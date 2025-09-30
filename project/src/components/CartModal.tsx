import React from 'react';
import { X, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { dbFunctions } from '../lib/database';
import { formatPrice, getPromotionPrice } from '../utils/formatters';
import { CartItem } from '../types/database';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [whatsappNumber, setWhatsappNumber] = React.useState('5511999999999');

  React.useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    const settings = await dbFunctions.getSiteSettings();
    setWhatsappNumber(settings.whatsapp_number);
  };

  if (!isOpen) return null;

  const getItemPrice = (item: CartItem) => {
    return getPromotionPrice(
      item.product.price,
      item.product.is_on_promotion,
      item.product.promotion_discount
    );
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    let message = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    
    items.forEach((item, index) => {
      const itemPrice = getItemPrice(item);
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Quantidade: ${item.quantity}\n`;
      message += `   Preço unitário: ${formatPrice(itemPrice)}\n`;
      message += `   Subtotal: ${formatPrice(itemPrice * item.quantity)}\n\n`;
    });
    
    message += `*Total: ${formatPrice(getTotalPrice())}*\n\n`;
    message += "Aguardo confirmação. Obrigado!";

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <ShoppingBag className="mr-2 text-red-600" size={24} />
            Carrinho
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemPrice = getItemPrice(item);
                return (
                  <div key={item.product.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium text-gray-800 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          {item.product.is_on_promotion && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(item.product.price)}
                            </div>
                          )}
                          <div className="font-bold text-red-600">
                            {formatPrice(itemPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-red-600">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <MessageCircle className="mr-2" size={20} />
                Finalizar pelo WhatsApp
              </button>
              
              <button
                onClick={clearCart}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};