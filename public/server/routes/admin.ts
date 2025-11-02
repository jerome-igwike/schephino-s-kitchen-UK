import type { Express, Request, Response } from 'express';
import type { IStorage } from '../storage';
import { requireAdmin } from '../middleware/auth';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { insertMenuItemSchema } from '@shared/schema';
import { z } from 'zod';
import { generateDispatchNotificationTemplate } from '../utils/email-templates';

export function registerAdminRoutes(app: Express, storage: IStorage) {
  // CSV Import for menu items (admin only)
  app.post('/api/admin/import/menu', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { csvData } = req.body;

      if (!csvData || typeof csvData !== 'string') {
        return res.status(400).json({ error: 'CSV data is required' });
      }

      // Parse CSV
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      const results = {
        success: 0,
        failed: 0,
        errors: [] as any[],
      };

      // Process each row
      for (let i = 0; i < records.length; i++) {
        const row = records[i];
        try {
          // Transform CSV row to menu item
          const menuItem = {
            name: row.name,
            description: row.description,
            category: row.category,
            price: row.price,
            image: row.image,
            dietary: row.dietary ? row.dietary.split(';').map((d: string) => d.trim()) : [],
            priceRangeLabel: row.priceRangeLabel || row.price_range_label,
            featured: row.featured === 'true' || row.featured === '1',
            seasonal: row.seasonal === 'true' || row.seasonal === '1',
            available: row.available !== 'false' && row.available !== '0',
          };

          // Validate
          const validated = insertMenuItemSchema.parse(menuItem);

          // Check if item exists by name
          const existing = await storage.getMenuItemByName(validated.name);
          if (existing) {
            // Update existing
            await storage.updateMenuItem(existing.id, validated);
          } else {
            // Create new
            await storage.createMenuItem(validated);
          }

          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            data: row,
            error: error.message,
          });
        }
      }

      res.json({
        message: `Import completed: ${results.success} successful, ${results.failed} failed`,
        ...results,
      });
    } catch (error: any) {
      console.error('Error importing CSV:', error);
      res.status(500).json({ error: error.message || 'Failed to import CSV' });
    }
  });

  // Export orders as CSV (admin only)
  app.get('/api/admin/orders/export', requireAdmin, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getOrders();

      const csvData = orders.map(order => ({
        id: order.id,
        trackingId: order.trackingId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        deliveryAddress: order.deliveryAddress,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        ubaRef: order.ubaRef || '',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }));

      const csv = stringify(csvData, {
        header: true,
        columns: [
          'id',
          'trackingId',
          'customerName',
          'customerEmail',
          'customerPhone',
          'deliveryAddress',
          'totalAmount',
          'status',
          'paymentStatus',
          'ubaRef',
          'createdAt',
          'updatedAt',
        ],
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=orders-export.csv');
      res.send(csv);
    } catch (error) {
      console.error('Error exporting orders:', error);
      res.status(500).json({ error: 'Failed to export orders' });
    }
  });

  // Manual dispatch endpoint (admin only)
  app.post('/api/admin/dispatch', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { orderId, ubaRef, notes } = req.body;

      if (!orderId || !ubaRef) {
        return res.status(400).json({ error: 'Order ID and UBA reference are required' });
      }

      const order = await storage.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Update order with UBA reference and status
      const updated = await storage.updateOrder(orderId, {
        ubaRef,
        status: 'handed_off',
      });

      // Create dispatch audit log
      await storage.createDispatchAudit({
        orderId,
        adminId: req.user?.id || 'system',
        ubaRef,
        notes: notes || null,
      });

      // Generate notification template for admin to copy/paste
      const notificationTemplate = generateDispatchNotificationTemplate(updated!, ubaRef);

      res.json({
        order: updated,
        notificationTemplate,
        message: 'Order dispatched successfully. Use the notification template to notify UBA Eats.',
      });
    } catch (error) {
      console.error('Error dispatching order:', error);
      res.status(500).json({ error: 'Failed to dispatch order' });
    }
  });

  // Anonymize order (GDPR compliance, admin only)
  app.delete('/api/admin/orders/:id/anonymize', requireAdmin, async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Anonymize customer data
      const anonymized = await storage.updateOrder(req.params.id, {
        customerName: 'ANONYMIZED',
        customerEmail: 'anonymized@example.com',
        customerPhone: 'ANONYMIZED',
        deliveryAddress: 'ANONYMIZED',
      });

      res.json({
        message: 'Order data anonymized successfully',
        order: anonymized,
      });
    } catch (error) {
      console.error('Error anonymizing order:', error);
      res.status(500).json({ error: 'Failed to anonymize order' });
    }
  });
}
