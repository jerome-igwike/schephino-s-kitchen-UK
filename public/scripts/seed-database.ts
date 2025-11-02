import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { menuItems } from '../shared/schema';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

interface CSVRow {
  Category: string;
  'Meal Name': string;
  'Price Range': string;
}

function parsePriceRange(priceRange: string): number {
  const match = priceRange.match(/£([\d.]+)/);
  if (match) {
    return parseFloat(match[1]);
  }
  return 50.00;
}

function getPriceRangeLabel(price: number): string {
  if (price < 50) return 'Low';
  if (price < 100) return 'Medium';
  return 'High';
}

function generateDescription(name: string, category: string): string {
  const descriptions: Record<string, string> = {
    'Soups': 'Authentic Nigerian soup prepared with fresh ingredients and traditional spices.',
    'Stews': 'Rich and flavorful stew made with premium ingredients.',
    'Sauces': 'Traditional Nigerian sauce bursting with authentic flavors.',
    'Rice dishes and Co': 'Delicious rice dish cooked to perfection with aromatic spices.',
    'Proteins and sides': 'Expertly seasoned protein dish with traditional Nigerian flavors.',
    'Extras': 'Essential ingredients to complement your meal.',
    'Fish platter': 'Fresh fish prepared in traditional Nigerian style.',
    'Party pick up menu': 'Party-sized portion perfect for celebrations and gatherings.',
    'Chop life boxes': 'Complete meal box featuring our signature dishes.',
    'Party packs': 'Convenient party pack with generous portions for your events.'
  };

  const baseDesc = descriptions[category] || 'Authentic Nigerian dish prepared with care and tradition.';
  
  if (name.toLowerCase().includes('jollof')) {
    return 'Our signature smokey jollof rice, cooked with the perfect blend of tomatoes, peppers, and spices.';
  }
  if (name.toLowerCase().includes('egusi')) {
    return 'Traditional egusi soup made with ground melon seeds, vegetables, and choice proteins.';
  }
  if (name.toLowerCase().includes('efo riro')) {
    return 'Classic Nigerian vegetable soup with a rich blend of spinach, peppers, and assorted meats.';
  }
  if (name.toLowerCase().includes('suya')) {
    return 'Grilled meat seasoned with our special suya spice blend, a Nigerian street food favorite.';
  }
  if (name.toLowerCase().includes('asun')) {
    return 'Spicy grilled goat meat delicacy, a Lagos favorite bursting with flavor.';
  }
  if (name.toLowerCase().includes('moi moi')) {
    return 'Steamed bean pudding, soft and flavorful, a beloved Nigerian classic.';
  }
  if (name.toLowerCase().includes('ofada')) {
    return 'Unpolished rice served with special ofada sauce, a southwestern Nigerian specialty.';
  }
  if (name.toLowerCase().includes('ayamase')) {
    return 'Designer stew with green peppers and assorted meats, a Lagos delicacy.';
  }
  if (name.toLowerCase().includes('okra')) {
    return 'Draw soup made with fresh okra and seafood, rich in flavor and nutrients.';
  }
  if (name.toLowerCase().includes('ogbono')) {
    return 'Traditional soup made with ground ogbono seeds, creating a unique draw soup.';
  }
  if (name.toLowerCase().includes('pepper soup')) {
    return 'Light and spicy soup infused with aromatic herbs and spices.';
  }
  if (name.toLowerCase().includes('fried rice')) {
    return 'Colorful Nigerian-style fried rice with mixed vegetables and seasonings.';
  }
  if (name.toLowerCase().includes('beans')) {
    return 'Hearty beans porridge cooked with palm oil and traditional spices.';
  }
  
  return baseDesc;
}

function generateImagePath(name: string, category: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `/images/menu/${slug}.jpg`;
}

async function seedDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Please set it in your environment variables.');
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL);

  try {
    console.log('Connected to database');

    const db = drizzle(client);

    const csvPath = path.join(import.meta.dirname, '..', 'menu.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CSVRow[];

    console.log(`\n🍽️  Seeding ${records.length} authentic Nigerian dishes...\n`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const record of records) {
      try {
        const price = parsePriceRange(record['Price Range']);
        const priceRangeLabel = getPriceRangeLabel(price);
        const name = record['Meal Name'];
        const category = record['Category'];
        
        await db.insert(menuItems).values({
          name: name,
          description: generateDescription(name, category),
          category: category,
          price: price.toString(),
          image: generateImagePath(name, category),
          dietary: [],
          priceRangeLabel: priceRangeLabel,
          featured: false,
          seasonal: false,
          available: true,
        });
        
        console.log(`  ✓ ${name} (${category} - £${price})`);
        successCount++;
      } catch (error) {
        console.error(`  ✗ Failed to add: ${record['Meal Name']}`, error);
        errorCount++;
      }
    }

    console.log('\n✅ Database seeding complete!');
    console.log(`   ${successCount} dishes added successfully`);
    if (errorCount > 0) {
      console.log(`   ${errorCount} dishes failed`);
    }

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedDatabase();
