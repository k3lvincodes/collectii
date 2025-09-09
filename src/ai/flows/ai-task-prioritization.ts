'use server';

/**
 * @fileOverview An AI task prioritization agent.
 *
 * - prioritizeTasks - A function that prioritizes tasks based on deadlines, dependencies, and team member availability.
 * - PrioritizeTasksInput - The input type for the prioritizeTasks function.
 * - PrioritizeTasksOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskSchema = z.object({
  id: z.string().describe('The unique identifier of the task.'),
  name: z.string().describe('The name or title of the task.'),
  deadline: z.string().describe('The deadline of the task in ISO format (YYYY-MM-DD).'),
  dependencies: z.array(z.string()).describe('An array of task IDs that this task depends on.'),
  assignee: z.string().describe('The ID of the team member assigned to the task.'),
  priority: z.enum(['high', 'medium', 'low']).describe('The current priority of the task.'),
  status: z.enum(['open', 'in progress', 'completed']).describe('The current status of the task.'),
  estimatedHours: z.number().describe('Estimated time in hours to complete the task'),
});

const TeamMemberSchema = z.object({
  id: z.string().describe('The unique identifier of the team member.'),
  availability: z.number().describe('The availability of the team member in hours per day.'),
});

const PrioritizeTasksInputSchema = z.object({
  tasks: z.array(TaskSchema).describe('An array of tasks to prioritize.'),
  teamMembers: z.array(TeamMemberSchema).describe('An array of team members and their availability.'),
});
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizeTasksOutputSchema = z.array(TaskSchema.extend({newPriority: z.enum(['high', 'medium', 'low']).describe('AI suggested new priority of the task.')}));
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

export async function prioritizeTasks(input: PrioritizeTasksInput): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are an AI task prioritization expert. Given a list of tasks with their deadlines, dependencies, assignees, and team member availability, determine the optimal priority for each task to ensure timely completion and efficient resource allocation.

Tasks:
{{#each tasks}}
- ID: {{this.id}}
  Name: {{this.name}}
  Deadline: {{this.deadline}}
  Dependencies: {{this.dependencies}}
  Assignee: {{this.assignee}}
  Priority: {{this.priority}}
  Status: {{this.status}}
  Estimated Hours: {{this.estimatedHours}}
{{/each}}

Team Members:
{{#each teamMembers}}
- ID: {{this.id}}
  Availability: {{this.availability}} hours/day
{{/each}}

Based on the above information, re-prioritize the tasks considering deadlines, dependencies, and team member availability. Return the tasks with a suggested newPriority field. Use "high", "medium", or "low" for the newPriority.

Output: An array of tasks with updated newPriority field. Retain all original information about each task.
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
