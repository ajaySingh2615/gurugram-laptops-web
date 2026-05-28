import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo area */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          TechReborn
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4">
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
        </div>
      </div>
    </nav>
  );
}
