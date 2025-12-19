import Link from "next/link";
import {
  Package,
  Facebook,
  Twitter,
  Instagram,
  Github,
  Sparkles,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const footerLinks = {
    Product: [
      { label: "Browse Assets", href: "/browse" },
      { label: "Pricing", href: "/plans" },
      { label: "Categories", href: "/categories" },
      { label: "Featured", href: "/browse?sort=featured" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
    Resources: [
      { label: "Help Center", href: "/help" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Guidelines", href: "/guidelines" },
    ],
    Creators: [
      { label: "Become a Seller", href: "/auth/signup?role=author" },
      { label: "Author Dashboard", href: "/dashboard" },
      { label: "Upload Asset", href: "/dashboard/upload" },
      { label: "Author Guide", href: "/guide" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Github, href: "#", label: "Github" },
  ];

  return (
    <footer className="relative border-t bg-muted/30">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Stay up to date</h3>
              <p className="text-muted-foreground">
                Get notified about new assets and features.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-72">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter your email"
                  className="pl-10 rounded-xl bg-background border-border/50 h-11"
                />
              </div>
              <Button className="rounded-xl h-11 px-6 shadow-lg shadow-primary/25">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">CreatifyX</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Your marketplace for premium digital assets. Discover, purchase,
              and create amazing content.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground/80">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CreatifyX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
