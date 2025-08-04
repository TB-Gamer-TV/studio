
'use client';

import { DiceRoller } from "@/components/dice-roller";
import { Separator } from "@/components/ui/separator";

export default function DiceRollerPage() {
    return (
        <div className="space-y-6">
            <header className="space-y-1.5">
                <h1 className="text-3xl font-bold font-headline">Dice Roller</h1>
                <p className="text-muted-foreground">Your trusty digital dice. Roll with modifiers and see your history.</p>
            </header>
            <Separator />
            <DiceRoller />
        </div>
    )
}
