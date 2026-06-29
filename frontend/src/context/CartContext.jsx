import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch { return []; }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (plant, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === plant._id);
      if (existing) {
        const newQty = Math.min(existing.qty + qty, plant.stock);
        toast.success(`Updated ${plant.name} → ${newQty} plants`);
        return prev.map((i) =>
          i._id === plant._id ? { ...i, qty: newQty } : i
        );
      }
      toast.success(`${plant.name} added to cart 🌶️`);
      return [...prev, { ...plant, qty }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, qty } : i)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + (i.price ?? i.pricePerSapling ?? 0) * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
