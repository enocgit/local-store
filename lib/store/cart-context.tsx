"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { useSiteConfig } from "@/hooks/use-site-config";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weight?: number;
  weightOptions?: number[];
  cartId?: string;
}

interface CartState {
  items: CartItem[];
  postcode: string;
  deliveryDate?: Date;
  deliveryTime?: string;
  subtotal: number;
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string; weight: number } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { id: string; quantity: number; weight: number };
    }
  | {
      type: "CHANGE_WEIGHT";
      payload: {
        id: string;
        oldWeight: number;
        newWeight: number;
        price: number;
      };
    }
  | { type: "SET_DELIVERY_DATE"; payload: Date }
  | { type: "SET_DELIVERY_TIME"; payload: string }
  | { type: "SET_POSTCODE"; payload: string }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const initialState: CartState = {
  items: [],
  deliveryDate: undefined,
  deliveryTime: undefined,
  postcode: "",
  subtotal: 0,
  total: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const cartId = action.payload.weight
        ? `${action.payload.id}-${action.payload.weight}`
        : action.payload.id;

      const existingItemIndex = state.items.findIndex(
        (item) =>
          (item.weight ? `${item.id}-${item.weight}` : item.id) === cartId,
      );

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity:
            newItems[existingItemIndex].quantity +
            (action.payload.quantity || 1),
        };
        newState = { ...state, items: newItems };
      } else {
        newState = {
          ...state,
          items: [
            ...state.items,
            {
              ...action.payload,
              cartId,
              quantity: action.payload.quantity || 1,
              weight: action.payload.weight,
            },
          ],
        };
      }
      break;
    }

    case "REMOVE_ITEM": {
      const cartId = action.payload.weight
        ? `${action.payload.id}-${action.payload.weight}`
        : action.payload.id;

      newState = {
        ...state,
        items: state.items.filter(
          (item) =>
            (item.weight ? `${item.id}-${item.weight}` : item.id) !== cartId,
        ),
      };
      break;
    }

    case "UPDATE_QUANTITY": {
      const cartId = action.payload.weight
        ? `${action.payload.id}-${action.payload.weight}`
        : action.payload.id;

      newState = {
        ...state,
        items: state.items.map((item) =>
          (item.weight ? `${item.id}-${item.weight}` : item.id) === cartId
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
      break;
    }

    case "CHANGE_WEIGHT": {
      const { id, oldWeight, newWeight, price } = action.payload;

      // Find if there's already an item with the new weight
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === id && item.weight === newWeight,
      );

      // Find the item being changed
      const changingItemIndex = state.items.findIndex(
        (item) => item.id === id && item.weight === oldWeight,
      );

      if (changingItemIndex === -1) return state;

      const changingItem = state.items[changingItemIndex];
      const newItems = [...state.items];

      if (existingItemIndex > -1) {
        // If an item with the new weight exists, add the changing item's quantity
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity:
            newItems[existingItemIndex].quantity + changingItem.quantity,
        };
        // Remove the old item
        newState = {
          ...state,
          items: newItems.filter((_, index) => index !== changingItemIndex),
        };
      } else {
        // If no existing item with new weight, update the weight and price
        newState = {
          ...state,
          items: state.items.map((item) =>
            item.id === id && item.weight === oldWeight
              ? { ...item, weight: newWeight, price: price }
              : item,
          ),
        };
      }
      break;
    }

    case "SET_DELIVERY_DATE":
      newState = {
        ...state,
        deliveryDate: action.payload,
      };
      break;

    case "SET_DELIVERY_TIME":
      newState = {
        ...state,
        deliveryTime: action.payload,
      };
      break;

    case "SET_POSTCODE":
      newState = {
        ...state,
        postcode: action.payload,
      };
      break;

    case "CLEAR_CART":
      newState = initialState;
      break;

    default:
      newState = state;
      break;
  }

  // Calculate derived values
  const subtotal = newState.items.reduce(
    (sum, item) => sum + item.price * (item.weight || 1) * item.quantity,
    0,
  );
  const total = subtotal;

  // Return final state with calculated values
  return {
    ...newState,
    subtotal,
    total,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const { items, deliveryDate, deliveryTime, postcode } =
        JSON.parse(savedCart);
      items.forEach((item: CartItem) => {
        dispatch({ type: "ADD_ITEM", payload: item });
      });
      if (deliveryDate) {
        dispatch({
          type: "SET_DELIVERY_DATE",
          payload: new Date(deliveryDate),
        });
      }
      if (deliveryTime) {
        dispatch({ type: "SET_DELIVERY_TIME", payload: deliveryTime });
      }
      if (postcode) {
        dispatch({ type: "SET_POSTCODE", payload: postcode });
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
