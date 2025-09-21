import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { mockProducts, mockCategories } from '../data/mockData';

export function useInitialData() {
  const { dispatch } = useApp();

  useEffect(() => {
    // Initialize with mock data
    dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
    dispatch({ type: 'SET_CATEGORIES', payload: mockCategories });
  }, [dispatch]);
}