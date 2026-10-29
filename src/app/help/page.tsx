"use client";

import Link from "next/link";
import { HelpCircle, Mail, MessageSquare, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HelpPage() {
  const faqs = [
    {
      q: "Who can purchase assets on CreatifyX?",
      a: "Only subscriber accounts can make purchase transactions and subscribe to plans. If you are logged in as an Author or Admin, please switch to a subscriber account.",
    },
    {
      q: "How do I download my purchased assets?",
      a: "Immediately after checkout, you will receive a direct download link, and all purchases are accessible anytime from your Purchases dashboard.",
    },
    {
      q: "How do I become a creator and sell assets?",
      a: "Sign up for an Author account or switch your role to Author in your profile. You can upload images, videos, web templates, and graphics templates directly from the Author Dashboard.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support all major credit cards, Apple Pay, Google Pay, and international cards securely processed via Stripe.",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          <HelpCircle className="w-4 h-4" /> Support Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          How can we help you?
        </h1>
        <p className="text-muted-foreground">
          Find answers to common questions about accounts, purchases, creator tools, and licensing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {faqs.map((faq, index) => (
          <Card key={index} className="border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 text-center flex flex-col items-center">
        <MessageSquare className="w-10 h-10 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Our support team is available to assist you with order inquiries, licensing questions, and account support.
        </p>
        <Link href="/contact">
          <Button className="rounded-xl px-6">
            Contact Support <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

