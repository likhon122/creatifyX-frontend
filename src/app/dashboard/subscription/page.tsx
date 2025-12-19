"use client";

import { useGetMeQuery, useGetPlansQuery } from "@/services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Crown,
  CheckCircle,
  Loader2,
  Sparkles,
  Zap,
  Shield,
  Download,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function SubscriptionPage() {
  const { data: userData, isLoading: userLoading } = useGetMeQuery();
  const { data: plansData, isLoading: plansLoading } =
    useGetPlansQuery(undefined);

  const user = userData?.data;
  const plans = plansData?.data || [];

  const isLoading = userLoading || plansLoading;

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Loading subscription details...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            My Subscription
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and billing
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Current Plan */}
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/5 to-emerald-600/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Your active subscription details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {user?.isPremium ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center">
                    <Crown className="h-7 w-7 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Premium Member</h3>
                    <p className="text-muted-foreground">
                      You have access to all premium features
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 rounded-xl px-4 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-muted rounded-2xl flex items-center justify-center">
                    <CreditCard className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Free Plan</h3>
                    <p className="text-muted-foreground">
                      Upgrade to unlock premium features
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  className="rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                >
                  <Link href="/plans">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Premium Benefits */}
        <Card className="border-2 border-border/50 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Premium Benefits</CardTitle>
                <CardDescription>
                  What you get with a premium subscription
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/10">
                <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Unlimited Downloads</h4>
                  <p className="text-sm text-muted-foreground">
                    Download any asset without limits
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Crown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-medium">Premium Assets</h4>
                  <p className="text-sm text-muted-foreground">
                    Access to exclusive premium content
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/10">
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">No Watermarks</h4>
                  <p className="text-sm text-muted-foreground">
                    Download assets without watermarks
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-yellow-500/5 to-amber-500/5 border border-yellow-500/10">
                <div className="h-8 w-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-medium">Discounts</h4>
                  <p className="text-sm text-muted-foreground">
                    Get discounts on premium asset purchases
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-rose-500/5 to-pink-500/5 border border-rose-500/10">
                <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h4 className="font-medium">Priority Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Get faster support response times
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-indigo-500/5 to-teal-500/5 border border-indigo-500/10">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-medium">Early Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Be first to access new features
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        {!user?.isPremium && plans.length > 0 && (
          <Card className="border-2 border-border/50 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-indigo-500/5 to-teal-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle>Available Plans</CardTitle>
                  <CardDescription>
                    Choose a plan that works for you
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan: any) => (
                  <Card
                    key={plan._id}
                    className="relative border-2 border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200"
                  >
                    <CardHeader className="bg-gradient-to-br from-primary/5 to-emerald-600/5">
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold mb-4">
                        ${plan.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          /{plan.billingCycle}
                        </span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features?.map((feature: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90"
                        asChild
                      >
                        <Link href="/plans">Select Plan</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
