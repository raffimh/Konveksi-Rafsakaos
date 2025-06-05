import { Metadata } from "next";
import AuthLayout from "@/components/layouts/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password - Rafsakaos Konveksi",
  description: "Reset your password to regain access to your account",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Your Password"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}