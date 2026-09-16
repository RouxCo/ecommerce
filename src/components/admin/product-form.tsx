"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    category: string | null;
    stock: number;
    featured: boolean;
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      image: (formData.get("image") as string) || null,
      category: (formData.get("category") as string) || null,
      stock: parseInt(formData.get("stock") as string, 10),
      featured: formData.get("featured") === "on",
    };

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Failed to save");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description}
          required
          className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Price (USD)
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="stock" className="text-sm font-medium">
            Stock
          </label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock ?? 0}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <Input
          id="category"
          name="category"
          defaultValue={product?.category ?? ""}
          placeholder="Electronics, Clothing, Home..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">
          Image URL
        </label>
        <Input
          id="image"
          name="image"
          type="url"
          defaultValue={product?.image ?? ""}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          defaultChecked={product?.featured}
          className="h-4 w-4 rounded border-zinc-300"
        />
        <label htmlFor="featured" className="text-sm font-medium">
          Featured product
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update product" : "Create product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
