
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useEffect } from 'react';

const SPELLCASTING_CLASSES: Record<string, { maxSpellLevel: number; isWarlock?: boolean, slotsPerLevel?: number[][] }> = {
  Bard: { maxSpellLevel: 9 },
  Cleric: { maxSpellLevel: 9 },
  Druid: { maxSpellLevel: 9 },
  Sorcerer: { maxSpellLevel: 9 },
  Wizard: { maxSpellLevel: 9 },
  Paladin: { maxSpellLevel: 5 },
  Ranger: { maxSpellLevel: 5 },
  Fighter: { maxSpellLevel: 4 }, // For Eldritch Knight
  Rogue: { maxSpellLevel: 4 }, // For Arcane Trickster
  Warlock: { 
    maxSpellLevel: 5, 
    isWarlock: true,
    // [level]: [numSlots, slotLevel]
    slotsPerLevel: [
        [1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4], 
        [2, 5], [2, 5], [3, 5], [3, 5], [3, 5], [3, 5], [4, 5], [4, 5],
        [4, 5], [4, 5], [4, 5], [4, 5]
    ]
  },
};

// Full caster spell slots per level
const fullCasterSlots = [
    [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2],
    [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

// Half caster spell slots
const halfCasterSlots = [
    [], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2],
    [4, 3, 3], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 2],
    [4, 3, 3, 3, 1], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2]
];

// Third caster spell slots (Eldritch Knight, Arcane Trickster)
const thirdCasterSlots = [
    [], [], [2], [3], [3], [3], [4, 2], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3],
    [4, 3, 2], [4, 3, 2], [4, 3, 2], [4, 3, 3], [4, 3, 3], [4, 3, 3], [4, 3, 3, 1],
    [4, 3, 3, 1]
];


export function getSpellcastingInfo(className: string) {
  const info = SPELLCASTING_CLASSES[className];
  return {
    isCaster: !!info,
    maxSpellLevel: info?.maxSpellLevel || 0,
    isWarlock: !!info?.isWarlock,
  };
}

type SlotState = Record<number, { current: number; max: number }>;

type SpellSlotsProps = {
  maxLevel: number;
  isWarlock?: boolean;
  characterClass: string;
  characterLevel: number;
  characterId: string;
};

export function SpellSlots({ maxLevel, isWarlock = false, characterClass, characterLevel, characterId }: SpellSlotsProps) {
  const [slots, setSlots] = useLocalStorage<SlotState>(`spell-slots-${characterId}`,{});

  useEffect(() => {
    const getInitialSlots = (): SlotState => {
        let newSlots: SlotState = {};
        if (isWarlock) {
            const warlockInfo = SPELLCASTING_CLASSES['Warlock'];
            if(warlockInfo?.slotsPerLevel && characterLevel > 0){
                const [numSlots, slotLevel] = warlockInfo.slotsPerLevel[characterLevel - 1];
                newSlots[slotLevel] = { current: slots[slotLevel]?.current ?? numSlots, max: numSlots };
            }
        } else {
            let casterTypeSlots;
            if (['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'].includes(characterClass)) {
                casterTypeSlots = fullCasterSlots;
            } else if (['Paladin', 'Ranger'].includes(characterClass)) {
                casterTypeSlots = halfCasterSlots;
            } else if (['Fighter', 'Rogue'].includes(characterClass)) {
                casterTypeSlots = thirdCasterSlots;
            }

            if(casterTypeSlots && characterLevel > 0){
                const levelSlots = casterTypeSlots[characterLevel - 1];
                if (levelSlots) {
                  levelSlots.forEach((numSlots, i) => {
                      const level = i + 1;
                      newSlots[level] = { current: slots[level]?.current ?? numSlots, max: numSlots };
                  });
                }
            }
        }
        
        // Fill remaining levels up to maxLevel with 0
        for(let i=1; i<=maxLevel; i++){
            if(!newSlots[i]){
                newSlots[i] = { current: slots[i]?.current ?? 0, max: 0 };
            }
        }
        
        return newSlots;
    };

    setSlots(getInitialSlots());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterClass, characterLevel, isWarlock, maxLevel]);


  const handleSlotChange = (level: number, type: 'current' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    setSlots((prev) => ({
      ...prev,
      [level]: { ...prev[level], [type]: Math.max(0, numValue) },
    }));
  };
  
  const title = isWarlock ? 'Pact Magic Slots' : 'Spell Slots';
  const levels = Object.keys(slots).map(Number).sort((a,b) => a - b);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {levels.length === 0 && <p className="text-muted-foreground">No spell slots for this class/level.</p>}
        {levels.map((level) => (
          slots[level].max > 0 &&
          <div key={level} className="flex items-center justify-between gap-4">
            <Label className="text-sm font-medium">Level {level}</Label>
            <div className="flex items-center justify-end gap-2">
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
