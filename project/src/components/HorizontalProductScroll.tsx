import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface HorizontalProductScrollProps {
  products: Product[];
  categoryName: string;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  getProductViews?: (productId: string) => number;
}

export function HorizontalProductScroll({
  products,
  categoryName,
  onAddToCart,
  onProductClick,
  getProductViews
}: HorizontalProductScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 text-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
              {categoryName}
            </h2>
            <p className="text-gray-600 mt-2">{products.length} produtos disponíveis</p>
          </div>
          
          <div className="flex space-x-2 justify-center">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200 hover:border-rose-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200 hover:border-rose-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 justify-start"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-80">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onProductClick={onProductClick}
                  views={getProductViews ? getProductViews(product.id) : product.views}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}