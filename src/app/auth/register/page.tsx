import { Metadata } from "next";
import AuthLayout from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account - Rafsakaos Konveksi",
  description: "Join Rafsakaos and start creating amazing custom clothing",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Join the Rafsakaos Family"
      description="Create your account and start your custom clothing journey today"
    >
      <RegisterForm />
    </AuthLayout>
  );
}