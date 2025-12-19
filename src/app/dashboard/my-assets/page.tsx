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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  FileImage,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Search,
  Plus,
  ExternalLink,
  Loader2,
  Sparkles,
  Filter,
  Crown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MyAssetsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data, isLoading } = useGetMyAssetsQuery({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    assetType: typeFilter === "all" ? undefined : typeFilter,
  });

  const assets = data?.data || [];
  const meta = data?.meta;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending_review":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20">
            <FileImage className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Assets</h1>
            <p className="text-muted-foreground">
              Manage and track your uploaded assets
            </p>
          </div>
        </div>
        <Button
          asChild
          className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
        >
          <Link href="/dashboard/upload">
            <Plus className="h-4 w-4 mr-2" />
            Upload New Asset
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-2 border-border/50 shadow-md">
        <CardHeader className="bg-gradient-to-br from-muted/50 to-transparent border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-primary" />
            Filters
          </CardTitle>
          <CardDescription>Filter your assets</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10 h-11"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="3d">3D</SelectItem>
                <SelectItem value="template">Template</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <Loader2 className="absolute -bottom-1 -right-1 h-6 w-6 animate-spin text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">Loading assets...</p>
          </div>
        </div>
      ) : assets.length === 0 ? (
        <Card className="border-2 border-border/50 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6">
              <FileImage className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-xl font-semibold mb-2">No assets found</p>
            <p className="text-muted-foreground mb-6">
              Start by uploading your first asset
            </p>
            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
            >
              <Link href="/dashboard/upload">
                <Plus className="h-4 w-4 mr-2" />
                Upload Asset
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {assets.map((asset: any) => (
              <Card
                key={asset._id}
                className="overflow-hidden border-2 border-border/50 card-hover group"
              >
                <div className="relative aspect-video bg-muted">
                  {asset.previews?.thumbnail?.secure_url ? (
                    <Image
                      src={asset.previews.thumbnail.secure_url}
                      alt={asset.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <FileImage className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={getStatusBadgeVariant(asset.status)}
                      className="shadow-md"
                    >
                      {asset.status.replace("_", " ")}
                    </Badge>
                  </div>
                  {asset.isPremium && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 shadow-md">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{asset.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="rounded-lg text-xs">
                      {asset.assetType}
                    </Badge>
                    <span className="text-sm font-semibold text-primary">
                      ${asset.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-lg">
                      <Eye className="h-3.5 w-3.5" />0
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-lg">
                      <Download className="h-3.5 w-3.5" />0
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-4 rounded-xl"
                    asChild
                  >
                    <Link href={`/asset/${asset._id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Asset
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-lg">
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= meta.totalPages}
                  className="rounded-xl"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
