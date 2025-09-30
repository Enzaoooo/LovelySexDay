import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Product, Category } from '../types/database';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { formatPrice, getPromotionPrice } from '../utils/formatters';
import { PAGINATION } from '../utils/constants';
import { Badge } from './ui/Badge';

interface CategorySectionProps {
  category: Category;
  products: Product[];
  onSelectProduct: (productId: number) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  products, 
  onSelectProduct 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const itemsPerView = PAGINATION.ITEMS_PER_VIEW;

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, products.length - itemsPerView) : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= products.length - itemsPerView ? 0 : prevIndex + 1
    );
  };

  if (products.length === 0) return null;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-serif">
            {category.name}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= products.length - itemsPerView}
              className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {products.map((product) => {
              const finalPrice = getPromotionPrice(
                product.price,
                product.is_on_promotion,
                product.promotion_discount
              );
              
              return (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-1/4 px-2"
                  style={{ minWidth: `${100 / itemsPerView}%` }}
                >
                  <div
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => onSelectProduct(product.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      
                      {/* Favorite button overlay */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, product)}
                        className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                          isFavorite(product.id)
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-600'
                        }`}
                      >
                        <Heart size={16} />
                      </button>
                      
                      {product.is_on_promotion && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="error" size="sm">
                            -{product.promotion_discount}%
                          </Badge>
                        </div>
                      )}

                      {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                        <div className="absolute bottom-2 right-2">
                          <Badge variant="warning" size="sm">
                            Últimas {product.stock_quantity}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 text-sm line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {product.is_on_promotion && product.promotion_discount > 0 ? (
                            <>
                              <span className="text-gray-500 text-xs line-through">
                                {formatPrice(product.price)}
                              </span>
                              <span className="text-sm font-bold text-red-600">
                                {formatPrice(finalPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-red-600">
                              {formatPrice(finalPrice)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock_quantity === 0}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                        >
                          {product.stock_quantity === 0 ? 'Esgotado' : 'Adicionar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};