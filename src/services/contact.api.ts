import { api } from "@/lib/api";
import { ApiResponse, Contact, PaginatedResponse } from "@/types";

export interface ContactFilters {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}

export const contactApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getContactStats: builder.query<
      ApiResponse<{
        total: number;
        open: number;
        inProgress: number;
        resolved: number;
        closed: number;
      }>,
      void
    >({
      query: () => "/contacts/stats/overview",
      providesTags: ["Contact"],
    }),
    getContacts: builder.query<
      PaginatedResponse<Contact>,
      ContactFilters | void
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, String(value));
          });
        }
        return `/contacts?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Contact" as const,
                id: _id,
              })),
              { type: "Contact", id: "LIST" },
            ]
          : [{ type: "Contact", id: "LIST" }],
    }),
    getContact: builder.query<ApiResponse<Contact>, string>({
      query: (contactId) => `/contacts/${contactId}`,
      providesTags: (_result, _error, contactId) => [
        { type: "Contact", id: contactId },
      ],
    }),
    createContact: builder.mutation<
      ApiResponse<Contact>,
      {
        subject: string;
        category: string;
        priority: string;
        message: string;
      }
    >({
      query: (data) => ({
        url: "/contacts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Contact", id: "LIST" }],
    }),
    replyToContact: builder.mutation<
      ApiResponse<Contact>,
      { contactId: string; reply: string }
    >({
      query: ({ contactId, reply }) => ({
        url: `/contacts/${contactId}/reply`,
        method: "POST",
        body: { reply },
      }),
      invalidatesTags: (_result, _error, { contactId }) => [
        { type: "Contact", id: contactId },
        { type: "Contact", id: "LIST" },
      ],
    }),
    updateContactStatus: builder.mutation<
      ApiResponse<Contact>,
      {
        contactId: string;
        status: "open" | "in_progress" | "resolved" | "closed";
      }
    >({
      query: ({ contactId, status }) => ({
        url: `/contacts/${contactId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { contactId }) => [
        { type: "Contact", id: contactId },
        { type: "Contact", id: "LIST" },
      ],
    }),
    deleteContact: builder.mutation<ApiResponse, string>({
      query: (contactId) => ({
        url: `/contacts/${contactId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Contact", id: "LIST" }],
    }),
  }),
});

export const {
  useGetContactStatsQuery,
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useReplyToContactMutation,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} = contactApi;
