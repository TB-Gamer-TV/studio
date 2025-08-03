'use client';

import { useState } from 'react';
import { Dices, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const diceTypes = [4, 6, 8, 10, 12, 20, 100];

export function DiceRoller() {
  const [numberOfDice, setNumberOfDice] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [results, setResults] = useState<{ roll: string; total: number }[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = (sides: number) => {
    setIsRolling(true);
    setResults([]);

    setTimeout(() => {
      let total = 0;
      const rolls = [];
      for (let i = 0; i < numberOfDice; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
      }
      total += modifier;

      const rollString = `${numberOfDice}d${sides} + ${modifier}`;
      const newResult = { roll: rollString, total };
      
      setResults(prev => [newResult, ...prev].slice(0, 5));
      setIsRolling(false);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dice Roller</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="num-dice">Dice</Label>
                <Input
                  id="num-dice"
                  type="number"
                  value={numberOfDice}
                  onChange={(e) => setNumberOfDice(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-center"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modifier">Modifier</Label>
                <Input
                  id="modifier"
                  type="number"
                  value={modifier}
                  onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                  className="w-24 text-center"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {diceTypes.map((sides) => (
                <Button key={sides} onClick={() => rollDice(sides)} disabled={isRolling}>
                  d{sides}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-background">
            <div className="flex items-center justify-center w-48 h-48 rounded-full bg-secondary">
              {isRolling ? (
                <Dices className="w-24 h-24 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-center">
                  {results.length > 0 ? (
                     <>
                        <div key={results[0].total} className="text-6xl font-bold animate-in fade-in zoom-in-50">
                           {results[0].total}
                        </div>
                        <p className="text-sm text-muted-foreground">{results[0].roll}</p>
                     </>
                  ) : (
                    <Dices className="w-24 h-24 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>
             <div className="w-full mt-4 space-y-2">
                <h4 className="font-medium text-center">Recent Rolls</h4>
                <ul className="space-y-1 text-sm text-center text-muted-foreground">
                    {results.slice(1).map((r, i) => (
                        <li key={i}>{r.roll} = {r.total}</li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
