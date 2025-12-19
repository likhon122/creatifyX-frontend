"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
  useGetMySubscriptionQuery,
  useGetPaymentHistoryQuery,
} from "@/services";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Camera,
  Loader2,
  Crown,
  CreditCard,
  Download,
  ShoppingBag,
  Star,
  Sparkles,
  Edit3,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: profileData, isLoading, refetch } = useGetMeQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  // Get subscription data
  const { data: subscriptionData } = useGetMySubscriptionQuery(undefined);
  // Get purchase history to count purchases
  const { data: purchaseData } = useGetPaymentHistoryQuery({ limit: 1000 });

  const profile = profileData?.data || user;
  const subscription = subscriptionData?.data;
  const totalPurchases = purchaseData?.meta?.total || 0;
  const completedPurchases =
    purchaseData?.data?.filter((p: any) => p.paymentStatus === "completed")
      .length || 0;

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpdate = async () => {
    if (!profile?._id) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("bio", formData.bio);
      if (selectedFile) {
        formDataToSend.append("profileImage", selectedFile);
      }

      const result = await updateProfile({
        id: profile._id,
        formData: formDataToSend,
      }).unwrap();

      if (result.data) {
        setUser(result.data);
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM dd, yyyy");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "destructive";
      case "admin":
        return "default";
      case "author":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <Loader2 className="absolute -bottom-1 -right-1 h-6 w-6 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="rounded-xl gap-2 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <Card className="border-2 border-border/50 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/5 to-emerald-500/5 border-b">
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your personal information and avatar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                  <AvatarImage
                    src={previewUrl || profile?.profileImage}
                    alt={profile?.name || "User"}
                  />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-emerald-600 text-white font-bold">
                    {profile?.name ? getInitials(profile.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute bottom-0 right-0 h-9 w-9 rounded-full border-2 shadow-lg bg-background hover:bg-primary hover:text-white transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{profile?.name}</h3>
                <p className="text-muted-foreground">{profile?.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge
                    variant={getRoleBadgeVariant(profile?.role || "subscriber")}
                    className="px-3 py-1 text-xs"
                  >
                    {profile?.role?.replace("_", " ")}
                  </Badge>
                  {profile?.isPremium && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 px-3 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <Badge
                    variant={
                      profile?.status === "active" ? "default" : "destructive"
                    }
                    className="px-3 py-1"
                  >
                    {profile?.status === "active" && (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    {profile?.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    className="h-11"
                  />
                ) : (
                  <p className="text-sm p-3 bg-muted/50 rounded-xl">
                    {profile?.name || "-"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile?.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <p className="text-sm p-3 bg-muted/50 rounded-xl min-h-[80px]">
                    {profile?.bio || "No bio provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center gap-4 pt-2">
                <Button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card className="border-2 border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-b">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Account Details
            </CardTitle>
            <CardDescription>
              Your account status and membership info
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Account Status
                  </p>
                  <Badge
                    variant={
                      profile?.status === "active" ? "default" : "destructive"
                    }
                    className="mt-1"
                  >
                    {profile?.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-sm font-semibold mt-0.5">
                    {profile?.createdAt ? formatDate(profile.createdAt) : "-"}
                  </p>
                </div>
              </div>

              {profile?.role === "author" && (
                <>
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Author Verification
                      </p>
                      <Badge
                        variant={
                          profile?.authorVerificationStatus === "active"
                            ? "default"
                            : profile?.authorVerificationStatus === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="mt-1"
                      >
                        {profile?.authorVerificationStatus || "Not Verified"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                      <Crown className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Earnings
                      </p>
                      <p className="text-sm font-semibold mt-0.5">
                        ${profile?.totalEarnings?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status Card - For all subscribers */}
        <Card className="border-2 border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border-b">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-amber-500" />
              Subscription Status
            </CardTitle>
            <CardDescription>
              Your current subscription plan and benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                      <Crown className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {typeof subscription.plan === "object"
                          ? subscription.plan.name
                          : "Premium Plan"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {typeof subscription.plan === "object"
                          ? subscription.plan.billingCycle
                          : "Monthly"}{" "}
                        billing
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      subscription.status === "active"
                        ? "default"
                        : subscription.status === "past_due"
                        ? "secondary"
                        : "destructive"
                    }
                    className="px-3 py-1"
                  >
                    {subscription.status}
                  </Badge>
                </div>
                <div className="grid gap-3 text-sm p-4 bg-muted/30 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Current Period Start
                    </span>
                    <span className="font-medium">
                      {subscription.currentPeriodStart
                        ? formatDate(subscription.currentPeriodStart)
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Current Period End
                    </span>
                    <span className="font-medium">
                      {subscription.currentPeriodEnd
                        ? formatDate(subscription.currentPeriodEnd)
                        : "-"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="w-full rounded-xl h-11"
                >
                  <Link href="/dashboard/subscription">
                    Manage Subscription
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                  <Crown className="h-10 w-10 text-amber-500" />
                </div>
                <p className="font-semibold text-lg mb-2">
                  No Active Subscription
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Upgrade to Premium for 30% discount on all purchases
                </p>
                <Button
                  asChild
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                >
                  <Link href="/plans">View Plans</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-2 border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-b">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-green-500" />
              Your Activity
            </CardTitle>
            <CardDescription>
              Overview of your purchases and downloads
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{completedPurchases}</p>
                  <p className="text-sm text-muted-foreground">
                    Completed Purchases
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                  <Download className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{completedPurchases}</p>
                  <p className="text-sm text-muted-foreground">
                    Assets Downloaded
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-lg">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {profile?.isPremium ? "30%" : "0%"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Premium Discount
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                asChild
                className="flex-1 rounded-xl h-11"
              >
                <Link href="/dashboard/purchases">View Purchases</Link>
              </Button>
              <Button
                asChild
                className="flex-1 rounded-xl h-11 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
              >
                <Link href="/browse">Browse Assets</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
