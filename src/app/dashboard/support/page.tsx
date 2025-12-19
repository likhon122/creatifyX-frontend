"use client";

import { useState } from "react";
import {
  useGetContactsQuery,
  useCreateContactMutation,
  useGetContactQuery,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Loader2,
  Sparkles,
  Headphones,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";

export default function SupportPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    message: "",
  });

  const { data, isLoading, refetch } = useGetContactsQuery({ page, limit });
  const { data: contactDetail } = useGetContactQuery(selectedId!, {
    skip: !selectedId,
  });
  const [createContact, { isLoading: creating }] = useCreateContactMutation();

  const contacts = data?.data || [];
  const meta = data?.meta;

  const handleCreate = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createContact(formData).unwrap();
      toast.success("Support ticket created successfully");
      setIsCreateOpen(false);
      setFormData({
        subject: "",
        category: "general",
        priority: "medium",
        message: "",
      });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create support ticket");
    }
  };

  const handleView = (id: string) => {
    setSelectedId(id);
    setIsViewOpen(true);
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
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            Support
          </h1>
          <p className="text-muted-foreground mt-2">
            Get help and support for your account
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90">
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Create Support Ticket
              </DialogTitle>
              <DialogDescription>
                Describe your issue and we'll get back to you as soon as
                possible
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  className="rounded-xl mt-1.5"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Brief description of your issue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  className="rounded-xl mt-1.5"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Describe your issue in detail..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Ticket
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Loading your tickets...</span>
            </div>
          </CardContent>
        </Card>
      ) : contacts.length === 0 ? (
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center mb-6">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <p className="text-xl font-semibold mb-2">No support tickets</p>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Create a ticket if you need help with anything
            </p>
            <Button
              className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Your Tickets ({meta?.total || 0})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {contacts.map((contact: any) => (
                <div
                  key={contact._id}
                  className="border-2 border-border/50 rounded-xl p-4 space-y-2 cursor-pointer hover:bg-muted/50 hover:shadow-md hover:border-primary/30 transition-all duration-200"
                  onClick={() => handleView(contact._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
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
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(contact.createdAt)}
                      </p>
                      <p className="text-sm line-clamp-2">{contact.message}</p>
                      {contact.adminReply && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Admin replied
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl hover:bg-primary/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
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

      {/* View Ticket Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Ticket Details
            </DialogTitle>
            <DialogDescription>View your support ticket</DialogDescription>
          </DialogHeader>
          {contactDetail?.data && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={getStatusBadgeVariant(contactDetail.data.status)}
                  className="rounded-lg"
                >
                  {contactDetail.data.status.replace("_", " ")}
                </Badge>
                <Badge
                  variant={getPriorityBadgeVariant(contactDetail.data.priority)}
                  className="rounded-lg"
                >
                  {contactDetail.data.priority}
                </Badge>
                <Badge variant="outline" className="rounded-lg">
                  {contactDetail.data.category}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Subject</p>
                <p className="font-medium">{contactDetail.data.subject}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Your Message
                </p>
                <div className="bg-muted p-4 rounded-xl border border-border/50">
                  <p className="whitespace-pre-wrap">
                    {contactDetail.data.message}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Submitted on {formatDate(contactDetail.data.createdAt)}
                </p>
              </div>

              {contactDetail.data.adminReply && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Admin Response
                  </p>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-xl border-2 border-green-500/20">
                    <p className="whitespace-pre-wrap">
                      {contactDetail.data.adminReply}
                    </p>
                  </div>
                </div>
              )}
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
