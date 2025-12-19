"use client";

import { useState, useEffect } from "react";
import { assetApi } from "@/services/asset.service";
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
import { toast } from "sonner";
import {
  FileImage,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Loader2,
  Filter,
  Eye,
  Download,
  Heart,
  Crown,
  ExternalLink,
  Settings2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AssetsManagementPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [assets, setAssets] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const filters: any = { page, limit };
      if (searchTerm) filters.search = searchTerm;
      if (statusFilter && statusFilter !== "all") filters.status = statusFilter;
      if (typeFilter && typeFilter !== "all") filters.assetType = typeFilter;

      const response = await assetApi.getAssets(filters);
      setAssets(response.data || []);
      setMeta(response.meta);
    } catch (error) {
      toast.error("Failed to load assets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [page, searchTerm, statusFilter, typeFilter]);

  const handleStatusChange = async (assetId: string, status: string) => {
    try {
      await assetApi.updateAsset(assetId, status);
      toast.success(`Asset status updated to ${status}`);
      loadAssets();
    } catch (error) {
      toast.error("Failed to update asset status");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending_review":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending_review":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
              <FileImage className="h-8 w-8 text-primary" />
            </div>
            Asset Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and manage all platform assets
          </p>
        </div>
      </div>

      <Card className="rounded-2xl border-2 border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <Filter className="h-4 w-4 text-blue-500" />
            </div>
            Filters
          </CardTitle>
          <CardDescription>
            Filter assets by status, type, or search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-2 border-border/50 focus:border-primary/50"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-xl border-2 border-border/50">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="rounded-xl border-2 border-border/50">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="graphic-template">
                  Graphic Template
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-4">
          <div className="relative">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <Loader2 className="h-6 w-6 text-primary animate-spin absolute -bottom-1 -right-1" />
          </div>
          <p className="text-muted-foreground font-medium">Loading assets...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {assets.map((asset: any) => (
              <Card
                key={asset._id}
                className="rounded-2xl border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Link
                      href={`/asset/${asset._id}`}
                      className="relative h-32 w-32 rounded-xl overflow-hidden bg-muted flex-shrink-0 hover:opacity-80 transition-opacity border-2 border-border/50"
                    >
                      {asset.previews?.thumbnail?.secure_url ? (
                        <Image
                          src={asset.previews.thumbnail.secure_url}
                          alt={asset.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <FileImage className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/asset/${asset._id}`}
                            className="font-semibold text-lg hover:text-primary transition-colors truncate block"
                          >
                            {asset.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            By {asset.author?.name || "Unknown"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getStatusBadgeVariant(asset.status)}
                            className="rounded-lg"
                          >
                            {getStatusIcon(asset.status)}
                            <span className="ml-1">{asset.status}</span>
                          </Badge>
                          <Badge variant="outline" className="rounded-lg">
                            {asset.assetType}
                          </Badge>
                          {asset.isPremium && (
                            <Badge
                              variant="default"
                              className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 border-0"
                            >
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        {asset.assetStats && (
                          <>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5" />
                              {asset.assetStats.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="h-3.5 w-3.5" />
                              {asset.assetStats.downloads || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3.5 w-3.5" />
                              {asset.assetStats.likes || 0}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={asset.status}
                          onValueChange={(value) =>
                            handleStatusChange(asset._id, value)
                          }
                        >
                          <SelectTrigger className="w-[180px] rounded-xl border-2 border-border/50">
                            <Settings2 className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="pending_review">
                              Pending Review
                            </SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>

                        <Link href={`/asset/${asset._id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-2 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="rounded-xl border-2 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border-2 border-border/50">
                <span className="text-sm font-medium">
                  Page {page} of {meta.totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === meta.totalPages}
                className="rounded-xl border-2 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50 disabled:opacity-50"
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
