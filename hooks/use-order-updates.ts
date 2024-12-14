import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/store/cart-context";

export function useOrderUpdates() {
  const { data: session } = useSession();
  const cart = useCart();

  useEffect(() => {
    if (!session?.user) return;

    const eventSource = new EventSource(`/api/order-updates`);

    eventSource.addEventListener("order_completed", (event) => {
      const data = JSON.parse(event.data);
      // Clear the cart
      cart.dispatch({ type: "CLEAR_CART" });
      // You could also show a success message or redirect
    });

    return () => {
      eventSource.close();
    };
  }, [session?.user, cart]);
}
