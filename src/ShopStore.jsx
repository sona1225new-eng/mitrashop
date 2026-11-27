"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ShopStoreContext = createContext(null);
const CART_KEY = "mitra-shop-cart";
const WISHLIST_KEY = "mitra-shop-wishlist";

function readStoredItems(key) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error(`Could not read ${key} from local storage.`, error);
    return [];
  }
}

function normalizeCart(items) {
  if (!Array.isArray(items)) return [];
  const cartByProduct = new Map();
  items.forEach((item) => {
    if (!item?.product?.id || !Number.isInteger(item.quantity) || item.quantity <= 0) return;
    const existing = cartByProduct.get(item.product.id);
    cartByProduct.set(item.product.id, {
      product: item.product,
      quantity: item.quantity + (existing?.quantity || 0),
    });
  });
  return [...cartByProduct.values()];
}

function normalizeWishlist(items) {
  if (!Array.isArray(items)) return [];
  return items.filter((product, index) => product?.id && items.findIndex((item) => item?.id === product.id) === index);
}

export function ShopStoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const storedCart = readStoredItems(CART_KEY);
    const storedWishlist = readStoredItems(WISHLIST_KEY);
    setCart(normalizeCart(storedCart));
    setWishlist(normalizeWishlist(storedWishlist));
    setHydrated(true);
  }, []);

  useEffect(() => {
    const syncStoredItems = (event) => {
      if (event.key === CART_KEY) {
        setCart(normalizeCart(readStoredItems(CART_KEY)));
      }
      if (event.key === WISHLIST_KEY) {
        setWishlist(normalizeWishlist(readStoredItems(WISHLIST_KEY)));
      }
    };
    window.addEventListener("storage", syncStoredItems);
    return () => window.removeEventListener("storage", syncStoredItems);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Could not save your cart and wishlist.", error);
      setToast("Your changes could not be saved on this device.");
    }
  }, [cart, wishlist, hydrated]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({
    cart,
    wishlist,
    cartCount: cart.reduce((total, item) => total + item.quantity, 0),
    wishlistCount: wishlist.length,
    showToast: setToast,
    addToCart(product, quantity = 1) {
      setCart((items) => {
        const existing = items.find((item) => item.product.id === product.id);
        return existing
          ? items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
          : [...items, { product, quantity }];
      });
      setToast(`${product.name} added to your cart.`);
    },
    setQuantity(productId, quantity) {
      setCart((items) => items.map((item) => item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item));
    },
    removeFromCart(productId) {
      const item = cart.find((entry) => entry.product.id === productId);
      setCart((items) => items.filter((entry) => entry.product.id !== productId));
      if (item) setToast(`${item.product.name} removed from your cart.`);
    },
    toggleWishlist(product) {
      const exists = wishlist.some((item) => item.id === product.id);
      setWishlist((items) => items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product]);
      setToast(exists ? `${product.name} removed from your wishlist.` : `${product.name} saved to your wishlist.`);
    },
    removeFromWishlist(productId) {
      const product = wishlist.find((item) => item.id === productId);
      setWishlist((items) => items.filter((item) => item.id !== productId));
      if (product) setToast(`${product.name} removed from your wishlist.`);
    },
    moveToCart(product) {
      setCart((items) => {
        const existing = items.find((item) => item.product.id === product.id);
        return existing
          ? items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...items, { product, quantity: 1 }];
      });
      setWishlist((items) => items.filter((item) => item.id !== product.id));
      setToast(`${product.name} moved to your cart.`);
    },
    moveToWishlist(product) {
      setCart((items) => items.filter((item) => item.product.id !== product.id));
      setWishlist((items) => items.some((item) => item.id === product.id) ? items : [...items, product]);
      setToast(`${product.name} saved for later.`);
    },
    clearCart() {
      setCart([]);
    },
  }), [cart, wishlist]);

  return (
    <ShopStoreContext.Provider value={value}>
      {children}
      <div className={`shop-toast${toast ? " is-visible" : ""}`} role="status" aria-live="polite">{toast}</div>
    </ShopStoreContext.Provider>
  );
}

export function useShopStore() {
  const store = useContext(ShopStoreContext);
  if (!store) throw new Error("useShopStore must be used within ShopStoreProvider.");
  return store;
}
