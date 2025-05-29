import { Metadata } from "next";
import AuthLayout from "@/components/layouts/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In - Rafsakaos Konveksi",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your email and password to sign in"
    >
      <LoginForm />
    </AuthLayout>
  );
}