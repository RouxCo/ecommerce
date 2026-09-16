"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function OrderSuccessHandler({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const router = useRouter();

  useEffect(() => {
    async function confirm() {
      try {
        const res = await fetch("/api/checkout/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        if (res.ok) {
          setStatus("success");
          router.refresh();
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }
    confirm();
  }, [orderId, router]);

  if (status === "loading") {
    return (
      <div className="mb-8 rounded-lg bg-blue-50 p-4 text-blue-800">
        Confirming your payment...
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="mb-8 rounded-lg bg-green-50 p-4 text-green-800">
        Payment successful! Thank you for your order.
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-lg bg-yellow-50 p-4 text-yellow-800">
      We received your order. If payment was successful it will update shortly.
    </div>
  );
}
