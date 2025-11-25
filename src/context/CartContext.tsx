"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export type OrderItem = {
  id: string;
  file: File | null;
  fileName: string;
  fileSize: string;
  pageCount: number;
  serviceType: 'print' | 'laminating' | 'binding' | 'photo';
  settings: {
    color: 'bw' | 'color';
    paperSize: 'A4' | 'F4' | 'A3' | 'A5' | '4R' | '10R' | '3x4';
    copies: number;
    binding: 'none' | 'staples' | 'softcover' | 'hardcover';
  };
  price: number;
  selected?: boolean;
};

type CartContextType = {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  removeSelectedItems: () => void;
  toggleSelection: (id: string) => void;
  toggleAll: (selected: boolean) => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from local storage on mount (for guest) or when session changes
  useEffect(() => {
    const loadCart = async () => {
      if (session?.user) {
        try {
          const res = await fetch('/api/user/cart');
          if (res.ok) {
            const data = await res.json();
            if (data.cart && data.cart.length > 0) {
               // Ensure selected property exists, default to true if missing
               const loadedItems = data.cart.map((item: OrderItem) => ({
                 ...item,
                 selected: item.selected !== undefined ? item.selected : true
               }));
               setItems(loadedItems);
            } else if (items.length > 0) {
               saveCartToDb(items);
            }
          }
        } catch (error) {
          console.error('Failed to load cart from DB:', error);
        }
      } else {
        // Guest mode: load from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            // Ensure selected property exists
            const loadedItems = parsedCart.map((item: OrderItem) => ({
              ...item,
              selected: item.selected !== undefined ? item.selected : true
            }));
            setItems(loadedItems);
          } catch (e) {
            console.error('Failed to parse cart from localStorage');
          }
        }
      }
      setIsInitialized(true);
    };

    loadCart();
  }, [session]);

  // Save cart to DB or localStorage whenever items change
  useEffect(() => {
    if (!isInitialized) return;

    if (session?.user) {
      saveCartToDb(items);
    } else {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, session, isInitialized]);

  const saveCartToDb = async (cartItems: OrderItem[]) => {
    try {
      // Remove File objects before sending to API (they can't be serialized)
      const sanitizedItems = cartItems.map(item => ({
        ...item,
        file: null // We can't store the file object in DB
      }));

      await fetch('/api/user/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: sanitizedItems }),
      });
    } catch (error) {
      console.error('Failed to save cart to DB:', error);
    }
  };

  const addItem = (item: OrderItem) => {
    setItems((prev) => [...prev, { ...item, selected: true }]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    if (session?.user) {
      saveCartToDb([]);
    }
  };

  const toggleSelection = (id: string) => {
    setItems((prev) => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const toggleAll = (selected: boolean) => {
    setItems((prev) => prev.map(item => ({ ...item, selected })));
  };

  const removeSelectedItems = () => {
    const remainingItems = items.filter(item => !item.selected);
    setItems(remainingItems);
    if (session?.user) {
      saveCartToDb(remainingItems);
    } else {
      localStorage.setItem('cart', JSON.stringify(remainingItems));
    }
  };

  const total = items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, removeSelectedItems, toggleSelection, toggleAll, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
