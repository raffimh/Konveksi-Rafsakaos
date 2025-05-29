"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, ShoppingBag, UserCheck, Clock } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface Customer {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  orders: number;
  last_order_at?: string;
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  totalOrders: number;
  averageOrdersPerCustomer: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    totalOrders: 0,
    averageOrdersPerCustomer: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const supabase = createClient();

  const loadCustomers = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get all customers first
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "customer")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get order counts for each customer
      const customerPromises = profiles.map(async (profile) => {
        const { count } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("customer_id", profile.id);

        const { data: lastOrder } = await supabase
          .from("orders")
          .select("created_at")
          .eq("customer_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        return {
          ...profile,
          orders: count || 0,
          last_order_at: lastOrder?.created_at,
        };
      });

      const customersWithOrders = await Promise.all(customerPromises);

      // Apply search filter if needed
      let filteredCustomers = customersWithOrders;
      if (debouncedSearch.trim()) {
        const searchTerm = debouncedSearch.trim().toLowerCase();
        filteredCustomers = customersWithOrders.filter(customer => 
          customer.display_name.toLowerCase().includes(searchTerm) ||
          customer.email.toLowerCase().includes(searchTerm) ||
          customer.id.toLowerCase().includes(searchTerm)
        );
      }

      // Calculate stats based on all customers
      const activeCustomers = customersWithOrders.filter(c => c.orders > 0).length;
      const totalOrders = customersWithOrders.reduce((sum, c) => sum + c.orders, 0);

      setCustomers(filteredCustomers);
      setStats({
        totalCustomers: customersWithOrders.length,
        activeCustomers,
        totalOrders,
        averageOrdersPerCustomer: activeCustomers ? totalOrders / activeCustomers : 0,
      });

    } catch (error) {
      console.error("Error loading customers:", error);
      // Only show error toast for non-search related errors
      if (!debouncedSearch) {
        toast.error("Failed to load customers");
      }
    } finally {
      setIsLoading(false);
    }
  }, [supabase, debouncedSearch]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  function getCustomerStatus(customer: Customer) {
    if (customer.orders > 10) return { label: "Loyal", class: "bg-green-100 text-green-800" };
    if (customer.orders > 0) return { label: "Active", class: "bg-blue-100 text-blue-800" };
    return { label: "New", class: "bg-gray-100 text-gray-800" };
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      loadCustomers(); // Reset to show all customers when search is cleared
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-[200px] sm:w-[300px]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeCustomers / stats.totalCustomers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Orders/Customer</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageOrdersPerCustomer.toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-[calc(100vw-3rem)]">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Customer</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <div className="h-6 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  </TableRow>
                ))
              ) : customers?.length ? (
                customers.map((customer) => {
                  const status = getCustomerStatus(customer);
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={customer.avatar_url} alt={customer.display_name} />
                            <AvatarFallback>{customer.display_name[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{customer.display_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={status.class}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-1">
                          <div className="font-medium">{customer.orders}</div>
                          {customer.last_order_at && (
                            <div className="text-xs text-muted-foreground">
                              Last order: {new Date(customer.last_order_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}