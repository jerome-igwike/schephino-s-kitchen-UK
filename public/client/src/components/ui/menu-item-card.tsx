import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@shared/schema";
import { motion } from "framer-motion";
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

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
}

export function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  const imageSrc = imageMap[item.image] || fineDiningImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-all h-full gpu-accelerated"
        onClick={onClick}
        data-testid={`card-menu-item-${item.id}`}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageSrc}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {item.seasonal && (
              <Badge
                className="bg-primary text-primary-foreground"
                data-testid={`badge-seasonal-${item.id}`}
              >
                Seasonal
              </Badge>
            )}
            {item.featured && (
              <Badge
                variant="secondary"
                data-testid={`badge-featured-${item.id}`}
              >
                Featured
              </Badge>
            )}
          </div>
          <div className="absolute top-3 left-3">
            <Badge
              className="bg-card text-card-foreground text-base font-semibold px-3 py-1"
              data-testid={`badge-price-${item.id}`}
            >
              ${item.price}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="font-serif text-xl font-semibold mb-2 line-clamp-2" data-testid={`text-name-${item.id}`}>
            {item.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2" data-testid={`text-description-${item.id}`}>
            {item.description}
          </p>
          {item.dietary && item.dietary.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {item.dietary.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs"
                  data-testid={`badge-dietary-${tag.toLowerCase()}-${item.id}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
