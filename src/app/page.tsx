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
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const stats = [
  { name: "Strength", value: "10" },
  { name: "Dexterity", value: "10" },
  { name: "Constitution", value: "10" },
  { name: "Intelligence", value: "10" },
  { name: "Wisdom", value: "10" },
  { name: "Charisma", value: "10" },
];

type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
};

export default function CharacterSheetPage() {
  const [characterName, setCharacterName] = useState("Aelar");
  const [characterClass, setCharacterClass] = useState("Ranger");
  const [characterLevel, setCharacterLevel] = useState("5");
  
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "Longbow", quantity: 1 },
    { id: 2, name: "Arrows", quantity: 20 },
    { id: 3, name: "Rations", quantity: 5 },
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("1");


  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      const quantity = parseInt(newItemQuantity, 10) || 1;
      const newItem: InventoryItem = {
        id: Date.now(),
        name: newItemName.trim(),
        quantity: quantity > 0 ? quantity : 1,
      };
      setInventory([...inventory, newItem]);
      setNewItemName("");
      setNewItemQuantity("1");
    }
  };

  const handleItemQuantityChange = (id: number, amount: number) => {
    setInventory(
      inventory
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + amount) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };


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
            <div className="flex items-center justify-between">
              <Label htmlFor="initiative" className="text-base">Initiative</Label>
              <Input id="initiative" type="number" defaultValue="+2" className="w-20 text-center" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="flex items-center justify-between gap-2">
              <Label htmlFor="gp">Gold</Label>
              <Input id="gp" type="number" defaultValue="50" className="w-24" />
            </div>
             <div className="flex items-center justify-between gap-2">
              <Label htmlFor="sp">Silver</Label>
              <Input id="sp" type="number" defaultValue="25" className="w-24" />
            </div>
             <div className="flex items-center justify-between gap-2">
              <Label htmlFor="cp">Copper</Label>
              <Input id="cp" type="number" defaultValue="10" className="w-24" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ability Scores</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4">
            {stats.slice(0, 2).map((stat) => (
              <div key={stat.name} className="space-y-2">
                <Label htmlFor={stat.name.toLowerCase()}>{stat.name}</Label>
                <Input
                  id={stat.name.toLowerCase()}
                  type="number"
                  defaultValue={stat.value}
                />
              </div>
            ))}
             {stats.slice(2, 4).map((stat) => (
              <div key={stat.name} className="space-y-2">
                <Label htmlFor={stat.name.toLowerCase()}>{stat.name}</Label>
                <Input
                  id={stat.name.toLowerCase()}
                  type="number"
                  defaultValue={stat.value}
                />
              </div>
            ))}
             {stats.slice(4, 6).map((stat) => (
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
            <form onSubmit={handleAddItem} className="flex flex-col gap-4 mb-6 sm:flex-row">
              <Input
                placeholder="Item Name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-grow"
              />
              <Input
                type="number"
                placeholder="Qty"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                className="w-24"
              />
              <Button type="submit"><Plus className="mr-2"/>Add Item</Button>
            </form>

            <div className="overflow-hidden border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="w-[150px] text-center">Quantity</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">Your inventory is empty.</TableCell>
                            </TableRow>
                        ) : (
                        inventory.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button variant="outline" size="icon" className="w-6 h-6" onClick={() => handleItemQuantityChange(item.id, -1)}><Minus/></Button>
                                        <span>{item.quantity}</span>
                                        <Button variant="outline" size="icon" className="w-6 h-6" onClick={() => handleItemQuantityChange(item.id, 1)}><Plus/></Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
