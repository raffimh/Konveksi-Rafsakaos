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
  Sparkles,
  Home,
  Search,
  Factory,
  Warehouse,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const adminRoutes = [
  {
    href: "/admin",
    label: "Overview",
    icon: Home,
    description: "Dashboard overview"
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: Package,
    description: "Manage orders"
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
    description: "Customer management"
  },
  {
    href: "/admin/materials",
    label: "Materials",
    icon: Shirt,
    description: "Material catalog"
  },
  {
    href: "/admin/production",
    label: "Production",
    icon: Factory,
    description: "Production planning"
  },
  {
    href: "/admin/inventory",
    label: "Inventory",
    icon: Warehouse,
    description: "Stock management"
  },
  {
    href: "/admin/reports",
    label: "Reports",
    icon: BarChart,
    description: "Analytics & reports"
  },
];

const customerRoutes = [
  {
    href: "/customer",
    label: "Overview",
    icon: Home,
    description: "Dashboard overview"
  },
  {
    href: "/customer/orders",
    label: "My Orders",
    icon: Package,
    description: "Your orders"
  },
  {
    href: "/customer/materials",
    label: "Materials",
    icon: PackageOpen,
    description: "Browse materials"
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/20 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl min-h-screen">
        <div className="p-6 border-b border-white/20">
          <Link href={homePath} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Rafsakaos
              </h1>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "Admin Panel" : "Customer Portal"}
              </p>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-white/50 dark:bg-slate-700/50 border-white/20 focus:border-blue-500/50 transition-all duration-200"
            />
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 p-4">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/50 dark:hover:bg-slate-700/50",
                  isActive
                    ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 shadow-lg"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg" 
                    : "bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{route.label}</div>
                  <div className="text-xs text-muted-foreground">{route.description}</div>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/30 dark:border-blue-700/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">Need Help?</div>
                <div className="text-xs text-muted-foreground">Contact support</div>
              </div>
            </div>
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Get Support
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-white/20 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl px-6 shadow-sm">
          {/* Mobile menu button */}
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-white/50 dark:hover:bg-slate-700/50"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
              <SheetHeader className="p-6 border-b border-white/20">
                <SheetTitle asChild>
                  <Link
                    href={homePath}
                    className="flex items-center gap-3"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Rafsakaos
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="space-y-2 p-4">
                {routes.map((route) => {
                  const Icon = route.icon;
                  const isActive = pathname === route.href;
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/50 dark:hover:bg-slate-700/50",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50"
                          : "text-slate-600 dark:text-slate-300"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        isActive 
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" 
                          : "bg-slate-100 dark:bg-slate-700"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div>{route.label}</div>
                        <div className="text-xs text-muted-foreground">{route.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Page title */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {routes.find(route => route.href === pathname)?.label || "Dashboard"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {routes.find(route => route.href === pathname)?.description || "Welcome back"}
            </p>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            {user && <UserNav user={user} />}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
