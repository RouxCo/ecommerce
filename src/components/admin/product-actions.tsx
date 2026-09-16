"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export function AdminProductActions({ productId }: { productId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete");
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/admin/products/${productId}/edit`}>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
