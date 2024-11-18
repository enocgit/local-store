"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weight?: number;
}

interface CartState {
  items: CartItem[];
  deliveryDate?: Date;
  deliveryTime?: string;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "UPDATE_WEIGHT"; payload: { id: string; weight: number } }
  | { type: "SET_DELIVERY_DATE"; payload: Date }
  | { type: "SET_DELIVERY_TIME"; payload: string }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const initialState: CartState = {
  items: [],
  deliveryDate: undefined,
  deliveryTime: undefined,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };

    case "UPDATE_WEIGHT":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, weight: action.payload.weight }
            : item,
        ),
      };

    case "SET_DELIVERY_DATE":
      return {
        ...state,
        deliveryDate: action.payload,
      };

    case "SET_DELIVERY_TIME":
      return {
        ...state,
        deliveryTime: action.payload,
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const { items, deliveryDate, deliveryTime } = JSON.parse(savedCart);
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
