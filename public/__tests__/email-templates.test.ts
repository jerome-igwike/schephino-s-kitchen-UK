import { generateOrderConfirmationEmail } from '../server/utils/email-templates';
import type { Order } from '../shared/schema';

describe('Email Templates', () => {
  const mockOrder: Order = {
    id: 'test-123',
    trackingId: 'SK-20251031-0001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+447123456789',
    deliveryAddress: '123 Test Street, London, UK',
    items: JSON.stringify([
      { name: 'Jollof Rice', quantity: 2, price: '12.99' },
      { name: 'Suya Skewers', quantity: 1, price: '8.50' },
    ]),
    totalAmount: '34.48',
    status: 'confirmed',
    paymentStatus: 'paid',
    stripePaymentIntentId: null,
    stripeSessionId: null,
    ubaRef: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should generate order confirmation email with correct subject', () => {
    const email = generateOrderConfirmationEmail(mockOrder);
    
    expect(email.subject).toContain('Order Confirmation');
    expect(email.subject).toContain(mockOrder.trackingId);
  });

  it('should include tracking ID in email content', () => {
    const email = generateOrderConfirmationEmail(mockOrder);
    
    expect(email.html).toContain(mockOrder.trackingId);
    expect(email.text).toContain(mockOrder.trackingId);
  });

  it('should include customer name in email', () => {
    const email = generateOrderConfirmationEmail(mockOrder);
    
    expect(email.html).toContain(mockOrder.customerName);
    expect(email.text).toContain(mockOrder.customerName);
  });

  it('should include order items in email', () => {
    const email = generateOrderConfirmationEmail(mockOrder);
    
    expect(email.html).toContain('Jollof Rice');
    expect(email.html).toContain('Suya Skewers');
    expect(email.text).toContain('Jollof Rice');
    expect(email.text).toContain('Suya Skewers');
  });

  it('should include total amount in email', () => {
    const email = generateOrderConfirmationEmail(mockOrder);
    
    expect(email.html).toContain(mockOrder.totalAmount);
    expect(email.text).toContain(mockOrder.totalAmount);
  });

  it('should include delivery address in email', () => {
    const email = generateOrderConfirmationEmail(mockOrder);
    
    expect(email.html).toContain(mockOrder.deliveryAddress);
    expect(email.text).toContain(mockOrder.deliveryAddress);
  });
});
