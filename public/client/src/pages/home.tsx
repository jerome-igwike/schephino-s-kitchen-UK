import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, UtensilsCrossed, Clock, Shield, Star } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/Luxury_chef_portrait_hero_cafb3243.png";
import fineDiningImage from "@assets/generated_images/Fine_dining_plated_dish_4eb15327.png";
import pastaImage from "@assets/generated_images/Luxury_pasta_dish_bf64e7ec.png";
import seafoodImage from "@assets/generated_images/Gourmet_seafood_platter_f87e7985.png";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Authentic Nigerian Cuisine",
    description: "Traditional recipes passed down through generations",
  },
  {
    icon: Clock,
    title: "Fresh Delivery",
    description: "Hot, delicious meals delivered straight to your door",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Made with premium ingredients and authentic spices",
  },
];

const promoItems = [
  {
    id: 1,
    title: "Jollof Rice",
    description: "Our Signature Smokey Party Jollof",
    image: fineDiningImage,
    badge: "Chef's Favorite",
  },
  {
    id: 2,
    title: "Egusi Soup",
    description: "Rich & Traditional",
    image: pastaImage,
    badge: "Most Popular",
  },
  {
    id: 3,
    title: "Suya & Asun",
    description: "Spiced Grilled Perfection",
    image: seafoodImage,
    badge: "Crowd Pleaser",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center gpu-accelerated"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: "translateZ(0)",
          }}
        >
          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-sidebar/90 via-sidebar/70 to-sidebar/90" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-primary text-primary-foreground text-sm px-4 py-2" data-testid="badge-hero-tag">
              Since 2018 • Chef Joseph Nkemakosi
            </Badge>
            <h1
              className="font-serif text-5xl md:text-7xl font-bold text-sidebar-foreground mb-6 leading-tight"
              data-testid="text-hero-title"
            >
              Authentic Nigerian Cuisine,
              <span className="block text-primary">Delivered to You</span>
            </h1>
            <p className="text-xl md:text-2xl text-sidebar-foreground/90 mb-8 leading-relaxed" data-testid="text-hero-subtitle">
              Where luxury meets Lagos flavor. Experience the warmth, spice, and richness of Nigeria in every dish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/menu">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 min-w-[200px]"
                  data-testid="button-view-menu"
                >
                  View Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/track">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 min-w-[200px] bg-card/20 backdrop-blur-sm border-2 hover:bg-card/40"
                  data-testid="button-track-order"
                >
                  Track Order
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-sidebar-foreground/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-2 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Cultural Insights Section */}
      <section className="py-16 px-6 bg-sidebar/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              From Lagos to London
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
              Each dish at Schephino's Kitchen carries the soul of Nigeria — from the smoky richness of our party Jollof 
              to the aromatic depth of our Egusi soup. We honor traditional cooking methods while bringing the authentic 
              taste of home to Nigerian families and food lovers across the UK.
            </p>
            <p className="text-lg text-muted-foreground/90 leading-relaxed italic">
              "Every plate tells a story of culture, community, and the warmth of Nigerian hospitality."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-12" data-testid="text-features-title">
            Why Schephino's Kitchen
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center h-full">
                    <CardContent className="pt-8 pb-6 px-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-serif text-2xl font-semibold mb-3" data-testid={`text-feature-${index}`}>
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seasonal Promo Carousel */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary text-primary-foreground" data-testid="badge-promo-tag">
              This Season
            </Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-promo-title">
              Customer Favorites
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The most loved dishes from our authentic Nigerian menu
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {promoItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-promo-${item.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {item.badge}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-sidebar/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-sidebar-foreground">
                      <h3 className="font-serif text-2xl font-bold mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sidebar-foreground/90">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <Star className="h-12 w-12 mx-auto mb-6 fill-current" />
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6" data-testid="text-cta-title">
            Ready for a Taste of Home?
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            From Jollof to Suya, each plate tells a story of tradition, culture, and authentic Nigerian flavors.
          </p>
          <Link href="/menu">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-card text-card-foreground border-2 border-card hover:bg-card/90 min-w-[240px]"
              data-testid="button-order-now"
            >
              Order Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-sidebar text-sidebar-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">
                Schephino's <span className="text-primary">Kitchen</span>
              </h3>
              <p className="text-sidebar-foreground/80 leading-relaxed">
                Authentic Nigerian cuisine redefined for the UK since 2018.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/menu" className="block text-sidebar-foreground/80 hover:text-primary transition-colors">
                  Menu
                </Link>
                <Link href="/track" className="block text-sidebar-foreground/80 hover:text-primary transition-colors">
                  Track Order
                </Link>
                <Link href="/account" className="block text-sidebar-foreground/80 hover:text-primary transition-colors">
                  My Account
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sidebar-foreground/80 leading-relaxed">
                Email: hello@schephinoskitchen.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-sidebar-border pt-6 text-center text-sidebar-foreground/60">
            <p>&copy; 2024 Schephino's Kitchen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
