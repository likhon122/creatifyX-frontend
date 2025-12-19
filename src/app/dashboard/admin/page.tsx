"use client";

import { useState } from "react";
import {
  useGetPendingAssetsQuery,
  useGetAdminAnalyticsQuery,
  useApproveAssetMutation,
  useRejectAssetMutation,
} from "@/services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileImage,
  DollarSign,
  TrendingUp,
  Eye,
  Download,
  Sparkles,
  Loader2,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { Asset } from "@/types";

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const { data: pendingData, isLoading: pendingLoading } =
    useGetPendingAssetsQuery({ page, limit: 20 });
  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetAdminAnalyticsQuery(undefined);
  const [approveAsset, { isLoading: approving }] = useApproveAssetMutation();
  const [rejectAsset, { isLoading: rejecting }] = useRejectAssetMutation();

  const pendingAssets: Asset[] = pendingData?.data || [];
  const analytics = analyticsData?.data;

  const handleApprove = async (assetId: string, assetTitle: string) => {
    try {
      await approveAsset(assetId).unwrap();
      toast.success(`Asset "${assetTitle}" approved successfully`);
    } catch (error) {
      toast.error("Failed to approve asset");
    }
  };

  const handleReject = async (assetId: string, assetTitle: string) => {
    try {
      await rejectAsset(assetId).unwrap();
      toast.success(`Asset "${assetTitle}" rejected`);
    } catch (error) {
      toast.error("Failed to reject asset");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage platform assets and analytics
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Assets
            {pendingAssets.length > 0 && (
              <Badge className="ml-2" variant="destructive">
                {pendingAssets.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {analyticsLoading ? (
            <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-600/20">
                    <Sparkles className="h-8 w-8 text-violet-500" />
                  </div>
                  <Loader2 className="absolute -bottom-1 -right-1 h-6 w-6 animate-spin text-emerald-500" />
                </div>
                <p className="mt-4 text-lg font-medium">Loading analytics...</p>
                <p className="text-sm text-muted-foreground">
                  Fetching your dashboard data
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">
                      {analytics?.users?.total || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.users?.premium || 0} premium
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-teal-500/10 to-emerald-500/10">
                    <CardTitle className="text-sm font-medium">
                      Total Assets
                    </CardTitle>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-md">
                      <FileImage className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">
                      {analytics?.assets?.total || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.assets?.pending || 0} pending review
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-emerald-500/10 to-green-500/10">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-md">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">
                      $
                      {analytics?.earnings?.total?.lifetime?.toFixed(2) ||
                        "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This month: $
                      {analytics?.earnings?.total?.thisMonth?.toFixed(2) ||
                        "0.00"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
                    <CardTitle className="text-sm font-medium">
                      Total Downloads
                    </CardTitle>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-md">
                      <Download className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">
                      {analytics?.downloads?.lifetime || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.downloads?.thisMonth || 0} this month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                    <CardTitle>User Distribution</CardTitle>
                    <CardDescription>
                      Total: {analytics?.users?.total || 0}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Authors</span>
                        <span className="font-semibold">
                          {analytics?.users?.authors || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Subscribers</span>
                        <span className="font-semibold">
                          {analytics?.users?.subscribers || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Premium</span>
                        <span className="font-semibold">
                          {analytics?.users?.premium || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-teal-500/5 to-emerald-500/5">
                    <CardTitle>Asset Status</CardTitle>
                    <CardDescription>Content overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Approved</span>
                        <span className="font-semibold">
                          {analytics?.assets?.approved || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pending</span>
                        <span className="font-semibold">
                          {analytics?.assets?.pending || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Rejected</span>
                        <span className="font-semibold">
                          {analytics?.assets?.rejected || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-emerald-500/5 to-green-500/5">
                    <CardTitle>Platform Stats</CardTitle>
                    <CardDescription>Overall metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Views</span>
                        <span className="font-semibold">
                          {analytics?.views?.lifetime || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Downloads</span>
                        <span className="font-semibold">
                          {analytics?.downloads?.lifetime || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Pending Assets Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-amber-500/5 to-orange-500/5">
              <CardTitle>Pending Assets Review</CardTitle>
              <CardDescription>
                Review and approve or reject assets submitted by authors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                      <Sparkles className="h-7 w-7 text-amber-500" />
                    </div>
                    <Loader2 className="absolute -bottom-1 -right-1 h-5 w-5 animate-spin text-orange-500" />
                  </div>
                  <p className="mt-4 font-medium">Loading pending assets...</p>
                </div>
              ) : pendingAssets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending assets to review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAssets.map((asset) => (
                    <div
                      key={asset._id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/asset/${asset._id}`}
                              className="font-semibold text-lg hover:underline"
                            >
                              {asset.title}
                            </Link>
                            <Badge variant="secondary">{asset.assetType}</Badge>
                            {asset.isPremium && <Badge>Premium</Badge>}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              Author:{" "}
                              {typeof asset.author === "object"
                                ? asset.author.name
                                : "Unknown"}
                            </span>
                            <span>•</span>
                            <span>Price: ${asset.price}</span>
                            {asset.orientation && (
                              <>
                                <span>•</span>
                                <span>Orientation: {asset.orientation}</span>
                              </>
                            )}
                          </div>
                          {asset.tags && asset.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {asset.tags.slice(0, 5).map((tag, idx) => (
                                <Badge key={idx} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                            onClick={() =>
                              handleApprove(asset._id, asset.title)
                            }
                            disabled={approving || rejecting}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-xl"
                            onClick={() => handleReject(asset._id, asset.title)}
                            disabled={approving || rejecting}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {analyticsLoading ? (
            <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-600/20">
                    <LayoutDashboard className="h-8 w-8 text-indigo-500" />
                  </div>
                  <Loader2 className="absolute -bottom-1 -right-1 h-6 w-6 animate-spin text-blue-500" />
                </div>
                <p className="mt-4 text-lg font-medium">
                  Loading detailed analytics...
                </p>
                <p className="text-sm text-muted-foreground">
                  Crunching the numbers for you
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-emerald-500/5 to-green-500/5">
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>All-time earnings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Company Earnings</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.company?.lifetime?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Author Earnings</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.authors?.lifetime?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total Revenue</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.total?.lifetime?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                    <CardTitle>This Month Revenue</CardTitle>
                    <CardDescription>Current month earnings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Company</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.company?.thisMonth?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Authors</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.authors?.thisMonth?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.total?.thisMonth?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-teal-500/5 to-emerald-500/5">
                    <CardTitle>This Year Revenue</CardTitle>
                    <CardDescription>Year-to-date earnings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Company</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.company?.thisYear?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Authors</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.authors?.thisYear?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.total?.thisYear?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-emerald-500/5 to-green-500/5">
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>All-time earnings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Company Earnings</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.company?.lifetime?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Author Earnings</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.authors?.lifetime?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total Revenue</span>
                      <span className="font-bold">
                        $
                        {analytics?.earnings?.total?.lifetime?.toFixed(2) ||
                          "0.00"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-teal-500/5 to-emerald-500/5">
                    <CardTitle>Asset Distribution</CardTitle>
                    <CardDescription>
                      Content breakdown by status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Approved</span>
                      <span className="font-bold">
                        {analytics?.assets?.approved || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Review</span>
                      <span className="font-bold">
                        {analytics?.assets?.pending || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rejected</span>
                      <span className="font-bold">
                        {analytics?.assets?.rejected || 0}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total Assets</span>
                      <span className="font-bold">
                        {analytics?.assets?.total || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                    <CardTitle>User Metrics</CardTitle>
                    <CardDescription>Platform user statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Users</span>
                      <span className="font-bold">
                        {analytics?.users?.total || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Authors</span>
                      <span className="font-bold">
                        {analytics?.users?.authors || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subscribers</span>
                      <span className="font-bold">
                        {analytics?.users?.subscribers || 0}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Premium Users</span>
                      <span className="font-bold">
                        {analytics?.users?.premium || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50 rounded-2xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-orange-500/5 to-amber-500/5">
                    <CardTitle>Platform Activity</CardTitle>
                    <CardDescription>Views and downloads</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Views</span>
                      <span className="font-bold">
                        {analytics?.views?.lifetime?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Downloads</span>
                      <span className="font-bold">
                        {analytics?.downloads?.lifetime?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Month Downloads</span>
                      <span className="font-bold">
                        {analytics?.downloads?.thisMonth?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>This Year Downloads</span>
                      <span className="font-bold">
                        {analytics?.downloads?.thisYear?.toLocaleString() || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
