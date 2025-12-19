"use client";

import { useState } from "react";
import {
  useGetContactsQuery,
  useGetContactQuery,
  useReplyToContactMutation,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  useGetContactStatsQuery,
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
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Loader2,
  Filter,
  Mail,
  User,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

export default function ContactsManagementPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const { data: statsData } = useGetContactStatsQuery();
  const { data, isLoading, refetch } = useGetContactsQuery({
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
    category: categoryFilter === "all" ? undefined : categoryFilter,
  });

  const { data: contactDetail } = useGetContactQuery(selectedId!, {
    skip: !selectedId,
  });

  const [replyToContact, { isLoading: replying }] = useReplyToContactMutation();
  const [updateStatus] = useUpdateContactStatusMutation();
  const [deleteContact] = useDeleteContactMutation();

  const contacts = data?.data || [];
  const meta = data?.meta;
  const stats = statsData?.data;

  const handleView = (id: string) => {
    setSelectedId(id);
    setReplyText("");
    setIsViewOpen(true);
  };

  const handleReply = async () => {
    if (!selectedId || !replyText.trim()) {
      toast.error("Reply message is required");
      return;
    }

    try {
      await replyToContact({
        contactId: selectedId,
        reply: replyText,
      }).unwrap();
      toast.success("Reply sent successfully");
      setReplyText("");
      refetch();
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const handleStatusChange = async (
    contactId: string,
    status: "open" | "in_progress" | "resolved" | "closed"
  ) => {
    try {
      await updateStatus({ contactId, status }).unwrap();
      toast.success(`Status changed to ${status.replace("_", " ")}`);
      refetch();
    } catch (error) {
      toast.error("Failed to change status");
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await deleteContact(contactId).unwrap();
      toast.success("Contact deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "open":
        return "default";
      case "in_progress":
        return "secondary";
      case "resolved":
        return "outline";
      case "closed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
              <Mail className="h-6 w-6" />
            </div>
            Support Contacts
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user support requests and inquiries
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50">
                <AlertCircle className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.open}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50">
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.inProgress}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.resolved}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Closed</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                <XCircle className="h-4 w-4 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats.closed}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter contacts by status or category
          </CardDescription>
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                <Sparkles className="h-8 w-8 text-blue-500 animate-pulse" />
              </div>
              <Loader2 className="h-6 w-6 animate-spin text-primary absolute -bottom-1 -right-1" />
            </div>
            <p className="text-lg font-medium mt-4">Loading contacts...</p>
            <p className="text-muted-foreground text-sm">
              Please wait while we fetch the data
            </p>
          </CardContent>
        </Card>
      ) : contacts.length === 0 ? (
        <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted mb-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">No contacts found</p>
            <p className="text-muted-foreground">
              No contacts match your filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-border/50 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Contacts
              <Badge variant="secondary" className="ml-2 rounded-lg">
                {meta?.total || 0} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.map((contact: any) => (
                <div
                  key={contact._id}
                  className="border-2 border-border/50 rounded-xl p-4 space-y-3 hover:shadow-md transition-shadow bg-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{contact.subject}</h3>
                        <Badge
                          variant={getStatusBadgeVariant(contact.status)}
                          className="rounded-lg"
                        >
                          {contact.status.replace("_", " ")}
                        </Badge>
                        <Badge
                          variant={getPriorityBadgeVariant(contact.priority)}
                          className="rounded-lg"
                        >
                          {contact.priority}
                        </Badge>
                        <Badge variant="outline" className="rounded-lg">
                          {contact.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {typeof contact.user === "object"
                          ? `${contact.user.name} (${contact.user.email})`
                          : "Unknown"}
                        <span className="text-muted-foreground/50">•</span>
                        <Calendar className="h-3 w-3" />
                        {formatDate(contact.createdAt)}
                      </p>
                      <p className="text-sm line-clamp-2 bg-muted/30 p-2 rounded-lg">
                        {contact.message}
                      </p>
                      {contact.adminReply && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Admin replied
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleView(contact._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-xl"
                        onClick={() => handleDelete(contact._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
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

      {/* View & Reply Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border-2 border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                <MessageSquare className="h-5 w-5 text-blue-500" />
              </div>
              Contact Details
            </DialogTitle>
            <DialogDescription>View and reply to contact</DialogDescription>
          </DialogHeader>
          {contactDetail?.data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                    <User className="h-3 w-3" />
                    From
                  </p>
                  <p className="font-medium">
                    {typeof contactDetail.data.user === "object"
                      ? contactDetail.data.user.name
                      : "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {typeof contactDetail.data.user === "object"
                      ? contactDetail.data.user.email
                      : ""}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Select
                    value={contactDetail.data.status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        contactDetail.data._id,
                        value as "open" | "in_progress" | "resolved" | "closed"
                      )
                    }
                  >
                    <SelectTrigger className="w-[150px] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge variant="outline" className="rounded-lg">
                    {contactDetail.data.category}
                  </Badge>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Priority</p>
                  <Badge
                    variant={getPriorityBadgeVariant(
                      contactDetail.data.priority
                    )}
                    className="rounded-lg"
                  >
                    {contactDetail.data.priority}
                  </Badge>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground mb-1">Subject</p>
                <p className="font-medium">{contactDetail.data.subject}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <div className="bg-muted/50 p-4 rounded-xl border border-border/30">
                  <p className="whitespace-pre-wrap">
                    {contactDetail.data.message}
                  </p>
                </div>
              </div>

              {contactDetail.data.adminReply && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Admin Reply
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border-2 border-green-200 dark:border-green-800">
                    <p className="whitespace-pre-wrap">
                      {contactDetail.data.adminReply}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Send Reply</p>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={4}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsViewOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={handleReply}
              disabled={replying || !replyText.trim()}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
            >
              <Send className="h-4 w-4 mr-2" />
              {replying ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
