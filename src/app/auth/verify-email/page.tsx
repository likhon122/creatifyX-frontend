"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authApi } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";
  const { setUser, setAccessToken } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      verifyEmail(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const verifyEmail = async (token: string) => {
    setIsVerifying(true);
    try {
      const response = await authApi.registerUser(token);
      setUser(response.data.userInfo);
      setAccessToken(response.data.accessToken);
      setIsVerified(true);
      toast.success("Email verified successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Verification failed. Token may be expired."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]"></div>

        <Card className="w-full max-w-md border-2 border-border/50 rounded-2xl overflow-hidden relative z-10">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-primary relative" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Verifying Your Email...</h2>
            <p className="text-muted-foreground">
              Please wait while we verify your account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]"></div>

        <Card className="w-full max-w-md border-2 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden relative z-10">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Email Verified!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your account has been successfully verified. Redirecting to
              dashboard...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <Sparkles className="h-4 w-4" />
              <span>Welcome to CreatifyX!</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]"></div>

      <Card className="w-full max-w-md border-2 border-border/50 rounded-2xl overflow-hidden relative z-10">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription className="text-base">
            We have sent you a verification link. Please check your inbox and
            click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-muted/50 p-5 border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">
                Didn&apos;t receive the email?
              </strong>
              <br />
              Check your spam folder or wait a few minutes and try again.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-2">
          <Button
            variant="outline"
            className="w-full rounded-xl h-11 border-2"
            onClick={() => router.push("/auth/login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
