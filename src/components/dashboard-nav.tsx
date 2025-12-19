"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  CreditCard,
  MessageSquare,
  FileImage,
  DollarSign,
  Upload,
  Clock,
  Star,
  XCircle,
} from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
      },
      {
        title: "Support",
        href: "/dashboard/support",
        icon: MessageSquare,
      },
    ];

    // Subscriber specific items
    if (user?.role === "subscriber") {
      return [
        ...baseItems,
        {
          title: "My Purchases",
          href: "/dashboard/purchases",
          icon: ShoppingBag,
        },
        {
          title: "Subscription",
          href: "/dashboard/subscription",
          icon: CreditCard,
        },
      ];
    }

    // Author specific items
    if (user?.role === "author") {
      return [
        ...baseItems,
        {
          title: "My Assets",
          href: "/dashboard/my-assets",
          icon: FileImage,
        },
        {
          title: "Upload Asset",
          href: "/dashboard/upload",
          icon: Upload,
        },
        {
          title: "Pending Assets",
          href: "/dashboard/pending",
          icon: Clock,
        },
        {
          title: "Rejected Assets",
          href: "/dashboard/rejected",
          icon: XCircle,
        },
        {
          title: "Reviews",
          href: "/dashboard/reviews",
          icon: Star,
        },
        {
          title: "Earnings",
          href: "/dashboard/earnings",
          icon: DollarSign,
        },
      ];
    }

    // Admin gets redirected to admin panel
    if (user?.role === "admin" || user?.role === "super_admin") {
      return [
        {
          title: "Overview",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Admin Panel",
          href: "/dashboard/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Profile",
          href: "/dashboard/profile",
          icon: User,
        },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="flex items-center gap-1 border-b-2 border-border/50 mb-6 overflow-x-auto pb-0 bg-gradient-to-r from-muted/30 to-transparent rounded-t-xl px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap rounded-t-lg",
              isActive
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
