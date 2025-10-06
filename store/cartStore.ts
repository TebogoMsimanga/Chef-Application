import { Meal } from "../utils/data";

export const cartStore: {
  cart: Meal[];
  setCart: (meals: Meal[]) => void;
  clearCart: () => void;
} = {
  cart: [],
  setCart: () => {},
  clearCart: () => {},
};
