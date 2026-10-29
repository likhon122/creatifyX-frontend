"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const values = [
    {
      icon: Sparkles,
      title: "Creator First",
      description:
        "We empower digital artists, designers, and developers to monetize their best work with fair revenue shares.",
    },
    {
      icon: ShieldCheck,
      title: "Vetted Quality",
      description:
        "Every single asset is manually reviewed and tested to guarantee compatibility, high resolution, and clean licensing.",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description:
        "Lightning-fast downloads, cloud streaming previews, and seamless Stripe integration get you building in seconds.",
    },
    {
      icon: Users,
      title: "Global Community",
      description:
        "Connecting creators and agencies across 120+ countries to share ideas, templates, and digital assets.",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" /> About CreatifyX
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
          The Marketplace for Premium Digital Assets
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          CreatifyX is built for modern creators, agencies, and businesses looking for
          world-class design assets, 3D models, stock video, graphics templates, and web components.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {values.map((v, idx) => {
          const Icon = v.icon;
          return (
            <Card key={idx} className="border-border/50 hover:border-primary/50 transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-primary/15 via-emerald-500/10 to-transparent border border-border p-8 sm:p-12 text-center flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to start creating?</h2>
        <p className="text-muted-foreground max-w-xl mb-8">
          Explore thousands of premium curated assets or join our creator community today.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/browse">
            <Button size="lg" className="rounded-xl">
              Browse Assets <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/plans">
            <Button size="lg" variant="outline" className="rounded-xl">
              View Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

