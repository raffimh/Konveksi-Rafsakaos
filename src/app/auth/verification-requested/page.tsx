import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthLayout from "@/components/layouts/auth-layout";

export const metadata: Metadata = {
  title: "Verify Email - Rafsakaos Konveksi",
  description: "Verify your email address to continue",
};

export default function VerificationRequestedPage() {
  return (
    <AuthLayout
      title="Check your email"
      description="We've sent you a verification link to your email address. Please check your inbox and click the link to verify your account."
    >
      <div className="grid gap-6">
        <div className="flex flex-col space-y-4">
          <Button asChild variant="outline">
            <Link href="/auth/login">
              Return to sign in
            </Link>
          </Button>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email?{" "}
            <Button variant="link" className="p-0 text-sm" asChild>
              <Link href="/auth/login">
                Try signing in again
              </Link>
            </Button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}