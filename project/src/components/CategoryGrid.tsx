import React from 'react';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  products: Product[];
}

export function CategoryGrid({ categories, onCategoryClick, products }: CategoryGridProps) {
  // Calculate dynamic product counts
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    productCount: products.filter(product => product.category === category.name).length
  }));

  return (
    <section id="categorias" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Nossas Categorias
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore nossa seleção cuidadosamente curada de produtos premium
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoriesWithCounts.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategoryClick(category)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-300">{category.productCount} produtos</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}