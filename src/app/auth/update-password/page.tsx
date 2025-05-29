import { Metadata } from "next";
import AuthLayout from "@/components/layouts/auth-layout";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Update Password - Rafsakaos Konveksi",
  description: "Update your password",
};

export default function UpdatePasswordPage() {
  return (
    <AuthLayout
      title="Update your password"
      description="Enter your new password below"
    >
      <UpdatePasswordForm />
    </AuthLayout>
  );
}