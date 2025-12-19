"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { assetService } from "@/services/asset.service";
import { categoryApi } from "@/services/category.service";
import { Asset, Category } from "@/types";
import { type AssetFilters } from "@/services/asset.api";
import {
  Search,
  Filter,
  Download,
  Eye,
  Heart,
  ChevronLeft,
  Star,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

// Asset Card Component with Hover Effects
function AssetCard({ asset }: { asset: Asset }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const assetId = asset._id;
  const isVideo =
    asset.assetType === "video" || asset.storage?.resource_type === "video";
  const previewImages = asset.previews?.images || [];
  const hasMultiplePreviews = previewImages.length > 1;
  // assetStats may not be present on the static Asset type definition
  const stats =
    (
      asset as unknown as {
        assetStats?: { views?: number; downloads?: number; likes?: number };
      }
    ).assetStats || {};

  // Get current image URL for slideshow
  const getCurrentImageUrl = () => {
    if (hasMultiplePreviews && previewImages[currentImageIndex]) {
      return previewImages[currentImageIndex].secure_url;
    }
    return asset.previews?.thumbnail?.secure_url || asset.storage?.secure_url;
  };

  // Handle hover for images with slideshow and videos with robust playback
  const handleMouseEnter = () => {
    setIsHovering(true);

    if (isVideo && videoRef.current) {
      const video = videoRef.current;
      // Ensure prerequisites for autoplay
      try {
        video.muted = true;
        video.playsInline = true;
      } catch {}

      // Attempt to play with retries and a canplay fallback
      const tryPlay = async () => {
        try {
          await video.play();
          return;
        } catch {
          // Retry on canplay or after short delays
          // Add a once listener so it will clean itself up
          video.addEventListener(
            "canplay",
            () => {
              video.play().catch(() => {});
            },
            { once: true }
          );

          setTimeout(() => video.play().catch(() => {}), 300);
          setTimeout(() => video.play().catch(() => {}), 800);
        }
      };

      tryPlay();
    } else if (hasMultiplePreviews) {
      // Start slideshow for images with multiple previews
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % previewImages.length);
      }, 1500); // Change image every 1500ms (1.5 seconds) for smoother experience
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);

    if (isVideo && videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {}
    } else if (hasMultiplePreviews) {
      // Stop slideshow and reset to first image
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!assetId) {
    console.error("Asset missing _id:", asset);
    return null;
  }

  return (
    <Link href={`/asset/${assetId}`} key={assetId}>
      <Card className="overflow-hidden group border-2 border-border/50 hover:border-primary/30 transition-all duration-300 card-hover">
        <CardContent className="p-0">
          <div
            className="relative h-52 bg-muted overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isVideo ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={
                    asset.storage?.secure_url ||
                    asset.previews?.thumbnail?.secure_url ||
                    asset.livePreview ||
                    undefined
                  }
                  poster={
                    asset.previews?.thumbnail?.secure_url || asset.livePreview
                  }
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  preload="auto"
                  onCanPlay={(e) => {
                    // Ensure video can play when loaded
                    if (isHovering) {
                      e.currentTarget
                        .play()
                        .then(() => {
                          // Video started
                        })
                        .catch(() => {});
                    }
                  }}
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
                    isHovering ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="bg-black/60 backdrop-blur-sm rounded-full p-3">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={getCurrentImageUrl()}
                  alt={asset.title}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                  layout="fill"
                  objectFit="cover"
                />
                {hasMultiplePreviews && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {previewImages.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "w-6 bg-white"
                            : "w-3 bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {asset.isPremium && (
              <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Premium
              </Badge>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
              {asset.title}
            </h3>
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="capitalize text-xs font-medium rounded-full"
              >
                {asset.assetType}
              </Badge>
              {asset.isPremium ? (
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                  ${asset.price.toFixed(2)}
                </span>
              ) : (
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 rounded-full">
                  FREE
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
              <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Eye className="h-3.5 w-3.5" /> {stats.views ?? 0}
              </span>
              <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Download className="h-3.5 w-3.5" /> {stats.downloads ?? 0}
              </span>
              <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Heart className="h-3.5 w-3.5" /> {stats.likes ?? 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<AssetFilters>({
    page: 1,
    limit: 12,
    search: searchParams.get("search") || "",
    assetType: searchParams.get("type") || "all",
    categories: searchParams.get("categories") || "",
    isPremium: searchParams.get("premium") === "true" ? true : undefined,
    sort: searchParams.get("sort") || "-createdAt",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();

    // Parse categories from URL on mount
    const categoriesParam = searchParams.get("categories");
    if (categoriesParam) {
      const categoryIds = categoriesParam.split(",").filter(Boolean);
      setSelectedCategories(categoryIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      setCategories(response.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      // Remove 'all' value from filters before sending to API
      const apiFilters = { ...filters };
      if (apiFilters.assetType === "all") {
        delete apiFilters.assetType;
      }
      const response = await assetService.getAssets(apiFilters);
      console.log("Assets loaded:", response.data);
      setAssets(response.data);
      setTotalPages(response.meta.totalPages);
      setCurrentPage(response.meta.page);
    } catch (error) {
      console.error("Failed to load assets:", error);
      toast.error("Failed to load assets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handleFilterChange = (key: keyof AssetFilters, value: unknown) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const toggleCategory = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newSelected);
    setFilters({
      ...filters,
      categories: newSelected.join(","),
      page: 1,
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setFilters({
      page: 1,
      limit: 12,
      search: "",
      assetType: "all",
      categories: "",
      isPremium: undefined,
      sort: "-createdAt",
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="py-8 md:py-12">
      {/* Header */}
      <div className="mb-10">
        <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
          <Search className="w-3 h-3 mr-1.5" />
          Explore
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Browse Digital Assets
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover thousands of high-quality digital assets for your projects
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search assets..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-11 h-12 rounded-xl border-border/50 focus:border-primary bg-background"
            />
          </div>
          <Select
            value={filters.assetType}
            onValueChange={(value) => handleFilterChange("assetType", value)}
          >
            <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl border-border/50">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="3d">3D Models</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.sort}
            onValueChange={(value) => handleFilterChange("sort", value)}
          >
            <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl border-border/50">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="-createdAt">Newest First</SelectItem>
              <SelectItem value="createdAt">Oldest First</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="-price">Price: High to Low</SelectItem>
              <SelectItem value="title">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12 rounded-xl border-border/50 hover:border-primary/50 flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>Categories</span>
                {selectedCategories.length > 0 && (
                  <Badge className="ml-1 h-5 px-1.5 text-xs bg-primary text-primary-foreground">
                    {selectedCategories.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-64 max-h-80 overflow-y-auto rounded-xl"
            >
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Filter by Category</span>
                {selectedCategories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilters();
                    }}
                    className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Clear all
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.length > 0 ? (
                categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onCheckedChange={() => toggleCategory(category._id)}
                    className="cursor-pointer"
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                ))
              ) : (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  Loading categories...
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Selected Categories Pills */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c._id === categoryId);
                return category ? (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className="h-8 pl-3 pr-1.5 gap-1 text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                  >
                    {category.name}
                    <button
                      onClick={() => toggleCategory(categoryId)}
                      className="ml-1 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ) : null;
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Assets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-border/50">
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No assets found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="rounded-xl"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {assets.map((asset) => (
              <AssetCard key={asset._id} asset={asset} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  if (totalPages > 5) {
                    // Logic for pagination
                    return <span key={pageNum}>{pageNum}</span>;
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
