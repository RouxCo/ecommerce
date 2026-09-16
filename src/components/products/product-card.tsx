import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: string | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              No image
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        {product.category && (
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
            {product.category}
          </p>
        )}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold leading-tight line-clamp-2 hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-lg font-bold">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/product/${product.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
