"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, LogOut } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  const { user, isInitialized, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Successfully logged out");
    router.push("/login");
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Left Side: Logo & Main Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            TechReborn
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/shop" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Shop
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side: Auth State */}
        <div className="flex items-center gap-6">
          {!isInitialized ? (
            <div className="h-9 w-24 animate-pulse bg-muted rounded-full"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="gap-2 rounded-full font-medium">
                <User className="h-4 w-4" />
                My Account
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hover:bg-red-50 hover:text-red-600 rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/signup">
                <Button className="rounded-full px-6 shadow-sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
