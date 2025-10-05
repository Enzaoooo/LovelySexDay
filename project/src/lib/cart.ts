import { CartItem, Product, Promotion } from './types';

const CART_KEY = 'lovely_cart';

export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product: Product, promotion?: Promotion): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product, quantity: 1, promotion });
  }

  saveCart(cart);
  window.dispatchEvent(new CustomEvent('cart-updated'));
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.product.id !== productId);
  saveCart(updatedCart);
  window.dispatchEvent(new CustomEvent('cart-updated'));
};

export const updateCartQuantity = (productId: string, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.product.id === productId);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  }
};

export const clearCart = (): void => {
  saveCart([]);
  window.dispatchEvent(new CustomEvent('cart-updated'));
};

export const getCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    const price = item.promotion?.discount_price || item.product.price;
    return total + (price * item.quantity);
  }, 0);
};

export const getCartCount = (): number => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};
