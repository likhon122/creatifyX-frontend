"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authApi } from "@/services/auth.service";
import { toast } from "sonner";
import {
  Loader2,
  Sparkles,
  Mail,
  Lock,
  User,
  FileText,
  ArrowRight,
  ShoppingBag,
  Palette,
} from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["subscriber", "author"]),
  bio: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "subscriber";
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"subscriber" | "author">(
    defaultRole as "subscriber" | "author"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: defaultRole as "subscriber" | "author",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.signup(data);
      toast.success("Verification email sent! Please check your inbox.");
      // In development, backend returns token; in production, user gets it via email
      if (response.data?.token) {
        router.push(`/auth/verify-email?token=${response.data.token}`);
      } else {
        router.push("/auth/verify-email");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground mt-1">
            Join CreatifyX and start your journey
          </p>
        </div>

        <Card className="border-2 border-border/50 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-8 space-y-5">
              {/* Role Selection Cards */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("subscriber");
                    setValue("role", "subscriber");
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedRole === "subscriber"
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <ShoppingBag
                    className={`h-5 w-5 mb-2 ${
                      selectedRole === "subscriber"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <p className="font-medium text-sm">Subscriber</p>
                  <p className="text-xs text-muted-foreground">Browse & buy</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("author");
                    setValue("role", "author");
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedRole === "author"
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <Palette
                    className={`h-5 w-5 mb-2 ${
                      selectedRole === "author"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <p className="font-medium text-sm">Author</p>
                  <p className="text-xs text-muted-foreground">Create & sell</p>
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                    {...register("name")}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                    {...register("email")}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                    {...register("password")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {selectedRole === "author" && (
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Bio (Optional)
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="bio"
                      type="text"
                      placeholder="Tell us about yourself"
                      className="pl-10 h-12 rounded-xl border-border/50 focus:border-primary"
                      {...register("bio")}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
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
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By creating an account, you agree to our{" "}
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

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-2">Loading...</p>
          </div>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
