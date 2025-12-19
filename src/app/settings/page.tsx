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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { userApi } from "@/services/user.service";
import { authApi } from "@/services/auth.service";
import { User } from "@/types";
import { Loader2, Upload, Lock } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, _hasHydrated } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    loadProfile();
  }, [isAuthenticated, _hasHydrated, router]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getProfile();
      setUser(response.data);
      resetProfile({
        name: response.data.name,
        bio: response.data.bio || "",
      });
      setPreviewUrl(response.data.profileImage || "");
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfile = async (data: ProfileFormData) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.bio) formData.append("bio", data.bio);
      if (profileImage) formData.append("profileImage", profileImage);

      await userApi.updateProfile(user._id, formData);
      toast.success("Profile updated successfully");
      loadProfile();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsSaving(true);
    try {
      await authApi.changePassword(data.oldPassword, data.newPassword);
      toast.success("Password changed successfully");
      resetPassword();
    } catch {
      toast.error("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <Button onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmitProfile(onSubmitProfile)}
                className="space-y-6"
              >
                {/* Profile Image */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={previewUrl} />
                    <AvatarFallback className="text-2xl">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="profileImage" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Upload className="h-4 w-4" />
                        <span>Upload new profile picture</span>
                      </div>
                    </Label>
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="max-w-xs"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...registerProfile("name")}
                    placeholder="John Doe"
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {profileErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...registerProfile("bio")}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  {profileErrors.bio && (
                    <p className="text-sm text-red-500 mt-1">
                      {profileErrors.bio.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/profile")}
                  >
                    View Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmitPassword(onSubmitPassword)}
                className="space-y-6"
              >
                {/* Current Password */}
                <div>
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="oldPassword"
                      type="password"
                      {...registerPassword("oldPassword")}
                      placeholder="Enter current password"
                      className="pl-10"
                    />
                  </div>
                  {passwordErrors.oldPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {passwordErrors.oldPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      {...registerPassword("newPassword")}
                      placeholder="Enter new password"
                      className="pl-10"
                    />
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerPassword("confirmPassword")}
                      placeholder="Confirm new password"
                      className="pl-10"
                    />
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
