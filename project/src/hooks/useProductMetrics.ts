import { useLocalStorage } from './useLocalStorage';
import { Product } from '../types';

export function useProductMetrics() {
  const [productViews, setProductViews] = useLocalStorage<Record<string, number>>('product-views', {});

  const incrementView = (productId: string) => {
    setProductViews(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const getProductViews = (productId: string): number => {
    return productViews[productId] || 0;
  };

  const getMostViewedProducts = (products: Product[], limit: number = 6): Product[] => {
    return products
      .map(product => ({
        ...product,
        views: getProductViews(product.id)
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  };

  return {
    incrementView,
    getProductViews,
    getMostViewedProducts
  };
}