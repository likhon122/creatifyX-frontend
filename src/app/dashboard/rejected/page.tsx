"use client";

import { useState } from "react";
import { useGetMyAssetsQuery } from "@/services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  XCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  FileImage,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Loader2,
  Ban,
  Upload,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Asset } from "@/types";

export default function RejectedAssetsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetMyAssetsQuery({
    page,
    limit,
    search: searchTerm || undefined,
    status: "rejected",
  });

  const assets = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-600/20 flex items-center justify-center">
              <XCircle className="h-7 w-7 text-red-500" />
            </div>
            Rejected Assets
          </h1>
          <p className="text-muted-foreground mt-1">
            Assets that were rejected during review. You can update and resubmit
            them.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="rounded-xl border-2 border-border/50"
        >
          <Link href="/dashboard/my-assets">View All Assets</Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6 border-2 border-border/50 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-slate-500/5 to-gray-500/5">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            Search Rejected Assets
          </CardTitle>
          <CardDescription>Find rejected assets to update</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rejected assets..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 rounded-xl border-2 border-border/50 focus:border-primary/50"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <Loader2 className="h-6 w-6 animate-spin text-primary absolute -bottom-1 -right-1" />
          </div>
          <p className="text-muted-foreground font-medium">Loading assets...</p>
        </div>
      ) : assets.length === 0 ? (
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center mb-4">
              <Ban className="h-10 w-10 text-green-500" />
            </div>
            <p className="text-xl font-semibold mb-2">No rejected assets</p>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              {searchTerm
                ? "No rejected assets match your search"
                : "Great news! You don't have any rejected assets"}
            </p>
            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 transition-opacity"
            >
              <Link href="/dashboard/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Asset
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Warning Banner */}
          <Card className="mb-6 border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5 shadow-lg rounded-2xl">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-red-600">
                    {assets.length} asset{assets.length > 1 ? "s" : ""} rejected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Review the rejection reasons and make necessary changes
                    before resubmitting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assets Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset: Asset) => (
              <Card
                key={asset._id}
                className="overflow-hidden border-2 border-red-500/20 shadow-lg rounded-2xl card-hover"
              >
                {/* Asset Preview */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-900 dark:to-gray-900">
                  {asset.previews?.thumbnail?.secure_url ? (
                    <Image
                      src={asset.previews.thumbnail.secure_url}
                      alt={asset.title}
                      fill
                      className="object-cover opacity-75"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileImage className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="destructive"
                      className="rounded-lg shadow-lg"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Rejected
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2 bg-gradient-to-br from-slate-500/5 to-gray-500/5">
                  <CardTitle className="text-lg truncate">
                    {asset.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-lg">
                      {asset.assetType}
                    </Badge>
                    <span className="text-xs font-semibold">
                      ${asset.price.toFixed(2)}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-2">
                  {/* Rejection Notice */}
                  <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 p-3 rounded-xl border border-red-500/20">
                    <p className="text-xs text-red-600 font-semibold mb-1">
                      This asset was rejected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Please review guidelines and update your asset before
                      resubmitting
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 rounded-xl border-2 border-border/50"
                    >
                      <Link href={`/asset/${asset._id}`}>View Details</Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="flex-1 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 transition-opacity"
                    >
                      <Link href={`/dashboard/upload?edit=${asset._id}`}>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Edit & Resubmit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 p-4 bg-gradient-to-br from-slate-500/5 to-gray-500/5 rounded-2xl border-2 border-border/50">
              <p className="text-sm text-muted-foreground font-medium">
                Page {meta.page} of {meta.totalPages} ({meta.total} rejected)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-xl border-2 border-border/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= meta.totalPages}
                  className="rounded-xl border-2 border-border/50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
