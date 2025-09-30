export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
};

export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length >= 13) {
    return numbers.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
  } else if (numbers.length >= 11) {
    return numbers.replace(/(\d{2})(\d{2})(\d{5})(\d*)/, '+$1 ($2) $3-$4');
  } else if (numbers.length >= 7) {
    return numbers.replace(/(\d{2})(\d{2})(\d*)/, '+$1 ($2) $3');
  } else if (numbers.length >= 4) {
    return numbers.replace(/(\d{2})(\d*)/, '+$1 ($2');
  } else if (numbers.length >= 2) {
    return numbers.replace(/(\d{2})/, '+$1');
  }
  return numbers;
};

export const getPromotionPrice = (price: number, isOnPromotion: boolean, discount: number): number => {
  return isOnPromotion && discount > 0 ? price * (1 - discount / 100) : price;
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};