"use client";

import { useState } from "react";
import {
  useGetSubscriptionsQuery,
  useUpdateSubscriptionMutation,
  useGetSubscriptionQuery,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  User,
  Package,
  Sparkles,
  Loader2,
  Receipt,
  Filter,
} from "lucide-react";
import { format } from "date-fns";

export default function SubscriptionsManagementPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { data, isLoading, refetch } = useGetSubscriptionsQuery({
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const { data: subscriptionDetail } = useGetSubscriptionQuery(selectedId!, {
    skip: !selectedId,
  });

  const [updateSubscription] = useUpdateSubscriptionMutation();

  const subscriptions = data?.data || [];
  const meta = data?.meta;

  const handleStatusChange = async (
    subscriptionId: string,
    status: "active" | "canceled" | "past_due" | "expired"
  ) => {
    try {
      await updateSubscription({
        id: subscriptionId,
        data: { status },
      }).unwrap();
      toast.success(`Subscription status changed to ${status}`);
      refetch();
    } catch (error) {
      toast.error("Failed to change subscription status");
    }
  };

  const handleView = (id: string) => {
    setSelectedId(id);
    setIsViewOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "canceled":
        return "destructive";
      case "past_due":
        return "secondary";
      case "expired":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
              <Receipt className="h-7 w-7 text-emerald-500" />
            </div>
            Subscriptions Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user subscriptions and billing
          </p>
        </div>
      </div>

      <Card className="rounded-2xl border-2 border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
              <Filter className="h-4 w-4 text-emerald-500" />
            </div>
            Filters
          </CardTitle>
          <CardDescription>Filter subscriptions by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                <SelectItem value="past_due">Past Due</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="rounded-2xl border-2 border-border/50 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                <Sparkles className="h-8 w-8 text-emerald-500" />
              </div>
              <Loader2 className="h-5 w-5 text-emerald-500 animate-spin absolute -bottom-1 -right-1" />
            </div>
            <p className="mt-4 text-lg font-medium">Loading subscriptions...</p>
            <p className="text-muted-foreground text-sm">
              Please wait while we fetch subscription data
            </p>
          </CardContent>
        </Card>
      ) : subscriptions.length === 0 ? (
        <Card className="rounded-2xl border-2 border-border/50 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 border border-border/50">
              <CreditCard className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mt-4">No subscriptions found</p>
            <p className="text-muted-foreground">
              No subscriptions match your filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-2 border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                <CreditCard className="h-4 w-4 text-emerald-500" />
              </div>
              Subscriptions ({meta?.total || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Plan</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Period</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription: any) => (
                    <tr key={subscription._id} className="border-b">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {typeof subscription.user === "object"
                              ? subscription.user.name
                              : "Unknown User"}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {typeof subscription.user === "object"
                            ? subscription.user.email
                            : ""}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {typeof subscription.plan === "object"
                              ? subscription.plan.name
                              : "Unknown Plan"}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          $
                          {typeof subscription.plan === "object"
                            ? subscription.plan.price
                            : "0"}
                          /
                          {typeof subscription.plan === "object"
                            ? subscription.plan.billingCycle
                            : "month"}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={getStatusBadgeVariant(subscription.status)}
                        >
                          {subscription.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(subscription.currentPeriodStart)} -{" "}
                          {formatDate(subscription.currentPeriodEnd)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/50"
                            onClick={() => handleView(subscription._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={subscription.status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                subscription._id,
                                value as
                                  | "active"
                                  | "canceled"
                                  | "past_due"
                                  | "expired"
                              )
                            }
                          >
                            <SelectTrigger className="w-[120px] rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="canceled">Canceled</SelectItem>
                              <SelectItem value="past_due">Past Due</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
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

      {/* View Subscription Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl rounded-2xl border-2 border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                <Eye className="h-4 w-4 text-emerald-500" />
              </div>
              Subscription Details
            </DialogTitle>
            <DialogDescription>View subscription information</DialogDescription>
          </DialogHeader>
          {subscriptionDetail?.data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> User
                  </p>
                  <p className="font-medium mt-1">
                    {typeof subscriptionDetail.data.user === "object"
                      ? subscriptionDetail.data.user.name
                      : "Unknown"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium mt-1">
                    {typeof subscriptionDetail.data.user === "object"
                      ? subscriptionDetail.data.user.email
                      : "Unknown"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Package className="h-3 w-3" /> Plan
                  </p>
                  <p className="font-medium mt-1">
                    {typeof subscriptionDetail.data.plan === "object"
                      ? subscriptionDetail.data.plan.name
                      : "Unknown"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-medium mt-1 text-emerald-600 dark:text-emerald-400">
                    $
                    {typeof subscriptionDetail.data.plan === "object"
                      ? subscriptionDetail.data.plan.price
                      : "0"}{" "}
                    /
                    {typeof subscriptionDetail.data.plan === "object"
                      ? subscriptionDetail.data.plan.billingCycle
                      : "month"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    className="mt-1 rounded-lg"
                    variant={getStatusBadgeVariant(
                      subscriptionDetail.data.status
                    )}
                  >
                    {subscriptionDetail.data.status}
                  </Badge>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground">Stripe ID</p>
                  <p className="font-medium text-xs mt-1 font-mono">
                    {subscriptionDetail.data.stripeSubscriptionId}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Period Start
                  </p>
                  <p className="font-medium mt-1">
                    {formatDate(subscriptionDetail.data.currentPeriodStart)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Period End
                  </p>
                  <p className="font-medium mt-1">
                    {formatDate(subscriptionDetail.data.currentPeriodEnd)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-medium mt-1">
                    {formatDate(subscriptionDetail.data.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
