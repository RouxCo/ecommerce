"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    stock: number;
  };
}

interface CartClientProps {
  initialItems: CartItem[];
}

export function CartClient({ initialItems }: CartClientProps) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  async function updateQuantity(productId: string, quantity: number) {
    setLoading(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update");
        return;
      }
      if (quantity === 0) {
        setItems((prev) => prev.filter((i) => i.product.id !== productId));
      } else {
        setItems((prev) =>
          prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
        );
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function removeItem(productId: string) {
    setLoading(productId);
    try {
      await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function checkout() {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 py-20 text-center">
        <p className="text-zinc-500 mb-4">Your cart is empty</p>
        <Link href="/">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              {item.product.image ? (
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link
                  href={`/product/${item.product.id}`}
                  className="font-medium hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="mt-1 text-sm text-zinc-500">
                  {formatPrice(item.product.price)} each
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={loading === item.product.id || item.quantity <= 1}
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={
                      loading === item.product.id || item.quantity >= item.product.stock
                    }
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-red-600"
                    disabled={loading === item.product.id}
                    onClick={() => removeItem(item.product.id)}
                  >
                    {loading === item.product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Shipping</span>
              <span>{total >= 100 ? "Free" : formatPrice(9.99)}</span>
            </div>
            <div className="border-t border-zinc-200 pt-2 mt-2 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total + (total >= 100 ? 0 : 9.99))}</span>
            </div>
          </div>
          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={checkout}
            disabled={checkingOut}
          >
            {checkingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              "Proceed to checkout"
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-zinc-500">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
