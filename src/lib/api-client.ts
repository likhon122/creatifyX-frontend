import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          // Get token from Zustand persisted storage
          const authStorage = localStorage.getItem("auth-storage");
          if (authStorage) {
            try {
              const { state } = JSON.parse(authStorage);
              const token = state?.accessToken;
              if (token) {
                config.headers.Authorization = `${token}`;
              }
            } catch (error) {
              console.error("Error parsing auth storage:", error);
            }
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await this.client.get("/auth/access-token");
            const { accessToken } = response.data.data;

            if (typeof window !== "undefined") {
              // Update token in Zustand store
              const authStorage = localStorage.getItem("auth-storage");
              if (authStorage) {
                try {
                  const parsed = JSON.parse(authStorage);
                  parsed.state.accessToken = accessToken;
                  localStorage.setItem("auth-storage", JSON.stringify(parsed));
                } catch (err) {
                  console.error("Error updating auth storage:", err);
                }
              }
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `${accessToken}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            // Token refresh failed, redirect to login
            if (typeof window !== "undefined") {
              localStorage.removeItem("auth-storage");
              window.location.href = "/auth/login";
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config
    );
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(
      url,
      data,
      config
    );
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  async upload<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
    return response.data;
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
