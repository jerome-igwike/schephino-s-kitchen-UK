import type { MenuItem, Order, User, InsertMenuItem, InsertOrder, InsertUser } from "@shared/schema";

export interface IStorage {
  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;
  bulkCreateMenuItems(items: InsertMenuItem[]): Promise<MenuItem[]>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrderByTrackingId(trackingId: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Users
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<string, MenuItem> = new Map();
  private orders: Map<string, Order> = new Map();
  private users: Map<string, User> = new Map();
  private trackingIdMap: Map<string, string> = new Map(); // trackingId -> orderId

  constructor() {
    this.initializeMockData();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateTrackingId(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segments = [3, 3, 3];
    const parts = segments.map((length) =>
      Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    );
    return `TRK-${parts.join("")}`;
  }

  private async initializeMockData() {
    // Load mock menu from JSON
    const mockMenuRaw = await import("../data/mock-menu.json");
    const mockMenu = mockMenuRaw.default || mockMenuRaw;
    
    mockMenu.forEach((item: any) => {
      const menuItem: MenuItem = {
        ...item,
        id: item.id || this.generateId(),
        dietary: item.dietary || [],
      };
      this.menuItems.set(menuItem.id, menuItem);
    });
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter((item) => item.available);
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.generateId();
    const menuItem: MenuItem = {
      ...item,
      id,
      dietary: item.dietary || [],
      featured: item.featured || false,
      seasonal: item.seasonal || false,
      available: item.available !== undefined ? item.available : true,
    };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const existing = this.menuItems.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async bulkCreateMenuItems(items: InsertMenuItem[]): Promise<MenuItem[]> {
    const created = await Promise.all(items.map((item) => this.createMenuItem(item)));
    return created;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByTrackingId(trackingId: string): Promise<Order | undefined> {
    const orderId = this.trackingIdMap.get(trackingId);
    if (!orderId) return undefined;
    return this.orders.get(orderId);
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.generateId();
    const trackingId = this.generateTrackingId();
    const now = new Date();
    
    const order: Order = {
      ...orderData,
      id,
      trackingId,
      status: orderData.status || "pending",
      paymentStatus: orderData.paymentStatus || "pending",
      createdAt: now,
      updatedAt: now,
    };
    
    this.orders.set(id, order);
    this.trackingIdMap.set(trackingId, id);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const existing = this.orders.get(id);
    if (!existing) return undefined;
    
    const updated: Order = {
      ...existing,
      status,
      updatedAt: new Date(),
    };
    
    this.orders.set(id, updated);
    return updated;
  }

  // Users
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.generateId();
    const user: User = {
      ...userData,
      id,
      role: userData.role || "customer",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
