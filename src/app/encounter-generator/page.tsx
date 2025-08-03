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

export default function EncounterGeneratorPage() {
  const [state, formAction] = useActionState(handleGenerateEncounter, undefined);

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
          {state?.data ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Encounter Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{state.data.description}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enemy Stat Blocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 overflow-x-auto rounded-md bg-secondary text-secondary-foreground font-code">
                    {state.data.encounterStats}
                  </pre>
                </CardContent>
              </Card>
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
