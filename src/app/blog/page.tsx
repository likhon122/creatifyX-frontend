"use client";

import Link from "next/link";
import { Newspaper, Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  const posts = [
    {
      title: "Announcing CreatifyX 2.0: Instant Downloads, Video Previews, and New Creator Tools",
      excerpt: "Explore the new features, streamlined checkout experience, and lightning-fast asset indexing on CreatifyX.",
      date: "October 2026",
      readTime: "4 min read",
      category: "Product Update",
      slug: "announcing-creatifyx-2",
    },
    {
      title: "Top 10 Design Trends in Motion Graphics & UI Templates for 2026",
      excerpt: "From kinetic typography to glassmorphism 3D components, here is what top creators are building this year.",
      date: "October 2026",
      readTime: "6 min read",
      category: "Design Trends",
      slug: "design-trends-2026",
    },
    {
      title: "Creator Playbook: How to Maximize Asset Sales on Digital Marketplaces",
      excerpt: "A complete guide to thumbnail presentation, metadata tagging, and pricing strategy for digital creators.",
      date: "September 2026",
      readTime: "8 min read",
      category: "Creator Guides",
      slug: "creator-sales-playbook",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          <Newspaper className="w-4 h-4" /> CreatifyX Blog
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Insights, Guides & Product News
        </h1>
        <p className="text-muted-foreground">
          Stay up to date with the latest design trends, creator tutorials, and marketplace releases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <Card key={idx} className="border-border/50 hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardContent className="p-6 space-y-4 flex flex-col flex-1 justify-between">
              <div>
                <Badge variant="secondary" className="mb-3">
                  {post.category}
                </Badge>
                <h3 className="font-bold text-lg leading-snug mb-2 hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

