import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { MenuItem, Order, User, InsertMenuItem, InsertOrder, InsertUser } from '@shared/schema';
import { menuItems, orders, users, trackingSequence } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';
import { DatabaseTrackingIdGenerator } from './utils/tracking-id';
import type { IStorage } from './storage';

export class DbStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private trackingIdGenerator: DatabaseTrackingIdGenerator;

  constructor(connectionString: string) {
    const client = postgres(connectionString);
    this.db = drizzle(client);
    this.trackingIdGenerator = new DatabaseTrackingIdGenerator(this.db);
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return await this.db
      .select()
      .from(menuItems)
      .where(eq(menuItems.available, true));
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    const results = await this.db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id))
      .limit(1);
    return results[0];
  }

  async getMenuItemByName(name: string): Promise<MenuItem | undefined> {
    const results = await this.db
      .select()
      .from(menuItems)
      .where(sql`LOWER(${menuItems.name}) = LOWER(${name})`)
      .limit(1);
    return results[0];
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const results = await this.db
      .insert(menuItems)
      .values(item)
      .returning();
    return results[0];
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const results = await this.db
      .update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, id))
      .returning();
    return results[0];
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const results = await this.db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning();
    return results.length > 0;
  }

  async bulkCreateMenuItems(items: InsertMenuItem[]): Promise<MenuItem[]> {
    return await this.db
      .insert(menuItems)
      .values(items)
      .returning();
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await this.db
      .select()
      .from(orders)
      .orderBy(sql`${orders.createdAt} DESC`);
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const results = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    return results[0];
  }

  async getOrderByTrackingId(trackingId: string): Promise<Order | undefined> {
    const results = await this.db
      .select()
      .from(orders)
      .where(eq(orders.trackingId, trackingId))
      .limit(1);
    return results[0];
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const trackingId = await this.trackingIdGenerator.generate();
    
    const results = await this.db
      .insert(orders)
      .values({
        ...orderData,
        trackingId,
      })
      .returning();
    
    return results[0];
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const results = await this.db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return results[0];
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const results = await this.db
      .update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return results[0];
  }

  // Dispatch Audit
  async createDispatchAudit(data: {
    orderId: string;
    adminId: string;
    ubaRef: string;
    notes: string | null;
  }): Promise<void> {
    // Import dispatchAudit here to avoid circular dependency
    const { dispatchAudit } = await import('@shared/schema');
    await this.db
      .insert(dispatchAudit)
      .values(data);
  }

  // Users
  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return results[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const results = await this.db
      .insert(users)
      .values(userData)
      .returning();
    return results[0];
  }
}

// DbStorage is exported and used via dynamic import in init-storage.ts
