import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Your Email - Rafsakaos Konveksi",
  description: "Please check your email to verify your account",
};

export default function VerificationRequestedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-lg font-semibold mb-6"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Rafsakaos
            </span>
          </Link>
        </div>

        {/* Main Card */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-white/20 dark:border-slate-700/20 shadow-2xl">
          <CardContent className="p-8">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse-glow">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Check Your Email
              </h1>
              
              <p className="text-muted-foreground leading-relaxed">
                We&apos;ve sent a verification link to your email address. 
                Please click the link in the email to activate your account.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/30">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">What&apos;s next?</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Check your email inbox</li>
                      <li>• Look for an email from Rafsakaos</li>
                      <li>• Click the verification link</li>
                      <li>• Start creating custom clothing!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mt-8">
              <Button
                asChild
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Link href="/auth/login">
                  <Mail className="w-4 h-4 mr-2" />
                  Open Email App
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="w-full h-12 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <Link href="/auth/register">
                  Resend Verification Email
                </Link>
              </Button>
            </div>

            {/* Back Link */}
            <div className="text-center mt-6">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              contact support
            </Link>
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-5 h-5 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 right-10 w-3 h-3 bg-indigo-400/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
}