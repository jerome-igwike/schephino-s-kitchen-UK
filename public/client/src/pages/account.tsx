import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, LogIn, UserPlus, Package, Clock, CheckCircle } from "lucide-react";

// Mock order history
const mockOrders = [
  {
    id: "1",
    trackingId: "TRK-ABC123",
    date: "2024-01-15",
    status: "completed",
    total: "78.50",
    items: 3,
  },
  {
    id: "2",
    trackingId: "TRK-DEF456",
    date: "2024-01-10",
    status: "completed",
    total: "125.00",
    items: 5,
  },
];

export default function Account() {
  const isLoggedIn = false; // TODO: Check Supabase auth state

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-24 md:pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <Card>
            <CardContent className="p-12 text-center">
              <UserPlus className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="font-serif text-3xl font-bold mb-4" data-testid="text-account-title">
                Welcome to Schephino's Kitchen
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Sign in or create an account to track your orders, save your favorite dishes, and enjoy faster checkout.
              </p>

              {/* Magic Link Login UI (Placeholder) */}
              <div className="max-w-md mx-auto space-y-4">
                <div className="p-6 bg-accent/20 border-2 border-dashed border-accent rounded-lg">
                  <Mail className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-semibold mb-2">Supabase Magic Link Authentication</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    TODO: Magic link email authentication UI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Environment variable: NEXT_PUBLIC_SUPABASE_URL
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" data-testid="button-sign-in">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button variant="outline" className="flex-1" data-testid="button-register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </div>
              </div>

              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  You can still place orders as a guest without an account
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Logged in view
  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2" data-testid="text-my-account">
            My Account
          </h1>
          <p className="text-muted-foreground">Manage your orders and preferences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold">John Doe</h3>
                <p className="text-sm text-muted-foreground">john@example.com</p>
              </div>
              <Button variant="outline" className="w-full" data-testid="button-edit-profile">
                Edit Profile
              </Button>
              <Button variant="ghost" className="w-full mt-2" data-testid="button-sign-out">
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Order History */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-2xl font-bold mb-6">Order History</h2>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id} className="hover-elevate active-elevate-2" data-testid={`card-order-${order.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">
                            Order #{order.trackingId}
                          </h3>
                          <Badge variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.items} items
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${order.total}</p>
                        </div>
                        <Link href={`/track?id=${order.trackingId}`}>
                          <Button variant="outline" data-testid={`button-view-${order.id}`}>
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockOrders.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-serif text-2xl font-bold mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start exploring our menu and place your first order
                    </p>
                    <Link href="/menu">
                      <Button>Browse Menu</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
