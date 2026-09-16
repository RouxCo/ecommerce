import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "PAID") {
      return NextResponse.json({ success: true, alreadyPaid: true });
    }

    // Verify with Stripe
    if (order.stripeSessionId) {
      const stripeSession = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
      if (stripeSession.payment_status !== "paid") {
        return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
      }
    }

    // Mark paid, decrease stock, clear cart
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({
        where: { userId: session.user.id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 });
  }
}
