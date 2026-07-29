import { supabase } from '../supabaseClient';

export interface Profile {
  id: string;
  full_name: string | null;
  default_currency: string;
  created_at: string;
}

export async function fetchProfile(): Promise<Profile> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(input: Partial<Pick<Profile, 'full_name' | 'default_currency'>>): Promise<Profile> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(input)
    .eq('id', userData.user.id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}