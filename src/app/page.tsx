import Link from "next/link";
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
  Image,
  Video,
  Music,
  FileText,
  Box,
  Layout,
  ArrowRight,
  Star,
  Download,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Sparkles,
  CheckCircle2,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description:
        "Every asset is reviewed and approved by our expert team for quality assurance",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Zap,
      title: "Instant Download",
      description:
        "Get your assets immediately after purchase with lightning-fast delivery",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Creator Community",
      description: "Join thousands of talented creators from around the world",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: TrendingUp,
      title: "Regular Updates",
      description: "New premium assets added daily from verified top creators",
      gradient: "from-emerald-500 to-pink-500",
    },
  ];

  const assetTypes = [
    {
      icon: Image,
      label: "Images",
      count: "10K+",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: Video,
      label: "Videos",
      count: "5K+",
      gradient: "from-emerald-500 to-pink-500",
    },
    {
      icon: Music,
      label: "Audio",
      count: "3K+",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: FileText,
      label: "Documents",
      count: "2K+",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Box,
      label: "3D Models",
      count: "1K+",
      gradient: "from-red-500 to-rose-500",
    },
    {
      icon: Layout,
      label: "Templates",
      count: "8K+",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  const stats = [
    { label: "Digital Assets", value: "50,000+", icon: Sparkles },
    { label: "Happy Customers", value: "25,000+", icon: Users },
    { label: "Expert Creators", value: "5,000+", icon: Star },
    { label: "Countries Served", value: "150+", icon: Globe },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto text-center px-4">
          <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
            <Sparkles className="w-4 h-4 mr-2" />
            New assets added daily
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Premium Digital Assets
            <br />
            <span className="bg-gradient-to-r from-primary via-emerald-500 to-pink-500 bg-clip-text text-transparent">
              For Your Creative Projects
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of high-quality digital assets from talented
            creators worldwide. Images, videos, templates, and more — all in one
            place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-base px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              asChild
            >
              <Link href="/browse">
                Browse Assets <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 border-2 hover:bg-accent"
              asChild
            >
              <Link href="/plans">View Pricing</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-20">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-emerald-500/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-colors">
                    <Icon className="h-6 w-6 text-primary mx-auto mb-3" />
                    <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">
              Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect assets for your next project from our curated
              collections
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
            {assetTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link
                  href={`/browse?type=${type.label.toLowerCase()}`}
                  key={type.label}
                >
                  <Card className="group cursor-pointer border-2 border-transparent hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden">
                    <CardContent className="flex flex-col items-center justify-center p-6 md:p-8 relative">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                      />
                      <div
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                      >
                        <Icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg mb-1">
                        {type.label}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {type.count}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">
              Why Us
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose CreatifyX?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The best platform for creators and buyers with unmatched quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group border-2 border-transparent hover:border-primary/30 transition-all duration-300 card-hover"
                >
                  <CardHeader className="pb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-emerald-500/5 to-teal-500/5" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardContent className="relative p-8 md:p-16 text-center">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                Get Started Today
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Start Creating?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of creators and get access to premium digital
                assets. Start with a free account or choose a subscription plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 shadow-lg shadow-primary/25"
                  asChild
                >
                  <Link href="/auth/signup">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 border-2"
                  asChild
                >
                  <Link href="/plans">
                    <Star className="mr-2 h-5 w-5" />
                    View Premium Plans
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sell Section */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                For Creators
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Sell Your Digital Assets
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Turn your creativity into income. Join our community of talented
                creators and start selling your digital assets today.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  { icon: Download, text: "Easy upload and management" },
                  { icon: TrendingUp, text: "Competitive earnings up to 80%" },
                  { icon: Users, text: "Reach millions of potential buyers" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-base font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="text-base px-8 py-6 shadow-lg shadow-primary/25"
                asChild
              >
                <Link href="/auth/signup?role=author">
                  Become a Seller <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-3xl blur-2xl" />
              <Card className="relative overflow-hidden border-2 border-primary/10">
                <CardHeader className="border-b bg-muted/30">
                  <CardTitle className="text-xl">Author Benefits</CardTitle>
                  <CardDescription>
                    Everything you need to succeed as a creator
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    {
                      label: "Commission Rate",
                      value: "Up to 80%",
                      gradient: "from-emerald-500 to-teal-500",
                    },
                    {
                      label: "Monthly Payouts",
                      value: "Automatic",
                      gradient: "from-blue-500 to-cyan-500",
                    },
                    {
                      label: "Support",
                      value: "24/7",
                      gradient: "from-emerald-500 to-pink-500",
                    },
                    {
                      label: "Analytics",
                      value: "Advanced",
                      gradient: "from-amber-500 to-orange-500",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{item.label}</span>
                      <Badge
                        className={`bg-gradient-to-r ${item.gradient} text-white border-0`}
                      >
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials hint section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6">
            Trusted Worldwide
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Loved by creators everywhere
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust CreatifyX for their
            creative needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "⭐⭐⭐⭐⭐ Excellent quality assets",
              "⭐⭐⭐⭐⭐ Fast downloads",
              "⭐⭐⭐⭐⭐ Great support",
            ].map((review, i) => (
              <div
                key={i}
                className="px-6 py-3 rounded-full bg-muted/50 border border-border/50 text-sm font-medium"
              >
                {review}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
