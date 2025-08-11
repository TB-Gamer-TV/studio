
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { hexToHsl, hslToHex } from "@/lib/utils"

const colors = [
    { name: 'Default Brown', value: '28 30% 50%' },
    { name: 'Slayer Red', value: '0 72% 51%' },
    { name: 'Forest Green', value: '142 76% 36%' },
    { name: 'Royal Blue', value: '221 83% 53%' },
    { name: 'Arcane Purple', value: '262 83% 58%' },
];

const fonts = [
    { name: 'Literata', value: 'Literata', family: 'serif' },
    { name: 'Merriweather', value: 'Merriweather', family: 'serif' },
    { name: 'Roboto', value: 'Roboto', family: 'sans-serif' },
    { name: 'Source Code Pro', value: 'Source Code Pro', family: 'monospace' },
];

export default function SettingsPage() {
    const { primaryColor, setPrimaryColor, font, setFont } = useTheme();

    // Check if the current primaryColor is one of the predefined colors
    const isPresetColor = colors.some(c => c.value === primaryColor);

    const handleCustomColorChange = (hex: string) => {
        const hsl = hexToHsl(hex);
        if (hsl) {
            setPrimaryColor(hsl);
        }
    }

    return (
        <div className="space-y-6">
            <header className="space-y-1.5">
                <h1 className="text-3xl font-bold font-headline">Settings</h1>
                <p className="text-muted-foreground">Customize the look and feel of Dungeon Ally.</p>
            </header>
            <Separator />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Primary Color</CardTitle>
                        <CardDescription>Choose an accent color for the application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup 
                            // If a custom color is used, this value won't match any radio item
                            value={isPresetColor ? primaryColor : ''} 
                            onValueChange={setPrimaryColor} 
                            className="space-y-2"
                        >
                            {colors.map((color) => (
                                <Label key={color.value} className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:text-accent-foreground">
                                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: `hsl(${color.value})` }} />
                                    <span>{color.name}</span>
                                    <RadioGroupItem value={color.value} id={color.value} className="sr-only"/>
                                    {primaryColor === color.value && <Check className="ml-auto text-primary" />}
                                </Label>
                            ))}
                        </RadioGroup>

                        <Separator className="my-4" />

                        <div className="space-y-2">
                            <Label htmlFor="custom-color" className="font-medium">Custom Color</Label>
                            <div className="flex items-center gap-4 p-4 border rounded-lg">
                                <Input 
                                    id="custom-color"
                                    type="color"
                                    value={hslToHex(primaryColor)}
                                    onChange={(e) => handleCustomColorChange(e.target.value)}
                                    className="w-12 h-10 p-1 cursor-pointer"
                                    aria-label="Custom color picker"
                                />
                                <span className="text-sm text-muted-foreground">Select any color you'd like.</span>
                            </div>
                        </div>

                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Application Font</CardTitle>
                        <CardDescription>Choose the primary font for the application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select value={font} onValueChange={setFont}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a font" />
                            </SelectTrigger>
                            <SelectContent>
                                {fonts.map(f => (
                                    <SelectItem key={f.value} value={f.value}>
                                        <span style={{ fontFamily: `${f.value}, ${f.family}`}}>{f.name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
