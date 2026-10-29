"use client";

import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          <FileText className="w-4 h-4" /> Legal Terms
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026
        </p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-8 sm:p-12 space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using CreatifyX, you agree to be bound by these Terms of Service.
              If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">2. Marketplace & Asset Licensing</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Subscriber Purchases:</strong> Only verified subscriber accounts may execute digital asset purchases and subscription checkouts.</li>
              <li><strong>Commercial License:</strong> Purchased digital items are licensed for personal and commercial client work as defined in each asset’s license terms.</li>
              <li><strong>Redistribution:</strong> You may not re-sell, redistribute, or sublicense raw source assets directly on competing marketplaces.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">3. Author & Creator Commitments</h2>
            <p className="text-muted-foreground mb-3">
              Authors uploading assets warrant that they hold all original intellectual property rights
              and that assets do not infringe any third-party copyrights or trademarks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">4. Termination & Refunds</h2>
            <p className="text-muted-foreground">
              Due to the immediate digital delivery of source assets, transactions are non-refundable
              once downloaded, except in cases of verified defective files as evaluated by CreatifyX support.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

