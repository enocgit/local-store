import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeliveryDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">Selected Delivery Slot</h3>
            <p>Friday, 15 March 2024</p>
            <p>14:00 - 16:00</p>
          </div>

          <div className="text-sm text-gray-600">
            <h4 className="mb-2 font-semibold">Delivery Notes:</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>We'll text you when your delivery is on its way</li>
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
