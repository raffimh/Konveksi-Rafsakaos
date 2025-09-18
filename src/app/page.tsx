"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { FloatingCard } from "@/components/ui/floating-card";
import { CustomerSlider } from "@/components/ui/customer-slider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/hooks/use-i18n";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LogIn,
  Users,
  Clock,
  Shirt,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Heart,
  CheckCircle,
  MessageCircle,
  Award,
  TrendingUp,
  Plus,
  Minus,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const faqs = t.faqData.questions;

  const customers = [
    {
      name: "Sarah Johnson",
      role: "Brand Owner",
      content:
        "Outstanding production quality! The team is very professional and the final results exceeded expectations. Highly recommended!",
      rating: 5,
      avatar:
        "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Michael Chen",
      role: "Fashion Designer",
      content:
        "The ordering process is easy and transparent. Real-time notifications are very helpful for tracking production progress.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Lisa Wong",
      role: "Startup Founder",
      content:
        "Responsive customer service and high-quality production results. A very satisfying partnership experience!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "David Martinez",
      role: "E-commerce Owner",
      content:
        "Amazing turnaround time and consistent quality. They helped us scale our clothing line efficiently with their reliable production.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      content:
        "The attention to detail is incredible. Every piece was perfectly crafted according to our specifications. Couldn't be happier!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "James Wilson",
      role: "Boutique Owner",
      content:
        "From design upload to delivery, everything was seamless. The quality control and communication throughout the process was excellent.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Amanda Thompson",
      role: "Online Retailer",
      content:
        "Competitive pricing without compromising on quality. The materials are premium and the craftsmanship is top-notch.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Carlos Garcia",
      role: "Fashion Entrepreneur",
      content:
        "Their production efficiency is remarkable. We've been able to launch multiple collections on time thanks to their reliable service.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Jessica Kim",
      role: "Brand Manager",
      content:
        "The real-time tracking system gives us complete visibility. We always know exactly where our orders stand in the production pipeline.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=64&h=64&fit=crop&crop=face",
    },
    {
      name: "Robert Taylor",
      role: "Clothing Line Owner",
      content:
        "Professional team that understands fashion business needs. They've been instrumental in helping us maintain consistent quality standards.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Rafsakaos
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t.nav.features}
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t.nav.about}
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t.nav.testimonials}
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t.nav.faq}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher variant="toggle" />
            <Button variant="ghost" onClick={() => router.push("/auth/login")}>
              <LogIn className="w-4 h-4 mr-2" />
              {t.auth.signIn}
            </Button>
            <Button
              onClick={() => router.push("/auth/register")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {t.auth.getStarted}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher variant="toggle" />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown - Small Right-Aligned */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 right-4 w-64 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg">
            <div className="p-4">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="#features"
                  className="text-sm font-medium hover:text-primary transition-colors py-1"
                  onClick={closeMobileMenu}
                >
                  {t.nav.features}
                </Link>
                <Link
                  href="#about"
                  className="text-sm font-medium hover:text-primary transition-colors py-1"
                  onClick={closeMobileMenu}
                >
                  {t.nav.about}
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm font-medium hover:text-primary transition-colors py-1"
                  onClick={closeMobileMenu}
                >
                  {t.nav.testimonials}
                </Link>
                <Link
                  href="#faq"
                  className="text-sm font-medium hover:text-primary transition-colors py-1"
                  onClick={closeMobileMenu}
                >
                  {t.nav.faq}
                </Link>
                <div className="pt-3 border-t space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      router.push("/auth/login");
                      closeMobileMenu();
                    }}
                    className="w-full justify-start text-xs"
                  >
                    <LogIn className="w-3 h-3 mr-2" />
                    {t.auth.signIn}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      router.push("/auth/register");
                      closeMobileMenu();
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs"
                  >
                    {t.auth.getStarted}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20" />
        <div className="container mx-auto max-w-7xl px-6 py-20 md:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  {t.home.hero.badge}
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  {t.home.hero.title}
                  <br />
                  <AnimatedGradientText>
                    {t.home.hero.titleHighlight}
                  </AnimatedGradientText>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  {t.home.hero.description}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {t.home.hero.rating}
                  </span>{" "}
                  {t.home.hero.ratingText}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/auth/register")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {t.home.hero.startProject}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/auth/login")}
                  className="border-2 hover:bg-muted/50"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t.home.hero.signIn}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">
                    {t.home.hero.qualityGuaranteed}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-muted-foreground">
                    {t.home.hero.fastProduction}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                  alt="Custom Clothing Manufacturing"
                  width={600}
                  height={400}
                  className="object-cover w-full h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Cards */}
              <FloatingCard className="absolute -bottom-6 -left-6" delay={500}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">200+ Projects</p>
                    <p className="text-xs text-muted-foreground">
                      Successfully Delivered
                    </p>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard className="absolute -top-6 -right-6" delay={1000}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">7-14 Days</p>
                    <p className="text-xs text-muted-foreground">
                      Production Time
                    </p>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 md:py-32 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/30 dark:via-blue-950/30 dark:to-cyan-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-float" />
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-lg rotate-45 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="secondary" className="mx-auto">
                {t.home.features.badge}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t.home.features.title}
                <AnimatedGradientText>
                  {t.home.features.titleHighlight}
                </AnimatedGradientText>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.home.features.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: t.home.features.customerCentric.title,
                  description: t.home.features.customerCentric.description,
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  icon: Shirt,
                  title: t.home.features.qualityMaterials.title,
                  description: t.home.features.qualityMaterials.description,
                  color: "bg-purple-100 text-purple-600",
                },
                {
                  icon: Clock,
                  title: t.home.features.fastProduction.title,
                  description: t.home.features.fastProduction.description,
                  color: "bg-green-100 text-green-600",
                },
                {
                  icon: Shield,
                  title: t.home.features.qualityGuarantee.title,
                  description: t.home.features.qualityGuarantee.description,
                  color: "bg-orange-100 text-orange-600",
                },
                {
                  icon: MessageCircle,
                  title: t.home.features.realTimeUpdates.title,
                  description: t.home.features.realTimeUpdates.description,
                  color: "bg-pink-100 text-pink-600",
                },
                {
                  icon: Award,
                  title: t.home.features.professionalTeam.title,
                  description: t.home.features.professionalTeam.description,
                  color: "bg-indigo-100 text-indigo-600",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Image
                src="https://images.unsplash.com/photo-1630930737762-95fba69e2dad?w=600&h=400&fit=crop"
                alt="Manufacturing Process"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <Badge variant="secondary">{t.home.about.badge}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t.home.about.title}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  <AnimatedGradientText>
                    {t.home.about.titleHighlight}
                  </AnimatedGradientText>
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.home.about.description}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">200+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.home.about.stats.projectsCompleted}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span className="font-semibold">98%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.home.about.stats.customerSatisfaction}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">50+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.home.about.stats.partnerBrands}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">5+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.home.about.stats.yearsExperience}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Slider Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">{t.home.testimonials.badge}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              {t.home.testimonials.title}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                <AnimatedGradientText>
                  {t.home.testimonials.titleHighlight}
                </AnimatedGradientText>
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.home.testimonials.description}
            </p>
          </div>

          {/* Auto-sliding Customer Reviews */}
          <div className="space-y-8">
            {/* First Row - Moving Right */}
            <CustomerSlider
              customers={customers.slice(0, 5)}
              direction="right"
              speed={25}
              className="w-full"
            />

            {/* Second Row - Moving Left */}
            <CustomerSlider
              customers={customers.slice(5, 10)}
              direction="left"
              speed={25}
              className="w-full"
            />
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-sm text-muted-foreground mb-4">
              {t.home.testimonials.viewAllTestimonials}
            </p>
            <Button
              onClick={() => router.push("/auth/register")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {t.auth.getStarted}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 relative overflow-hidden">
        {/* Background Similar to Features but with Blue Theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 dark:from-blue-950/20 dark:via-slate-950/20 dark:to-indigo-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.1),transparent_50%)] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Different Floating Geometric Shapes for FAQ */}
        <div className="absolute top-16 right-16 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl rotate-12 animate-float" />
        <div
          className="absolute top-1/3 left-12 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-1/3 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-xl rotate-45 animate-float"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="secondary">{t.home.faq.badge}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                {t.home.faq.title}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  <AnimatedGradientText>
                    {t.home.faq.titleHighlight}
                  </AnimatedGradientText>
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.home.faq.description}
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <span className="font-semibold">{faq.question}</span>
                      {openFaq === index ? (
                        <Minus className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Plus className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center">
          <div className="space-y-8 text-white">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t.home.cta.title}
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              {t.home.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/auth/register")}
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              >
                {t.home.cta.startNow}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/auth/login")}
                className="border-white text-black hover:text-white hover:bg-white/10"
              >
                {t.auth.signIn}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Rafsakaos
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Rafsakaos Konveksi. {t.home.footer.allRightsReserved}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
