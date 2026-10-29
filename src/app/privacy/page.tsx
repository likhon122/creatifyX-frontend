"use client";

import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          <Shield className="w-4 h-4" /> Legal & Privacy
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: October 2026
        </p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-8 sm:p-12 space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">1. Overview</h2>
            <p className="text-muted-foreground">
              At CreatifyX, we value your trust and prioritize the security of your personal data.
              This Privacy Policy details how we collect, store, protect, and use your information
              when you use our website, services, and digital marketplace.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Account Information:</strong> Name, email address, profile credentials, and role.</li>
              <li><strong>Payment & Billing:</strong> Transaction data handled securely through PCI-DSS compliant Stripe processors. We do not store raw credit card numbers.</li>
              <li><strong>Creator Content:</strong> Assets, thumbnails, metadata, and files uploaded for sale.</li>
              <li><strong>Usage Analytics:</strong> IP address, device specifications, browser type, and interaction metrics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">3. How We Use Information</h2>
            <p className="text-muted-foreground mb-3">
              We process your data exclusively to provide, improve, and secure CreatifyX services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Facilitating instant downloads, asset licensing, and creator payouts.</li>
              <li>Protecting against fraud, abuse, and unauthorized access.</li>
              <li>Delivering critical account notifications and transaction receipts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">4. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions or wish to request data deletion, contact our privacy team at{" "}
              <a href="mailto:privacy@creatifyx.com" className="text-primary hover:underline">
                privacy@creatifyx.com
              </a>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

