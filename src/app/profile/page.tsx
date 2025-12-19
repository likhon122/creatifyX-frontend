"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { userApi } from "@/services/user.service";
import { assetApi } from "@/services/asset.service";
import { User, Asset } from "@/types";
import { Mail, Calendar, Edit, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, _hasHydrated } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      // Load user's assets if author
      if (response.data.role === "author") {
        const assetsResponse = await assetApi.getAssets({
          author: response.data._id,
          limit: 6,
        });
        setAssets(assetsResponse.data);
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
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
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <Button onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="text-2xl">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                    {user.isPremium && (
                      <Badge className="bg-yellow-500">Premium Member</Badge>
                    )}
                    {user.status === "active" ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Suspended</Badge>
                    )}
                  </div>
                </div>
                <Button onClick={() => router.push("/settings")}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              {user.bio && (
                <p className="text-muted-foreground mb-4">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {user.role === "author" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </CardTitle>
                <div className="text-2xl font-bold">
                  ${user.totalEarnings?.toFixed(2) || "0.00"}
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Assets
                </CardTitle>
                <div className="text-2xl font-bold">{assets.length}</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Rating
                </CardTitle>
                <div className="text-2xl font-bold flex items-center gap-2">
                  0.0
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </CardHeader>
            </Card>
          </>
        )}
        {user.role === "subscriber" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Subscription Status
                </CardTitle>
                <div className="text-2xl font-bold">
                  {user.isPremium ? "Premium" : "Free"}
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Downloads
                </CardTitle>
                <div className="text-2xl font-bold">0</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Purchases
                </CardTitle>
                <div className="text-2xl font-bold">0</div>
              </CardHeader>
            </Card>
          </>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="assets" className="w-full">
        <TabsList>
          {user.role === "author" && (
            <TabsTrigger value="assets">My Assets</TabsTrigger>
          )}
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {user.role === "author" && (
          <TabsContent value="assets">
            {assets.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No assets yet</p>
                  <Button onClick={() => router.push("/dashboard/upload")}>
                    Upload Your First Asset
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                  <Card
                    key={asset._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/asset/${asset._id}`)}
                  >
                    <div className="relative h-48 bg-muted">
                      <img
                        src={
                          asset.previews?.thumbnail?.secure_url ||
                          asset.storage?.secure_url
                        }
                        alt={asset.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg truncate">
                        {asset.title}
                      </CardTitle>
                      <CardDescription className="flex items-center justify-between">
                        <span className="capitalize">{asset.assetType}</span>
                        <span className="font-semibold text-foreground">
                          ${asset.price}
                        </span>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="activity">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No reviews yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
