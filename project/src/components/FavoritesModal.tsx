import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice, getPromotionPrice } from '../utils/formatters';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: number) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectProduct 
}) => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleProductClick = (productId: number) => {
    onSelectProduct(productId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Heart className="mr-2 text-red-600" size={24} />
            Favoritos
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Favorites Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Nenhum produto favoritado</p>
              <p className="text-gray-400 text-sm mt-2">
                Adicione produtos aos favoritos para vê-los aqui
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((product) => {
                const finalPrice = getPromotionPrice(
                  product.price,
                  product.is_on_promotion,
                  product.promotion_discount
                );
                
                return (
                  <div 
                    key={product.id} 
                    className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-xs truncate">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          {product.is_on_promotion && product.promotion_discount > 0 ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500 text-xs line-through">
                                {formatPrice(product.price)}
                              </span>
                              <span className="font-bold text-red-600 text-sm">
                                {formatPrice(finalPrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-red-600 text-sm">
                              {formatPrice(finalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={product.stock_quantity === 0}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                            title="Adicionar ao carrinho"
                          >
                            <ShoppingCart size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromFavorites(product.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                            title="Remover dos favoritos"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <button
              onClick={clearFavorites}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Limpar Favoritos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};