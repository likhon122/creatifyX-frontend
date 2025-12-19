"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { planApi } from "@/services/plan.service";
import { subscriptionApi } from "@/services/subscription.service";
import { useAuthStore } from "@/store/auth-store";
import { Plan } from "@/types";
import {
  Check,
  Loader2,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Download,
  Headphones,
} from "lucide-react";
import { toast } from "sonner";

export default function PlansPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await planApi.getPlans();
      setPlans(response.data.filter((p) => p.isActive));
    } catch (error) {
      toast.error("Failed to load plans");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      router.push("/auth/login");
      return;
    }

    setProcessingPlanId(planId);
    try {
      const response = await subscriptionApi.createCheckout(planId);
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to get checkout URL");
        setProcessingPlanId(null);
      }
    } catch (error) {
      toast.error("Failed to create checkout session");
      setProcessingPlanId(null);
    }
  };

  const getPlanGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-pink-500",
      "from-amber-500 to-orange-500",
    ];
    return gradients[index % gradients.length];
  };

  const getPlanIcon = (index: number) => {
    const icons = [Zap, Crown, Sparkles];
    return icons[index % icons.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="text-center mb-16 px-4">
        <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20">
          <Sparkles className="w-4 h-4 mr-2" />
          Pricing Plans
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Choose Your Plan
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Get unlimited access to premium digital assets. Choose the plan that
          works best for you and your creative needs.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto px-4 mb-20">
        {plans.map((plan, index) => {
          const isPopular = plan.name.toLowerCase().includes("pro");
          const Icon = getPlanIcon(index);
          const gradient = getPlanGradient(index);

          return (
            <Card
              key={plan._id}
              className={`relative overflow-hidden transition-all duration-300 card-hover ${
                isPopular
                  ? "border-2 border-primary shadow-xl scale-105 lg:scale-110"
                  : "border-2 border-border/50 hover:border-primary/30"
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-pink-500" />
              )}
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-emerald-600 text-white border-0 shadow-lg px-4 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pt-10 pb-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} mx-auto mb-6 flex items-center justify-center shadow-lg`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground text-lg">
                    /{plan.billingCycle}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <Separator className="mb-6" />
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pb-8">
                <Button
                  className={`w-full h-12 rounded-xl text-base font-medium transition-all ${
                    isPopular
                      ? "shadow-lg shadow-primary/25 hover:shadow-primary/40"
                      : ""
                  }`}
                  variant={isPopular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan._id)}
                  disabled={
                    processingPlanId === plan._id ||
                    (user?.isPremium && isPopular)
                  }
                >
                  {processingPlanId === plan._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : user?.isPremium && isPopular ? (
                    "Current Plan"
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            All Plans Include
          </h2>
          <p className="text-muted-foreground">
            Everything you need to succeed
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Download,
              title: "Unlimited Downloads",
              desc: "Download as many assets as you need",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: Shield,
              title: "Commercial License",
              desc: "Use assets in commercial projects",
              gradient: "from-emerald-500 to-teal-500",
            },
            {
              icon: Headphones,
              title: "Premium Support",
              desc: "24/7 customer support",
              gradient: "from-emerald-500 to-pink-500",
            },
            {
              icon: Clock,
              title: "Regular Updates",
              desc: "New assets added weekly",
              gradient: "from-amber-500 to-orange-500",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card
                key={i}
                className="group border-2 border-border/50 hover:border-primary/30 transition-all card-hover"
              >
                <CardHeader className="pb-2">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ or Additional Info */}
      <div className="mt-20 text-center px-4">
        <Card className="max-w-2xl mx-auto border-2 border-border/50 bg-muted/30">
          <CardContent className="p-8 md:p-12">
            <h3 className="text-xl font-semibold mb-3">
              Not sure which plan is right for you?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you choose the perfect plan for your
              needs.
            </p>
            <Button
              variant="outline"
              className="rounded-xl h-11 px-6"
              onClick={() => router.push("/contact")}
            >
              Contact Sales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
