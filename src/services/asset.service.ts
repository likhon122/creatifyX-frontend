import apiClient from "@/lib/api-client";
import { ApiResponse, PaginatedResponse, Asset, AssetStats } from "@/types";
import type { AssetFilters } from "./asset.api";

export const assetService = {
  // Get all assets
  async getAssets(filters?: AssetFilters): Promise<PaginatedResponse<Asset>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/assets?${params.toString()}`);
  },

  // Get my assets (author's assets)
  async getMyAssets(filters?: AssetFilters): Promise<PaginatedResponse<Asset>> {
    // Get current user from localStorage
    const authStorage = localStorage.getItem("auth-storage");
    let authorId = "";
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        authorId = state?.user?.userId;
      } catch (error) {
        console.error("Error parsing auth storage:", error);
      }
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    if (authorId) {
      params.append("author", authorId);
    }
    return apiClient.get(`/assets?${params.toString()}`);
  },

  // Get single asset
  async getAsset(id: string): Promise<ApiResponse<Asset>> {
    return apiClient.get(`/assets/${id}`);
  },

  // Create asset
  async createAsset(formData: FormData): Promise<ApiResponse<Asset>> {
    return apiClient.upload("/assets", formData);
  },

  // Update asset
  async updateAsset(id: string, status: string): Promise<ApiResponse<Asset>> {
    return apiClient.patch(`/assets/${id}`, { status });
  },

  // Asset Stats
  async incrementView(assetId: string): Promise<ApiResponse> {
    return apiClient.post("/asset-stats/view", { assetId });
  },

  async toggleLike(assetId: string): Promise<ApiResponse> {
    return apiClient.post("/asset-stats/like", { assetId });
  },

  async recordDownload(assetId: string): Promise<ApiResponse> {
    return apiClient.post("/asset-stats/download", { assetId });
  },

  async downloadAsZip(assetId: string): Promise<Blob> {
    // Get token from auth storage
    let token = "";
    if (typeof window !== "undefined") {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          token = state?.accessToken || "";
        } catch (error) {
          console.error("Error parsing auth storage:", error);
        }
      }
    }

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const response = await fetch(`${API_URL}/asset-stats/download-zip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ assetId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Download zip error:", errorText);
      throw new Error(
        `Failed to download zip: ${response.status} ${response.statusText}`
      );
    }

    return response.blob();
  },

  async getAssetStats(assetId: string): Promise<ApiResponse<AssetStats>> {
    return apiClient.get(`/asset-stats/${assetId}`);
  },

  async getDetailedStats(assetId: string): Promise<ApiResponse> {
    return apiClient.get(`/asset-stats/${assetId}/detailed`);
  },
};

// Export with both names for backward compatibility
export { assetService as assetApi };
