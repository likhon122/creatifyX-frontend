import apiClient from "@/lib/api-client";
import { ApiResponse, Contact, PaginatedResponse } from "@/types";

export interface ContactFilters {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}

export const contactApi = {
  // Get contact stats (admin)
  async getStats(): Promise<
    ApiResponse<{
      total: number;
      open: number;
      inProgress: number;
      resolved: number;
      closed: number;
    }>
  > {
    return apiClient.get("/contacts/stats/overview");
  },

  // Get contacts
  async getContacts(
    filters?: ContactFilters
  ): Promise<PaginatedResponse<Contact>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    return apiClient.get(`/contacts?${params.toString()}`);
  },

  // Get single contact
  async getContact(contactId: string): Promise<ApiResponse<Contact>> {
    return apiClient.get(`/contacts/${contactId}`);
  },

  // Create contact
  async createContact(data: {
    subject: string;
    category: string;
    priority: string;
    message: string;
  }): Promise<ApiResponse<Contact>> {
    return apiClient.post("/contacts", data);
  },

  // Reply to contact (admin)
  async replyToContact(
    contactId: string,
    reply: string
  ): Promise<ApiResponse<Contact>> {
    return apiClient.post(`/contacts/${contactId}/reply`, { reply });
  },

  // Update contact status (admin)
  async updateStatus(
    contactId: string,
    status: "open" | "in_progress" | "resolved" | "closed"
  ): Promise<ApiResponse<Contact>> {
    return apiClient.patch(`/contacts/${contactId}/status`, { status });
  },

  // Delete contact (admin)
  async deleteContact(contactId: string): Promise<ApiResponse> {
    return apiClient.delete(`/contacts/${contactId}`);
  },
};
