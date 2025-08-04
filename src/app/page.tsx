
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, BookText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpellSlots, getSpellcastingInfo } from "@/components/spell-slots";
import { useLocalStorage } from "@/hooks/use-local-storage";


type Stat = {
  name: string;
  value: string;
};

const initialStats: Stat[] = [
  { name: "Strength", value: "10" },
  { name: "Dexterity", value: "10" },
  { name: "Constitution", value: "10" },
  { name: "Intelligence", value: "10" },
  { name: "Wisdom", value: "10" },
  { name: "Charisma", value: "10" },
];

const classes = [
  "Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", 
  "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"
];

const races = [
  "Dragonborn", "Dwarf", "Elf", "Gnome", "Half-Elf", 
  "Half-Orc", "Halfling", "Human", "Tiefling"
];

type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  description: string;
};

const initialInventory: InventoryItem[] = [
    { id: 1, name: "Longbow", quantity: 1, description: "1d8 piercing damage, range 150/600 ft." },
    { id: 2, name: "Arrows", quantity: 20, description: "" },
    { id: 3, name: "Rations", quantity: 5, description: "1 day of food." },
];

type Currency = {
  gp: string;
  sp: string;
  cp: string;
}

const initialCurrency: Currency = { gp: "50", sp: "25", cp: "10" };

export default function CharacterSheetPage() {
  const [characterName, setCharacterName] = useLocalStorage("characterName", "Aelar");
  const [characterClass, setCharacterClass] = useLocalStorage("characterClass", "Ranger");
  const [characterRace, setCharacterRace] = useLocalStorage("characterRace", "Human");
  const [characterLevel, setCharacterLevel] = useLocalStorage("characterLevel", "5");

  const [armorClass, setArmorClass] = useLocalStorage("armorClass", "15");
  const [hitPoints, setHitPoints] = useLocalStorage("hitPoints", "42");
  const [speed, setSpeed] = useLocalStorage("speed", "30ft");
  const [initiative, setInitiative] = useLocalStorage("initiative", "+2");
  const [stats, setStats] = useLocalStorage<Stat[]>('stats', initialStats);
  const [currency, setCurrency] = useLocalStorage<Currency>('currency', initialCurrency);
  
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>("inventory", initialInventory);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("1");
  const [newItemDescription, setNewItemDescription] = useState("");

  const handleStatChange = (statName: string, value: string) => {
    setStats(stats.map(stat => stat.name === statName ? { ...stat, value } : stat));
  }
  
  const handleCurrencyChange = (coin: keyof Currency, value: string) => {
    setCurrency(prev => ({...prev, [coin]: value}));
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      const quantity = parseInt(newItemQuantity, 10) || 1;
      const newItem: InventoryItem = {
        id: Date.now(),
        name: newItemName.trim(),
        quantity: quantity > 0 ? quantity : 1,
        description: newItemDescription.trim(),
      };
      setInventory([...inventory, newItem]);
      setNewItemName("");
      setNewItemQuantity("1");
      setNewItemDescription("");
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
  
  const handleItemDescriptionChange = (id: number, description: string) => {
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, description } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };
  
  const spellcastingInfo = getSpellcastingInfo(characterClass);


  return (
    <div className="space-y-6">
       <header className="space-y-1.5">
          <h1 className="text-3xl font-bold font-headline">Character Sheet</h1>
          <p className="text-muted-foreground">Manage your character's stats, skills, and inventory.</p>
        </header>
        <Separator />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="text-2xl font-semibold leading-none tracking-tight">Character Information</div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2 md:col-span-2 lg:col-span-2">
              <Label htmlFor="char-name">Character Name</Label>
              <Input
                id="char-name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="char-class">Class</Label>
               <Select value={characterClass} onValueChange={setCharacterClass}>
                <SelectTrigger id="char-class">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="char-race">Race</Label>
              <Select value={characterRace} onValueChange={setCharacterRace}>
                <SelectTrigger id="char-race">
                  <SelectValue placeholder="Select a race" />
                </SelectTrigger>
                <SelectContent>
                  {races.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
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
        
        <div className="grid grid-cols-1 gap-6 lg:col-span-4 lg:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Combat Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="ac">Armor Class</Label>
                    <Input id="ac" type="number" value={armorClass} onChange={(e) => setArmorClass(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hp">Hit Points</Label>
                    <Input id="hp" type="number" value={hitPoints} onChange={(e) => setHitPoints(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="speed">Speed</Label>
                    <Input id="speed" type="text" value={speed} onChange={(e) => setSpeed(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="initiative">Initiative</Label>
                    <Input id="initiative" type="text" value={initiative} onChange={(e) => setInitiative(e.target.value)} />
                </div>
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Currency</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                <Label htmlFor="gp">Gold</Label>
                <Input id="gp" type="number" value={currency.gp} onChange={(e) => handleCurrencyChange('gp', e.target.value)} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="sp">Silver</Label>
                <Input id="sp" type="number" value={currency.sp} onChange={(e) => handleCurrencyChange('sp', e.target.value)} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="cp">Copper</Label>
                <Input id="cp" type="number" value={currency.cp} onChange={(e) => handleCurrencyChange('cp', e.target.value)} />
                </div>
            </CardContent>
            </Card>
        </div>


        <div className={`grid grid-cols-1 gap-6 lg:col-span-4 ${spellcastingInfo.isCaster ? 'lg:grid-cols-2' : ''}`}>
            <Card className={spellcastingInfo.isCaster ? '' : 'lg:col-span-2'}>
              <CardHeader>
                <CardTitle>Ability Scores</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.name} className="space-y-2">
                    <Label htmlFor={stat.name.toLowerCase()}>{stat.name}</Label>
                    <Input
                      id={stat.name.toLowerCase()}
                      type="number"
                      value={stat.value}
                      onChange={(e) => handleStatChange(stat.name, e.target.value)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {spellcastingInfo.isCaster && (
                <SpellSlots 
                characterClass={characterClass}
                characterLevel={parseInt(characterLevel, 10) || 1}
                maxLevel={spellcastingInfo.maxSpellLevel}
                isWarlock={spellcastingInfo.isWarlock}
                />
            )}
        </div>
        
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              A list of items your character is carrying.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-4 sm:flex-row">
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
              </div>
               <Textarea
                  placeholder="Item description (optional)"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  rows={2}
                />
              <Button type="submit"><Plus className="mr-2"/>Add Item</Button>
            </form>

            <div className="overflow-hidden border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="w-[150px] text-center">Quantity</TableHead>
                            <TableHead className="w-[150px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">Your inventory is empty.</TableCell>
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
                                    <div className="flex items-center justify-end gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <BookText className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit: {item.name}</DialogTitle>
                                                </DialogHeader>
                                                <Textarea
                                                  defaultValue={item.description}
                                                  onChange={(e) => handleItemDescriptionChange(item.id, e.target.value)}
                                                  rows={5}
                                                  placeholder="Add a description for your item..."
                                                />
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button>Done</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </div>
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
