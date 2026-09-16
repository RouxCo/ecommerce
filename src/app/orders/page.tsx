import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrderSuccessHandler } from "@/components/cart/order-success-handler";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ success?: string; orderId?: string }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-10">
      {params.success && params.orderId && (
        <OrderSuccessHandler orderId={params.orderId} />
      )}

      <h1 className="mb-8 text-3xl font-bold tracking-tight">Your orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-20 text-center">
          <p className="text-zinc-500 mb-4">No orders yet</p>
          <Link href="/">
            <Button>Start shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <p className="text-sm text-zinc-500">
                    Order placed{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-1 font-mono text-xs text-zinc-400">{order.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
              <ul className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-zinc-600">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
