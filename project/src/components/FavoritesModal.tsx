import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { supabase } from '../lib/supabase';
import { getSessionId } from '../lib/session';
import { Product, Promotion } from '../lib/types';
import { addToCart } from '../lib/cart';

interface FavoriteWithProduct {
  id: string;
  product: Product;
  promotion?: Promotion;
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesModal = ({ isOpen, onClose }: FavoritesModalProps) => {
  const [favorites, setFavorites] = useState<FavoriteWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const loadFavorites = async () => {
    setLoading(true);
    const sessionId = getSessionId();

    const { data: favData } = await supabase
      .from('favorites')
      .select('id, product_id')
      .eq('session_id', sessionId);

    if (favData && favData.length > 0) {
      const productIds = favData.map(f => f.product_id);

      const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      const { data: promotions } = await supabase
        .from('promotions')
        .select('*')
        .in('product_id', productIds)
        .eq('is_active', true);

      const favoritesWithProducts = favData.map(fav => {
        const product = products?.find(p => p.id === fav.product_id);
        const promotion = promotions?.find(p => p.product_id === fav.product_id);

        return {
          id: fav.id,
          product: product!,
          promotion,
        };
      }).filter(f => f.product);

      setFavorites(favoritesWithProducts);
    } else {
      setFavorites([]);
    }

    setLoading(false);
  };

  const removeFavorite = async (favoriteId: string) => {
    await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId);

    loadFavorites();
  };

  const handleAddToCart = (favorite: FavoriteWithProduct) => {
    addToCart(favorite.product, favorite.promotion);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Meus Favoritos" maxWidth="lg">
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8 text-neutral-500">Carregando...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-500 mb-4">Nenhum produto favoritado ainda</p>
            <Button onClick={onClose}>Explorar Produtos</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => {
              const hasPromotion = favorite.promotion &&
                new Date(favorite.promotion.starts_at) <= new Date() &&
                (!favorite.promotion.ends_at || new Date(favorite.promotion.ends_at) >= new Date());

              const displayPrice = hasPromotion
                ? favorite.promotion!.discount_price
                : favorite.product.price;

              return (
                <div
                  key={favorite.id}
                  className="flex gap-4 p-5 bg-neutral-50 rounded-2xl hover:bg-neutral-100 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1"
                >
                  <div className="w-20 h-20 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-md">
                    {favorite.product.image_url ? (
                      <img
                        src={favorite.product.image_url}
                        alt={favorite.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-neutral-900 line-clamp-1 mb-1">
                      {favorite.product.name}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      {hasPromotion && (
                        <span className="text-sm text-neutral-400 line-through">
                          R$ {favorite.product.price.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-black">
                        R$ {displayPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleAddToCart(favorite)}
                      className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 shadow-md"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      className="p-2 rounded-full bg-neutral-200 text-neutral-700 hover:bg-rose hover:text-white transition-all duration-300 transform hover:scale-110 shadow-sm"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
