import { useState, useMemo } from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MenuItemCard } from "@/components/ui/menu-item-card";
import { MenuItemModal } from "@/components/ui/menu-item-modal";
import type { MenuItem } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const categories = ["All", "Appetizers", "Pasta", "Main Course", "Desserts"];
const priceRanges = ["All", "$$", "$$$", "$$$$"];
const dietaryFilters = ["All", "Vegetarian", "Gluten-Free", "Dairy-Free"];

export default function Menu() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [selectedDietary, setSelectedDietary] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesPrice =
        selectedPriceRange === "All" ||
        item.priceRangeLabel === selectedPriceRange;
      const matchesDietary =
        selectedDietary === "All" ||
        (item.dietary && item.dietary.includes(selectedDietary));

      return matchesSearch && matchesCategory && matchesPrice && matchesDietary;
    });
  }, [menuItems, searchQuery, selectedCategory, selectedPriceRange, selectedDietary]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedPriceRange("All");
    setSelectedDietary("All");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "All" || selectedPriceRange !== "All" || selectedDietary !== "All";

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-menu-title">
            Our Menu
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover our selection of handcrafted dishes
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 text-base border-2 focus:border-primary"
                data-testid="input-search"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
              data-testid={`button-category-${category.toLowerCase().replace(" ", "-")}`}
            >
              {category}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-accent" : ""}
            data-testid="button-toggle-filters"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="flex flex-wrap gap-2">
                      {priceRanges.map((range) => (
                        <Badge
                          key={range}
                          variant={selectedPriceRange === range ? "default" : "outline"}
                          className="cursor-pointer hover-elevate active-elevate-2"
                          onClick={() => setSelectedPriceRange(range)}
                          data-testid={`badge-price-${range.toLowerCase().replace("$", "")}`}
                        >
                          {range}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Dietary Options</h3>
                    <div className="flex flex-wrap gap-2">
                      {dietaryFilters.map((dietary) => (
                        <Badge
                          key={dietary}
                          variant={selectedDietary === dietary ? "default" : "outline"}
                          className="cursor-pointer hover-elevate active-elevate-2"
                          onClick={() => setSelectedDietary(dietary)}
                          data-testid={`badge-dietary-${dietary.toLowerCase().replace(" ", "-")}`}
                        >
                          {dietary}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {hasActiveFilters && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      variant="ghost"
                      onClick={resetFilters}
                      className="text-sm"
                      data-testid="button-reset-filters"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground" data-testid="text-results-count">
            {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"} found
          </p>
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted" />
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground text-lg mb-4" data-testid="text-no-results">
                No dishes found matching your criteria
              </p>
              {hasActiveFilters && (
                <Button onClick={resetFilters} data-testid="button-clear-filters">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <MenuItemModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
