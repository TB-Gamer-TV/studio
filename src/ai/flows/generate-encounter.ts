// This file holds the Genkit flow for generating D\&D encounters.

'use server';

/**
 * @fileOverview Generates balanced D&D encounters appropriate to a desired level, including a description and stat blocks for each enemy.
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

const EnemyStatBlockSchema = z.object({
    name: z.string().describe('The name of the enemy.'),
    meta: z.string().describe("The enemy's size, type, and alignment (e.g., 'Medium humanoid, neutral evil')."),
    armorClass: z.string().describe("The enemy's Armor Class (AC)."),
    hitPoints: z.string().describe("The enemy's hit points, including the dice formula (e.g., '22 (5d8)')."),
    speed: z.string().describe("The enemy's speed (e.g., '30 ft., fly 60 ft.')."),
    abilityScores: z.string().describe("The enemy's ability scores in the format 'STR 10 (+0) DEX 12 (+1) CON 11 (+0) INT 8 (-1) WIS 11 (+0) CHA 9 (-1)')."),
    skills: z.string().optional().describe("The enemy's skill proficiencies (e.g., 'Perception +2, Stealth +4')."),
    senses: z.string().optional().describe("The enemy's senses (e.g., 'darkvision 60 ft., passive Perception 12')."),
    languages: z.string().optional().describe("The languages the enemy can speak."),
    challenge: z.string().describe("The enemy's Challenge Rating and XP (e.g., '1/4 (50 XP)')."),
    traits: z.string().optional().describe("Special traits or abilities the enemy has, formatted with markdown for titles (e.g., '**Keen Smell.** The wolf has advantage...')."),
    actions: z.string().describe("The actions the enemy can take, formatted with markdown for titles (e.g., '**Bite.** Melee Weapon Attack...')."),
    reactions: z.string().optional().describe("The reactions the enemy can take."),
    legendaryActions: z.string().optional().describe("The legendary actions the enemy can take.")
});

const GenerateEncounterOutputSchema = z.object({
  description: z.string().describe('A description of the encounter.'),
  enemies: z.array(EnemyStatBlockSchema).describe('An array of enemies in the encounter, each with their own structured stat block.')
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

Create a balanced and challenging encounter appropriate for the party's level, size and environment. Include a description of the encounter. For each enemy involved, create a structured stat block object and add it to the enemies array. The description should include enough detail for the DM to run the encounter. Ensure all fields in the stat block are filled out correctly based on D&D 5e rules.`,
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
