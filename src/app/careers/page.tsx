"use client";

import Link from "next/link";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CareersPage() {
  const openings = [
    {
      title: "Senior Full-Stack Engineer (Next.js / Node.js)",
      department: "Engineering",
      location: "Remote (Global)",
      type: "Full-Time",
    },
    {
      title: "Product Designer (UI/UX & Design Systems)",
      department: "Design",
      location: "Remote (Global)",
      type: "Full-Time",
    },
    {
      title: "Creator Community & Partnerships Manager",
      department: "Operations",
      location: "Remote (Global)",
      type: "Full-Time",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          <Briefcase className="w-4 h-4" /> Join Our Team
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Build the Future of Digital Content
        </h1>
        <p className="text-muted-foreground">
          Help millions of creators, agencies, and designers discover and monetize creative work.
        </p>
      </div>

      <div className="space-y-4 mb-16">
        {openings.map((job, idx) => (
          <Card key={idx} className="border-border/50 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-foreground mb-1">{job.title}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{job.department}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-500 font-medium">{job.type}</span>
                </div>
              </div>
              <Link href="/contact">
                <Button variant="outline" className="rounded-xl whitespace-nowrap">
                  Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

