"use client";

import { useState } from "react";
import { useGetAssetReviewsQuery, useDeleteReviewMutation } from "@/services";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MessageSquare,
  Search,
  Sparkles,
  Loader2,
  User,
  Calendar,
  Reply,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function ReviewsManagementPage() {
  const [assetId, setAssetId] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, refetch } = useGetAssetReviewsQuery(
    { assetId, page, limit },
    { skip: !assetId }
  );

  const [deleteReview] = useDeleteReviewMutation();

  const reviews = data?.data || [];
  const meta = data?.meta;

  const handleSearch = () => {
    if (searchInput.trim()) {
      setAssetId(searchInput.trim());
      setPage(1);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg">
              <Star className="h-6 w-6" />
            </div>
            Reviews Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and moderate user reviews
          </p>
        </div>
      </div>

      <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            Search Reviews by Asset
          </CardTitle>
          <CardDescription>
            Enter an asset ID to view its reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter Asset ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 rounded-xl"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Reviews
            </Button>
          </div>
        </CardContent>
      </Card>

      {!assetId ? (
        <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted mb-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">Search for an asset</p>
            <p className="text-muted-foreground text-center max-w-md">
              Enter an asset ID above to view and manage its reviews
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
              </div>
              <Loader2 className="h-6 w-6 animate-spin text-primary absolute -bottom-1 -right-1" />
            </div>
            <p className="text-lg font-medium mt-4">Loading reviews...</p>
            <p className="text-muted-foreground text-sm">
              Please wait while we fetch the data
            </p>
          </CardContent>
        </Card>
      ) : reviews.length === 0 ? (
        <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted mb-4">
              <Star className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">No reviews found</p>
            <p className="text-muted-foreground">
              This asset has no reviews yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Reviews for Asset
              <Badge variant="secondary" className="ml-2 rounded-lg">
                {meta?.total || 0} total
              </Badge>
            </CardTitle>
            <CardDescription>
              <Link
                href={`/asset/${assetId}`}
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                View Asset →
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div
                  key={review._id}
                  className="border-2 border-border/50 rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow bg-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-semibold">
                            {typeof review.user === "object"
                              ? review.user.name
                              : "Anonymous User"}
                          </span>
                        </div>
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {typeof review.user === "object"
                          ? review.user.email
                          : ""}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-xl"
                      onClick={() => handleDelete(review._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-xl border border-border/30">
                    <p className="whitespace-pre-wrap">{review.comment}</p>
                  </div>

                  {review.authorReply && (
                    <div className="ml-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-l-4 border-blue-500">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                        <Reply className="h-4 w-4" />
                        Author Reply
                      </p>
                      <p className="whitespace-pre-wrap text-sm">
                        {review.authorReply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
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
