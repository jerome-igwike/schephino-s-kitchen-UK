import type { Express, Request, Response } from "express";
import type { IStorage } from "./storage";
import { insertMenuItemSchema, insertOrderSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { registerStripeRoutes } from "./routes/stripe";
import { registerAdminRoutes } from "./routes/admin";
import { sendOrderConfirmationEmail } from "./utils/email-templates";
import { requireAdmin } from "./middleware/auth";

export function registerRoutes(app: Express, storage: IStorage) {
  // Register additional route modules
  registerStripeRoutes(app, storage);
  registerAdminRoutes(app, storage);
  // Health check
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ========== MENU ROUTES ==========
  
  // Get all menu items
  app.get("/api/menu", async (req: Request, res: Response) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  // Get single menu item
  app.get("/api/menu/:id", async (req: Request, res: Response) => {
    try {
      const item = await storage.getMenuItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  });

  // Create menu item (admin)
  app.post("/api/admin/menu", requireAdmin, async (req: Request, res: Response) => {
    try {
      const data = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating menu item:", error);
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  // Bulk create menu items from CSV (admin)
  app.post("/api/admin/menu/bulk", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Items must be an array" });
      }
      
      const validatedItems = items.map((item) => insertMenuItemSchema.parse(item));
      const created = await storage.bulkCreateMenuItems(validatedItems);
      res.status(201).json({ created: created.length, items: created });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error bulk creating menu items:", error);
      res.status(500).json({ error: "Failed to bulk create menu items" });
    }
  });

  // Update menu item (admin)
  app.patch("/api/admin/menu/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const updated = await storage.updateMenuItem(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });

  // Delete menu item (admin)
  app.delete("/api/admin/menu/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteMenuItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  // ========== ORDER ROUTES ==========
  
  // Create order (guest checkout)
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const data = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(data);
      
      // Send confirmation email if email service is configured
      try {
        await sendOrderConfirmationEmail(order);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the order creation if email fails
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Track order by tracking ID
  app.get("/api/orders/track/:trackingId", async (req: Request, res: Response) => {
    try {
      const order = await storage.getOrderByTrackingId(req.params.trackingId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error tracking order:", error);
      res.status(500).json({ error: "Failed to track order" });
    }
  });

  // Get all orders (for customer or admin)
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // ========== ADMIN ORDER ROUTES ==========
  
  // Get all orders (admin)
  app.get("/api/admin/orders", requireAdmin, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Update order status (admin)
  app.patch("/api/admin/orders/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { status, ubaRef } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const updates: any = { status };
      if (ubaRef) {
        updates.ubaRef = ubaRef;
      }
      
      const updated = await storage.updateOrder(req.params.id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // ========== USER ROUTES (STUBS FOR FUTURE SUPABASE) ==========
  
  // Get current user (stub)
  app.get("/api/auth/user", async (req: Request, res: Response) => {
    // TODO: Implement Supabase authentication
    res.status(401).json({ error: "Authentication not yet implemented" });
  });

  // Register user (stub)
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // ========== CSV EXPORT (ADMIN) ==========
  
  // Export menu as CSV
  app.get("/api/admin/menu/export", requireAdmin, async (req: Request, res: Response) => {
    try {
      const items = await storage.getMenuItems();
      
      // Generate CSV
      const headers = ["id", "name", "description", "category", "price", "image", "dietary", "priceRangeLabel", "featured", "seasonal", "available"];
      const csvRows = [headers.join(",")];
      
      items.forEach((item) => {
        const row = [
          item.id,
          `"${item.name}"`,
          `"${item.description}"`,
          item.category,
          item.price,
          item.image,
          `"${(item.dietary || []).join(";")}"`,
          item.priceRangeLabel,
          item.featured,
          item.seasonal,
          item.available,
        ];
        csvRows.push(row.join(","));
      });
      
      const csv = csvRows.join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=menu-export.csv");
      res.send(csv);
    } catch (error) {
      console.error("Error exporting menu:", error);
      res.status(500).json({ error: "Failed to export menu" });
    }
  });
}
