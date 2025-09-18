"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/hooks/use-i18n";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const testimonials = [
  {
    id: 1,
    text: "Sudah 3 tahun bekerja sama dengan Rafsakaos untuk produksi seragam perusahaan. Kualitas jahitan rapi, bahan premium, dan selalu on-time delivery.",
    name: "Siti Nurhaliza",
    role: "HRD Manager, PT. Maju Bersama",
    avatar: "SN",
    rating: 5,
  },
  {
    id: 2,
    text: "Tim Rafsakaos sangat profesional dalam handling custom jersey tim futsal kami. Design sesuai request dan hasil produksi memuaskan!",
    name: "Budi Santoso",
    role: "Ketua Tim Garuda FC",
    avatar: "BS",
    rating: 5,
  },
  {
    id: 3,
    text: "Pelayanan customer service yang responsif dan proses produksi yang transparan. Sangat recommended untuk kebutuhan konveksi berkualitas.",
    name: "Maya Indira",
    role: "Owner, Boutique Luna",
    avatar: "MI",
    rating: 5,
  },
  {
    id: 4,
    text: "Dari mockup design hingga hasil jadi, semuanya sesuai ekspektasi. Rafsakaos memang partner terpercaya untuk usaha fashion kami.",
    name: "Andi Rahman",
    role: "Founder, Streetwear Indo",
    avatar: "AR",
    rating: 5,
  },
];

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Side - Hero Section */}
        <div className="relative hidden h-full flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-10 text-white lg:flex dark:border-r overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0">
            {/* Custom textile pattern background */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="textile"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="20" cy="20" r="2" fill="white" opacity="0.3" />
                    <path
                      d="M0,20 L40,20 M20,0 L20,40"
                      stroke="white"
                      strokeWidth="0.5"
                      opacity="0.2"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#textile)" />
              </svg>
            </div>

            {/* Floating geometric shapes */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-lg rotate-45 blur-lg animate-bounce"></div>
            <div className="absolute bottom-32 left-32 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full blur-lg animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-lg rotate-12 blur-xl animate-bounce delay-500"></div>
          </div>

          {/* Content */}
          <div className="relative z-20 flex items-center justify-between text-lg font-medium">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-white"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
              </div>
              <Link
                href="/"
                className="text-white hover:text-blue-200 transition-colors"
              >
                <AnimatedGradientText className="text-white font-bold text-xl">
                  Rafsakaos Konveksi
                </AnimatedGradientText>
              </Link>
            </div>
            <LanguageSwitcher variant="toggle" />
          </div>

          {/* Services Highlight */}
          <div className="relative z-20 mt-8 space-y-6">
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {t.authLayout.customDesign.title}
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    {t.authLayout.customDesign.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {t.authLayout.qualityMaterials.title}
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    {t.authLayout.qualityMaterials.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {t.authLayout.fastProduction.title}
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    {t.authLayout.fastProduction.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Stats */}
          <div className="relative z-20 mt-8">
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">500+</div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider">
                    {t.authLayout.stats.brandPartner}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">50K+</div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider">
                    {t.authLayout.stats.productsCompleted}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">7+</div>
                  <div className="text-xs text-blue-200 uppercase tracking-wider">
                    {t.authLayout.stats.yearsExperience}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Testimonial Slider */}
          <div className="relative z-20 mt-auto">
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 overflow-hidden">
              <div className="relative">
                {/* Current Testimonial */}
                <div
                  key={testimonials[currentTestimonial].id}
                  className="animate-fade-in"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {testimonials[currentTestimonial].avatar}
                      </span>
                    </div>
                    <div className="flex-1">
                      <blockquote className="text-white leading-relaxed mb-4">
                        &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">
                            {testimonials[currentTestimonial].name}
                          </div>
                          <div className="text-sm text-blue-200">
                            {testimonials[currentTestimonial].role}
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[
                            ...Array(testimonials[currentTestimonial].rating),
                          ].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center space-x-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? "bg-white scale-125"
                          : "bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex flex-col min-h-screen lg:p-8">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[400px] space-y-6">
              {/* Mobile Header */}
              <div className="flex items-center justify-between lg:hidden mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-white"
                    >
                      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                  </div>
                  <Link href="/" className="font-bold text-xl">
                    Rafsakaos
                  </Link>
                </div>
                <LanguageSwitcher variant="toggle" />
              </div>

              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-muted-foreground">{description}</p>
              </div>

              {/* Form Card */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/20 p-6 shadow-xl">
                {children}
              </div>

              <p className="px-4 text-center text-xs text-muted-foreground">
                {t.authLayout.termsAndPrivacy}{" "}
                <a
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  {t.authLayout.termsOfService}
                </a>{" "}
                {t.authLayout.and}{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary transition-colors"
                >
                  {t.authLayout.privacyPolicy}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
