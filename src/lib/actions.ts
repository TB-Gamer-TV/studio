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


export async function handleGenerateEncounter(prevState: State | undefined, formData: FormData) : Promise<State> {
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
