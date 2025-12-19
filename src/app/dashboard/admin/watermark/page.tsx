"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Upload,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Info,
  Droplet,
} from "lucide-react";
import { toast } from "sonner";
import { watermarkService, Watermark } from "@/services/watermark.service";
import Image from "next/image";

export default function WatermarkPage() {
  const [watermarks, setWatermarks] = useState<Watermark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadWatermarks();
  }, []);

  const loadWatermarks = async () => {
    try {
      setIsLoading(true);
      const response = await watermarkService.getAllWatermarks();
      setWatermarks(response.data || []);
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage = apiError?.response?.data?.message;
      toast.error("Failed to Load Watermarks", {
        description:
          errorMessage || "Please refresh the page or try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a PNG, JPG, GIF, or WebP image file.",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 5MB. Please choose a smaller image.",
      });
      return;
    }

    // Validate image dimensions (optional but helpful)
    const img = new window.Image();
    img.src = URL.createObjectURL(file);

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("watermark", file);

      const response = await watermarkService.uploadWatermark(formData);
      toast.success("Watermark uploaded!", {
        description:
          response.message ||
          "Your watermark is now active and will be applied to asset previews.",
      });
      loadWatermarks();
    } catch (error) {
      // Extract error message from API response
      const apiError = error as {
        response?: { data?: { message?: string; errorCode?: string } };
      };
      const errorMessage =
        apiError?.response?.data?.message || "Failed to upload watermark";
      const errorCode = apiError?.response?.data?.errorCode;

      // Show specific error messages based on error code
      let description =
        "Please try again or contact support if the problem persists.";

      if (errorCode === "NO_FILE") {
        description =
          "No file was received. Please select a file and try again.";
      } else if (errorCode === "INVALID_FILE_TYPE") {
        description = "Only PNG, JPG, GIF, and WebP images are supported.";
      } else if (errorCode === "FILE_TOO_LARGE") {
        description = "Please choose a smaller image (max 5MB).";
      } else if (errorMessage.includes("Authentication")) {
        description =
          "Your session may have expired. Please refresh and try again.";
      } else if (errorMessage.includes("Cloud")) {
        description =
          "There was an issue with our cloud storage. Please try again later.";
      }

      toast.error("Upload Failed", {
        description:
          errorMessage !== "Failed to upload watermark"
            ? errorMessage
            : description,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      setActivatingId(id);
      await watermarkService.setActiveWatermark(id);
      toast.success("Watermark Activated!", {
        description:
          "This watermark will now be applied to all asset previews.",
      });
      loadWatermarks();
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        apiError?.response?.data?.message || "Failed to activate watermark";
      toast.error("Activation Failed", {
        description: errorMessage,
      });
    } finally {
      setActivatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await watermarkService.deleteWatermark(deleteId);
      toast.success("Watermark Deleted", {
        description: "The watermark has been permanently removed.",
      });
      loadWatermarks();
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        apiError?.response?.data?.message || "Failed to delete watermark";
      toast.error("Delete Failed", {
        description: errorMessage,
      });
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-white">
              <Droplet className="h-6 w-6" />
            </div>
            Watermark Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage watermarks for asset previews
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-border/50 hover:border-primary/30 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload New Watermark
          </CardTitle>
          <CardDescription>
            Upload a PNG image with transparency for best results. Recommended
            size: 200x50 pixels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <Label htmlFor="watermark" className="mb-2 block">
                Watermark Image
              </Label>
              <Input
                ref={fileInputRef}
                id="watermark"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer"
              />
            </div>
            {isUploading && (
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            )}
          </div>
          <div className="mt-4 p-4 rounded-lg bg-muted/50 flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Tips for best watermarks:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use PNG format with transparent background</li>
                <li>Keep the design simple and recognizable</li>
                <li>Recommended dimensions: 200x50 to 400x100 pixels</li>
                <li>Maximum file size: 5MB</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Watermarks List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Your Watermarks
          </CardTitle>
          <CardDescription>
            Manage your uploaded watermarks. The active watermark will be
            applied to all asset previews.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-border/50">
                  <Skeleton className="h-24 w-full rounded-lg mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : watermarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Droplet className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No watermarks yet</h3>
              <p className="text-muted-foreground">
                Upload your first watermark to get started
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {watermarks.map((watermark) => (
                <div
                  key={watermark._id}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    watermark.isActive
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  {watermark.isActive && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}

                  <div className="h-24 bg-muted/50 rounded-lg flex items-center justify-center mb-4 overflow-hidden p-4">
                    <Image
                      src={watermark.secure_url}
                      alt="Watermark preview"
                      width={watermark.width}
                      height={watermark.height}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium uppercase">
                        {watermark.format}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">
                        {watermark.width} × {watermark.height}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploaded:</span>
                      <span className="font-medium text-xs">
                        {formatDate(watermark.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!watermark.isActive && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSetActive(watermark._id)}
                        disabled={activatingId === watermark._id}
                      >
                        {activatingId === watermark._id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            Activating...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Set Active
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(watermark._id)}
                      disabled={watermark.isActive}
                      title={
                        watermark.isActive
                          ? "Cannot delete active watermark"
                          : "Delete watermark"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Watermark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this watermark? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
