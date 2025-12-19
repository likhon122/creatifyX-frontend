import { api } from "@/lib/api";
import {
  AuthResponse,
  LoginCredentials,
  SignupData,
  ApiResponse,
} from "@/types";

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signup: builder.mutation<ApiResponse, SignupData>({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    registerUser: builder.mutation<AuthResponse, { token: string }>({
      query: ({ token }) => ({
        url: "/auth/register-user",
        method: "POST",
        body: { token },
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    verifyOtp: builder.mutation<AuthResponse, { email: string; otp: number }>({
      query: ({ email, otp }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: { email, otp: parseInt(otp.toString()) },
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    changePassword: builder.mutation<
      ApiResponse,
      { oldPassword: string; newPassword: string }
    >({
      query: ({ oldPassword, newPassword }) => ({
        url: "/auth/change-password",
        method: "POST",
        body: { oldPassword, newPassword },
      }),
    }),
    forgotPassword: builder.mutation<ApiResponse, { email: string }>({
      query: ({ email }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse,
      { token: string; newPassword: string }
    >({
      query: ({ token, newPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, newPassword },
      }),
    }),
    refreshToken: builder.query<ApiResponse<{ accessToken: string }>, void>({
      query: () => "/auth/access-token",
    }),
  }),
});

export const {
  useSignupMutation,
  useRegisterUserMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenQuery,
} = authApi;
