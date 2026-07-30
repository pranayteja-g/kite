import { supabase } from '../supabaseClient';
import type { GoalContribution } from '../../types/database';

export async function fetchGoalContributions(goalId: string): Promise<GoalContribution[]> {
  const { data, error } = await supabase
    .from('goal_contributions')
    .select('*')
    .eq('goal_id', goalId)
    .order('contributed_at', { ascending: false });
  if (error) throw error;
  return data as GoalContribution[];
}

export interface CreateContributionInput {
  goal_id: string;
  amount: number;
  contributed_at: string;
  notes?: string;
}

export async function createGoalContribution(input: CreateContributionInput): Promise<GoalContribution> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('goal_contributions')
    .insert({ ...input, user_id: userData.user.id })
    .select()
    .single();
  if (error) throw error;
  return data as GoalContribution;
}

export async function deleteGoalContribution(id: string): Promise<void> {
  const { error } = await supabase.from('goal_contributions').delete().eq('id', id);
  if (error) throw error;
}