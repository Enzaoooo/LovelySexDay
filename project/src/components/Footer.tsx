import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { dbFunctions } from '../lib/database';
import { formatPhoneNumber } from '../utils/formatters';

export const Footer: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = React.useState('5511999999999');

  React.useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    const settings = await dbFunctions.getSiteSettings();
    setWhatsappNumber(settings.whatsapp_number);
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Olá! Gostaria de mais informações.`, '_blank');
  };

  return (
    <footer className="bg-gradient-to-r from-red-600 via-purple-700 to-red-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif tracking-wide">
            Lovely Sex Day
          </h2>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Phone size={20} />
              <span className="font-semibold">{formatPhoneNumber(whatsappNumber).replace(/^\+55 /, '')}</span>
            </div>
            
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full transition-colors"
            >
              <MessageCircle size={20} />
              <span className="font-semibold">WhatsApp</span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 pt-8">
            <p className="text-white/80">
              © 2024 Lovely Sex Day. Todos os direitos reservados.
            </p>
            <p className="text-white/60 text-sm mt-2">
              Site destinado exclusivamente para maiores de 18 anos.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};