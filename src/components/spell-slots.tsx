
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SPELLCASTING_CLASSES: Record<string, { maxSpellLevel: number; isWarlock?: boolean }> = {
  Bard: { maxSpellLevel: 9 },
  Cleric: { maxSpellLevel: 9 },
  Druid: { maxSpellLevel: 9 },
  Paladin: { maxSpellLevel: 5 },
  Ranger: { maxSpellLevel: 5 },
  Sorcerer: { maxSpellLevel: 9 },
  Warlock: { maxSpellLevel: 5, isWarlock: true },
  Wizard: { maxSpellLevel: 9 },
  // Third-casters like Eldritch Knight or Arcane Trickster would have max level 4
  // For simplicity, we are not handling subclasses here.
};

export function getSpellcastingInfo(className: string) {
  const info = SPELLCASTING_CLASSES[className];
  return {
    isCaster: !!info,
    maxSpellLevel: info?.maxSpellLevel || 0,
    isWarlock: !!info?.isWarlock,
  };
}

type SpellSlotsProps = {
  maxLevel: number;
  isWarlock?: boolean;
};

export function SpellSlots({ maxLevel, isWarlock = false }: SpellSlotsProps) {
  const [slots, setSlots] = useState<Record<number, { current: number; max: number }>>(
    Object.fromEntries(
      Array.from({ length: maxLevel }, (_, i) => [
        i + 1,
        { current: 0, max: 0 },
      ])
    )
  );

  const handleSlotChange = (level: number, type: 'current' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    setSlots((prev) => ({
      ...prev,
      [level]: { ...prev[level], [type]: Math.max(0, numValue) },
    }));
  };

  const title = isWarlock ? 'Pact Magic Slots' : 'Spell Slots';
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {levels.map((level) => (
          <div key={level} className="flex items-center justify-between gap-4">
            <Label className="w-16 text-sm font-medium">Level {level}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={slots[level]?.current ?? ''}
                onChange={(e) => handleSlotChange(level, 'current', e.target.value)}
                className="w-16 text-center"
                aria-label={`Current Level ${level} Slots`}
              />
              <span className="text-muted-foreground">/</span>
              <Input
                type="number"
                value={slots[level]?.max ?? ''}
                onChange={(e) => handleSlotChange(level, 'max', e.target.value)}
                className="w-16 text-center"
                aria-label={`Max Level ${level} Slots`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
