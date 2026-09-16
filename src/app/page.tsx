import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/product-card";
import { SearchBar } from "@/components/products/search-bar";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const category = params.category?.trim() || "";

  const products = await prisma.product.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { name: { contains: query } },
                { description: { contains: query } },
                { category: { contains: query } },
              ],
            }
          : {},
        category ? { category: { equals: category } } : {},
      ],
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  // Get unique categories for the filter chips
  const allCategories = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  const categories = allCategories
    .map((p) => p.category)
    .filter((c): c is string => !!c)
    .sort();

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Discover quality products
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
          Carefully selected items for modern living. Free shipping on orders over $100.
        </p>
      </section>

      {/* Search */}
      <section className="mb-10 max-w-2xl mx-auto">
        <Suspense fallback={<div className="h-10 bg-zinc-100 rounded-md animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </section>

      {/* Category chips */}
      {categories.length > 0 && (
        <section className="mb-8 flex flex-wrap items-center gap-2">
          <CategoryChip label="All" active={!category} href="/" />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={category === cat}
              href={query ? `/?category=${encodeURIComponent(cat)}&q=${encodeURIComponent(query)}` : `/?category=${encodeURIComponent(cat)}`}
            />
          ))}
        </section>
      )}

      {/* Results header */}
      <section>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold">
            {query ? (
              <>
                Results for &ldquo;{query}&rdquo;
                {category && <span className="text-zinc-500 font-normal"> in {category}</span>}
              </>
            ) : category ? (
              category
            ) : (
              "All products"
            )}
          </h2>
          <p className="text-sm text-zinc-500">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 py-20 text-center text-zinc-500">
            {query || category ? (
              <>
                <p className="mb-2">No products found.</p>
                <p className="text-sm">Try a different search term or clear the filters.</p>
              </>
            ) : (
              "No products yet. Seed the database or add some from the admin panel."
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  href,
}: {
  label: string;
  active: boolean;
  href: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-zinc-900 text-white"
          : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
      }`}
    >
      {label}
    </a>
  );
}
