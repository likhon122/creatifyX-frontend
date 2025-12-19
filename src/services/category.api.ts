import { api } from "@/lib/api";
import { ApiResponse, Category } from "@/types";

export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCategories: builder.query<
      ApiResponse<Category[]>,
      { parentCategory?: boolean } | void
    >({
      query: (params) => {
        const queryString =
          params?.parentCategory !== undefined
            ? `?parentCategory=${params.parentCategory}`
            : "";
        return `/categories${queryString}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Category" as const,
                id: _id,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
    getCategory: builder.query<ApiResponse<Category>, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<ApiResponse<Category>, Partial<Category>>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation<
      ApiResponse<Category>,
      { id: string; data: Partial<Category> }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;
