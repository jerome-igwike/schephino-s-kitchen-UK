import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-24 md:pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
              <h2 className="font-serif text-3xl font-bold mb-4" data-testid="text-empty-cart">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Explore our menu and add some delicious dishes
              </p>
              <Link href="/menu">
                <Button size="lg" data-testid="button-browse-menu">
                  Browse Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8" data-testid="text-cart-title">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.menuItemId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card data-testid={`card-cart-item-${item.menuItemId}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-semibold mb-2" data-testid={`text-item-name-${item.menuItemId}`}>
                          {item.name}
                        </h3>
                        <p className="text-2xl font-bold text-primary mb-4" data-testid={`text-item-price-${item.menuItemId}`}>
                          ${item.price}
                        </p>

                        <div className="flex items-center gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.menuItemId, item.quantity - 1)
                              }
                              data-testid={`button-decrease-${item.menuItemId}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-lg font-semibold w-8 text-center" data-testid={`text-quantity-${item.menuItemId}`}>
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.menuItemId, item.quantity + 1)
                              }
                              data-testid={`button-increase-${item.menuItemId}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.menuItemId)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-remove-${item.menuItemId}`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                        <p className="text-2xl font-bold" data-testid={`text-subtotal-${item.menuItemId}`}>
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold" data-testid="text-summary-subtotal">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-semibold">$5.00</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-semibold" data-testid="text-summary-tax">${(totalAmount * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary text-2xl" data-testid="text-summary-total">
                        ${(totalAmount + 5 + totalAmount * 0.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full text-lg py-6" size="lg" data-testid="button-proceed-checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/menu">
                  <Button variant="outline" className="w-full mt-3" data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>

                <div className="mt-6 p-4 bg-accent/20 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    Free delivery on orders over $50
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
