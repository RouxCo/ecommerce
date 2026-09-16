import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const cartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99).default(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, quantity } = cartSchema.parse(body);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (product.stock < quantity) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) {
        return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
      }
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
        include: { product: true },
      });
      return NextResponse.json(updated);
    }

    const item = await prisma.cartItem.create({
      data: {
        userId: session.user.id,
        productId,
        quantity,
      },
      include: { product: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, quantity } = z
      .object({
        productId: z.string(),
        quantity: z.number().int().min(0).max(99),
      })
      .parse(body);

    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id, productId },
      });
      return NextResponse.json({ success: true });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.stock < quantity) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    const updated = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id, productId },
  });

  return NextResponse.json({ success: true });
}
