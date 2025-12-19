"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  FolderTree,
  FileImage,
  CreditCard,
  LayoutDashboard,
  Star,
  MessageSquare,
  Shield,
  Droplet,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Categories",
    href: "/dashboard/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Assets",
    href: "/dashboard/admin/assets",
    icon: FileImage,
  },
  {
    title: "Watermark",
    href: "/dashboard/admin/watermark",
    icon: Droplet,
  },
  {
    title: "Plans",
    href: "/dashboard/admin/plans",
    icon: CreditCard,
  },
  {
    title: "Subscriptions",
    href: "/dashboard/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Support",
    href: "/dashboard/admin/contacts",
    icon: MessageSquare,
  },
  {
    title: "Reviews",
    href: "/dashboard/admin/reviews",
    icon: Star,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Manage your platform</p>
        </div>
      </div>
      <nav className="flex items-center gap-1 border-b-2 border-border/50 overflow-x-auto pb-0 bg-gradient-to-r from-muted/30 to-transparent rounded-t-xl px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

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
    </div>
  );
}
