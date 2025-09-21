import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { Product, Category } from '../../types';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  onCategoryClick: (categoryId: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function HomePage({ products, categories, onCategoryClick, onProductClick, onAddToCart }: HomePageProps) {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-pink-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Bem-vindos ao
            <span className="block text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
              Lovely Sex Day
            </span>
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Descubra nossa coleção exclusiva de produtos íntimos com qualidade premium e entrega discreta
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200">
            Explorar Produtos
          </button>
        </div>
      </div>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Nossas Categorias
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                className="group relative overflow-hidden rounded-lg aspect-square bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    {category.name}
                  </h3>
                  <ChevronRight className="absolute top-2 right-2 h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Produtos em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div 
                  className="aspect-square bg-gray-700 cursor-pointer"
                  onClick={() => onProductClick(product)}
                >
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded">
                    Destaque
                  </div>
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
                    <span className="text-2xl font-bold text-purple-400">
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
        </div>
      </section>
    </div>
  );
}