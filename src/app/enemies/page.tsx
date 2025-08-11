
'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus, Minus, Trash2, Heart, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

type Enemy = {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
};

const initialEnemies: Enemy[] = [
  { id: 1, name: 'Goblin Grunt', hp: 7, maxHp: 7 },
  { id: 2, name: 'Orc War Chief', hp: 45, maxHp: 45 },
  { id: 3, name: 'Dire Wolf', hp: 22, maxHp: 22 },
];

export default function EnemyTrackerPage() {
  const [enemies, setEnemies] = useLocalStorage<Enemy[]>('enemies', initialEnemies);
  const [newEnemyName, setNewEnemyName] = useState('');
  const [newEnemyHp, setNewEnemyHp] = useState('');
  const [damageValues, setDamageValues] = useState<Record<number, string>>({});

  const handleAddEnemy = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEnemyName.trim() && newEnemyHp) {
      const hp = parseInt(newEnemyHp);
      const newEnemy: Enemy = {
        id: Date.now(),
        name: newEnemyName,
        hp: hp,
        maxHp: hp,
      };
      setEnemies([...enemies, newEnemy]);
      setNewEnemyName('');
      setNewEnemyHp('');
    }
  };

  const handleHpChange = (id: number, amount: number) => {
    setEnemies(
      enemies.map((enemy) =>
        enemy.id === id ? { ...enemy, hp: Math.max(0, enemy.hp + amount) } : enemy
      )
    );
  };
  
  const handleBulkHpChange = (id: number, operation: 'damage' | 'heal') => {
    const amount = parseInt(damageValues[id] || '0', 10);
    if (isNaN(amount) || amount <= 0) return;

    const change = operation === 'damage' ? -amount : amount;
    handleHpChange(id, change);
  };

  const handleRemoveEnemy = (id: number) => {
    setEnemies(enemies.filter((enemy) => enemy.id !== id));
  };
  
  const handleDamageValueChange = (id: number, value: string) => {
    setDamageValues(prev => ({...prev, [id]: value}));
  }

  return (
    <div className="space-y-6">
        <header className="space-y-1.5">
          <h1 className="text-3xl font-bold font-headline">Enemy HP Tracker</h1>
          <p className="text-muted-foreground">Keep track of your foes' health during combat.</p>
        </header>
        <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Add New Enemy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddEnemy} className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Enemy Name"
              value={newEnemyName}
              onChange={(e) => setNewEnemyName(e.target.value)}
              className="flex-grow"
            />
            <Input
              type="number"
              placeholder="Max HP"
              value={newEnemyHp}
              onChange={(e) => setNewEnemyHp(e.target.value)}
              className="sm:w-32"
            />
            <Button type="submit">
              <Plus className="mr-2" /> Add Enemy
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enemies.map((enemy) => (
          <Card key={enemy.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{enemy.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveEnemy(enemy.id)}>
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleHpChange(enemy.id, -1)}>
                    <Minus />
                  </Button>
                  <div className="flex-grow text-center">
                    <p key={enemy.hp} className="text-3xl font-bold animate-in fade-in-0">
                      {enemy.hp}
                    </p>
                    <p className="text-xs text-muted-foreground">/ {enemy.maxHp} HP</p>
                  </div>
                  <Button size="icon" variant="outline" onClick={() => handleHpChange(enemy.id, 1)}>
                    <Plus />
                  </Button>
                </div>
                <Progress value={(enemy.hp / enemy.maxHp) * 100} />
                 <div className="flex flex-wrap items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Amount"
                        className="h-9 text-center flex-grow min-w-[60px]"
                        value={damageValues[enemy.id] || ''}
                        onChange={(e) => handleDamageValueChange(enemy.id, e.target.value)}
                    />
                    <div className="flex-grow flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleBulkHpChange(enemy.id, 'damage')}>
                          <Shield className="mr-1 h-4 w-4"/> Damage
                      </Button>
                       <Button variant="outline" size="sm" className="flex-1" onClick={() => handleBulkHpChange(enemy.id, 'heal')}>
                          <Heart className="mr-1 h-4 w-4"/> Heal
                      </Button>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
