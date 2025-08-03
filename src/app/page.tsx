"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const stats = [
  { name: "Strength", value: "10" },
  { name: "Dexterity", value: "10" },
  { name: "Constitution", value: "10" },
  { name: "Intelligence", value: "10" },
  { name: "Wisdom", value: "10" },
  { name: "Charisma", value: "10" },
];

export default function CharacterSheetPage() {
  const [characterName, setCharacterName] = useState("Aelar");
  const [characterClass, setCharacterClass] = useState("Ranger");
  const [characterLevel, setCharacterLevel] = useState("5");

  return (
    <div className="space-y-6">
       <header className="space-y-1.5">
          <h1 className="text-3xl font-bold font-headline">Character Sheet</h1>
          <p className="text-muted-foreground">Manage your character's stats, skills, and inventory.</p>
        </header>
        <Separator />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Character Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="char-name">Character Name</Label>
              <Input
                id="char-name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="char-class">Class</Label>
              <Input
                id="char-class"
                value={characterClass}
                onChange={(e) => setCharacterClass(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="char-level">Level</Label>
              <Input
                id="char-level"
                type="number"
                value={characterLevel}
                onChange={(e) => setCharacterLevel(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Combat Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ac" className="text-base">Armor Class</Label>
              <Input id="ac" type="number" defaultValue="15" className="w-20 text-center" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="hp" className="text-base">Hit Points</Label>
              <Input id="hp" type="number" defaultValue="42" className="w-20 text-center" />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="speed" className="text-base">Speed</Label>
              <Input id="speed" type="text" defaultValue="30ft" className="w-20 text-center" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ability Scores</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.name} className="space-y-2">
                <Label htmlFor={stat.name.toLowerCase()}>{stat.name}</Label>
                <Input
                  id={stat.name.toLowerCase()}
                  type="number"
                  defaultValue={stat.value}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              A list of items your character is carrying.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 text-center border-2 border-dashed rounded-lg border-border">
              <p className="text-muted-foreground">Inventory management coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
