import { supabase } from '../supabaseClient';
import type { Goal, GoalPriority } from '../../types/database';

export async function fetchGoals(): Promise<Goal[]> {
    const { data, error } = await supabase.from('goals').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Goal[];
}

export interface CreateGoalInput {
    name: string;
    target_amount: number;
    deadline?: string;
    priority: GoalPriority;
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');
    const { data, error } = await supabase
        .from('goals')
        .insert({ ...input, user_id: userData.user.id })
        .select()
        .single();
    if (error) throw error;
    return data as Goal;
}

export async function deleteGoal(id: string): Promise<void> {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) throw error;
}