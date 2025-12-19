"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Loader2,
  XCircle,
  Sparkles,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react";
import {
  useVerifyPaymentSessionMutation,
  useVerifySubscriptionSessionMutation,
} from "@/services";
import { toast } from "sonner";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const sessionId = searchParams.get("session_id");
  const type = searchParams.get("type") || "payment"; // 'payment' or 'subscription'

  const [verifyPayment] = useVerifyPaymentSessionMutation();
  const [verifySubscription] = useVerifySubscriptionSessionMutation();

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        // Check if we're in development and session_id is missing
        console.error("Missing session_id parameter in URL");
        setErrorMessage(
          "No session ID found. Please complete the checkout process first."
        );
        setIsVerifying(false);

        // Redirect to browse after 3 seconds
        setTimeout(() => {
          router.push("/browse");
        }, 3000);
        return;
      }

      try {
        if (type === "subscription") {
          const response = await verifySubscription({ sessionId }).unwrap();
          if (response.success) {
            setVerificationSuccess(true);
            toast.success("Subscription activated successfully!");
          }
        } else {
          const response = await verifyPayment({ sessionId }).unwrap();
          if (response.success) {
            setVerificationSuccess(true);
            toast.success("Payment verified successfully!");
          }
        }
      } catch (error: any) {
        console.error("Verification error:", error);
        setErrorMessage(
          error?.data?.message ||
            "Failed to verify payment. Please contact support."
        );
        toast.error("Payment verification failed");
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [sessionId, type, verifyPayment, verifySubscription, router]);

  if (isVerifying) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]"></div>

        <Card className="w-full max-w-lg border-2 border-border/50 rounded-2xl overflow-hidden relative z-10">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-primary relative" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Verifying Payment...</h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your{" "}
              {type === "subscription" ? "subscription" : "payment"}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!verificationSuccess) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]"></div>

        <Card className="w-full max-w-lg border-2 border-red-200 dark:border-red-800 rounded-2xl overflow-hidden relative z-10">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 mx-auto flex items-center justify-center mb-6">
              <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-red-600">
              Verification Failed
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {errorMessage ||
                "We could not verify your payment. Please contact support if the amount was charged."}
            </p>
            {sessionId && (
              <p className="text-xs text-muted-foreground mb-8 font-mono bg-muted/50 px-4 py-2 rounded-lg inline-block">
                Session ID: {sessionId}
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => router.push("/dashboard")}
                className="rounded-xl h-11"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/browse")}
                className="rounded-xl h-11 border-2"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Assets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]"></div>

      <Card className="w-full max-w-lg border-2 border-green-200 dark:border-green-800 rounded-2xl overflow-hidden relative z-10">
        <CardContent className="pt-16 pb-16 text-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mx-auto flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {type === "subscription"
              ? "Subscription Activated!"
              : "Payment Successful!"}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {type === "subscription"
              ? "Your premium subscription has been activated. Enjoy unlimited access to all assets!"
              : "Thank you for your purchase. You can now download your asset from your dashboard."}
          </p>
          {sessionId && (
            <p className="text-xs text-muted-foreground mb-8 font-mono bg-muted/50 px-4 py-2 rounded-lg inline-block">
              Transaction ID: {sessionId.slice(0, 20)}...
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push("/dashboard")}
              className="rounded-xl h-11 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/browse")}
              className="rounded-xl h-11 border-2"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {type === "subscription" ? "Browse Assets" : "Continue Shopping"}
            </Button>
          </div>

          {type === "subscription" && (
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Welcome to Premium! Enjoy 30% off all assets.</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
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
      <SuccessContent />
    </Suspense>
  );
}
