// Utilitário para integração com WhatsApp
export function generateWhatsAppMessage(cartItems: Array<{ product: { name: string; price: number }; quantity: number }>, total: number): string {
  let message = "🛍️ *Pedido LovelySexDay*\n\n";
  
  cartItems.forEach(item => {
    message += `• ${item.product.name}\n`;
    message += `  Quantidade: ${item.quantity}\n`;
    message += `  Preço unitário: R$ ${item.product.price.toFixed(2)}\n\n`;
  });
  
  message += `💰 *Total: R$ ${total.toFixed(2)}*\n\n`;
  message += "Gostaria de finalizar este pedido com nossa consultora! 💕";
  
  return encodeURIComponent(message);
}

export function openWhatsApp(message: string, phoneNumber: string = '5511999999999') {
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, '_blank');
}