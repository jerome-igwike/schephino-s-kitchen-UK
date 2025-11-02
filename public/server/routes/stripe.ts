import type { Express, Request, Response } from 'express';
import type { IStorage } from '../storage';
import { getStripeClient, STRIPE_WEBHOOK_SECRET } from '../config/stripe';
import { sendOrderConfirmationEmail } from '../utils/email-templates';
import { requireAdmin } from '../middleware/auth';
import type Stripe from 'stripe';

export function registerStripeRoutes(app: Express, storage: IStorage) {
  // Create Stripe checkout session
  app.post('/api/stripe/create-checkout-session', async (req: Request, res: Response) => {
    try {
      const stripe = getStripeClient();
      const { orderId, items, totalAmount, customerEmail } = req.body;

      if (!orderId || !items || !totalAmount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Convert items to Stripe line items
      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to pence
        },
        quantity: item.quantity,
      }));

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/confirmation?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/cart`,
        customer_email: customerEmail,
        metadata: {
          orderId,
        },
      });

      // Update order with Stripe session ID
      const order = await storage.getOrderById(orderId);
      if (order) {
        await storage.updateOrder(orderId, {
          stripeSessionId: session.id,
        });
      }

      res.json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
  });

  // Stripe webhook handler
  app.post('/api/stripe/webhook', async (req: Request, res: Response) => {
    try {
      const stripe = getStripeClient();
      const sig = req.headers['stripe-signature'] as string;

      if (!sig || !STRIPE_WEBHOOK_SECRET) {
        return res.status(400).json({ error: 'Missing signature or webhook secret' });
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody as Buffer,
          sig,
          STRIPE_WEBHOOK_SECRET
        );
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const orderId = session.metadata?.orderId;

          if (orderId) {
            // Update order payment status
            const updated = await storage.updateOrder(orderId, {
              paymentStatus: 'paid',
              status: 'confirmed',
              stripePaymentIntentId: session.payment_intent as string,
            });

            // Send confirmation email
            if (updated) {
              await sendOrderConfirmationEmail(updated);
            }

            console.log(`Order ${orderId} marked as paid`);
          }
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`Payment failed for ${paymentIntent.id}`);
          break;
        }

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook handler error:', error);
      res.status(500).json({ error: error.message || 'Webhook handler failed' });
    }
  });

  // Get payment intent ID for refund (admin)
  app.get('/api/admin/orders/:id/payment-intent', requireAdmin, async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (!order.stripePaymentIntentId) {
        return res.status(404).json({ error: 'No payment intent found for this order' });
      }

      res.json({
        paymentIntentId: order.stripePaymentIntentId,
        amount: order.totalAmount,
        refundUrl: `https://dashboard.stripe.com/payments/${order.stripePaymentIntentId}`,
      });
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      res.status(500).json({ error: 'Failed to fetch payment intent' });
    }
  });
}
