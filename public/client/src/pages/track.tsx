import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Package, CheckCircle, Truck, UtensilsCrossed, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@shared/schema";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const statusSteps = [
  { status: "pending", label: "Order Placed", icon: Package },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle },
  { status: "preparing", label: "Preparing", icon: UtensilsCrossed },
  { status: "ready", label: "Out for Delivery", icon: Truck },
  { status: "completed", label: "Delivered", icon: CheckCircle },
];

export default function Track() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const initialTrackingId = searchParams.get("id") || "";
  
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [searchTrackingId, setSearchTrackingId] = useState(initialTrackingId);

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ["/api/orders/track", searchTrackingId],
    enabled: !!searchTrackingId,
  });

  const handleSearch = () => {
    setSearchTrackingId(trackingId);
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex((step) => step.status === order.status);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8" data-testid="text-track-title">
          Track Your Order
        </h1>

        {/* Search Card */}
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <Label htmlFor="trackingId" className="text-base mb-3 block">
              Enter your tracking ID
            </Label>
            <div className="flex gap-3">
              <Input
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g., TRK-ABC123XYZ"
                className="h-12 text-base flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                data-testid="input-tracking-id"
              />
              <Button
                onClick={handleSearch}
                size="lg"
                className="px-8"
                data-testid="button-track"
              >
                <Search className="mr-2 h-5 w-5" />
                Track
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Searching for your order...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-serif text-2xl font-bold mb-2" data-testid="text-not-found">
                Order Not Found
              </h3>
              <p className="text-muted-foreground">
                We couldn't find an order with that tracking ID. Please check and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Order Found */}
        {order && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Order Status Card */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div>
                    <h2 className="font-serif text-3xl font-bold mb-2" data-testid="text-order-status">
                      Order #{order.trackingId}
                    </h2>
                    <p className="text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    className="bg-primary text-primary-foreground text-base px-4 py-2 w-fit"
                    data-testid="badge-order-status"
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                {/* Progress Timeline */}
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted md:left-1/2 md:-translate-x-1/2" />
                  <div className="space-y-8">
                    {statusSteps.map((step, index) => {
                      const StepIcon = step.icon;
                      const currentStepIndex = getCurrentStepIndex();
                      const isCompleted = index <= currentStepIndex;
                      const isActive = index === currentStepIndex;

                      return (
                        <div key={step.status} className="relative flex items-start gap-6 md:justify-center">
                          <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-background border-muted text-muted-foreground"
                          }`}>
                            <StepIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 md:absolute md:w-1/2" style={{ left: index % 2 === 0 ? "0" : "50%" }}>
                            <div className={`md:${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
                              <h3 className={`font-semibold text-lg mb-1 ${isActive ? "text-primary" : ""}`}>
                                {step.label}
                              </h3>
                              {isActive && (
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  In Progress
                                </p>
                              )}
                              {isCompleted && !isActive && (
                                <p className="text-sm text-muted-foreground">
                                  Completed
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details Card */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <h3 className="font-serif text-2xl font-bold mb-6">Order Details</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Customer Name</p>
                    <p className="font-semibold" data-testid="text-customer-name">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <p className="font-semibold">{order.customerPhone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
                    <p className="font-semibold">{order.deliveryAddress}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Items</h4>
                  <div className="space-y-2 mb-4">
                    {JSON.parse(order.items).map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4 border-t">
                    <span>Total</span>
                    <span className="text-primary" data-testid="text-order-total">${parseFloat(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estimated Delivery */}
            {order.status !== "completed" && order.status !== "cancelled" && (
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3" />
                  <p className="text-lg font-semibold">
                    Estimated Delivery: 45 minutes
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    We'll notify you when your order is ready for delivery
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
