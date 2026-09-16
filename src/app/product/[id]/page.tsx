import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/add-to-cart-button";


export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              No image available
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.category && (
            <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              {product.category}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-semibold">{formatPrice(product.price)}</p>

          <div className="mt-6 space-y-4">
            <p className="text-zinc-600 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-3 text-sm">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  product.stock > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
              {product.featured && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                  Featured
                </span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <AddToCartButton productId={product.id} disabled={product.stock === 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
