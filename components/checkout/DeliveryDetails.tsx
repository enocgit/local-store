import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/store/cart-context";

export function DeliveryDetails() {
  const { state } = useCart();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">Selected Delivery Slot</h3>
            <p>
              {state.deliveryDate?.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p>{state.deliveryTime}</p>
          </div>

          <div className="text-sm text-gray-600">
            <h4 className="mb-2 font-semibold">Delivery Notes:</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>We&apos;ll text you when your delivery is on its way</li>
              <li>
                Please ensure someone is available to receive the delivery
              </li>
              <li>
                Keep your phone handy - our driver may need to contact you
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
