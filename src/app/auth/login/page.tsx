"use client";

import AuthLayout from "@/components/layouts/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { useTranslation } from "@/lib/hooks/use-i18n";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t.auth.welcomeBack}
      description={t.auth.signIn}
    >
      <LoginForm />
    </AuthLayout>
  );
}