"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { authApi } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import {
  Loader2,
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Copy,
  Check,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setAccessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const fillAdminCredentials = () => {
    setValue("email", "superadmin@gmail.com", { shouldValidate: true });
    setValue("password", "superadmin", { shouldValidate: true });
    toast.success("Super Admin credentials auto-filled!");
  };

  const copyToClipboard = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`Copied ${field} to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);

      // Check if response contains direct login tokens (for super admins / admins / subscribers)
      if (response.data?.userInfo && response.data?.accessToken) {
        setUser(response.data.userInfo);
        setAccessToken(response.data.accessToken);
        toast.success(response.message || "Login successful!");
        router.push("/dashboard");
      } else if (response.success) {
        // OTP challenge only for authors
        toast.success(response.message || "OTP sent to your email!");
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(
          response.message ||
            "Invalid response from server. Please check your credentials."
        );
        console.error("Unexpected login response:", response);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in to your CreatifyX account
          </p>
        </div>

        {/* Super Admin / Interviewer Demo Credentials Box */}
        <div className="mb-5 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-emerald-500/10 p-4 shadow-md backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Shield className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Super Admin Credentials
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Direct Login • No 2-Step OTP Required
                </p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Admin Access
            </span>
          </div>

          <div className="space-y-2 mb-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-background/90 border border-border/60">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider w-16 shrink-0">
                  Email:
                </span>
                <span className="font-mono font-medium truncate text-foreground select-all">
                  superadmin@gmail.com
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                onClick={() => copyToClipboard("superadmin@gmail.com", "email")}
                title="Copy email"
              >
                {copiedField === "email" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-background/90 border border-border/60">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider w-16 shrink-0">
                  Password:
                </span>
                <span className="font-mono font-medium truncate text-foreground select-all">
                  superadmin
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                onClick={() => copyToClipboard("superadmin", "password")}
                title="Copy password"
              >
                {copiedField === "password" ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillAdminCredentials}
            className="w-full h-9 rounded-xl border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-600 font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Zap className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
            1-Click Auto-Fill Super Admin Credentials
          </Button>
        </div>

        <Card className="border-2 border-border/50 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                    {...register("email")}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 rounded-xl border-border/50 focus:border-primary"
                    {...register("password")}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all bg-gradient-to-r from-primary to-emerald-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </CardContent>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
