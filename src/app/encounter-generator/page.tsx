
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { handleGenerateEncounter } from '@/lib/actions';
import { Loader2, WandSparkles } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { GenerateEncounterOutput } from '@/ai/flows/generate-encounter';
import { useEffect } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="mr-2 animate-spin" />
      ) : (
        <WandSparkles className="mr-2" />
      )}
      Generate Encounter
    </Button>
  );
}

// Helper to render sections with bold titles from markdown-like text
const StatBlockSection = ({ title, content }: { title: string; content?: string }) => {
  if (!content) return null;

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="italic">{part.slice(2, -2)} </strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-1">
      <h4 className="font-bold text-lg font-headline border-b-2 border-primary/50 pb-1 mb-2">{title}</h4>
      {content.split('\n').filter(line => line.trim()).map((line, index) => (
         <p key={index} className="text-sm">{renderContent(line)}</p>
      ))}
    </div>
  );
};


export default function EncounterGeneratorPage() {
  const [storedEncounter, setStoredEncounter] = useLocalStorage<GenerateEncounterOutput | null>('encounter-generator-data', null);
  const [state, formAction] = useActionState(handleGenerateEncounter, undefined);

  useEffect(() => {
    if (state?.data) {
      setStoredEncounter(state.data);
    }
  }, [state?.data, setStoredEncounter]);
  
  const encounterData = state?.data ?? storedEncounter;


  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-bold font-headline">Encounter Generator</h1>
        <p className="text-muted-foreground">
          Create a balanced D&D encounter with an AI-powered Dungeon Master.
        </p>
      </header>
      <Separator />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <form action={formAction}>
              <CardHeader>
                <CardTitle>Encounter Parameters</CardTitle>
                <CardDescription>
                  Tell the DM about the party to generate a fitting challenge.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partySize">Party Size</Label>
                  <Input id="partySize" name="partySize" type="number" defaultValue="4" />
                  {state?.errors?.partySize && <p className="text-sm text-destructive">{state.errors.partySize[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Average Party Level</Label>
                  <Input id="level" name="level" type="number" defaultValue="5" />
                  {state?.errors?.level && <p className="text-sm text-destructive">{state.errors.level[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Input id="environment" name="environment" placeholder="e.g., Dark Forest, Icy Cave" />
                  {state?.errors?.environment && <p className="text-sm text-destructive">{state.errors.environment[0]}</p>}
                </div>
              </CardContent>
              <CardFooter className='flex-col'>
                <SubmitButton />
                 {state?.errors?._form && <p className="mt-2 text-sm text-destructive">{state.errors._form[0]}</p>}
              </CardFooter>
            </form>
          </Card>
        </div>
        <div className="space-y-6 lg:col-span-2">
          {encounterData ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Encounter Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{encounterData.description}</p>
                </CardContent>
              </Card>
              <div className='space-y-6'>
                <h2 className="text-2xl font-bold font-headline">Enemy Stat Blocks</h2>
                {encounterData.enemies.map((enemy, index) => (
                    <Card key={index} className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline">{enemy.name}</CardTitle>
                            <p className="text-sm italic text-muted-foreground">{enemy.meta}</p>
                        </CardHeader>
                        <CardContent className="space-y-4 font-code">
                            <div className='grid grid-cols-3 gap-y-2 text-center border-y-2 border-primary/50 py-2'>
                                <div><span className='font-bold text-sm block font-headline'>Armor Class</span> {enemy.armorClass}</div>
                                <div><span className='font-bold text-sm block font-headline'>Hit Points</span> {enemy.hitPoints}</div>
                                <div><span className='font-bold text-sm block font-headline'>Speed</span> {enemy.speed}</div>
                            </div>

                            <div className="text-center border-b-2 border-primary/50 py-2">
                                <p className="text-sm">{enemy.abilityScores}</p>
                            </div>
                            
                             <div className="space-y-2 text-sm">
                                {enemy.skills && <p><strong className="font-headline">Skills:</strong> {enemy.skills}</p>}
                                {enemy.senses && <p><strong className="font-headline">Senses:</strong> {enemy.senses}</p>}
                                {enemy.languages && <p><strong className="font-headline">Languages:</strong> {enemy.languages}</p>}
                                <p><strong className="font-headline">Challenge:</strong> {enemy.challenge}</p>
                             </div>

                             <Separator className="bg-primary/50" />

                            <StatBlockSection title="Traits" content={enemy.traits} />
                            <StatBlockSection title="Actions" content={enemy.actions} />
                            <StatBlockSection title="Reactions" content={enemy.reactions} />
                            <StatBlockSection title="Legendary Actions" content={enemy.legendaryActions} />

                        </CardContent>
                    </Card>
                ))}
              </div>
            </>
          ) : (
            <Card className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <CardContent className='text-center'>
                    <WandSparkles className="w-16 h-16 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Your generated encounter will appear here.</p>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
