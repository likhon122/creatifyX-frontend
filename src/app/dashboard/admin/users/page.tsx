"use client";

import { useState } from "react";
import {
  useGetUsersQuery,
  useChangeUserStatusMutation,
  useChangeUserRoleMutation,
  useChangeAuthorVerificationMutation,
} from "@/services";
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
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  Shield,
  UserCheck,
  UserX,
  Crown,
  Mail,
} from "lucide-react";
import Image from "next/image";

export default function UsersManagementPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [authorStatusFilter, setAuthorStatusFilter] = useState<string>("");

  const { data, isLoading, refetch } = useGetUsersQuery({
    page,
    limit,
    searchTerm,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    authorVerificationStatus: authorStatusFilter || undefined,
  });

  const [changeStatus] = useChangeUserStatusMutation();
  const [changeRole] = useChangeUserRoleMutation();
  const [changeAuthorVerification] = useChangeAuthorVerificationMutation();

  const users = data?.data || [];
  const meta = data?.meta;

  const handleStatusChange = async (
    userId: string,
    status: "active" | "blocked" | "inactive"
  ) => {
    try {
      await changeStatus({ id: userId, status }).unwrap();
      toast.success(`User status changed to ${status}`);
      refetch();
    } catch (error) {
      toast.error("Failed to change user status");
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await changeRole({ id: userId, role }).unwrap();
      toast.success(`User role changed to ${role}`);
      refetch();
    } catch (error) {
      toast.error("Failed to change user role");
    }
  };

  const handleAuthorVerificationChange = async (
    userId: string,
    authorVerificationStatus: string
  ) => {
    try {
      await changeAuthorVerification({
        id: userId,
        authorVerificationStatus,
      }).unwrap();
      toast.success(
        `Author verification changed to ${authorVerificationStatus}`
      );
      refetch();
    } catch (error) {
      toast.error("Failed to change author verification status");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "blocked":
        return "destructive";
      case "inactive":
        return "secondary";
      default:
        return "outline";
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
              <Users className="h-8 w-8 text-primary" />
            </div>
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
      </div>

      <Card className="rounded-2xl border-2 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-muted to-muted/50">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
            Filters
          </CardTitle>
          <CardDescription>
            Filter users by role, status, or search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-2 border-border/50"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="rounded-xl border-2 border-border/50">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="subscriber">Subscriber</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-xl border-2 border-border/50">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={authorStatusFilter}
              onValueChange={setAuthorStatusFilter}
            >
              <SelectTrigger className="rounded-xl border-2 border-border/50">
                <SelectValue placeholder="Author Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Author Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="rounded-2xl border-2 border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent animate-pulse">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <Loader2 className="h-6 w-6 text-primary animate-spin absolute -bottom-1 -right-1" />
            </div>
            <p className="mt-4 text-muted-foreground font-medium">
              Loading users...
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {users.map((user: any) => (
              <Card
                key={user._id}
                className="rounded-2xl border-2 border-border/50 hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 border-2 border-border/50">
                        {user.profileImage ? (
                          <Image
                            src={user.profileImage}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {user.isPremium && (
                          <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                            <Crown className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <Badge
                            variant={getRoleBadgeVariant(user.role)}
                            className="rounded-lg"
                          >
                            {user.role === "super_admin" && (
                              <Shield className="h-3 w-3 mr-1" />
                            )}
                            {user.role}
                          </Badge>
                          <Badge
                            variant={getStatusBadgeVariant(user.status)}
                            className="rounded-lg"
                          >
                            {user.status === "active" && (
                              <UserCheck className="h-3 w-3 mr-1" />
                            )}
                            {user.status === "blocked" && (
                              <UserX className="h-3 w-3 mr-1" />
                            )}
                            {user.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>

                        {user.bio && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {user.bio}
                          </p>
                        )}

                        {user.role === "author" && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-muted-foreground">
                              Author Status:
                            </span>
                            <Badge variant="outline" className="rounded-lg">
                              {user.authorVerificationStatus}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Select
                        value={user.status}
                        onValueChange={(value) =>
                          handleStatusChange(user._id, value as any)
                        }
                      >
                        <SelectTrigger className="rounded-xl border-2 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          handleRoleChange(user._id, value)
                        }
                      >
                        <SelectTrigger className="rounded-xl border-2 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subscriber">Subscriber</SelectItem>
                          <SelectItem value="author">Author</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {user.role === "author" && (
                        <Select
                          value={user.authorVerificationStatus}
                          onValueChange={(value) =>
                            handleAuthorVerificationChange(user._id, value)
                          }
                        >
                          <SelectTrigger className="rounded-xl border-2 border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="not_started">
                              Not Started
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <Card className="rounded-2xl border-2 border-border/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="rounded-xl border-2 border-border/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5"
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
                    className="rounded-xl border-2 border-border/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
