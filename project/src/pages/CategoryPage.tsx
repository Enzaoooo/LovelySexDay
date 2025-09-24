import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ProductGrid } from '../components/ProductGrid';
import { Category, Product } from '../types';

interface CategoryPageProps {
  category: Category;
  products: Product[];
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  getProductViews: (productId: string) => number;
}

export function CategoryPage({
  category,
  products,
  onBack,
  onProductClick,
  onAddToCart,
  getProductViews
}: CategoryPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-rose-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar</span>
        </button>
        
        <div className="relative h-48 rounded-xl overflow-hidden mb-6">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
            <p className="text-white/90 text-lg">{products.length} produtos encontrados</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <ProductGrid
        products={products}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
        getProductViews={getProductViews}
      />
    </div>
  );
}