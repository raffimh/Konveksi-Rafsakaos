"use client";

import AuthLayout from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import { useTranslation } from "@/lib/hooks/use-i18n";

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t.auth.joinFamily}
      description={t.auth.startJourney}
    >
      <RegisterForm />
    </AuthLayout>
  );
}