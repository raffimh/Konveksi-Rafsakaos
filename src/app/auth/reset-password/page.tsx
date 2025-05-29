import { Metadata } from "next";
import AuthLayout from "@/components/layouts/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password - Rafsakaos Konveksi",
  description: "Reset your password",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email address and we will send you a password reset link"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}