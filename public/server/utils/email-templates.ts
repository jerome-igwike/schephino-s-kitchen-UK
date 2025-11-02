import type { Order } from '@shared/schema';
import { getEmailService, FROM_EMAIL, FROM_NAME } from '../config/email';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function generateOrderConfirmationEmail(order: Order): EmailTemplate {
  const items = JSON.parse(order.items);
  const itemsList = items.map((item: any) => 
    `${item.quantity}x ${item.name} - £${item.price}`
  ).join('\n');

  const subject = `Order Confirmation - ${order.trackingId}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Inter, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #081427; color: #D4AF37; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-family: 'Playfair Display', serif; }
    .content { padding: 20px; background: #F6F2EC; }
    .tracking-id { background: #D4AF37; color: #081427; padding: 10px; text-align: center; font-weight: bold; font-size: 18px; margin: 20px 0; }
    .order-details { background: white; padding: 15px; margin: 20px 0; border-radius: 8px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Schephino's Kitchen</h1>
      <p>Luxury Fine Dining, Delivered to You</p>
    </div>
    <div class="content">
      <h2>Thank You for Your Order!</h2>
      <p>Dear ${order.customerName},</p>
      <p>We've received your order and our culinary team is preparing your exceptional dining experience.</p>
      
      <div class="tracking-id">
        Tracking ID: ${order.trackingId}
      </div>
      
      <div class="order-details">
        <h3>Order Summary</h3>
        <p><strong>Delivery Address:</strong><br/>${order.deliveryAddress}</p>
        <p><strong>Items:</strong></p>
        <pre>${itemsList}</pre>
        <p><strong>Total:</strong> £${order.totalAmount}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>
      
      <p>You can track your order at any time using your tracking ID: <strong>${order.trackingId}</strong></p>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>With gratitude,<br/>
      <strong>Chef Joseph Nkemakosi & Team</strong></p>
    </div>
    <div class="footer">
      <p>Schephino's Kitchen - Established 2018</p>
      <p>Taste the best of Nigerian dishes</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Schephino's Kitchen - Order Confirmation

Dear ${order.customerName},

Thank you for your order!

Tracking ID: ${order.trackingId}

Order Summary:
${itemsList}

Total: £${order.totalAmount}
Delivery Address: ${order.deliveryAddress}
Status: ${order.status}

You can track your order using your tracking ID: ${order.trackingId}

Best regards,
Chef Joseph Nkemakosi & Team
Schephino's Kitchen
  `.trim();

  return { subject, html, text };
}

export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  try {
    const emailService = getEmailService();
    const template = generateOrderConfirmationEmail(order);

    await emailService.send({
      to: order.customerEmail,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log(`Order confirmation email sent to ${order.customerEmail} for order ${order.trackingId}`);
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
}

export function generateDispatchNotificationTemplate(order: Order, ubaRef: string): string {
  const items = JSON.parse(order.items);
  const itemsList = items.map((item: any) => 
    `${item.quantity}x ${item.name}`
  ).join(', ');

  return `
🍽️ NEW ORDER FOR PICKUP - Schephino's Kitchen

UBA Eats Reference: ${ubaRef}
Tracking ID: ${order.trackingId}

Customer: ${order.customerName}
Phone: ${order.customerPhone}
Delivery Address: ${order.deliveryAddress}

Order Details:
${itemsList}

Total: £${order.totalAmount}

Please confirm pickup time.
  `.trim();
}
