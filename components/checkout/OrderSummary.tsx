import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This would typically come from your cart context/store
const mockOrderDetails = {
  items: [
    {
      id: 1,
      name: "Premium Frozen Pizza Pack",
      quantity: 2,
      price: 12.99,
    },
    {
      id: 2,
      name: "Organic Mixed Berries",
      quantity: 1,
      price: 8.99,
    },
  ],
  subtotal: 34.97,
  deliveryFee: 4.99,
  total: 39.96,
};

export function OrderSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          {mockOrderDetails.items.map((item) => (
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
            <span>£{mockOrderDetails.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>£{mockOrderDetails.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-lg font-bold">
            <span>Total</span>
            <span>£{mockOrderDetails.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
          <h3 className="font-semibold">Delivery Information</h3>
          <p>Delivery on Friday, 15 March 2024</p>
          <p>Time slot: 14:00 - 16:00</p>
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
