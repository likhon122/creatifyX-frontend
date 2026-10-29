"use client";

import Link from "next/link";
import { BookOpen, Upload, DollarSign, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GuidePage() {
  const steps = [
    {
      icon: BookOpen,
      step: "Step 1",
      title: "Register as an Author",
      description: "Sign up or toggle your account role to Author to unlock asset upload capabilities and sales analytics.",
    },
    {
      icon: Upload,
      step: "Step 2",
      title: "Upload Your Digital Assets",
      description: "Upload your high-res source files, screenshots, video previews, and metadata tags in the Author Dashboard.",
    },
    {
      icon: CheckCircle2,
      step: "Step 3",
      title: "Fast Review Process",
      description: "Our review team validates file integrity and quality within 24-48 hours. Once approved, it appears live in the store.",
    },
    {
      icon: DollarSign,
      step: "Step 4",
      title: "Earn & Track Payouts",
      description: "Earn revenue every time a subscriber purchases your asset or streams your downloads. Monitor your earnings in real-time.",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          <BookOpen className="w-4 h-4" /> Creator Handbook
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Author & Seller Guide
        </h1>
        <p className="text-muted-foreground">
          Everything you need to know about preparing, publishing, and monetizing your creative assets on CreatifyX.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} className="border-border/50">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Link href="/dashboard/upload">
          <Button size="lg" className="rounded-xl px-8">
            Go to Upload Dashboard <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

