'use client'

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Dices, ScrollText, Shield, UserCircle } from 'lucide-react';
import { Icons } from '@/components/icons';

const navItems = [
  { href: '/', label: 'Character Sheet', icon: UserCircle },
  { href: '/enemies', label: 'Enemy Tracker', icon: Shield },
  { href: '/encounter-generator', label: 'Encounter Generator', icon: ScrollText },
  { href: '/dice-roller', label: 'Dice Roller', icon: Dices },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="size-6 text-sidebar-primary" />
            <h1 className="text-lg font-semibold font-headline text-sidebar-foreground">Dungeon Ally</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton tooltip={item.label} isActive={pathname === item.href} asChild>
                    <span>
                      <item.icon />
                      <span>{item.label}</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
           <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Icons.logo className="size-6 text-primary" />
            <h1 className="text-lg font-semibold font-headline">Dungeon Ally</h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
