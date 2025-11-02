import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  console.warn('SUPABASE_URL not set. Supabase features will be disabled.');
}

if (!process.env.SUPABASE_KEY) {
  console.warn('SUPABASE_KEY not set. Supabase features will be disabled.');
}

export const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_KEY environment variables.');
  }
  return supabase;
}
