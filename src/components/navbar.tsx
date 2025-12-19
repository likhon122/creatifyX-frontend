"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Moon,
  Sun,
  Search,
  Menu,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Package,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Grid3X3,
  Layers,
  FolderOpen,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { categoryApi } from "@/services/category.service";
import type { Category } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Organize categories into parent and sub categories
  const { parentCategories, subCategoryMap } = useMemo(() => {
    const parents = categories.filter(
      (cat) => cat.parentCategory || cat.categoryType === "main_category"
    );
    const subMap: Record<string, Category[]> = {};

    // Build subcategory map
    parents.forEach((parent) => {
      const subs = categories.filter((cat) => {
        // Check if this category is a subcategory of the parent
        if (Array.isArray(parent.subCategories)) {
          return parent.subCategories.some((subCat) => {
            if (typeof subCat === "string") return subCat === cat._id;
            return subCat._id === cat._id;
          });
        }
        return false;
      });
      subMap[parent._id] = subs;
    });

    return { parentCategories: parents, subCategoryMap: subMap };
  }, [categories]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Assets" },
    { href: "/plans", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
          : "bg-background/50 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <Image
            src="/creatify.png"
            alt="CreatifyX Logo"
            width={40}
            height={40}
            className="rounded-xl shadow-lg group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
            CreatifyX
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Categories Mega Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 h-10 bg-transparent hover:bg-muted data-[state=open]:bg-muted">
                  <Grid3X3 className="mr-2 h-4 w-4" />
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[800px] p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                          <Layers className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">
                            Browse Categories
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Explore our digital assets collection
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/browse")}
                        className="rounded-xl"
                      >
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      {parentCategories.map((parent) => {
                        const subCategories = subCategoryMap[parent._id] || [];
                        return (
                          <div key={parent._id} className="space-y-2">
                            {/* Parent Category Header */}
                            <button
                              onClick={() =>
                                router.push(`/browse?categories=${parent._id}`)
                              }
                              className="font-semibold text-sm hover:text-primary cursor-pointer w-full text-left flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-primary/10 transition-all group"
                            >
                              <FolderOpen className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                              <span className="truncate">{parent.name}</span>
                            </button>
                            {/* Subcategories */}
                            {subCategories.length > 0 && (
                              <div className="space-y-1 pl-2">
                                {subCategories.slice(0, 5).map((sub) => (
                                  <button
                                    key={sub._id}
                                    onClick={() =>
                                      router.push(
                                        `/browse?categories=${sub._id}`
                                      )
                                    }
                                    className="text-xs text-muted-foreground hover:text-primary cursor-pointer block w-full text-left py-1.5 px-3 rounded-lg hover:bg-muted/50 transition-colors truncate"
                                  >
                                    {sub.name}
                                  </button>
                                ))}
                                {subCategories.length > 5 && (
                                  <button
                                    onClick={() =>
                                      router.push(
                                        `/browse?categories=${parent._id}`
                                      )
                                    }
                                    className="text-xs text-primary font-medium cursor-pointer block w-full text-left py-1.5 px-3 rounded-lg hover:bg-primary/10 transition-colors"
                                  >
                                    +{subCategories.length - 5} more
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {categories.length}
                        </span>{" "}
                        categories available
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push("/browse?sort=newest")}
                          className="rounded-xl text-xs"
                        >
                          🆕 New Assets
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push("/browse?sort=popular")}
                          className="rounded-xl text-xs"
                        >
                          🔥 Popular
                        </Button>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/browse")}
            className="rounded-xl hover:bg-muted"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl hover:bg-muted"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu or Auth Buttons */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-xl hover:bg-muted"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-600 text-white font-semibold">
                      {user.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 p-2 rounded-2xl shadow-xl"
                align="end"
              >
                <DropdownMenuLabel className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-600 text-white font-semibold">
                        {user.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard")}
                  className="rounded-lg py-2.5 cursor-pointer"
                >
                  <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                  Dashboard
                </DropdownMenuItem>
                {user.role === "author" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/pending")}
                    className="rounded-lg py-2.5 cursor-pointer"
                  >
                    <Package className="mr-3 h-4 w-4 text-primary" />
                    Pending Assets
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="rounded-lg py-2.5 cursor-pointer"
                >
                  <User className="mr-3 h-4 w-4 text-primary" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="rounded-lg py-2.5 cursor-pointer"
                >
                  <Settings className="mr-3 h-4 w-4 text-primary" />
                  Settings
                </DropdownMenuItem>
                {(user.role === "admin" || user.role === "super_admin") && (
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/admin")}
                    className="rounded-lg py-2.5 cursor-pointer"
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-lg py-2.5 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => router.push("/auth/login")}
                className="rounded-xl"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push("/auth/signup")}
                className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              >
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6">
              <div className="flex items-center gap-2 mb-8">
                <Image
                  src="/creatify.png"
                  alt="CreatifyX Logo"
                  width={36}
                  height={36}
                  className="rounded-xl"
                />
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                  CreatifyX
                </span>
              </div>
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="pt-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-center rounded-xl"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/auth/login");
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full justify-center rounded-xl shadow-lg shadow-primary/25"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/auth/signup");
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
