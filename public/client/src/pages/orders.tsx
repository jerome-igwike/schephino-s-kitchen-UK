import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@shared/schema";

export default function Orders() {
  // TODO: This would filter orders by user when auth is implemented
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

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
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8" data-testid="text-orders-title">
          My Orders
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-3 w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="font-serif text-3xl font-bold mb-4" data-testid="text-no-orders">
                No Orders Yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start exploring our menu and place your first order
              </p>
              <Link href="/menu">
                <Button size="lg" data-testid="button-browse-menu">
                  Browse Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="hover-elevate active-elevate-2 cursor-pointer"
                data-testid={`card-order-${order.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-xl" data-testid={`text-tracking-${order.id}`}>
                          {order.trackingId}
                        </h3>
                        <Badge
                          className={`${getStatusColor(order.status)} text-white`}
                          data-testid={`badge-status-${order.id}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName} • {order.deliveryAddress.split(",")[0]}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Total</p>
                        <p className="text-2xl font-bold text-primary" data-testid={`text-total-${order.id}`}>
                          ${parseFloat(order.totalAmount).toFixed(2)}
                        </p>
                      </div>
                      <Link href={`/track?id=${order.trackingId}`}>
                        <Button variant="outline" data-testid={`button-track-${order.id}`}>
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
