import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema, type CheckoutForm } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

const steps = ["Contact", "Delivery", "Payment"];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const { cart, totalAmount, clearCart } = useCart();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const orderData = {
        ...data,
        items: JSON.stringify(cart),
        totalAmount: (totalAmount + 5 + totalAmount * 0.08).toFixed(2),
        status: "pending",
        paymentStatus: "pending",
      };
      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: (data: any) => {
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: `Your tracking ID is: ${data.trackingId}`,
      });
      setLocation(`/confirmation/${data.trackingId}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    createOrderMutation.mutate(data);
  };

  if (cart.length === 0) {
    setLocation("/cart");
    return null;
  }

  const subtotal = totalAmount;
  const deliveryFee = 5;
  const tax = totalAmount * 0.08;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8" data-testid="text-checkout-title">
          Checkout
        </h1>

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      index <= currentStep
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted text-muted-foreground"
                    }`}
                    data-testid={`step-indicator-${index}`}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-2 font-medium">{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-16 mx-2 transition-all ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardContent className="p-6 md:p-8 space-y-6">
                  {/* Contact Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h2 className="font-serif text-2xl font-bold mb-4">Contact Information</h2>
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        {...register("customerName")}
                        className="mt-1.5 h-12"
                        placeholder="John Doe"
                        data-testid="input-name"
                      />
                      {errors.customerName && (
                        <p className="text-destructive text-sm mt-1" data-testid="error-name">
                          {errors.customerName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email Address *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        {...register("customerEmail")}
                        className="mt-1.5 h-12"
                        placeholder="john@example.com"
                        data-testid="input-email"
                      />
                      {errors.customerEmail && (
                        <p className="text-destructive text-sm mt-1" data-testid="error-email">
                          {errors.customerEmail.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        {...register("customerPhone")}
                        className="mt-1.5 h-12"
                        placeholder="(555) 123-4567"
                        data-testid="input-phone"
                      />
                      {errors.customerPhone && (
                        <p className="text-destructive text-sm mt-1" data-testid="error-phone">
                          {errors.customerPhone.message}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Delivery Address */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4 pt-6 border-t"
                  >
                    <h2 className="font-serif text-2xl font-bold mb-4">Delivery Address</h2>
                    <div>
                      <Label htmlFor="deliveryAddress">Street Address *</Label>
                      <Input
                        id="deliveryAddress"
                        {...register("deliveryAddress")}
                        className="mt-1.5 h-12"
                        placeholder="123 Main Street, Apt 4B, City, State 12345"
                        data-testid="input-address"
                      />
                      {errors.deliveryAddress && (
                        <p className="text-destructive text-sm mt-1" data-testid="error-address">
                          {errors.deliveryAddress.message}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Payment Section (Placeholder) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-6 border-t"
                  >
                    <h2 className="font-serif text-2xl font-bold mb-4">Payment Method</h2>
                    <div className="bg-accent/20 border-2 border-dashed border-accent rounded-lg p-6 text-center">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-2">
                        <strong>Stripe Payment Integration</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        TODO: Stripe Elements will be integrated here
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Environment variable: NEXT_PUBLIC_STRIPE_PK
                      </p>
                    </div>
                  </motion.div>

                  <Button
                    type="submit"
                    className="w-full text-lg py-6 mt-6"
                    size="lg"
                    disabled={createOrderMutation.isPending}
                    data-testid="button-place-order"
                  >
                    {createOrderMutation.isPending ? (
                      "Processing..."
                    ) : (
                      <>
                        Place Order - ${total.toFixed(2)}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between text-sm">
                      <span className="flex-1">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold" data-testid="text-checkout-subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-semibold" data-testid="text-checkout-tax">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary text-2xl" data-testid="text-checkout-total">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-center">
                    <strong>Estimated Delivery:</strong> 45 minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
