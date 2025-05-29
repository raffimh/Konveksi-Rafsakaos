import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Unauthorized - Rafsakaos Konveksi",
  description: "You do not have permission to access this page",
};

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full bg-muted p-4">
            <ShieldAlert className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Access Denied
            </h1>
            <p className="text-sm text-muted-foreground">
              You do not have permission to access this page.
              Please contact the administrator if you believe this is an error.
            </p>
          </div>
        </div>
        <Button asChild variant="default">
          <Link href="/">
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}