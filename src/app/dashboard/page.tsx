"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import {
  useGetAdminAnalyticsQuery,
  useGetAuthorAnalyticsQuery,
  useGetMyAssetsQuery,
  useGetMyPendingAssetsQuery,
  useGetPaymentHistoryQuery,
} from "@/services";
import {
  Download,
  DollarSign,
  Eye,
  FileUp,
  Loader2,
  ShoppingBag,
  TrendingUp,
  Clock,
  Calendar,
  XCircle,
  Sparkles,
  BarChart3,
  Users,
  CreditCard,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { Asset, IndividualPayment } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

// Chart colors
const CHART_COLORS = {
  primary: "#10b981",
  secondary: "#14b8a6",
  accent: "#059669",
  blue: "#3b82f6",
  amber: "#f59e0b",
  green: "#22c55e",
  red: "#ef4444",
  purple: "#8b5cf6",
  pink: "#ec4899",
};

const PIE_COLORS = ["#10b981", "#14b8a6", "#059669", "#0d9488", "#0f766e"];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();

  // Queries based on user role
  const {
    data: adminAnalytics,
    isLoading: adminLoading,
    error: adminError,
  } = useGetAdminAnalyticsQuery(undefined, {
    skip: user?.role !== "admin" && user?.role !== "super_admin",
  });
  const {
    data: authorAnalytics,
    isLoading: authorLoading,
    error: authorError,
  } = useGetAuthorAnalyticsQuery(undefined, {
    skip: user?.role !== "author",
  });
  const { data: myAssetsData, isLoading: assetsLoading } = useGetMyAssetsQuery(
    { page: 1, limit: 10 },
    {
      skip: user?.role !== "author",
    }
  );
  const { data: pendingData } = useGetMyPendingAssetsQuery(
    { page: 1, limit: 5 },
    {
      skip: user?.role !== "author",
    }
  );
  const {
    data: purchaseHistory,
    isLoading: purchaseLoading,
    error: purchaseError,
  } = useGetPaymentHistoryQuery(
    { page: 1, limit: 10 },
    {
      skip:
        user?.role === "author" ||
        user?.role === "admin" ||
        user?.role === "super_admin",
    }
  );

  // Debug logging
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "super_admin") {
      console.log("Admin Analytics Data:", adminAnalytics);
      console.log("Admin Analytics Loading:", adminLoading);
      console.log("Admin Analytics Error:", adminError);
    }
    if (user?.role === "author") {
      console.log("Author Analytics Data:", authorAnalytics);
      console.log("Author Analytics Loading:", authorLoading);
      console.log("Author Analytics Error:", authorError);
      console.log("My Assets Data:", myAssetsData);
    }
    if (user?.role === "subscriber") {
      console.log("Purchase History Data:", purchaseHistory);
      console.log("Purchase Loading:", purchaseLoading);
      console.log("Purchase Error:", purchaseError);
    }
  }, [
    purchaseHistory,
    purchaseLoading,
    purchaseError,
    user,
    adminAnalytics,
    adminLoading,
    adminError,
    authorAnalytics,
    authorLoading,
    authorError,
    myAssetsData,
  ]);

  const isLoading = adminLoading || authorLoading || assetsLoading;
  const myAssets: Asset[] = myAssetsData?.data || [];
  const pendingAssets: Asset[] = pendingData?.data || [];

  // Show nothing while hydrating to prevent flash (handled by layout)
  if (!_hasHydrated || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4 relative" />
          </div>
          <p className="text-muted-foreground font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (user?.role === "admin" || user?.role === "super_admin") {
    const analytics = adminAnalytics?.data;

    if (adminError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">
              Error Loading Analytics
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {(adminError as any)?.data?.message ||
                "Failed to load admin analytics. Please try again."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="rounded-xl"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Platform overview and management
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/admin")}
            className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            View Full Admin Panel
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {adminLoading ? (
            <div className="col-span-4 text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading analytics...
              </p>
            </div>
          ) : (
            <>
              <Card className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analytics?.users?.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-amber-500 font-medium">
                      {analytics?.users?.premium || 0}
                    </span>{" "}
                    premium users
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Assets
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Package className="h-4 w-4 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analytics?.assets?.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-amber-500 font-medium">
                      {analytics?.assets?.pending || 0}
                    </span>{" "}
                    pending review
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    $
                    {analytics?.earnings?.total?.lifetime?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All-time revenue
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Downloads
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Download className="h-4 w-4 text-amber-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analytics?.downloads?.lifetime || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All downloads
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>
                      Platform earnings breakdown
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-lg bg-green-500/10 text-green-600 border-green-500/30"
                >
                  +
                  {(
                    ((analytics?.earnings?.total?.thisMonth || 0) /
                      Math.max(analytics?.earnings?.total?.lifetime || 1, 1)) *
                    100
                  ).toFixed(1)}
                  % this month
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      {
                        name: "Today",
                        total: analytics?.earnings?.total?.today || 0,
                        company: analytics?.earnings?.company?.today || 0,
                      },
                      {
                        name: "Yesterday",
                        total: analytics?.earnings?.total?.yesterday || 0,
                        company: analytics?.earnings?.company?.yesterday || 0,
                      },
                      {
                        name: "This Week",
                        total: analytics?.earnings?.total?.thisWeek || 0,
                        company: analytics?.earnings?.company?.thisWeek || 0,
                      },
                      {
                        name: "This Month",
                        total: analytics?.earnings?.total?.thisMonth || 0,
                        company: analytics?.earnings?.company?.thisMonth || 0,
                      },
                      {
                        name: "This Year",
                        total: analytics?.earnings?.total?.thisYear || 0,
                        company: analytics?.earnings?.company?.thisYear || 0,
                      },
                    ]}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="totalGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="companyGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#14b8a6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#14b8a6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="name"
                      className="text-xs"
                      tick={{ fill: "currentColor" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "currentColor" }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
                      }}
                      formatter={(value: number | undefined) => [
                        `$${value?.toFixed(2) ?? "0.00"}`,
                        "",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#totalGradient)"
                      strokeWidth={2}
                      name="Total Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="company"
                      stroke="#14b8a6"
                      fillOpacity={1}
                      fill="url(#companyGradient)"
                      strokeWidth={2}
                      name="Company Share"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Distribution Chart */}
          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <PieChart className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>User types breakdown</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        {
                          name: "Subscribers",
                          value: analytics?.users?.subscribers || 0,
                        },
                        {
                          name: "Authors",
                          value: analytics?.users?.authors || 0,
                        },
                        {
                          name: "Premium",
                          value: analytics?.users?.premium || 0,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[0, 1, 2].map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Downloads & Views Chart */}
          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                  <Activity className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle>Activity Trends</CardTitle>
                  <CardDescription>Downloads & views over time</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Today",
                        downloads: analytics?.downloads?.today || 0,
                        views: analytics?.views?.today || 0,
                      },
                      {
                        name: "Yesterday",
                        downloads: analytics?.downloads?.yesterday || 0,
                        views: analytics?.views?.yesterday || 0,
                      },
                      {
                        name: "This Week",
                        downloads: analytics?.downloads?.thisWeek || 0,
                        views: analytics?.views?.thisWeek || 0,
                      },
                      {
                        name: "This Month",
                        downloads: analytics?.downloads?.thisMonth || 0,
                        views: analytics?.views?.thisMonth || 0,
                      },
                    ]}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="name"
                      className="text-xs"
                      tick={{ fill: "currentColor" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "currentColor" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="downloads"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                      name="Downloads"
                    />
                    <Bar
                      dataKey="views"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Views"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Assets Status Chart */}
          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                  <Package className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <CardTitle>Assets Status</CardTitle>
                  <CardDescription>Asset approval breakdown</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics?.assets?.approved || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Approved</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-2xl font-bold text-amber-600">
                    {analytics?.assets?.pending || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="text-2xl font-bold text-red-600">
                    {analytics?.assets?.rejected || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Rejected</div>
                </div>
              </div>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        {
                          name: "Approved",
                          value: analytics?.assets?.approved || 0,
                        },
                        {
                          name: "Pending",
                          value: analytics?.assets?.pending || 0,
                        },
                        {
                          name: "Rejected",
                          value: analytics?.assets?.rejected || 0,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Card */}
        <Card className="border-2 border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Platform activity overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View detailed reports in admin panel
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Author Dashboard
  if (user?.role === "author") {
    const analytics = authorAnalytics?.data;

    if (authorError) {
      return (
        <div className="container min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-600">
              Error Loading Analytics
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {(authorError as any)?.data?.message ||
                "Failed to load author analytics. Please try again."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="rounded-xl"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="container py-8 space-y-8">
        {authorLoading && !analytics ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4 relative" />
              </div>
              <p className="text-muted-foreground font-medium">
                Loading analytics...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold">Creator Dashboard</h1>
                </div>
                <p className="text-muted-foreground">
                  Your content performance at a glance
                </p>
              </div>
              <div className="flex gap-3">
                {pendingAssets.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/pending")}
                    className="rounded-xl border-2"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Pending ({pendingAssets.length})
                  </Button>
                )}
                <Button
                  onClick={() => router.push("/dashboard/upload")}
                  className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload Asset
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Earnings
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    $
                    {analytics?.earnings?.lifetime?.toFixed(2) ||
                      user?.totalEarnings?.toFixed(2) ||
                      "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All-time earnings
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Assets
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Package className="h-4 w-4 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{myAssets.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Published assets
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Views
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Eye className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analytics?.views?.lifetime || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All-time views
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Downloads
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Download className="h-4 w-4 text-amber-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analytics?.downloads?.lifetime || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All-time downloads
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Assets Alert */}
            {pendingAssets.length > 0 && (
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle className="text-blue-900 dark:text-blue-100">
                          Pending Assets
                        </CardTitle>
                        <CardDescription className="text-blue-800 dark:text-blue-200">
                          {pendingAssets.length} asset
                          {pendingAssets.length > 1 ? "s" : ""} awaiting review
                        </CardDescription>
                      </div>
                    </div>
                    <Link href="/dashboard/pending">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingAssets.slice(0, 3).map((asset) => (
                      <div
                        key={asset._id}
                        className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50"
                      >
                        <div>
                          <p className="font-medium">{asset.title}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {asset.assetType}
                          </p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 rounded-full">
                          Pending
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* My Assets Card */}
            <Card className="border-2 border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>My Assets</CardTitle>
                    <CardDescription>Your uploaded content</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {myAssets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      No assets yet. Upload your first asset!
                    </p>
                    <Button
                      onClick={() => router.push("/dashboard/upload")}
                      className="rounded-xl"
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      Upload Asset
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myAssets.map((asset) => {
                      if (!asset._id) return null;
                      return (
                        <Link key={asset._id} href={`/asset/${asset._id}`}>
                          <div className="flex items-center justify-between p-4 border-2 border-border/50 rounded-xl hover:border-primary/30 hover:bg-accent/50 transition-all duration-300 group">
                            <div className="flex items-center gap-4">
                              <div className="relative h-16 w-16 rounded-xl overflow-hidden">
                                <img
                                  src={
                                    asset.previews?.thumbnail?.secure_url ||
                                    asset.storage?.secure_url
                                  }
                                  alt={asset.title}
                                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold group-hover:text-primary transition-colors">
                                  {asset.title}
                                </h4>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {asset.assetType}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              <p className="font-bold text-lg">
                                ${asset.price}
                              </p>
                              <Badge
                                variant={
                                  asset.status === "approved"
                                    ? "default"
                                    : asset.status === "pending_review"
                                    ? "secondary"
                                    : "destructive"
                                }
                                className="rounded-full"
                              >
                                {asset.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  // Subscriber Dashboard
  return (
    <div className="container py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Your purchases and subscriptions
          </p>
        </div>
        <Button
          onClick={() => router.push("/browse")}
          className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Browse Assets
        </Button>
      </div>

      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="purchases"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            My Purchases
          </TabsTrigger>
          <TabsTrigger
            value="subscription"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Subscription
          </TabsTrigger>
        </TabsList>
        <TabsContent value="purchases" className="mt-6">
          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>
                    Assets you&apos;ve purchased - download them anytime
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {purchaseLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading your purchases...
                  </p>
                </div>
              ) : purchaseError ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">
                    Error Loading Purchases
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {(purchaseError as any)?.data?.message ||
                      "Failed to load purchase history. Please try again."}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="rounded-xl"
                  >
                    Retry
                  </Button>
                </div>
              ) : !purchaseHistory?.data ||
                purchaseHistory.data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No purchases yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your asset library today
                  </p>
                  <Button
                    onClick={() => router.push("/browse")}
                    className="rounded-xl"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Browse Assets
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchaseHistory.data.map((payment: IndividualPayment) => {
                    // Backend returns assetDetails, not asset
                    const asset =
                      payment.assetDetails ||
                      (typeof payment.asset === "object"
                        ? payment.asset
                        : null);
                    if (!asset || !asset._id) return null;

                    return (
                      <div
                        key={payment._id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-5 border-2 border-border/50 rounded-xl hover:border-primary/30 hover:bg-accent/30 transition-all duration-300 gap-4 group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                            <img
                              src={
                                asset.previews?.thumbnail?.secure_url ||
                                asset.storage?.secure_url
                              }
                              alt={asset.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                              {asset.title}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Badge
                                variant="secondary"
                                className="capitalize rounded-full"
                              >
                                {asset.assetType}
                              </Badge>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(
                                  payment.transactionDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                            {payment.isPremiumUser &&
                              payment.discountAmount > 0 && (
                                <Badge className="mt-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-600 border-amber-500/20 rounded-full">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Premium Discount: $
                                  {payment.discountAmount.toFixed(2)} saved
                                </Badge>
                              )}
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <div className="text-left md:text-right">
                            <p className="font-bold text-xl bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                              ${payment.finalPrice.toFixed(2)}
                            </p>
                            {payment.discountAmount > 0 && (
                              <p className="text-sm text-muted-foreground line-through">
                                ${payment.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {payment.paymentStatus === "completed" ? (
                              <>
                                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 rounded-full">
                                  Purchased
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    if (asset.storage?.secure_url) {
                                      window.open(
                                        asset.storage.secure_url,
                                        "_blank"
                                      );
                                    } else {
                                      toast.error(
                                        "Download link not available"
                                      );
                                    }
                                  }}
                                  className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                                >
                                  <Download className="h-4 w-4 mr-1.5" />
                                  Download
                                </Button>
                              </>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="rounded-full"
                              >
                                {payment.paymentStatus}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {purchaseHistory.meta &&
                    purchaseHistory.meta.totalPages > 1 && (
                      <div className="text-center pt-4 text-sm text-muted-foreground">
                        Showing {purchaseHistory.data.length} of{" "}
                        {purchaseHistory.meta.total} purchases
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscription" className="mt-6">
          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Subscription Status</CardTitle>
                  <CardDescription>Your current plan</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {user?.isPremium ? (
                <div className="p-6 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                      Active Premium Subscription
                    </p>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    You have unlimited access to all premium assets with
                    exclusive discounts
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/plans")}
                    className="rounded-xl border-2"
                  >
                    Manage Subscription
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-6">
                    No active subscription. Upgrade to unlock premium benefits!
                  </p>
                  <Button
                    onClick={() => router.push("/plans")}
                    className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    View Premium Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="purchases">
          <Card className="border-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>Your asset purchases</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {purchaseLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading purchases...
                  </p>
                </div>
              ) : !purchaseHistory?.data ||
                purchaseHistory.data.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No purchases yet</p>
                  <Button
                    onClick={() => router.push("/browse")}
                    className="rounded-xl"
                  >
                    Browse Assets
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchaseHistory.data.map((payment: IndividualPayment) => {
                    const asset =
                      typeof payment.asset === "object" ? payment.asset : null;
                    if (!asset || !asset._id) return null;

                    return (
                      <div
                        key={payment._id}
                        className="flex items-center justify-between p-4 border-2 border-border/50 rounded-xl hover:border-primary/30 hover:bg-accent/50 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative h-16 w-16 rounded-xl overflow-hidden">
                            <img
                              src={
                                asset.previews?.thumbnail?.secure_url ||
                                asset.storage?.secure_url
                              }
                              alt={asset.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold group-hover:text-primary transition-colors">
                              {asset.title}
                            </h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {asset.assetType}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(
                                payment.transactionDate
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col gap-2">
                          <div>
                            <p className="font-bold text-lg">
                              ${payment.finalPrice.toFixed(2)}
                            </p>
                            {payment.discountAmount > 0 && (
                              <p className="text-xs text-muted-foreground line-through">
                                ${payment.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                payment.paymentStatus === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="rounded-full"
                            >
                              {payment.paymentStatus}
                            </Badge>
                            {payment.paymentStatus === "completed" && (
                              <Link href={`/asset/${asset._id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
