import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Lock, Package, Filter, FileSpreadsheet, Download } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Order } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/orders/${orderId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Status updated",
        description: "Order status has been updated successfully",
      });
    },
  });

  const handleLogin = () => {
    // TODO: Implement proper admin authentication
    if (password === "admin") {
      setIsAuthenticated(true);
      toast({
        title: "Welcome, Admin",
        description: "You are now logged in to the admin dashboard",
      });
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your password and try again",
        variant: "destructive",
      });
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement CSV parsing and menu import
      toast({
        title: "CSV Upload",
        description: "CSV parsing will be implemented in the backend phase",
      });
    }
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    toast({
      title: "Export",
      description: "CSV export will be implemented in the backend phase",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-24 md:pb-12">
        <div className="max-w-md mx-auto px-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Lock className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="font-serif text-3xl font-bold mb-4" data-testid="text-admin-title">
                Admin Access
              </h2>
              <p className="text-muted-foreground mb-6">
                Please enter your admin credentials to continue
              </p>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="h-12"
                  data-testid="input-admin-password"
                />
                <Button
                  className="w-full"
                  onClick={handleLogin}
                  data-testid="button-admin-login"
                >
                  Sign In
                </Button>
              </div>
              <div className="mt-6 p-4 bg-accent/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Demo password: admin
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-destructive";
      case "preparing":
      case "ready":
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2" data-testid="text-dashboard-title">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage orders and menu items</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
            data-testid="button-admin-logout"
          >
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
              <p className="text-3xl font-bold" data-testid="text-total-orders">{orders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-primary">
                {orders.filter((o) => o.status === "pending").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Preparing</p>
              <p className="text-3xl font-bold text-primary">
                {orders.filter((o) => o.status === "preparing").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-500">
                {orders.filter((o) => o.status === "completed").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CSV Import Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-serif text-2xl font-bold mb-4">Menu Management</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 p-6 bg-accent/20 border-2 border-dashed border-accent rounded-lg">
                <FileSpreadsheet className="h-10 w-10 mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">CSV Menu Import</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV file to bulk import or update menu items
                </p>
                <label htmlFor="csv-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload CSV
                    </span>
                  </Button>
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                  data-testid="input-csv-upload"
                />
                <p className="text-xs text-muted-foreground mt-3">
                  Expected format: name, description, category, price, image, dietary tags, price_range_label
                </p>
              </div>
              <div className="flex-1 p-6 bg-card border border-card-border rounded-lg">
                <Download className="h-10 w-10 mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Export Menu Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download current menu items as CSV for backup or editing
                </p>
                <Button
                  variant="outline"
                  onClick={handleExportCSV}
                  data-testid="button-export-csv"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Management */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="font-serif text-2xl font-bold">Orders</h2>
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground" data-testid="text-no-orders">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Tracking ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold">Total</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-accent/50" data-testid={`row-order-${order.id}`}>
                        <td className="py-4 px-4 font-mono text-sm">{order.trackingId}</td>
                        <td className="py-4 px-4">{order.customerName}</td>
                        <td className="py-4 px-4 font-semibold">${parseFloat(order.totalAmount).toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <Select
                            value={order.status}
                            onValueChange={(status) =>
                              updateStatusMutation.mutate({ orderId: order.id, status })
                            }
                          >
                            <SelectTrigger className="w-[140px]" data-testid={`select-status-${order.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
