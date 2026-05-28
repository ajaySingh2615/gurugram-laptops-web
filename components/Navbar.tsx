"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function Navbar() {
  const { user, isInitialized, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Successfully logged out");
    router.push("/login");
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo area */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          TechReborn
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4 items-center">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/shop">
            <Button variant="ghost">Shop</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost">Contact</Button>
          </Link>

          {/* Auth State */}
          <div className="ml-4 pl-4 border-l flex gap-2">
            {!isInitialized ? (
              <Button variant="ghost" disabled>Loading...</Button>
            ) : user ? (
              <>
                <Button variant="ghost" disabled>My Account</Button>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
