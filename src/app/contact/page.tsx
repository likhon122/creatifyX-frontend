"use client";

import { useEffect, useState } from "react";
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
import { contactApi } from "@/services/contact.service";
import { useAuthStore } from "@/store/auth-store";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

const contactSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.enum(["general", "technical", "billing", "content", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: "general",
      priority: "medium",
    },
  });

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, _hasHydrated, router]);

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      await contactApi.createContact(data);
      setSubmitted(true);
      toast.success("Support ticket created successfully!");
    } catch (error) {
      toast.error("Failed to submit contact form");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container max-w-2xl py-16 text-center">
        <Card>
          <CardContent className="pt-16 pb-16">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto flex items-center justify-center mb-6">
              <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Message Sent!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for contacting us. Our support team will get back to you
              within 24-48 hours.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Support</h1>
        <p className="text-muted-foreground">
          Have a question or issue? Fill out the form below and our team will
          help you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                We typically respond within 24-48 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Subject */}
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    {...register("subject")}
                    placeholder="Brief description of your issue"
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("category", value as any)
                    }
                    defaultValue="general"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">
                        Technical Support
                      </SelectItem>
                      <SelectItem value="billing">
                        Billing & Payments
                      </SelectItem>
                      <SelectItem value="content">Content Issues</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("priority", value as any)
                    }
                    defaultValue="medium"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.priority && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.priority.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Please provide as much detail as possible..."
                    rows={8}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                For general inquiries:
              </p>
              <a
                href="mailto:support@creatifyx.com"
                className="text-sm font-medium hover:underline"
              >
                support@creatifyx.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Urgent: 2-4 hours</li>
                <li>• High: 12-24 hours</li>
                <li>• Medium: 24-48 hours</li>
                <li>• Low: 48-72 hours</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Check our FAQ section for quick answers to common questions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
