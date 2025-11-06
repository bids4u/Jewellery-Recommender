import { create } from "zustand";

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      // Avoid duplicates
      const exists = state.items.find((i) => i.name === item.name);
      if (exists) return state;
      return { items: [...state.items, item] };
    }),
  removeItem: (name) =>
    set((state) => ({
      items: state.items.filter((i) => i.name !== name),
    })),
  clearCart: () => set({ items: [] }),
}));
