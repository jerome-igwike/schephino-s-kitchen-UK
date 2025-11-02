import type { IStorage } from './storage';
import { MemStorage } from './storage';

export async function initStorage(): Promise<IStorage> {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (DATABASE_URL) {
    console.log('Initializing database storage with PostgreSQL');
    const { DbStorage } = await import('./db-storage');
    return new DbStorage(DATABASE_URL);
  } else {
    console.log('DATABASE_URL not set - using in-memory storage (development mode)');
    return new MemStorage();
  }
}
