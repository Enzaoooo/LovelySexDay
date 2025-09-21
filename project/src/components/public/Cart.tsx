import React from 'react';
import { CartItem } from '../../types';
import { Minus, Plus, Trash2, ArrowLeft, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CartProps {
  onBack: () => void;
}

export function Cart({ onBack }: CartProps) {
  const { state, dispatch } = useApp();

  const updateQuantity = (productId: string, newQuantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: productId, quantity: newQuantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const totalValue = state.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const generateWhatsAppMessage = () => {
    const items = state.cart.map(item => 
      `• ${item.product.name} (Quantidade: ${item.quantity})`
    ).join('\n');
    
    const message = `Olá! Gostaria de fazer um pedido:\n\n${items}\n\nValor Total: R$ ${totalValue.toFixed(2).replace('.', ',')}\n\nAguardo confirmação!\n\n*Pedido enviado via Lovely Sex Day*`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppRedirect = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/5512982226485?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Continuar comprando</span>
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Carrinho de Compras</h1>

        {state.cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Seu carrinho está vazio</p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Explorar Produtos
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {state.cart.map((item) => (
                <div key={item.product.id} className="bg-gray-900 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-24 aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    {item.product.images[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="text-white font-semibold">{item.product.name}</h3>
                    <p className="text-gray-400 text-sm">{item.product.shortDescription}</p>
                    <p className="text-purple-400 font-semibold">
                      R$ {item.product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-800 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-white font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal and Remove */}
                    <div className="text-right">
                      <p className="text-white font-bold">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-400 hover:text-red-300 transition-colors mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-white">Total do Pedido:</span>
                <span className="text-3xl font-bold text-purple-400">
                  R$ {totalValue.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button
                onClick={handleWhatsAppRedirect}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="h-6 w-6" />
                <span>Finalizar Pedido via WhatsApp</span>
              </button>
              
              <p className="text-gray-400 text-sm text-center mt-4">
                Você será redirecionado para o WhatsApp com os detalhes do seu pedido
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}