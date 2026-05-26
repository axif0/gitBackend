import { z } from 'zod';

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  price: z.number().positive(),
  discountPercent: z.number().min(0).max(100),
  quantity: z.number().int().positive().max(100),
  image: z.string().optional(),
  category: z.string().optional(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, quantity: Math.min(i.quantity + action.payload.quantity, 100) }
              : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.productId !== action.payload.productId) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { items: state.items.filter(i => i.productId !== action.payload.productId) };
      }
      return {
        items: state.items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, quantity: Math.min(action.payload.quantity, 100) }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    case 'LOAD_CART':
      return { items: action.payload };
    default:
      return state;
  }
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const finalPrice = item.price - (item.price * item.discountPercent) / 100;
    return sum + finalPrice * item.quantity;
  }, 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
