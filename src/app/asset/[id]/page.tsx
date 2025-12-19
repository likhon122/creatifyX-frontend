"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { assetApi } from "@/services/asset.service";
import { paymentApi } from "@/services/payment.service";
import { reviewApi } from "@/services/review.service";
import { useAuthStore } from "@/store/auth-store";
import { Asset, Review } from "@/types";
import {
  Download,
  Eye,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Loader2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(0);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    // Validate ID before making API calls
    if (!id || id === "undefined" || id === "null" || id.trim() === "") {
      toast.error("Invalid asset ID");
      router.replace("/browse");
      return;
    }

    loadAsset();
    checkPurchaseStatus();
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadAsset = async () => {
    if (!id || id === "undefined" || id === "null") return;

    try {
      const response = await assetApi.getAsset(id);
      // Try to increment view count on server, then update local copy optimistically
      const assetData = response.data as Asset & {
        assetStats?: { views?: number; downloads?: number; likes?: number };
      };
      try {
        await assetApi.incrementView(id);
        assetData.assetStats = {
          ...(assetData.assetStats || {}),
          views: (assetData.assetStats?.views ?? 0) + 1,
        };
      } catch {
        // ignore increment errors
      }

      setAsset(assetData as Asset);
    } catch {
      toast.error("Failed to load asset");
      router.push("/browse");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPurchaseStatus = async () => {
    if (!isAuthenticated || !id || id === "undefined" || id === "null") return;

    try {
      const response = await paymentApi.checkPurchase(id);
      setIsPurchased(response.data.isPurchased);
    } catch {
      // Ignore error
    }
  };

  const loadReviews = async () => {
    if (!id || id === "undefined" || id === "null") return;

    try {
      const response = await reviewApi.getAssetReviews(id, 1, 10);
      setReviews(response.data);

      // Check if the current user has already reviewed
      if (isAuthenticated && user) {
        const userReview = response.data.find((review: Review) => {
          const reviewUserId =
            typeof review.user === "object" ? review.user._id : review.user;
          return reviewUserId === user._id;
        });
        setHasUserReviewed(!!userReview);
      }
    } catch {
      // Ignore error
    }
  };

  const handleSubmitReview = async () => {
    if (!id || !isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await reviewApi.createReview({
        assetId: id,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Review submitted successfully!");
      setReviewComment("");
      setReviewRating(5);
      setHasUserReviewed(true);
      loadReviews(); // Reload reviews
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handlePurchase = async () => {
    // Use asset._id instead of URL param for reliability
    const assetId = asset?._id || id;

    console.log(assetId);

    if (!assetId || assetId === "undefined" || assetId === "null" || !asset) {
      console.error("Invalid asset data:", { assetId, asset, id });
      toast.error("Asset not loaded properly. Please refresh the page.");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to purchase");
      router.push("/auth/login");
      return;
    }

    console.log(assetId);

    // Premium users get 30% discount but still need to purchase
    setIsPurchasing(true);
    try {
      console.log("Creating checkout for asset ID:", assetId);
      const response = await paymentApi.createCheckout(assetId);
      console.log(response);

      // Redirect to Stripe checkout page using sessionUrl
      if (response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else {
        throw new Error("No session URL returned from server");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to create checkout session");
      setIsPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (!id || id === "undefined" || id === "null") {
      toast.error("Invalid asset ID");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to download");
      router.push("/auth/login");
      return;
    }

    // Allow download if: asset is free OR user purchased it
    if (!isFreeAsset && !isPurchased) {
      toast.error("Please purchase this asset first");
      return;
    }

    try {
      toast.loading("Preparing your download...");

      // Download asset as zip file
      const blob = await assetApi.downloadAsZip(id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${asset?.slug || "asset"}_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Refresh asset to get updated stats
      try {
        const resp = await assetApi.getAsset(id);
        setAsset(resp.data);
      } catch {}

      toast.dismiss();
      toast.success("Download complete!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to download asset");
      console.error("Download error:", error);
    }
  };

  const handleLike = async () => {
    if (!id || id === "undefined" || id === "null") {
      toast.error("Invalid asset ID");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to like");
      return;
    }

    try {
      await assetApi.toggleLike(id);
      // Refresh asset to get updated likes/views
      try {
        const resp = await assetApi.getAsset(id);
        setAsset(resp.data);
      } catch {}
      toast.success("Like updated!");
    } catch {
      toast.error("Failed to update like");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[28rem] w-full rounded-2xl" />
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="container min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Asset Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The asset you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/browse")} className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse Assets
          </Button>
        </div>
      </div>
    );
  }

  const finalPrice = asset.discountPrice || asset.price;
  const hasDiscount = asset.discountPrice && asset.discountPrice < asset.price;
  const isFreeAsset = !asset.isPremium; // Free assets are non-premium only
  const premiumDiscount = user?.isPremium ? 0.3 : 0; // 30% discount for premium users
  const userFinalPrice = finalPrice * (1 - premiumDiscount);

  // Determine if asset is video
  const isVideo =
    asset.storage?.resource_type === "video" || asset.assetType === "video";

  // Get all preview images (for assets with multiple previews like ZIP files)
  const previewImages = asset.previews?.images || [];
  const hasMultiplePreviews = previewImages.length > 0;

  // Get the current preview URL
  const getCurrentPreviewUrl = () => {
    if (hasMultiplePreviews && previewImages[selectedPreview]) {
      return previewImages[selectedPreview].secure_url;
    }
    return (
      asset.livePreview ||
      asset.previews?.thumbnail?.secure_url ||
      asset.storage?.secure_url
    );
  };

  const currentPreviewUrl = getCurrentPreviewUrl();

  // Safe stats accessor (Asset type may not include assetStats)
  const stats =
    (
      asset as unknown as {
        assetStats?: { views?: number; downloads?: number; likes?: number };
      }
    ).assetStats || {};
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
      : 0;

  return (
    <div className="container py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preview Image/Video */}
          <div className="space-y-4">
            <div className="relative h-[28rem] bg-muted rounded-2xl overflow-hidden border-2 border-border/50 group">
              {isVideo ? (
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  controlsList="nodownload"
                  preload="auto"
                  className="w-full h-full object-contain"
                  poster={asset.previews?.thumbnail?.secure_url}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    video.play().catch(() => {
                      console.log("Autoplay prevented by browser");
                    });
                  }}
                >
                  <source
                    src={currentPreviewUrl}
                    type={`video/${asset.storage?.format || "mp4"}`}
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={currentPreviewUrl || ""}
                  alt={asset.title}
                  layout="fill"
                  objectFit="contain"
                  className="w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
              )}
              {asset.isPremium && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Premium
                </Badge>
              )}
            </div>

            {/* Preview Gallery Thumbnails */}
            {hasMultiplePreviews && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {previewImages.map((preview, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPreview(index)}
                    className={`relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedPreview === index
                        ? "border-primary ring-2 ring-primary/30 scale-105"
                        : "border-border/50 hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={preview.secure_url}
                      alt={`Preview ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{asset.title}</h1>
                <p className="text-muted-foreground mb-4">
                  by{" "}
                  <span className="font-medium text-foreground">
                    {typeof asset.author === "object"
                      ? asset.author.name
                      : "Unknown Author"}
                  </span>
                </p>
                {/* Live Preview Button - Highlighted */}
                {asset.livePreview && (
                  <Button
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                    onClick={() => window.open(asset.livePreview, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Live Preview
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLike}
                  className="rounded-xl border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-2 hover:bg-primary/5 hover:border-primary/30 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{stats.views ?? 0}</span> views
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <Download className="h-4 w-4 text-green-500" />
                <span className="font-medium">{stats.downloads ?? 0}</span>{" "}
                downloads
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({reviews.length} reviews)
                </span>
              </span>
            </div>
          </div>

          <Separator />

          {/* Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl">
              <TabsTrigger
                value="details"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="p-5 rounded-xl bg-muted/30 border border-border/50">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  High-quality {asset.assetType} asset perfect for your creative
                  projects.
                </p>
              </div>

              {/* Live Preview URL Section - Highlighted */}
              {asset.livePreview && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                        <ExternalLink className="h-4 w-4" />
                        Live Preview Available
                      </h4>
                      <p className="text-sm text-muted-foreground break-all">
                        {asset.livePreview}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-xl bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.open(asset.livePreview, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <h4 className="font-semibold text-sm mb-1 text-muted-foreground">
                    Type
                  </h4>
                  <p className="text-base font-medium capitalize">
                    {asset.assetType}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <h4 className="font-semibold text-sm mb-1 text-muted-foreground">
                    Format
                  </h4>
                  <p className="text-base font-medium uppercase">
                    {asset.storage?.format}
                  </p>
                </div>
                {asset.resolution && (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <h4 className="font-semibold text-sm mb-1 text-muted-foreground">
                      Resolution
                    </h4>
                    <p className="text-base font-medium">{asset.resolution}</p>
                  </div>
                )}
                {asset.orientation && (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <h4 className="font-semibold text-sm mb-1 text-muted-foreground">
                      Orientation
                    </h4>
                    <p className="text-base font-medium capitalize">
                      {asset.orientation}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {asset.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              {/* Review Form - Show for authenticated users who purchased */}
              {isAuthenticated &&
                (isPurchased || isFreeAsset) &&
                !hasUserReviewed && (
                  <Card className="mb-6 border-2 border-primary/20 rounded-xl overflow-hidden">
                    <CardHeader className="bg-primary/5">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Write a Review
                      </CardTitle>
                      <CardDescription>
                        Share your experience with this asset
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <div className="flex gap-1.5 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setReviewRating(i + 1)}
                              className="focus:outline-none transition-transform hover:scale-110"
                              type="button"
                            >
                              <Star
                                className={`h-7 w-7 cursor-pointer transition-colors ${
                                  i < reviewRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300 hover:text-yellow-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="comment">Your Review</Label>
                        <Textarea
                          id="comment"
                          placeholder="Share your thoughts about this asset..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={4}
                          className="mt-2 rounded-xl"
                        />
                      </div>
                      <Button
                        onClick={handleSubmitReview}
                        disabled={isSubmittingReview || !reviewComment.trim()}
                        className="rounded-xl"
                      >
                        {isSubmittingReview ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Submit Review
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}

              {/* Show message for non-purchasers */}
              {isAuthenticated && !isPurchased && !isFreeAsset && (
                <Card className="mb-6 bg-muted/50 border-2 border-border/50 rounded-xl">
                  <CardContent className="py-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                      <MessageSquare className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Purchase this asset to leave a review
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Show message for users who already reviewed */}
              {hasUserReviewed && (
                <Card className="mb-6 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
                  <CardContent className="py-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                      Thank you for your review!
                    </p>
                  </CardContent>
                </Card>
              )}

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card
                      key={review._id}
                      className="border-2 border-border/50 rounded-xl"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Avatar className="border-2 border-border">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {typeof review.user === "object"
                                ? review.user.name[0]
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {typeof review.user === "object"
                                ? review.user.name
                                : "User"}
                            </p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-2 border-border/50 rounded-2xl overflow-hidden sticky top-24">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-emerald-500/5">
              <CardTitle>Purchase</CardTitle>
              <CardDescription>
                Get instant access to this asset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Only show price for premium assets */}
              {asset.isPremium && (
                <div className="text-center p-4 rounded-xl bg-muted/30">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                      ${userFinalPrice.toFixed(2)}
                    </span>
                    {(hasDiscount || user?.isPremium) && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${asset.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {user?.isPremium && (
                    <Badge className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Premium: Save 30% (${(finalPrice * 0.3).toFixed(2)})
                    </Badge>
                  )}
                  {hasDiscount && !user?.isPremium && (
                    <Badge variant="destructive" className="mt-3">
                      Save ${(asset.price - finalPrice).toFixed(2)}
                    </Badge>
                  )}
                </div>
              )}

              {/* Free asset badge */}
              {!asset.isPremium && (
                <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800">
                  <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    Free Asset
                  </Badge>
                </div>
              )}

              {/* Show download button ONLY for: purchased assets or free assets */}
              {isPurchased || isFreeAsset ? (
                <Button
                  className="w-full rounded-xl h-12 text-base bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </Button>
              ) : (
                <Button
                  className="w-full rounded-xl h-12 text-base bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Buy Now
                    </>
                  )}
                </Button>
              )}

              {user?.isPremium && asset.isPremium && !isPurchased && (
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Premium members get 30% off all assets!
                </p>
              )}
              {isPurchased && (
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                  <Check className="h-4 w-4" />
                  You own this asset
                </div>
              )}
              {isFreeAsset && (
                <p className="text-xs text-center text-muted-foreground">
                  This is a free asset - available to all users
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 text-sm text-muted-foreground border-t pt-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-green-500/10">
                  <Download className="h-4 w-4 text-green-500" />
                </div>
                <span>Instant download</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10">
                  <Star className="h-4 w-4 text-amber-500" />
                </div>
                <span>Commercial license included</span>
              </div>
            </CardFooter>
          </Card>

          {/* Author Card */}
          {typeof asset.author === "object" && (
            <Card className="border-2 border-border/50 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-muted/50 to-transparent">
                <CardTitle>About the Author</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14 border-2 border-border">
                    <AvatarImage src={asset.author.profileImage} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {asset.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{asset.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-green-500 font-medium">
                        ${asset.author.totalEarnings}
                      </span>{" "}
                      earned
                    </p>
                  </div>
                </div>
                {asset.author.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {asset.author.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
