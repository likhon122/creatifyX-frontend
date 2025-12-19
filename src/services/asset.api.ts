import { api } from "@/lib/api";
import { ApiResponse, PaginatedResponse, Asset, AssetStats } from "@/types";

export interface AssetFilters {
  page?: number;
  limit?: number;
  search?: string;
  assetType?: string;
  categories?: string;
  isPremium?: boolean;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  author?: string;
  sort?: string;
}

export const assetApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAssets: builder.query<PaginatedResponse<Asset>, AssetFilters | void>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, String(value));
            }
          });
        }
        return `/assets?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Asset" as const,
                id: _id,
              })),
              { type: "Asset", id: "LIST" },
            ]
          : [{ type: "Asset", id: "LIST" }],
    }),
    getMyAssets: builder.query<PaginatedResponse<Asset>, AssetFilters | void>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, String(value));
            }
          });
        }

        // Get current user from localStorage
        if (typeof window !== "undefined") {
          const authStorage = localStorage.getItem("auth-storage");
          if (authStorage) {
            try {
              const { state } = JSON.parse(authStorage);
              const authorId = state?.user?.userId;
              if (authorId) {
                params.append("author", authorId);
              }
            } catch (error) {
              console.error("Error parsing auth storage:", error);
            }
          }
        }

        return `/assets?${params.toString()}`;
      },
      providesTags: [{ type: "Asset", id: "MY_LIST" }],
    }),
    getAsset: builder.query<ApiResponse<Asset>, string>({
      query: (id) => `/assets/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Asset", id }],
    }),
    createAsset: builder.mutation<ApiResponse<Asset>, FormData>({
      query: (formData) => ({
        url: "/assets",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "MY_LIST" },
      ],
    }),
    updateAsset: builder.mutation<
      ApiResponse<Asset>,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/assets/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "MY_LIST" },
      ],
    }),
    incrementView: builder.mutation<ApiResponse, { assetId: string }>({
      query: ({ assetId }) => ({
        url: "/asset-stats/view",
        method: "POST",
        body: { assetId },
      }),
    }),
    toggleLike: builder.mutation<ApiResponse, { assetId: string }>({
      query: ({ assetId }) => ({
        url: "/asset-stats/like",
        method: "POST",
        body: { assetId },
      }),
      invalidatesTags: (_result, _error, { assetId }) => [
        { type: "Asset", id: assetId },
      ],
    }),
    recordDownload: builder.mutation<ApiResponse, { assetId: string }>({
      query: ({ assetId }) => ({
        url: "/asset-stats/download",
        method: "POST",
        body: { assetId },
      }),
    }),
    downloadAsZip: builder.mutation<Blob, { assetId: string }>({
      query: ({ assetId }) => ({
        url: "/asset-stats/download-zip",
        method: "POST",
        body: { assetId },
        responseHandler: async (response) => {
          return response.blob();
        },
      }),
    }),
    getAssetStats: builder.query<ApiResponse<AssetStats>, string>({
      query: (assetId) => `/asset-stats/${assetId}`,
    }),
    getDetailedStats: builder.query<ApiResponse, string>({
      query: (assetId) => `/asset-stats/${assetId}/detailed`,
    }),
    getMyPendingAssets: builder.query<
      PaginatedResponse<Asset>,
      AssetFilters | void
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, String(value));
            }
          });
        }
        return `/assets/author/pending?${params.toString()}`;
      },
      providesTags: [{ type: "Asset", id: "PENDING_LIST" }],
    }),
    getPendingAssets: builder.query<
      PaginatedResponse<Asset>,
      AssetFilters | void
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, String(value));
            }
          });
        }
        return `/assets/admin/pending?${params.toString()}`;
      },
      providesTags: [{ type: "Asset", id: "ADMIN_PENDING_LIST" }],
    }),
    approveAsset: builder.mutation<ApiResponse<Asset>, string>({
      query: (id) => ({
        url: `/assets/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "PENDING_LIST" },
        { type: "Asset", id: "ADMIN_PENDING_LIST" },
      ],
    }),
    rejectAsset: builder.mutation<ApiResponse<Asset>, string>({
      query: (id) => ({
        url: `/assets/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "PENDING_LIST" },
        { type: "Asset", id: "ADMIN_PENDING_LIST" },
      ],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetMyAssetsQuery,
  useGetAssetQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useIncrementViewMutation,
  useToggleLikeMutation,
  useRecordDownloadMutation,
  useDownloadAsZipMutation,
  useGetAssetStatsQuery,
  useGetDetailedStatsQuery,
  useGetMyPendingAssetsQuery,
  useGetPendingAssetsQuery,
  useApproveAssetMutation,
  useRejectAssetMutation,
} = assetApi;
