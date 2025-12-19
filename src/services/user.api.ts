import { api } from "@/lib/api";
import { ApiResponse, User, PaginatedResponse } from "@/types";

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  searchTerm?: string;
  authorVerificationStatus?: string;
}

export const userApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    getUser: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    getUsers: builder.query<PaginatedResponse<User>, UserFilters | void>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, String(value));
          });
        }
        return `/users?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "User" as const,
                id: _id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    updateProfile: builder.mutation<
      ApiResponse<User>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    changeUserStatus: builder.mutation<
      ApiResponse<User>,
      { id: string; status: "active" | "blocked" | "inactive" }
    >({
      query: ({ id, status }) => ({
        url: `/users/change-user-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    changeUserRole: builder.mutation<
      ApiResponse<User>,
      { id: string; role: string }
    >({
      query: ({ id, role }) => ({
        url: `/users/change-user-status/${id}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    changeAuthorVerification: builder.mutation<
      ApiResponse<User>,
      { id: string; authorVerificationStatus: string }
    >({
      query: ({ id, authorVerificationStatus }) => ({
        url: `/users/change-user-status/${id}`,
        method: "PATCH",
        body: { authorVerificationStatus },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetProfileQuery,
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateProfileMutation,
  useChangeUserStatusMutation,
  useChangeUserRoleMutation,
  useChangeAuthorVerificationMutation,
} = userApi;
