import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { menuItems } from '../shared/schema';
import mockMenuData from '../data/mock-menu.json';

async function seedDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Please set it in your environment variables.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const db = drizzle(client);

    // Seed menu items
    console.log(`Seeding ${mockMenuData.length} menu items...`);
    
    for (const item of mockMenuData) {
      await db.insert(menuItems).values({
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        image: item.image,
        dietary: item.dietary || [],
        priceRangeLabel: item.priceRangeLabel,
        featured: item.featured || false,
        seasonal: item.seasonal || false,
        available: item.available !== undefined ? item.available : true,
      });
      console.log(`  ✓ ${item.name}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`   ${mockMenuData.length} menu items added`);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedDatabase();
