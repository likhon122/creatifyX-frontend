"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { assetApi } from "@/services/asset.service";
import { categoryApi } from "@/services/category.service";
import { useAuthStore } from "@/store/auth-store";
import { Category } from "@/types";
import {
  Loader2,
  Upload,
  X,
  AlertCircle,
  Info,
  Sparkles,
  FileUp,
  ImagePlus,
  Crown,
  Tag,
  DollarSign,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";

const uploadSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title too long"),
  assetType: z.enum([
    "image",
    "video",
    "web",
    "presentation",
    "graphic-template",
  ]),
  categories: z
    .array(z.string())
    .min(1, "Select at least one category")
    .max(5, "Maximum 5 categories"),
  tags: z.string().min(1, "Add at least one tag"),
  price: z.number().min(0, "Price must be positive"),
  isPremium: z.boolean(),
  orientation: z.enum(["horizontal", "vertical", "square"]).optional(),
  livePreview: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type UploadFormData = z.infer<typeof uploadSchema>;

type AssetTypeKey =
  | "image"
  | "video"
  | "web"
  | "presentation"
  | "graphic-template";

const ASSET_TYPE_INFO: Record<
  AssetTypeKey,
  {
    label: string;
    mainFileDesc: string;
    previewDesc: string;
    requirements: string[];
  }
> = {
  image: {
    label: "Image",
    mainFileDesc: "JPG, PNG, or other image formats",
    previewDesc: "Auto-generated (no upload needed)",
    requirements: [
      "Max size: 10MB",
      "Resolution: 4MP - 25MP",
      "Preview is automatically generated with watermark",
    ],
  },
  video: {
    label: "Video",
    mainFileDesc: "MP4, MOV, or other video formats",
    previewDesc: "Optional: Short video preview (max 15 seconds)",
    requirements: [
      "Size: 2MB - 500MB (minimum 2MB required)",
      "Duration: 5 seconds - 5 minutes",
      "Optional video preview (max 15 seconds)",
    ],
  },
  web: {
    label: "Web Template (ZIP)",
    mainFileDesc: "ZIP file containing web template",
    previewDesc: "Required: 1-5 preview images (JPG/PNG)",
    requirements: [
      "Max size: 500MB",
      "Must provide 1-5 preview images (500KB-5MB each)",
      "Live preview URL required",
    ],
  },
  presentation: {
    label: "Presentation (ZIP)",
    mainFileDesc: "ZIP file containing presentation",
    previewDesc: "Required: 1-5 preview images (JPG/PNG)",
    requirements: [
      "Max size: 500MB",
      "Must provide 1-5 preview images (500KB-5MB each)",
      "Live preview URL required",
    ],
  },
  "graphic-template": {
    label: "Graphic Template (ZIP)",
    mainFileDesc: "ZIP file containing template files",
    previewDesc: "Required: 1-5 preview images (JPG/PNG)",
    requirements: [
      "Max size: 500MB",
      "Must provide 1-5 preview images (500KB-5MB each)",
      "Live preview URL required",
    ],
  },
};

export default function UploadAssetPage() {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetTypeKey | "">(
    ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      isPremium: false,
      categories: [],
    },
  });

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated || user?.role !== "author") {
      router.push("/dashboard");
      return;
    }
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, _hasHydrated]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      setCategories(response.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const isZipType = (type: string) =>
    ["web", "presentation", "graphic-template"].includes(type);

  const validateFiles = () => {
    if (!assetFile) {
      toast.error("Please select an asset file");
      return false;
    }

    const type = selectedAssetType;
    if (!type) {
      toast.error("Please select asset type");
      return false;
    }

    // File size validation
    const fileSizeInMB = assetFile.size / 1024 / 1024;

    // Video file size validation
    if (type === "video") {
      if (fileSizeInMB < 2) {
        toast.error("Video file must be at least 2 MB");
        return false;
      }
      if (fileSizeInMB > 500) {
        toast.error("Video file must not exceed 500 MB");
        return false;
      }
    }

    // Image file size validation
    if (type === "image") {
      if (fileSizeInMB > 10) {
        toast.error("Image file must not exceed 10 MB");
        return false;
      }
    }

    // ZIP types file size validation
    if (isZipType(type)) {
      if (fileSizeInMB > 500) {
        toast.error("ZIP file must not exceed 500 MB");
        return false;
      }
    }

    // ZIP types require preview images
    if (isZipType(type)) {
      if (previewFiles.length === 0) {
        toast.error("ZIP files require at least 1 preview image");
        return false;
      }
      if (previewFiles.length > 5) {
        toast.error("Maximum 5 preview images allowed");
        return false;
      }
    }

    // Images should not have preview uploads
    if (type === "image" && previewFiles.length > 0) {
      toast.error(
        "Preview is auto-generated for images. Please remove preview files."
      );
      return false;
    }

    return true;
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!validateFiles()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();

      // Backend expects JSON data in 'data' field
      const assetData = {
        title: data.title,
        assetType: data.assetType,
        price: data.price,
        isPremium: data.isPremium,
        tags: data.tags,
        categories: data.categories,
        orientation: data.orientation,
        livePreview: data.livePreview || undefined,
      };
      formData.append("data", JSON.stringify(assetData));

      // Backend expects main file as 'file' field
      formData.append("file", assetFile!);

      // Backend expects preview(s) as 'preview' field
      previewFiles.forEach((file) => {
        formData.append("preview", file);
      });

      await assetApi.createAsset(formData);
      toast.success("Asset uploaded successfully! Pending review.");
      router.push("/dashboard");
    } catch {
      console.log(errors);
      toast.error("Failed to upload asset. Please check all requirements.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetTypeChange = (value: string) => {
    setSelectedAssetType(value as AssetTypeKey);
    setValue("assetType", value as AssetTypeKey);
    // Clear files when type changes
    setAssetFile(null);
    setPreviewFiles([]);
  };

  const handlePreviewFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast.error("Maximum 5 preview images allowed");
      return;
    }
    setPreviewFiles(files);
  };

  const removePreviewFile = (index: number) => {
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedCategories = watch("categories") || [];
  const currentType = ASSET_TYPE_INFO[selectedAssetType as AssetTypeKey];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-2 border-border/50 shadow-xl">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-emerald-500/5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20">
              <FileUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Upload New Asset</CardTitle>
              <CardDescription className="mt-1">
                Share your creative work with the community
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Title
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="My Awesome Asset"
                className="h-11"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Asset Type */}
            <div className="space-y-2">
              <Label
                htmlFor="assetType"
                className="text-sm font-medium flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4 text-primary" />
                Asset Type *
              </Label>
              <Select onValueChange={handleAssetTypeChange}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="web">Web Template</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="graphic-template">
                    Graphic Template
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.assetType && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.assetType.message}
                </p>
              )}

              {/* Show requirements for selected type */}
              {selectedAssetType && currentType && (
                <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      Requirements
                    </p>
                  </div>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1.5">
                    {currentType.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Asset File */}
            {selectedAssetType && (
              <div className="space-y-2">
                <Label
                  htmlFor="assetFile"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Upload className="h-4 w-4 text-primary" />
                  Main Asset File *
                </Label>
                <p className="text-sm text-muted-foreground">
                  {currentType?.mainFileDesc}
                </p>
                <div className="mt-2 border-2 border-dashed border-border/60 hover:border-primary/50 rounded-2xl p-8 text-center transition-colors bg-muted/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-500/10 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary/60" />
                  </div>
                  <Input
                    id="assetFile"
                    type="file"
                    onChange={(e) => setAssetFile(e.target.files?.[0] || null)}
                    accept={
                      selectedAssetType === "image"
                        ? "image/*"
                        : selectedAssetType === "video"
                        ? "video/*"
                        : ".zip,application/zip,application/x-zip-compressed"
                    }
                    className="max-w-xs mx-auto"
                  />
                  {assetFile && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                      <FileUp className="h-4 w-4 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-medium">{assetFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(assetFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preview Files */}
            {selectedAssetType && (
              <div className="space-y-2">
                <Label
                  htmlFor="previewFiles"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <ImagePlus className="h-4 w-4 text-primary" />
                  Preview Files{" "}
                  {isZipType(selectedAssetType) ? "*" : "(Optional)"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {currentType?.previewDesc}
                </p>

                {selectedAssetType !== "image" && (
                  <div className="mt-2 border-2 border-dashed border-border/60 hover:border-primary/50 rounded-2xl p-6 transition-colors bg-muted/30">
                    <Input
                      id="previewFiles"
                      type="file"
                      multiple={isZipType(selectedAssetType)}
                      onChange={handlePreviewFilesChange}
                      accept={
                        selectedAssetType === "video"
                          ? "video/*"
                          : isZipType(selectedAssetType)
                          ? "image/jpeg,image/jpg,image/png"
                          : ""
                      }
                      className="max-w-xs mx-auto"
                    />
                    {previewFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {previewFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-background rounded-xl border-2 border-border/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-emerald-500/10 flex items-center justify-center">
                                <ImagePlus className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024).toFixed(0)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                              onClick={() => removePreviewFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {selectedAssetType === "image" && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      ✓
                    </span>
                    Preview will be automatically generated with watermark
                  </p>
                )}
              </div>
            )}

            {/* Live Preview URL (required for ZIP types) */}
            {selectedAssetType && isZipType(selectedAssetType) && (
              <div className="space-y-2">
                <Label htmlFor="livePreview" className="text-sm font-medium">
                  Live Preview URL *
                </Label>
                <Input
                  id="livePreview"
                  {...register("livePreview")}
                  placeholder="https://example.com/demo"
                  type="url"
                  className="h-11"
                />
                <p className="text-sm text-muted-foreground">
                  Required for templates - provide a working demo URL
                </p>
                {errors.livePreview && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.livePreview.message}
                  </p>
                )}
              </div>
            )}

            {/* Orientation */}
            {selectedAssetType &&
              (selectedAssetType === "image" ||
                selectedAssetType === "video") && (
                <div className="space-y-2">
                  <Label htmlFor="orientation" className="text-sm font-medium">
                    Orientation
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValue(
                        "orientation",
                        value as "horizontal" | "vertical" | "square"
                      )
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">
                        Horizontal (Landscape)
                      </SelectItem>
                      <SelectItem value="vertical">
                        Vertical (Portrait)
                      </SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

            {/* Categories */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-primary" />
                Categories *
              </Label>
              <p className="text-sm text-muted-foreground">
                Select up to 5 categories
              </p>
              <div className="border-2 border-border/50 rounded-xl p-4 max-h-64 overflow-y-auto space-y-3 bg-muted/20">
                {categories
                  .filter((cat) => cat.categoryType === "main_category")
                  .map((parent) => {
                    const subcategories = categories.filter(
                      (cat) =>
                        cat.categoryType === "sub_category" &&
                        Array.isArray(parent.subCategories) &&
                        parent.subCategories.some(
                          (subId: string | { _id: string }) =>
                            typeof subId === "string"
                              ? subId === cat._id
                              : subId._id === cat._id
                        )
                    );

                    return (
                      <div key={parent._id} className="space-y-2">
                        {/* Parent Category */}
                        <label className="flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer hover:bg-accent transition-colors font-medium">
                          <input
                            type="checkbox"
                            value={parent._id}
                            checked={selectedCategories.includes(parent._id)}
                            onChange={(e) => {
                              if (
                                e.target.checked &&
                                selectedCategories.length >= 5
                              ) {
                                toast.error("Maximum 5 categories allowed");
                                return;
                              }
                              const newCategories = e.target.checked
                                ? [...selectedCategories, parent._id]
                                : selectedCategories.filter(
                                    (id) => id !== parent._id
                                  );
                              setValue("categories", newCategories);
                            }}
                            className="rounded w-4 h-4 accent-primary"
                          />
                          <span className="text-sm">{parent.name}</span>
                        </label>

                        {/* Subcategories */}
                        {subcategories.length > 0 && (
                          <div className="ml-8 space-y-1 border-l-2 border-border/50 pl-4">
                            {subcategories.map((sub) => (
                              <label
                                key={sub._id}
                                className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  value={sub._id}
                                  checked={selectedCategories.includes(sub._id)}
                                  onChange={(e) => {
                                    if (
                                      e.target.checked &&
                                      selectedCategories.length >= 5
                                    ) {
                                      toast.error(
                                        "Maximum 5 categories allowed"
                                      );
                                      return;
                                    }
                                    const newCategories = e.target.checked
                                      ? [...selectedCategories, sub._id]
                                      : selectedCategories.filter(
                                          (id) => id !== sub._id
                                        );
                                    setValue("categories", newCategories);
                                  }}
                                  className="rounded w-4 h-4 accent-primary"
                                />
                                <span className="text-sm text-muted-foreground">
                                  {sub.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {selectedCategories.length} / 5
                  </span>
                  categories selected
                </p>
              )}
              {errors.categories && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.categories.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label
                htmlFor="tags"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Tag className="h-4 w-4 text-primary" />
                Tags
              </Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="nature, landscape, mountains (comma-separated)"
                className="h-11"
              />
              {errors.tags && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tags.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-medium flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4 text-primary" />
                Price ($)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="9.99"
                className="h-11"
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Premium */}
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-200 dark:border-amber-800">
              <input
                type="checkbox"
                id="isPremium"
                {...register("isPremium")}
                className="rounded w-5 h-5 accent-amber-500"
              />
              <Label
                htmlFor="isPremium"
                className="cursor-pointer flex items-center gap-2"
              >
                <Crown className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Premium only</span>
                <span className="text-sm text-muted-foreground">
                  (requires subscription)
                </span>
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading || !selectedAssetType}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-base font-semibold shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Asset
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={isLoading}
                className="h-12 rounded-xl px-8"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
