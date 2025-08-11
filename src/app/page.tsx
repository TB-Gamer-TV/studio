
'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, User, WandSparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Define the structure for a single character
export type Character = {
  id: string;
  name: string;
  race: string;
  class: string;
  level: string;
  armorClass: string;
  hitPoints: string;
  speed: string;
  initiative: string;
  stats: { name: string; value: string }[];
  currency: { gp: string; sp: string; cp: string };
  inventory: { id: number; name: string; quantity: number; description: string }[];
};

// Define the default stats for a new character
const initialStats = [
  { name: 'Strength', value: '10' },
  { name: 'Dexterity', value: '10' },
  { name: 'Constitution', value: '10' },
  { name: 'Intelligence', value: '10' },
  { name: 'Wisdom', value: '10' },
  { name: 'Charisma', value: '10' },
];

// Define the default empty inventory
const initialInventory: Character['inventory'] = [];

// Define the default starting currency
const initialCurrency: Character['currency'] = { gp: '0', sp: '0', cp: '0' };


export default function CharacterListPage() {
  const [characters, setCharacters] = useLocalStorage<Character[]>('characters', []);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCharacter = () => {
    if (newCharacterName.trim()) {
      const newCharacter: Character = {
        id: Date.now().toString(),
        name: newCharacterName,
        race: 'Human',
        class: 'Fighter',
        level: '1',
        armorClass: '10',
        hitPoints: '10',
        speed: '30ft',
        initiative: '+0',
        stats: initialStats,
        currency: initialCurrency,
        inventory: initialInventory,
      };
      setCharacters([...characters, newCharacter]);
      setNewCharacterName('');
      setIsDialogOpen(false);
    }
  };

  const handleRemoveCharacter = (id: string) => {
    setCharacters(characters.filter((char) => char.id !== id));
  };
  

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className='space-y-1.5'>
            <h1 className="text-3xl font-bold font-headline">Your Characters</h1>
            <p className="text-muted-foreground">Manage your party of adventurers.</p>
        </div>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2" />
                    Create New Character
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Character</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="new-char-name">Character Name</Label>
                    <Input
                        id="new-char-name"
                        value={newCharacterName}
                        onChange={(e) => setNewCharacterName(e.target.value)}
                        placeholder="e.g., Elara Moonwhisper"
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button onClick={handleAddCharacter}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </header>
      <Separator />

       {characters.length === 0 ? (
            <Card className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <CardContent className='text-center'>
                    <User className="w-16 h-16 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">You haven't created any characters yet.</p>
                    <p className="mt-2 text-sm text-muted-foreground">Click "Create New Character" to get started.</p>
                </CardContent>
            </Card>
        ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {characters.map((char) => (
                <Card key={char.id} className="flex flex-col">
                    <CardHeader className="flex-grow">
                        <CardTitle className="flex items-center justify-between">
                            <span>{char.name}</span>
                             <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleRemoveCharacter(char.id)}>
                                <Trash2 className="w-4 h-4 text-muted-foreground" />
                            </Button>
                        </CardTitle>
                        <CardDescription>{`Lvl ${char.level} ${char.race} ${char.class}`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/character/${char.id}`} className='w-full'>
                            <Button className="w-full">View Sheet</Button>
                        </Link>
                    </CardContent>
                </Card>
                ))}
            </div>
        )}
    </div>
  );
}
