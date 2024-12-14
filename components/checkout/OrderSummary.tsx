import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useCart } from "@/lib/store/cart-context";
import { Loader2 } from "lucide-react";

export function OrderSummary() {
  const { state } = useCart();
  const { data: siteConfigs, isLoading } = useSiteConfig();
  const deliveryFee = parseFloat(
    (siteConfigs?.delivery_fee as string) ?? "4.70",
  );

  if (isLoading)
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          {state.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Order Totals */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>£{state.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>£{deliveryFee.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600">
            Free delivery for BD1 area{" "}
            <span className="text-[0.65rem]">(calculated at checkout)</span>
          </p>
          <div className="flex justify-between border-t pt-2 text-lg font-bold">
            <span>Total</span>
            <span>£{(state.total + deliveryFee).toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
          <h3 className="font-semibold">Delivery Information</h3>
          <p>
            Delivery on{" "}
            {state.deliveryDate?.toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>Time slot: {state.deliveryTime}</p>
        </div>

        {/* Secure Payment Notice */}
        <div className="text-sm text-gray-600">
          <p className="flex items-center justify-center">
            🔒 Secure payment powered by Stripe
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
