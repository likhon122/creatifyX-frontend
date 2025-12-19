"use client";

import { useGetAuthorAnalyticsQuery } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Loader2,
  Sparkles,
  Wallet,
  CalendarDays,
  Trophy,
  AlertCircle,
} from "lucide-react";

export default function EarningsPage() {
  const { data, isLoading, error } = useGetAuthorAnalyticsQuery(undefined);

  const analytics = data?.data;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <Loader2 className="h-6 w-6 animate-spin text-primary absolute -bottom-1 -right-1" />
          </div>
          <p className="text-muted-foreground font-medium">
            Loading your earnings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <p className="text-lg font-semibold text-red-600 mb-2">
              Error loading earnings data
            </p>
            <p className="text-muted-foreground">Please try again later</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
              <DollarSign className="h-7 w-7 text-green-600" />
            </div>
            My Earnings
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your earnings and revenue
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Earnings Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-border/50 shadow-lg rounded-2xl card-hover overflow-hidden">
            <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Lifetime Earnings
                </CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${analytics?.earnings?.lifetime?.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total earnings from all time
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="border-2 border-border/50 shadow-lg rounded-2xl card-hover overflow-hidden">
            <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ${analytics?.earnings?.thisMonth?.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Earnings this month
                </p>
              </CardContent>
            </div>
          </Card>

          <Card className="border-2 border-border/50 shadow-lg rounded-2xl card-hover overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ${analytics?.earnings?.thisWeek?.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Earnings this week
                </p>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Detailed Earnings */}
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/5 to-emerald-600/5">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Earnings Breakdown
            </CardTitle>
            <CardDescription>Detailed view of your earnings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-500/5 to-gray-500/5 rounded-xl border border-border/30 transition-all hover:border-border/60">
                  <span className="text-sm font-medium text-muted-foreground">
                    Today
                  </span>
                  <span className="font-bold text-lg">
                    ${analytics?.earnings?.today?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-500/5 to-gray-500/5 rounded-xl border border-border/30 transition-all hover:border-border/60">
                  <span className="text-sm font-medium text-muted-foreground">
                    Yesterday
                  </span>
                  <span className="font-bold text-lg">
                    ${analytics?.earnings?.yesterday?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl border border-border/30 transition-all hover:border-border/60">
                  <span className="text-sm font-medium text-muted-foreground">
                    This Week
                  </span>
                  <span className="font-bold text-lg text-blue-600">
                    ${analytics?.earnings?.thisWeek?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-xl border border-border/30 transition-all hover:border-border/60">
                  <span className="text-sm font-medium text-muted-foreground">
                    This Month
                  </span>
                  <span className="font-bold text-lg text-emerald-600">
                    ${analytics?.earnings?.thisMonth?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-xl border border-border/30 transition-all hover:border-border/60">
                  <span className="text-sm font-medium text-muted-foreground">
                    This Year
                  </span>
                  <span className="font-bold text-lg text-amber-600">
                    ${analytics?.earnings?.thisYear?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-primary/10 to-emerald-600/10 rounded-xl border-2 border-primary/50 transition-all hover:border-primary">
                  <span className="text-sm font-semibold">Lifetime Total</span>
                  <span className="font-bold text-xl bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                    ${analytics?.earnings?.lifetime?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Assets */}
        {analytics?.topAssets && analytics.topAssets.length > 0 && (
          <Card className="border-2 border-border/50 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-amber-500/5 to-orange-500/5">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Top Performing Assets
              </CardTitle>
              <CardDescription>
                Your best performing assets by earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {analytics.topAssets.map((asset: any, index: number) => (
                  <div
                    key={asset.assetId}
                    className="flex items-center justify-between p-4 border-2 border-border/50 rounded-xl transition-all hover:border-primary/30 hover:shadow-md card-hover"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? "bg-gradient-to-br from-amber-400 to-orange-500"
                            : index === 1
                            ? "bg-gradient-to-br from-slate-400 to-slate-500"
                            : index === 2
                            ? "bg-gradient-to-br from-amber-600 to-amber-700"
                            : "bg-gradient-to-br from-primary to-emerald-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{asset.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {asset.views} views • {asset.downloads} downloads
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${asset.earnings?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-xs text-muted-foreground">earned</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
