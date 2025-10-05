import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Promotion } from '../lib/types';
import { ProductCard } from './ProductCard';
import { useRef, useState, useEffect } from 'react';

interface ProductScrollSectionProps {
  title: string;
  products: Product[];
  promotions?: Promotion[];
}

export const ProductScrollSection = ({ title, products, promotions }: ProductScrollSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-black">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white">
            {title}
          </h2>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 hover:border-gold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 disabled:hover:border-neutral-800"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 hover:border-gold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 disabled:hover:border-neutral-800"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="flex gap-4 md:gap-6 pb-4">
            {products.map((product) => {
              const promotion = promotions?.find(p => p.product_ids?.includes(product.id));
              return (
                <div
                  key={product.id}
                  className="flex-none w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] min-w-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <ProductCard product={product} promotion={promotion} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
