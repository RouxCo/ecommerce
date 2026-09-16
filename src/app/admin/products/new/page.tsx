import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Add product</h1>
      <ProductForm />
    </div>
  );
}
