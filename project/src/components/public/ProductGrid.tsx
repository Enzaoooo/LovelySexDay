import React, { useState } from 'react';
import { Product, Category } from '../../types';
import { Star, Filter, X } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategoryId?: string | null;
  searchQuery?: string;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ 
  products, 
  categories, 
  selectedCategoryId, 
  searchQuery,
  onProductClick, 
  onAddToCart 
}: ProductGridProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter products
  let filteredProducts = products.filter(p => p.status === 'active');

  if (selectedCategoryId) {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategoryId);
  }

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  filteredProducts = filteredProducts.filter(p => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const pageTitle = selectedCategory ? selectedCategory.name : 'Todos os Produtos';

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="text-lg font-semibold text-white">Filtros</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Faixa de Preço</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-sm">Mínimo: R$ {priceRange[0]}</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full mt-1 accent-purple-600"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Máximo: R$ {priceRange[1]}</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full mt-1 accent-purple-600"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-white font-medium mb-3">Categorias</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="text-gray-400 text-sm">
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
                <p className="text-gray-400">{filteredProducts.length} produtos encontrados</p>
              </div>
              
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div 
                    className="aspect-square bg-gray-700 cursor-pointer relative"
                    onClick={() => onProductClick(product)}
                  >
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded">
                        Destaque
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 
                      className="font-semibold text-white mb-2 cursor-pointer hover:text-purple-400 transition-colors"
                      onClick={() => onProductClick(product)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-purple-400">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}