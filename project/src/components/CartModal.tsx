import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } from '../lib/cart';
import { CartItem } from '../lib/types';
import { supabase } from '../lib/supabase';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCart();
      loadWhatsapp();
    }

    const handleCartUpdate = () => {
      if (isOpen) {
        loadCart();
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [isOpen]);

  const loadCart = () => {
    setCart(getCart());
  };

  const loadWhatsapp = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('whatsapp_number')
      .maybeSingle();

    if (data?.whatsapp_number) {
      setWhatsapp(data.whatsapp_number);
    }
  };

  const handleCheckout = () => {
    if (!whatsapp) {
      alert('WhatsApp não configurado');
      return;
    }

    let message = 'Olá! Gostaria de fazer um pedido:\n\n';

    cart.forEach((item) => {
      const price = item.promotion?.discount_price || item.product.price;
      message += `• ${item.product.name}\n`;
      message += `  Quantidade: ${item.quantity}\n`;
      message += `  Preço: R$ ${(price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `*Total: R$ ${getCartTotal(cart).toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  const total = getCartTotal(cart);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Meu Carrinho" maxWidth="lg">
      <div className="p-6">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-500 mb-4">Seu carrinho está vazio</p>
            <Button onClick={onClose}>Explorar Produtos</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => {
                const price = item.promotion?.discount_price || item.product.price;
                const hasPromotion = !!item.promotion;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-5 bg-neutral-50 rounded-2xl hover:shadow-lg transition-all duration-500"
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-md">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-neutral-900 line-clamp-2 mb-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
                        {hasPromotion && (
                          <span className="text-sm text-neutral-400 line-through">
                            R$ {item.product.price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-black">
                          R$ {price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white rounded-full border border-neutral-200 shadow-sm">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 hover:bg-neutral-100 rounded-l-full transition-all duration-300 transform hover:scale-110 text-black"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold min-w-[2rem] text-center text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 hover:bg-neutral-100 rounded-r-full transition-all duration-300 transform hover:scale-110 text-black"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 rounded-full bg-neutral-200 text-neutral-700 hover:bg-rose hover:text-white transition-all duration-300 transform hover:scale-110 shadow-sm"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-neutral-600 mb-1">Subtotal</p>
                      <p className="text-lg font-bold text-neutral-900">
                        R$ {(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-neutral-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-700">Subtotal</span>
                <span className="text-lg font-semibold text-black">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-display font-bold text-neutral-900">Total</span>
                <span className="text-2xl font-display font-bold text-black">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              variant="secondary"
              fullWidth
              size="lg"
            >
              <MessageCircle className="w-5 h-5" />
              Finalizar pelo WhatsApp
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};