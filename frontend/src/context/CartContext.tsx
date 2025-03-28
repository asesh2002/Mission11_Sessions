import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      //check if item exist
      const existingItem = prevCart.find((c) => c.bookId === item.bookId); //returns true or false
      //make a new cart if it does
      const updatedCart = prevCart.map((c) =>
        c.bookId === item.bookId
          ? { ...c, donationAmount: c.purchaseAmount + item.purchaseAmount }
          : c
      );

      return existingItem ? updatedCart : [...prevCart, item];
    });
  };

  const removeFromCart = (bookId: number) => {
    //filter out projects that are not equal to the project id that we are looking at
    setCart((prevCart) => prevCart.filter((c) => c.bookId !== bookId));
  };

  const clearCart = () => {
    setCart(() => []);
  };
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context;
}