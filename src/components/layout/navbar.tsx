import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut, LayoutDashboard, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { NavbarSearch } from "./navbar-search";


export async function Navbar() {
  const session = await auth();
  let cartCount = 0;

  if (session?.user?.id) {
    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      select: { quantity: true },
    });
    cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Package className="h-6 w-6" />
          <span>Lumina</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-zinc-600">
            Shop
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin/products" className="transition-colors hover:text-zinc-600">
              Admin
            </Link>
          )}
          {session && (
            <Link href="/orders" className="transition-colors hover:text-zinc-600">
              Orders
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavbarSearch />
          <Link href="/cart" className="relative p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>


          {session ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-zinc-600">
                {session.user.name || session.user.email}
              </span>
              {session.user.role === "ADMIN" && (
                <Link href="/admin/products">
                  <Button variant="ghost" size="icon">
                    <LayoutDashboard className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button variant="ghost" size="icon" type="submit">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
