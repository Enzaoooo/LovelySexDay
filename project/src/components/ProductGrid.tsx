import React from 'react';
import { ShoppingCart, Eye, Heart, Star, Package } from 'lucide-react';
import { Product } from '../types/database';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { formatPrice, getPromotionPrice } from '../utils/formatters';
import { Badge } from './ui/Badge';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (productId: number) => void;
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onSelectProduct, 
  title = "Produtos",
  subtitle 
}) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

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

  if (products.length === 0) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
            <p className="text-gray-600">Nenhum produto encontrado.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const finalPrice = getPromotionPrice(
              product.price,
              product.is_on_promotion,
              product.promotion_discount
            );
            
            return (
              <div
                key={product.id}
                className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => onSelectProduct(product.id)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 space-y-1">
                    {product.is_featured && (
                      <Badge variant="warning" size="sm">
                        <Star className="mr-1" size={12} />
                        Destaque
                      </Badge>
                    )}
                    {product.is_on_promotion && (
                      <Badge variant="error" size="sm">
                        -{product.promotion_discount}%
                      </Badge>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product.id);
                      }}
                      className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <ShoppingCart size={20} />
                    </button>
                    <button
                      onClick={(e) => handleToggleFavorite(e, product)}
                      className={`p-3 rounded-full transition-colors ${
                        isFavorite(product.id)
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-white text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <Heart size={20} />
                    </button>
                  </div>

                  {/* Stock indicator */}
                  {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="warning" size="sm">
                        Últimas {product.stock_quantity}
                      </Badge>
                    </div>
                  )}
                  
                  {product.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Esgotado</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.is_on_promotion && product.promotion_discount > 0 ? (
                        <>
                          <span className="text-gray-500 text-sm line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            {formatPrice(finalPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(finalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock_quantity === 0}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm font-semibold"
                    >
                      <ShoppingCart size={16} />
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};