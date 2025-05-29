"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/user-nav";
import { NotificationsDropdown } from "@/components/notifications/notifications-dropdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { UserWithProfile } from "@/lib/types/user";
import {
  BarChart,
  Package,
  Users,
  Menu,
  PackageOpen,
  Shirt,
} from "lucide-react";

const adminRoutes = [
  {
    href: "/admin",
    label: "Overview",
    icon: BarChart,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: Package,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    href: "/admin/materials",
    label: "Materials",
    icon: Shirt,
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: BarChart,
  },
];

const customerRoutes = [
  {
    href: "/customer",
    label: "Overview",
    icon: BarChart,
  },
  {
    href: "/customer/orders",
    label: "My Orders",
    icon: Package,
  },
  {
    href: "/customer/materials",
    label: "Materials",
    icon: PackageOpen,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export function DashboardLayout({ 
  children, 
  isAdmin = false 
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const pathname = usePathname();
  const routes = isAdmin ? adminRoutes : customerRoutes;
  const supabase = createClient();
  const homePath = isAdmin ? "/admin" : "/customer";

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setUser({ ...user, ...profile });
        }
      }
    };

    getUser();
  }, [supabase]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-gray-100/40 min-h-screen">
        <div className="p-6">
          <Link href={homePath} className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span>Rafsakaos</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                  pathname === route.href
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-500"
                )}
              >
                <Icon className="h-5 w-5" />
                {route.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6">
          {/* Mobile menu button */}
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-6">
                <SheetTitle asChild>
                  <Link
                    href={homePath}
                    className="flex items-center gap-2 font-semibold"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Package className="h-6 w-6" />
                    <span>Rafsakaos</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="space-y-1 px-4">
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900",
                        pathname === route.href
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-500"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Push notification and user nav to right */}
          <div className="ml-auto flex items-center gap-2">
            <NotificationsDropdown />
            {user && <UserNav user={user} />}
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
