import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Share2, Home, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Confirmation() {
  const [, params] = useRoute("/confirmation/:trackingId");
  const { toast } = useToast();
  const trackingId = params?.trackingId || "";

  const handleShare = () => {
    const url = `${window.location.origin}/track?id=${trackingId}`;
    if (navigator.share) {
      navigator.share({
        title: "Track My Order - Schephino's Kitchen",
        text: `Track my order with ID: ${trackingId}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Tracking link has been copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 md:pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center overflow-hidden">
            <div className="bg-primary py-12 px-6">
              <CheckCircle className="h-20 w-20 mx-auto mb-4 text-primary-foreground" />
              <h1 className="font-serif text-4xl font-bold text-primary-foreground mb-2" data-testid="text-confirmation-title">
                Order Confirmed!
              </h1>
              <p className="text-primary-foreground/90 text-lg">
                Thank you for choosing Schephino's Kitchen
              </p>
            </div>

            <CardContent className="p-8 md:p-12">
              <div className="mb-8">
                <p className="text-muted-foreground mb-3">Your Tracking ID</p>
                <div className="inline-flex items-center gap-2 bg-accent px-6 py-3 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                  <code className="text-2xl font-mono font-bold" data-testid="text-tracking-id">
                    {trackingId}
                  </code>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-card border border-card-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                  <p className="text-xl font-bold">45 minutes</p>
                </div>
                <div className="p-6 bg-card border border-card-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                  <Badge className="bg-primary text-primary-foreground" data-testid="badge-status">
                    Confirmed
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <Link href={`/track?id=${trackingId}`}>
                  <Button className="w-full text-lg py-6" size="lg" data-testid="button-track-order">
                    <Package className="mr-2 h-5 w-5" />
                    Track Your Order
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleShare}
                  data-testid="button-share"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Tracking Link
                </Button>

                <Link href="/">
                  <Button variant="ghost" className="w-full" data-testid="button-back-home">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>

              <div className="mt-8 p-4 bg-accent/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your email address with your order details.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
