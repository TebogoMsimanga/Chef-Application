/**
 * Cart Store
 * 
 * Manages shopping cart state using Zustand.
 * Handles:
 * - Adding items to cart with customizations
 * - Removing items from cart
 * - Updating item quantities
 * - Calculating totals
 * 
 * @module store/cart.store
 */

import {CartCustomization, CartStore} from "@/type";
import {create} from "zustand";
import * as Sentry from "@sentry/react-native";

/**
 * Check if two customization arrays are equal
 * Used to identify items with the same customizations
 * 
 * @param {CartCustomization[]} a - First customization array
 * @param {CartCustomization[]} b - Second customization array
 * @returns {boolean} True if arrays are equal
 */
function areCustomizationsEqual(
    a: CartCustomization[] = [],
    b: CartCustomization[] = []
): boolean {
    if (a.length !== b.length) return false;

    const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
    const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

    return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}

/**
 * Cart Store
 * 
 * Manages shopping cart state with Zustand.
 * All operations include console logging for debugging.
 */
export const useCartStore = create<CartStore>((set, get) => ({
    items: [],

    /**
     * Add item to cart
     * If item with same ID and customizations exists, increases quantity
     * Otherwise, adds new item with quantity 1
     * 
     * @param {Omit<CartItemType, "quantity">} item - Item to add
     */
    addItem: (item) => {
        try {
            console.log("[CartStore] Adding item to cart:", item.name, item.id);
            
            const customizations = item.customizations ?? [];

            const existing = get().items.find(
                (i) =>
                    i.id === item.id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
            );

            if (existing) {
                console.log("[CartStore] Item exists, increasing quantity:", existing.quantity + 1);
                set({
                    items: get().items.map((i) =>
                        i.id === item.id &&
                        areCustomizationsEqual(i.customizations ?? [], customizations)
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                });
            } else {
                console.log("[CartStore] New item added to cart");
                set({
                    items: [...get().items, { ...item, quantity: 1, customizations }],
                });
            }
            
            const totalItems = get().getTotalItems();
            console.log("[CartStore] Cart updated - Total items:", totalItems);
        } catch (error: any) {
            console.error("[CartStore] Error adding item:", error);
            Sentry.captureException(error, {
                tags: { component: "CartStore", action: "addItem" },
                extra: { itemId: item.id, itemName: item.name },
            });
        }
    },

    /**
     * Remove item from cart
     * Removes item with matching ID and customizations
     * 
     * @param {string} id - Item ID
     * @param {CartCustomization[]} customizations - Item customizations
     */
    removeItem: (id, customizations = []) => {
        try {
            console.log("[CartStore] Removing item from cart:", id);
            
            set({
                items: get().items.filter(
                    (i) =>
                        !(
                            i.id === id &&
                            areCustomizationsEqual(i.customizations ?? [], customizations)
                        )
                ),
            });
            
            const totalItems = get().getTotalItems();
            console.log("[CartStore] Item removed - Total items:", totalItems);
        } catch (error: any) {
            console.error("[CartStore] Error removing item:", error);
            Sentry.captureException(error, {
                tags: { component: "CartStore", action: "removeItem" },
                extra: { itemId: id },
            });
        }
    },

    /**
     * Increase item quantity by 1
     * 
     * @param {string} id - Item ID
     * @param {CartCustomization[]} customizations - Item customizations
     */
    increaseQty: (id, customizations = []) => {
        try {
            console.log("[CartStore] Increasing quantity for item:", id);
            
            set({
                items: get().items.map((i) =>
                    i.id === id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
            
            const item = get().items.find(
                (i) => i.id === id && areCustomizationsEqual(i.customizations ?? [], customizations)
            );
            console.log("[CartStore] Quantity increased - New quantity:", item?.quantity);
        } catch (error: any) {
            console.error("[CartStore] Error increasing quantity:", error);
            Sentry.captureException(error, {
                tags: { component: "CartStore", action: "increaseQty" },
                extra: { itemId: id },
            });
        }
    },

    /**
     * Decrease item quantity by 1
     * Removes item if quantity reaches 0
     * 
     * @param {string} id - Item ID
     * @param {CartCustomization[]} customizations - Item customizations
     */
    decreaseQty: (id, customizations = []) => {
        try {
            console.log("[CartStore] Decreasing quantity for item:", id);
            
            set({
                items: get()
                    .items.map((i) =>
                        i.id === id &&
                        areCustomizationsEqual(i.customizations ?? [], customizations)
                            ? { ...i, quantity: i.quantity - 1 }
                            : i
                    )
                    .filter((i) => i.quantity > 0),
            });
            
            const totalItems = get().getTotalItems();
            console.log("[CartStore] Quantity decreased - Total items:", totalItems);
        } catch (error: any) {
            console.error("[CartStore] Error decreasing quantity:", error);
            Sentry.captureException(error, {
                tags: { component: "CartStore", action: "decreaseQty" },
                extra: { itemId: id },
            });
        }
    },

    /**
     * Clear all items from cart
     */
    clearCart: () => {
        try {
            console.log("[CartStore] Clearing cart");
            set({ items: [] });
            console.log("[CartStore] Cart cleared");
        } catch (error: any) {
            console.error("[CartStore] Error clearing cart:", error);
            Sentry.captureException(error, {
                tags: { component: "CartStore", action: "clearCart" },
            });
        }
    },

    /**
     * Get total number of items in cart
     * 
     * @returns {number} Total quantity of all items
     */
    getTotalItems: () => {
        try {
            const total = get().items.reduce((total, item) => total + item.quantity, 0);
            console.log("[CartStore] Total items:", total);
            return total;
        } catch (error: any) {
            console.error("[CartStore] Error calculating total items:", error);
            Sentry.captureException(error, {
                tags: { component: "CartStore", action: "getTotalItems" },
            });
            return 0;
        }
    },

    /**
     * Get total price of all items in cart
     * Includes base price and customization prices
     * 
     * @returns {number} Total price
     */
    getTotalPrice: () => {
        try {
            const total = get().items.reduce((total, item) => {
                const base = item.price;
                const customPrice =
                    item.customizations?.reduce(
                        (s: number, c: CartCustomization) => s + c.price,
                        0
                    ) ?? 0;
                return total + item.quantity * (base + customPrice);
            }, 0);
            
            console.log("[CartStore] Total price:", total.toFixed(2));
            return total;
        } catch (error: any) {
            console.error("[CartStore] Error calculating total price:", error);
            Sentry.captureException(error, {
                tags: { component: "CartStore", action: "getTotalPrice" },
            });
            return 0;
        }
    },
}));