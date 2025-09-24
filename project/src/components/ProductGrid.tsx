import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  getProductViews?: (productId: string) => number;
}

export function ProductGrid({ 
  products, 
  title, 
  subtitle, 
  onAddToCart, 
  onProductClick,
  getProductViews 
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          {title && (
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent mb-4">
                {title}
              </h2>
              {subtitle && <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>}
            </div>
          )}
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="py-16">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent mb-4">
              {title}
            </h2>
            {subtitle && <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
              views={getProductViews ? getProductViews(product.id) : product.views}
            />
          ))}
        </div>
      </div>
    </section>
  );
}