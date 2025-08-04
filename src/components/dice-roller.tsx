
'use client';

import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useState } from 'react';

const diceTypes = [4, 6, 8, 10, 12, 20, 100];

type RollResult = {
  roll: string;
  total: number;
  rollStatus: 'critical' | 'fumble' | 'normal';
};

export function DiceRoller() {
  const [numberOfDice, setNumberOfDice] = useLocalStorage('dice-numberOfDice', 1);
  const [modifier, setModifier] = useLocalStorage('dice-modifier', 0);
  const [results, setResults] = useLocalStorage<RollResult[]>('dice-results', []);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = (sides: number) => {
    setIsRolling(true);

    setTimeout(() => {
      let diceSum = 0;
      const rolls = [];
      for (let i = 0; i < numberOfDice; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        diceSum += roll;
      }
      const total = diceSum + modifier;

      let rollStatus: RollResult['rollStatus'] = 'normal';
      if (sides === 20) {
        if (diceSum === 1) {
            rollStatus = 'fumble';
        } else if (diceSum === 20) {
            rollStatus = 'critical';
        }
      }
      
      const rollString = `${numberOfDice}d${sides}${modifier > 0 ? ` + ${modifier}` : ''}`;
      const newResult: RollResult = { roll: rollString, total, rollStatus };
      
      setResults(prev => [newResult, ...prev].slice(0, 10));
      setIsRolling(false);
    }, 300);
  };

  const getResultColor = (status: RollResult['rollStatus']) => {
    if (status === 'critical') return 'text-green-500';
    if (status === 'fumble') return 'text-red-500';
    return 'text-foreground';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Dice Roller</CardTitle>
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
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-center w-48 h-48 rounded-full bg-background/50">
              {isRolling ? (
                <Dices className="w-24 h-24 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-center">
                  {results.length > 0 ? (
                     <>
                        <div key={results[0].total + results[0].roll} className={cn("text-6xl font-bold animate-in fade-in zoom-in-50", getResultColor(results[0].rollStatus))}>
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
                <ul className="h-24 overflow-y-auto text-sm text-center text-muted-foreground">
                    {results.slice(1).map((r, i) => (
                        <li key={i} className={getResultColor(r.rollStatus)}>{r.roll} = {r.total}</li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
