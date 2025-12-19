import { api } from "@/lib/api";
import { ApiResponse, Plan } from "@/types";

export const planApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPlans: builder.query<ApiResponse<Plan[]>, void>({
      query: () => "/plans",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Plan" as const,
                id: _id,
              })),
              { type: "Plan", id: "LIST" },
            ]
          : [{ type: "Plan", id: "LIST" }],
    }),
    createPlan: builder.mutation<
      ApiResponse<Plan>,
      {
        name: string;
        description: string;
        price: number;
        billingCycle: "monthly" | "yearly";
        features: string[];
      }
    >({
      query: (data) => ({
        url: "/plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Plan", id: "LIST" }],
    }),
    updatePlan: builder.mutation<
      ApiResponse<Plan>,
      { id: string; data: Partial<Plan> }
    >({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Plan", id },
        { type: "Plan", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
} = planApi;
