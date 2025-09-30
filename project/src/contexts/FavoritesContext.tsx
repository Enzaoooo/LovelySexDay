import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/database';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  getTotalFavorites: () => number;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage<Product[]>(STORAGE_KEYS.FAVORITES, []);

  const addToFavorites = (product: Product) => {
    setFavorites(currentFavorites => {
      const isAlreadyFavorite = currentFavorites.some(fav => fav.id === product.id);
      if (isAlreadyFavorite) {
        return currentFavorites;
      }
      return [...currentFavorites, product];
    });
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites(currentFavorites => 
      currentFavorites.filter(favorite => favorite.id !== productId)
    );
  };

  const isFavorite = (productId: number) => {
    return favorites.some(favorite => favorite.id === productId);
  };

  const getTotalFavorites = () => {
    return favorites.length;
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getTotalFavorites,
    clearFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};