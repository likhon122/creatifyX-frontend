import apiClient from "@/lib/api-client";
import {
  AuthResponse,
  LoginCredentials,
  SignupData,
  ApiResponse,
} from "@/types";

export const authApi = {
  // Sign up (Step 1: sends verification email)
  async signup(data: SignupData): Promise<ApiResponse> {
    return apiClient.post("/auth/signup", data);
  },

  // Register user (Step 2: complete signup with token from email)
  async registerUser(token: string): Promise<AuthResponse> {
    return apiClient.post("/auth/register-user", { token });
  },

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post("/auth/login", credentials);
  },

  // Verify OTP (for login)
  async verifyOtp(email: string, otp: number): Promise<AuthResponse> {
    return apiClient.post("/auth/verify-otp", {
      email,
      otp: parseInt(otp.toString()),
    });
  },

  // Logout
  async logout(): Promise<ApiResponse> {
    return apiClient.post("/auth/logout");
  },

  // Change Password
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return apiClient.post("/auth/change-password", {
      oldPassword,
      newPassword,
    });
  },

  // Forgot Password
  async forgotPassword(email: string): Promise<ApiResponse> {
    return apiClient.post("/auth/forgot-password", { email });
  },

  // Reset Password
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return apiClient.post("/auth/reset-password", { token, newPassword });
  },

  // Get new access token
  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    return apiClient.get("/auth/access-token");
  },
};
