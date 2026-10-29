"use client";

import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          <ShieldCheck className="w-4 h-4" /> Community Standards
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Creator & Marketplace Guidelines
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Our standards ensure CreatifyX remains a trusted, high-quality ecosystem for buyers and authors.
        </p>
      </div>

      <div className="space-y-8">
        <Card className="border-border/50">
          <CardContent className="p-8 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Asset Quality Standards
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm sm:text-base leading-relaxed">
              <li>High resolution source files (minimum 1080p for video, crisp vector / high-DPI for graphics).</li>
              <li>Clean folder organization and properly labeled layer structures in PSD, AI, Figma, or ZIP archives.</li>
              <li>Include valid watermarked previews or screenshots representing actual asset contents.</li>
              <li>Accurate tags, compatible tools, and descriptive titles.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-8 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Prohibited Content
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm sm:text-base leading-relaxed">
              <li>No copyrighted trademarks, logos, or brand identities without documented commercial release.</li>
              <li>No malicious scripts, obfuscated code, or broken links inside template archives.</li>
              <li>No scraped or duplicated content from competing digital asset marketplaces.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

