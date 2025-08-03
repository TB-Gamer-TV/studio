// This file holds the Genkit flow for generating D\&D encounters.

'use server';

/**
 * @fileOverview Generates balanced D&D encounters appropriate to a desired level, including a description and stat blocks.
 *
 * - generateEncounter - A function that generates a D\&D encounter.
 * - GenerateEncounterInput - The input type for the generateEncounter function.
 * - GenerateEncounterOutput - The return type for the generateEncounter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEncounterInputSchema = z.object({
  level: z.number().describe('The level of the party.'),
  environment: z.string().describe('The environment the encounter takes place in.'),
  partySize: z.number().describe('The size of the adventuring party')
});
export type GenerateEncounterInput = z.infer<typeof GenerateEncounterInputSchema>;

const GenerateEncounterOutputSchema = z.object({
  description: z.string().describe('A description of the encounter.'),
  encounterStats: z.string().describe('The encounter stats, including the enemies and their stats')
});
export type GenerateEncounterOutput = z.infer<typeof GenerateEncounterOutputSchema>;

export async function generateEncounter(input: GenerateEncounterInput): Promise<GenerateEncounterOutput> {
  return generateEncounterFlow(input);
}

const generateEncounterPrompt = ai.definePrompt({
  name: 'generateEncounterPrompt',
  input: {schema: GenerateEncounterInputSchema},
  output: {schema: GenerateEncounterOutputSchema},
  prompt: `You are a Dungeon Master with 20 years of experience. You are creating a D&D encounter for a party of level {{{level}}} characters. The party size is {{{partySize}}}. The environment is {{{environment}}}.

Create a balanced and challenging encounter appropriate for the party's level, size and environment. Include a description of the encounter, as well as the stat blocks for the enemies involved. The description should include enough detail for the DM to run the encounter.`,
});

const generateEncounterFlow = ai.defineFlow(
  {
    name: 'generateEncounterFlow',
    inputSchema: GenerateEncounterInputSchema,
    outputSchema: GenerateEncounterOutputSchema,
  },
  async input => {
    const {output} = await generateEncounterPrompt(input);
    return output!;
  }
);
