'use server';

import { config } from 'dotenv';
config();

import { generateEncounter } from '@/ai/flows/generate-encounter';
import { z } from 'zod';

const encounterSchema = z.object({
  level: z.coerce.number().min(1, "Level must be at least 1.").max(20, "Level cannot be more than 20."),
  partySize: z.coerce.number().min(1, "Party size must be at least 1.").max(10, "Party size cannot be more than 10."),
  environment: z.string().min(3, "Environment must be at least 3 characters long.").max(50, "Environment cannot be more than 50 characters."),
});

type State = {
    data?: {
        description: string;
        encounterStats: string;
    };
    errors?: {
        level?: string[];
        partySize?: string[];
        environment?: string[];
        _form?: string[];
    };
}

const sampleEncounter = {
  description: "As you venture deeper into the Whispering Woods, the air grows cold and a thick fog swirls around your feet. Ahead, you spot a clearing where three goblins are huddled around a crackling campfire, sharpening their crude weapons. They haven't seen you yet.",
  encounterStats: `
Goblin
Small humanoid (goblinoid), neutral evil

Armor Class 15 (leather armor, shield)
Hit Points 7 (2d6)
Speed 30 ft.

STR 8 (-1) DEX 14 (+2) CON 10 (+0) INT 10 (+0) WIS 8 (-1) CHA 8 (-1)

Skills: Stealth +6
Senses: passive Perception 9
Languages: Common, Goblin
Challenge: 1/4 (50 XP)

Nimble Escape. The goblin can take the Disengage or Hide action as a bonus action on each of its turns.

Actions
Scimitar. Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.
Shortbow. Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.
`
}

export async function handleGenerateEncounter(prevState: State | undefined, formData: FormData) : Promise<State> {
  // If no API key is present, return a sample encounter.
  if (!process.env.GEMINI_API_KEY) {
    // Add a small delay to simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: {
      description: sampleEncounter.description,
      encounterStats: sampleEncounter.encounterStats.repeat(3)
    }};
  }

  const rawFormData = {
    level: formData.get('level'),
    partySize: formData.get('partySize'),
    environment: formData.get('environment'),
  };

  const validation = encounterSchema.safeParse(rawFormData);
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateEncounter(validation.data);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { errors: { _form: ["An unexpected error occurred while generating the encounter. Please try again."] } };
  }
}
