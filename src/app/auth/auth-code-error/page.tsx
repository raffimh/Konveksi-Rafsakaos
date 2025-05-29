import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Authentication Error - Rafsakaos Konveksi",
  description: "There was an error with your authentication",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            There was an error processing your authentication request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              This could be due to:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>An expired or invalid verification link</li>
              <li>The link has already been used</li>
              <li>A network error occurred</li>
            </ul>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/auth/register">
                  Try Registration Again
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/login">
                  Go to Login
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}