import { supabase } from '../supabaseClient';
import type { Category } from '../../types/database';

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data as Category[];
}