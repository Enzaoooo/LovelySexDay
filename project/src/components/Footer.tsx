import { useEffect, useState } from 'react';
import { Heart, Mail, MessageCircle, Instagram, Facebook, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../lib/types';

export const Footer = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .maybeSingle();

    if (data) {
      setSettings(data);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black-dark border-t border-neutral-800 text-white mt-24">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-display text-3xl font-bold mb-4 text-gold">
              {settings?.site_name || 'Lovely Sex Day'}
            </h3>
            <p className="text-neutral-400 mb-6 leading-relaxed font-light">
              Sua loja especializada em produtos íntimos de qualidade. Discrição, elegância e satisfação garantidas.
            </p>
            <div className="flex gap-3">
              {settings?.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-black-light border border-neutral-800 hover:border-magenta hover:text-magenta transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.facebook && (
                <a
                  href={`https://facebook.com/${settings.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-black-light border border-neutral-800 hover:border-magenta hover:text-magenta transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gold"></div>
              Links Úteis
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#/" className="text-neutral-400 hover:text-gold transition-colors duration-300 tracking-wide">
                  Início
                </a>
              </li>
              <li>
                <a href="#/categories" className="text-neutral-400 hover:text-gold transition-colors duration-300 tracking-wide">
                  Categorias
                </a>
              </li>
              <li>
                <a href="#/products" className="text-neutral-400 hover:text-gold transition-colors duration-300 tracking-wide">
                  Produtos
                </a>
              </li>
              <li>
                <a href="#/promotions" className="text-neutral-400 hover:text-gold transition-colors duration-300 tracking-wide">
                  Promoções
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gold"></div>
              Contato
            </h4>
            <ul className="space-y-4">
              {settings?.whatsapp_number && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-neutral-400 hover:text-wine transition-all duration-300 group"
                  >
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="tracking-wide">WhatsApp</span>
                  </a>
                </li>
              )}
              
            </ul>
          </div>
        </div>

        
      
      </div>
    </footer>
  );
};
