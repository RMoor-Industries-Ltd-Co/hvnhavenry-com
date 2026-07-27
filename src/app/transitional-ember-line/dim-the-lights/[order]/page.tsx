import { MockCheckout } from "@/components/checkout/MockCheckout";

// Deep-link target for the Transitional Ember Line — Dim the Lights. The `[order]`
// segment is the mock order/session id (e.g. o_12345678). Reached from "Acquire This
// Piece" on the showroom; served at shophvn.com once its DNS points here.
export default async function Page({ params }: { params: Promise<{ order: string }> }) {
  const { order } = await params;
  return <MockCheckout order={order} />;
}
