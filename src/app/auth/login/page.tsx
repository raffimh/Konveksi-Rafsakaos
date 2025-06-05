import { Metadata } from "next";
import AuthLayout from "@/components/layouts/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In - Rafsakaos Konveksi",
  description: "Sign in to your account to access custom clothing services",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back to Rafsakaos"
      description="Sign in to continue your custom clothing journey with us"
    >
      <LoginForm />
    </AuthLayout>
  );
}