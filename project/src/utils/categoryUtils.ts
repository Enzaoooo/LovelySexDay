import { Product, Category } from '../types';

/**
 * Calculate dynamic product counts for categories
 */
export function calculateCategoryProductCounts(products: Product[], categories: Category[]): Category[] {
  return categories.map(category => ({
    ...category,
    productCount: products.filter(product => product.category === category.name).length
  }));
}

/**
 * Get products by category name
 */
export function getProductsByCategory(products: Product[], categoryName: string): Product[] {
  return products.filter(product => product.category === categoryName);
}

/**
 * Get all unique categories from products
 */
export function getUniqueCategories(products: Product[]): string[] {
  return [...new Set(products.map(product => product.category))];
}