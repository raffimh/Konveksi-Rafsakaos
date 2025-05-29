"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { LoginSchema, loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchema) {
    try {
      setIsLoading(true);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        if (signInError.message === "Invalid login credentials") {
          toast.error("Wrong email or password");
          return;
        }

        if (signInError.message.includes("Email not confirmed")) {
          toast.error("Please verify your email first");
          return;
        }

        throw signInError;
      }

      // Get user role to determine redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile) throw new Error("No profile found");

      // Refresh first to ensure new auth state is applied
      router.refresh();

      // Then redirect based on role
      if (profile.role === "admin") {
        await router.replace("/admin");
      } else {
        await router.replace("/customer");
      }

      toast.success("Login successful");
    } catch {
      toast.error("Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
      <div className="text-sm text-center space-y-2">
        <Link
          href="/auth/reset-password"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Forgot password?
        </Link>
      </div>
      <div className="text-sm text-center">
        <span className="text-muted-foreground">
          Don&apos;t have an account?
        </span>{" "}
        <Link
          href="/auth/register"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
