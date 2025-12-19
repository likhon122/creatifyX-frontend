"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminNav } from "@/components/admin-nav";
import { Loader2, Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (_hasHydrated) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user?.role !== "admin" && user?.role !== "super_admin") {
        router.push("/dashboard");
      }
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <Loader2 className="absolute -bottom-1 -right-1 h-6 w-6 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin" && user?.role !== "super_admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <AdminNav />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
