"use client";

import { useState } from "react";
import { useGetPaymentHistoryQuery } from "@/services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  DollarSign,
  Download,
  Loader2,
  Sparkles,
  Package,
  Filter,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { assetApi } from "@/services/asset.service";

export default function PurchasesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [downloadingAssetId, setDownloadingAssetId] = useState<string | null>(
    null
  );

  const { data, isLoading } = useGetPaymentHistoryQuery({
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const purchases = data?.data || [];
  const meta = data?.meta;

  const handleDownload = async (assetId: string, assetSlug: string) => {
    if (downloadingAssetId) return; // Prevent multiple downloads

    setDownloadingAssetId(assetId);
    try {
      toast.loading("Preparing your download...");

      // Download asset as zip file
      const blob = await assetApi.downloadAsZip(assetId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${assetSlug || "asset"}_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Download complete!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to download asset");
      console.error("Download error:", error);
    } finally {
      setDownloadingAssetId(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            My Purchases
          </h1>
          <p className="text-muted-foreground mt-2">
            View your purchase history and downloaded assets
          </p>
        </div>
      </div>

      <Card className="mb-6 border-2 border-border/50 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-slate-500/5 to-gray-500/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-500/20 to-gray-500/20 flex items-center justify-center">
              <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter your purchases by status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px] rounded-xl">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Purchases</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Loading your purchases...</span>
            </div>
          </CardContent>
        </Card>
      ) : purchases.length === 0 ? (
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-primary" />
            </div>
            <p className="text-xl font-semibold mb-2">No purchases yet</p>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Start exploring our amazing collection of assets and make your
              first purchase
            </p>
            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
            >
              <Link href="/browse">
                <Sparkles className="h-4 w-4 mr-2" />
                Browse Assets
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Purchase History ({meta?.total || 0})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {purchases.map((purchase: any) => {
                const asset = purchase.assetDetails || purchase.asset;
                const isAssetObject =
                  typeof asset === "object" && asset !== null;

                return (
                  <div
                    key={purchase._id}
                    className="border-2 border-border/50 rounded-xl p-4 flex items-start gap-4 hover:bg-muted/50 hover:shadow-md transition-all duration-200"
                  >
                    {/* Asset Preview */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-xl overflow-hidden border-2 border-border/30">
                      {isAssetObject &&
                      asset.previews?.thumbnail?.secure_url ? (
                        <Image
                          src={asset.previews.thumbnail.secure_url}
                          alt={asset.title || "Asset"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Purchase Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold truncate">
                            {isAssetObject ? asset.title : "Asset"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={getStatusBadgeVariant(
                                purchase.paymentStatus
                              )}
                            >
                              {purchase.paymentStatus}
                            </Badge>
                            {isAssetObject && (
                              <Badge variant="outline">{asset.assetType}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 font-semibold">
                            <DollarSign className="h-4 w-4" />
                            {purchase.finalPrice.toFixed(2)}
                          </div>
                          {purchase.discountAmount > 0 && (
                            <p className="text-xs text-muted-foreground line-through">
                              ${purchase.originalPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(purchase.transactionDate)}
                        </span>
                        {purchase.isPremiumUser && (
                          <Badge variant="secondary" className="text-xs">
                            Premium Discount
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        {isAssetObject && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="rounded-xl"
                          >
                            <Link href={`/asset/${asset._id}`}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Asset
                            </Link>
                          </Button>
                        )}
                        {purchase.paymentStatus === "completed" &&
                          isAssetObject && (
                            <Button
                              size="sm"
                              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                              onClick={() =>
                                handleDownload(asset._id, asset.slug)
                              }
                              disabled={downloadingAssetId === asset._id}
                            >
                              {downloadingAssetId === asset._id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Downloading...
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </>
                              )}
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages} ({meta.total} total)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= meta.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
