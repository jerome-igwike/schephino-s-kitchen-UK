import { Home, UtensilsCrossed, Package, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";

export function BottomNav() {
  const [location] = useLocation();
  const { totalItems } = useCart();

  const navItems = [
    { href: "/", icon: Home, label: "Home", testId: "nav-home" },
    { href: "/menu", icon: UtensilsCrossed, label: "Menu", testId: "nav-menu" },
    { href: "/orders", icon: Package, label: "Orders", testId: "nav-orders" },
    { href: "/account", icon: User, label: "Account", testId: "nav-account" },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-40 shadow-2xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          const isMenu = item.href === "/menu";

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all relative min-h-[48px] hover-elevate active-elevate-2 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={item.testId}
              >
                <div className="relative">
                  <Icon
                    className={`h-6 w-6 transition-all ${
                      isActive ? "fill-primary" : ""
                    }`}
                  />
                  {isMenu && totalItems > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 bg-primary text-primary-foreground text-[10px]"
                      data-testid="badge-nav-cart-count"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
