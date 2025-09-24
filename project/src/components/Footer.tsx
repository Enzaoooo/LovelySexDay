import React from 'react';

export function Footer({ whatsappNumber }: { whatsappNumber: string }) {
  const sanitizedWhatsapp = whatsappNumber.replace(/\D/g, '');
  const whatsappLink = `https://wa.me/55${sanitizedWhatsapp}`;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text mb-4">
              Lovely Sex Day
            </h3>
            <p className="text-gray-400 mb-4">
              Sua loja de produtos íntimos com qualidade, discrição e entrega segura.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  WhatsApp: {whatsappNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Horário de Atendimento</h4>
            <div className="space-y-2 text-gray-400">
              <p>Segunda a Sexta: 9h às 18h</p>
              <p>Sábado: 9h às 14h</p>
              <p>Domingo: Fechado</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Lovely Sex Day. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}