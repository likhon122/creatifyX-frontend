"use client";

import { useState } from "react";
import { useGetAuthorReviewsQuery, useReplyToReviewMutation } from "@/services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  MessageSquare,
  Star,
  Reply,
  Loader2,
  CheckCircle,
  Clock,
  Sparkles,
  MessageCircle,
  MessagesSquare,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import type { Review, Asset, User as UserType } from "@/types";

export default function AuthorReviewsPage() {
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data, isLoading, refetch } = useGetAuthorReviewsQuery(undefined);
  const [replyToReview, { isLoading: replying }] = useReplyToReviewMutation();

  const reviews = data?.data || [];

  const handleOpenReply = (review: Review) => {
    setSelectedReview(review);
    setReplyText(review.authorReply?.comment || "");
    setReplyDialogOpen(true);
  };

  const handleSubmitReply = async () => {
    if (!selectedReview || !replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      await replyToReview({
        reviewId: selectedReview._id,
        reply: replyText,
      }).unwrap();

      toast.success("Reply submitted successfully");
      setReplyDialogOpen(false);
      setSelectedReview(null);
      setReplyText("");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit reply");
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Stats
  const totalReviews = reviews.length;
  const repliedReviews = reviews.filter((r) => r.authorReply).length;
  const pendingReplies = totalReviews - repliedReviews;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            Customer Reviews
          </h1>
          <p className="text-muted-foreground mt-1">
            View and respond to reviews on your assets
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl card-hover overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <MessagesSquare className="h-4 w-4" />
                Total Reviews
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                {totalReviews}
              </CardTitle>
            </CardHeader>
          </div>
        </Card>
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl card-hover overflow-hidden">
          <div className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Average Rating
              </CardDescription>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                  {averageRating.toFixed(1)}
                </span>
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              </CardTitle>
            </CardHeader>
          </div>
        </Card>
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl card-hover overflow-hidden">
          <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Replied
              </CardDescription>
              <CardTitle className="text-3xl font-bold text-green-600">
                {repliedReviews}
              </CardTitle>
            </CardHeader>
          </div>
        </Card>
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl card-hover overflow-hidden">
          <div className="bg-gradient-to-br from-orange-500/5 to-red-500/5">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Reply
              </CardDescription>
              <CardTitle className="text-3xl font-bold text-orange-600">
                {pendingReplies}
              </CardTitle>
            </CardHeader>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <Loader2 className="h-6 w-6 animate-spin text-primary absolute -bottom-1 -right-1" />
          </div>
          <p className="text-muted-foreground font-medium">
            Loading reviews...
          </p>
        </div>
      ) : reviews.length === 0 ? (
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-600/10 flex items-center justify-center mb-4">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <p className="text-xl font-semibold mb-2">No reviews yet</p>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              When customers review your assets, they will appear here
            </p>
            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 transition-opacity"
            >
              <Link href="/dashboard/my-assets">View My Assets</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const asset = review.asset as Asset;
            const buyer = review.user as UserType;

            return (
              <Card
                key={review._id}
                className="border-2 border-border/50 shadow-lg rounded-2xl card-hover overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-br from-slate-500/5 to-gray-500/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Reviewer Info */}
                      <Avatar className="h-12 w-12 ring-2 ring-border/50">
                        <AvatarImage src={buyer?.profileImage} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-emerald-600/20">
                          {buyer?.name ? getInitials(buyer.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {buyer?.name || "Anonymous"}
                          </p>
                          {review.authorReply ? (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600 bg-green-500/10"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Replied
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-orange-600 border-orange-600 bg-orange-500/10"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Reply
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {buyer?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Asset Info */}
                    <Link
                      href={`/asset/${asset?._id}`}
                      className="flex items-center gap-3 p-3 rounded-xl border-2 border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all"
                    >
                      <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
                        {asset?.previews?.thumbnail?.secure_url ? (
                          <Image
                            src={asset.previews.thumbnail.secure_url}
                            alt={asset?.title || "Asset"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm truncate max-w-[150px]">
                          {asset?.title || "Asset"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          View Asset
                        </p>
                      </div>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {/* Review Comment */}
                  <div className="bg-gradient-to-br from-slate-500/5 to-gray-500/5 p-4 rounded-xl border border-border/30">
                    <p className="text-sm">{review.comment}</p>
                  </div>

                  {/* Author Reply */}
                  {review.authorReply && (
                    <div className="ml-8 border-l-2 border-primary pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Reply className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Your Reply</span>
                        <span className="text-xs text-muted-foreground">
                          {review.authorReply.repliedAt &&
                            formatDate(review.authorReply.repliedAt.toString())}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.authorReply.comment}
                      </p>
                    </div>
                  )}

                  {/* Reply Button */}
                  <div className="flex justify-end">
                    <Button
                      variant={review.authorReply ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleOpenReply(review)}
                      className={
                        review.authorReply
                          ? "rounded-xl"
                          : "rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 transition-opacity"
                      }
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      {review.authorReply ? "Edit Reply" : "Reply"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="rounded-2xl border-2 border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center">
                <Reply className="h-4 w-4 text-primary" />
              </div>
              {selectedReview?.authorReply
                ? "Edit Your Reply"
                : "Reply to Review"}
            </DialogTitle>
            <DialogDescription>
              Respond to the customer&apos;s feedback on your asset
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              {/* Original Review Preview */}
              <div className="bg-gradient-to-br from-slate-500/5 to-gray-500/5 p-4 rounded-xl border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < selectedReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    by {(selectedReview.user as UserType)?.name || "Anonymous"}
                  </span>
                </div>
                <p className="text-sm">{selectedReview.comment}</p>
              </div>

              {/* Reply Input */}
              <div>
                <Textarea
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  className="rounded-xl border-2 border-border/50 focus:border-primary/50"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReplyDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReply}
              disabled={replying}
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 transition-opacity"
            >
              {replying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Reply className="h-4 w-4 mr-2" />
                  Submit Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
