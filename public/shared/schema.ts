import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Menu Items
export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image").notNull(),
  dietary: text("dietary").array(),
  priceRangeLabel: text("price_range_label").notNull(),
  featured: boolean("featured").default(false),
  seasonal: boolean("seasonal").default(false),
  available: boolean("available").default(true),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

// Orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingId: text("tracking_id").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  items: text("items").notNull(), // JSON string of cart items
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, handed_off, delivered, cancelled
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, refunded
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSessionId: text("stripe_session_id"),
  ubaRef: text("uba_ref"), // UBA Eats reference for dispatch
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  trackingId: true,
  createdAt: true,
  updatedAt: true,
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Users (for future Supabase integration)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: text("role").notNull().default("customer"), // customer, admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Cart Item Type (frontend only)
export const cartItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  price: z.string(),
  quantity: z.number().min(1),
  image: z.string(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Checkout Form Schema
export const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  deliveryAddress: z.string().min(10, "Address must be at least 10 characters"),
});

export type CheckoutForm = z.infer<typeof checkoutFormSchema>;

// Order Items (individual items in an order)
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  menuItemId: varchar("menu_item_id").notNull(),
  menuItemName: text("menu_item_name").notNull(),
  quantity: integer("quantity").notNull(),
  priceAtTime: decimal("price_at_time", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;

// Payment Information
export const paymentInfo = pgTable("payment_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().unique().references(() => orders.id, { onDelete: 'cascade' }),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSessionId: text("stripe_session_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("gbp"),
  status: text("status").notNull().default("pending"), // pending, succeeded, failed, refunded
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PaymentInfo = typeof paymentInfo.$inferSelect;

// Addresses (for future use - saved customer addresses)
export const addresses = pgTable("addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  label: text("label"), // "Home", "Work", etc.
  street: text("street").notNull(),
  city: text("city").notNull(),
  postcode: text("postcode").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;

// Admin Users (specific admin permissions)
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  permissions: text("permissions").array().notNull().default(sql`ARRAY['orders:read', 'orders:update', 'menu:read', 'menu:write']`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;

// Dispatch Audit Log
export const dispatchAudit = pgTable("dispatch_audit", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  adminId: varchar("admin_id").notNull().references(() => users.id),
  ubaRef: text("uba_ref").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DispatchAudit = typeof dispatchAudit.$inferSelect;

// Tracking Sequence (for generating unique tracking IDs)
export const trackingSequence = pgTable("tracking_sequence", {
  id: varchar("id").primaryKey().default('default'),
  date: text("date").notNull(), // YYYYMMDD format
  sequence: integer("sequence").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TrackingSequence = typeof trackingSequence.$inferSelect;
