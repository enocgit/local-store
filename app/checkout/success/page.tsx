import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <CardDescription>
            Thank you for your order. We'll email you the details shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <h3 className="font-semibold">Delivery Information</h3>
            <p>Delivery on Friday, 15 March 2024</p>
            <p>Time slot: 14:00 - 16:00</p>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2">What happens next?</p>
            <ul className="list-inside list-disc space-y-1">
              <li>You'll receive an order confirmation email</li>
              <li>We'll send updates about your delivery</li>
              <li>You'll get a text when your delivery is on its way</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-2">
            <Link href="/">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
            <Link href="/account/orders">
              <Button variant="outline" className="w-full">
                View Order History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
