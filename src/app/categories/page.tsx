"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, ArrowRight, Sparkles } from "lucide-react";
import { categoryApi } from "@/services/category.service";
import { Category } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await categoryApi.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          <Layers className="w-4 h-4" /> Discover Content
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Browse by Category
        </h1>
        <p className="text-muted-foreground">
          Find the exact digital assets you need across all creative disciplines.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat._id} href={`/browse?categories=${cat._id}`}>
              <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {cat.categoryType.replace("_", " ")}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center text-xs text-primary font-medium">
                    Explore assets <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
