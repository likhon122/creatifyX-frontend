"use client";

import { useState } from "react";
import { useGetMyPendingAssetsQuery } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  AlertCircle,
  Upload,
  Loader2,
  Sparkles,
  Tag,
  DollarSign,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Asset } from "@/types";

export default function PendingAssetsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMyPendingAssetsQuery({ page, limit: 20 });

  const pendingAssets: Asset[] = data?.data || [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
              <Clock className="h-8 w-8 text-amber-500 animate-pulse" />
            </div>
            <Loader2 className="absolute -bottom-1 -right-1 h-6 w-6 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">
            Loading pending assets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
          <Clock className="h-8 w-8 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Pending Assets</h1>
          <p className="text-muted-foreground">
            Track your assets that are currently under review
          </p>
        </div>
      </div>

      {pendingAssets.length === 0 ? (
        <Card className="border-2 border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <Clock className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Pending Assets</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You don&apos;t have any assets pending review at the moment.
                Start uploading your creative work!
              </p>
              <Button
                asChild
                className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
              >
                <Link href="/dashboard/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Asset
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-blue-500/20">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Review Process
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                Your assets are being reviewed by our admin team. This typically
                takes 24-48 hours. You&apos;ll receive a notification once the
                review is complete.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingAssets.map((asset) => (
              <Card
                key={asset._id}
                className="border-2 border-border/50 shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border-b">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">
                          <Link
                            href={`/asset/${asset._id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {asset.title}
                          </Link>
                        </CardTitle>
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 shadow-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending Review
                        </Badge>
                      </div>
                      <CardDescription>
                        Submitted:{" "}
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="font-medium capitalize text-sm">
                          {asset.assetType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-medium text-sm">${asset.price}</p>
                      </div>
                    </div>
                    {asset.orientation && (
                      <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                        <div className="h-4 w-4 rounded border-2 border-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Orientation
                          </p>
                          <p className="font-medium capitalize text-sm">
                            {asset.orientation}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                      <Crown className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Premium</p>
                        <p className="font-medium text-sm">
                          {asset.isPremium ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {asset.tags && asset.tags.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Tags
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {asset.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="rounded-lg"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="px-4 py-2 bg-muted/50 rounded-xl text-sm font-medium">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="rounded-xl"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
