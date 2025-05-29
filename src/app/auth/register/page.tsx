import { Metadata } from "next";
import AuthLayout from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account - Rafsakaos Konveksi",
  description: "Create an account to get started",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      description="Enter your information to create an account"
    >
      <RegisterForm />
    </AuthLayout>
  );
}