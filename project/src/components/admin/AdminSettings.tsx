import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validatePhone, sanitizeInput } from '../../utils/security';
import { Phone } from 'lucide-react';

export function AdminSettings() {
  const { state, dispatch } = useApp();
  const [whatsappNumber, setWhatsappNumber] = useState(state.config.whatsappNumber);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitizar e validar entrada
    const sanitizedNumber = sanitizeInput(whatsappNumber);
    
    if (!validatePhone(sanitizedNumber)) {
      alert('Número de telefone inválido. Use o formato: +5512982226485');
      return;
    }
    
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: { whatsappNumber: sanitizedNumber }
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Configurações Gerais</h1>

      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número de WhatsApp para Pedidos
            </label>
            <p className="text-gray-400 text-sm mb-3">
              Este número será usado para receber os pedidos dos clientes. Inclua o código do país (ex: +5511999999999)
            </p>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="+5512982226485"
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              {saved && (
                <span className="text-green-400 text-sm">Configurações salvas com sucesso!</span>
              )}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700"
            >
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Informações do Sistema</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Nome da Loja:</span>
            <span className="text-white">{state.config.storeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total de Produtos:</span>
            <span className="text-white">{state.products.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total de Categorias:</span>
            <span className="text-white">{state.categories.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}