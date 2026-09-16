"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Loader2 } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
}

export function AddToCartButton({ productId, disabled }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  async function handleAdd() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to add to cart");
        return;
      }

      setAdded(true);
      router.refresh();
      setTimeout(() => setAdded(false), 2000);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={disabled || loading}
      size="lg"
      className="w-full sm:w-auto min-w-[160px]"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : added ? (
        <>
          <Check className="h-4 w-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Add to cart
        </>
      )}
    </Button>
  );
}
