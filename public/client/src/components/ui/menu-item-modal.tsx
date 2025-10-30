import { useState } from "react";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@shared/schema";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import heroImage from "@assets/generated_images/Luxury_chef_portrait_hero_cafb3243.png";
import fineDiningImage from "@assets/generated_images/Fine_dining_plated_dish_4eb15327.png";
import pastaImage from "@assets/generated_images/Luxury_pasta_dish_bf64e7ec.png";
import seafoodImage from "@assets/generated_images/Gourmet_seafood_platter_f87e7985.png";
import dessertImage from "@assets/generated_images/Luxury_dessert_with_gold_43fe0233.png";
import steakImage from "@assets/generated_images/Premium_steak_presentation_6878cd7c.png";

const imageMap: Record<string, string> = {
  hero: heroImage,
  "fine-dining": fineDiningImage,
  pasta: pastaImage,
  seafood: seafoodImage,
  dessert: dessertImage,
  steak: steakImage,
};

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MenuItemModal({ item, isOpen, onClose }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!item) return null;

  const imageSrc = imageMap[item.image] || fineDiningImage;

  const handleAddToCart = () => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
    });
    toast({
      title: "Added to cart",
      description: `${quantity}x ${item.name}`,
    });
    setQuantity(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            data-testid="backdrop-menu-modal"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
          >
            <div className="bg-card rounded-t-3xl md:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-card/80 backdrop-blur-sm rounded-full p-2 hover-elevate active-elevate-2"
                data-testid="button-close-modal"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Image */}
              <div className="relative aspect-video md:aspect-[16/9] overflow-hidden">
                <img
                  src={imageSrc}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {item.seasonal && (
                    <Badge className="bg-primary text-primary-foreground" data-testid="badge-modal-seasonal">
                      Seasonal
                    </Badge>
                  )}
                  {item.featured && (
                    <Badge variant="secondary" data-testid="badge-modal-featured">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h2 className="font-serif text-3xl font-bold mb-1" data-testid="text-modal-name">
                      {item.name}
                    </h2>
                    <p className="text-muted-foreground">{item.category}</p>
                  </div>
                  <p className="text-3xl font-serif font-bold text-primary" data-testid="text-modal-price">
                    ${item.price}
                  </p>
                </div>

                <p className="text-foreground leading-relaxed mb-6" data-testid="text-modal-description">
                  {item.description}
                </p>

                {item.dietary && item.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.dietary.map((tag) => (
                      <Badge key={tag} variant="outline" data-testid={`badge-modal-dietary-${tag.toLowerCase()}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-sm font-medium">Quantity</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      data-testid="button-decrease-quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center" data-testid="text-quantity">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      data-testid="button-increase-quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full text-lg py-6"
                  onClick={handleAddToCart}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart - ${(parseFloat(item.price) * quantity).toFixed(2)}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
