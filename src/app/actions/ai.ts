'use server';

import { prioritizeTasks, type PrioritizeTasksInput, type PrioritizeTasksOutput } from '@/ai/flows/ai-task-prioritization';

export async function runPrioritizeTasks(input: PrioritizeTasksInput): Promise<{success: boolean; data?: PrioritizeTasksOutput; error?: string;}> {
    try {
        const result = await prioritizeTasks(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("AI Prioritization Error:", error);
        return { success: false, error: 'An unexpected error occurred while prioritizing tasks.' };
    }
}
