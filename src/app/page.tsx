"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { FloatingCard } from "@/components/ui/floating-card";
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
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is the minimum order for custom production?",
      answer:
        "Our minimum order is 24 pieces per design. This ensures production efficiency and competitive pricing for our customers.",
    },
    {
      question: "How long does production take?",
      answer:
        "Standard production time is 7-14 working days, depending on design complexity and order quantity. We provide accurate estimates after reviewing your order details.",
    },
    {
      question: "What materials are available?",
      answer:
        "We offer various high-quality materials including Cotton Combed 24s, Cotton Combed 30s, Denim, Rayon, and Linen. Each material has different characteristics and pricing.",
    },
    {
      question: "How do I upload my design?",
      answer:
        "You can upload designs in PNG, JPG, or PDF format through our platform. Our team will review your design and provide feedback if adjustments are needed for production.",
    },
    {
      question: "Is there a quality guarantee?",
      answer:
        "Yes, we provide quality guarantee for all products. If there are any quality issues with production, we will replace or repair at no additional cost.",
    },
    {
      question: "How does the payment system work?",
      answer:
        "We use a secure payment system. Payment is made after order confirmation, and you will receive a unique code for bank transfer.",
    },
  ];

  const testimonials = [
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
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
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
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/auth/login")}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/auth/register")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20" />
        <div className="container mx-auto max-w-7xl px-6 py-20 md:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🚀 Professional Garment Manufacturing
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Custom Clothing
                  <br />
                  <AnimatedGradientText>Made Simple</AnimatedGradientText>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Professional garment production service for your brand.
                  Quality materials, expert craftsmanship, and reliable delivery
                  with real-time tracking.
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
                  <span className="font-semibold text-foreground">4.9/5</span>{" "}
                  from 200+ happy customers
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/auth/register")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/auth/login")}
                  className="border-2 hover:bg-muted/50"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">
                    Quality Guaranteed
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-muted-foreground">
                    Fast Production
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
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="mx-auto">
              ✨ Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need for
              <AnimatedGradientText> Custom Production</AnimatedGradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From design upload to final delivery, we provide end-to-end
              solutions for your custom clothing needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Customer-Centric",
                description:
                  "Dedicated support throughout your production journey with real-time notifications and updates.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Shirt,
                title: "Quality Materials",
                description:
                  "Premium fabrics including Cotton Combed, Denim, Rayon, and Linen for superior products.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: Clock,
                title: "Fast Production",
                description:
                  "Efficient manufacturing with 7-14 days turnaround time and transparent progress tracking.",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: Shield,
                title: "Quality Guarantee",
                description:
                  "100% quality assurance with replacement guarantee if products don't meet standards.",
                color: "bg-orange-100 text-orange-600",
              },
              {
                icon: MessageCircle,
                title: "Real-time Updates",
                description:
                  "Stay informed with instant notifications about your order status and production progress.",
                color: "bg-pink-100 text-pink-600",
              },
              {
                icon: Award,
                title: "Professional Team",
                description:
                  "Experienced craftsmen and quality control team ensuring every piece meets excellence.",
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
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Image
                src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop"
                alt="Manufacturing Process"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <Badge variant="secondary">🏭 Our Story</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Crafting Quality Since
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  <AnimatedGradientText>Day One</AnimatedGradientText>
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                With years of experience in garment manufacturing, we&apos;ve
                perfected the art of custom clothing production. Our
                state-of-the-art facility and skilled craftsmen ensure every
                piece meets the highest standards.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">200+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Projects Completed
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span className="font-semibold">98%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Customer Satisfaction
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">50+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Partner Brands
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">5+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Years Experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">💬 Customer Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              What Our
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                <AnimatedGradientText>Customers Say</AnimatedGradientText>
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our
              satisfied customers have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/50 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    &quot;{testimonial.content}&ldquo;
                  </p>
                  <div className="flex items-center space-x-3">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">❓ FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                <AnimatedGradientText>Questions</AnimatedGradientText>
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our custom clothing
              manufacturing service.
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
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <div className="space-y-8 text-white">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Custom Project?
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who trust us with their
              custom clothing needs. Get started today and experience the
              difference quality makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push("/auth/register")}
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/auth/login")}
                className="border-white text-black hover:bg-white/10"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-6">
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
              © 2025 Rafsakaos Konveksi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
