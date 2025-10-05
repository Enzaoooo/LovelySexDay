import React, { useState, useEffect } from 'react';
import { Save, Settings, Phone, Upload, X } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../../lib/database';
import { uploadImage } from '../../lib/supabase';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { formatPhoneNumber } from './utils/formatters';

export const SiteSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState({
    whatsapp_number: '',
    site_name: '',
    logo_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleRemoveImage = () => {
    setSettings(prev => ({ ...prev, logo_url: '' }));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const siteSettings = await getSiteSettings();
      if (siteSettings) {
        setSettings({
          whatsapp_number: siteSettings.whatsapp_number || '',
          site_name: siteSettings.site_name || '',
          logo_url: siteSettings.logo_url || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      let imageUrl = settings.logo_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'site');
      }

      const updatedSettings = {
        ...settings,
        logo_url: imageUrl,
      };

      await updateSiteSettings(updatedSettings);
      setSettings(updatedSettings);
      setImageFile(null);
      setMessage('Configurações salvas com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbersOnly = e.target.value.replace(/\D/g, '');
    
    setSettings(prev => ({
      ...prev,
      whatsapp_number: numbersOnly
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Settings className="text-red-600 mr-3" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Configurações do Site</h2>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('sucesso') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Site
            </label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
              placeholder="Nome do site"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline mr-2" size={16} />
              Número do WhatsApp
            </label>
            <input
              type="text"
              value={formatPhoneNumber(settings.whatsapp_number)}
              onChange={handlePhoneChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
              placeholder="+55 (11) 99999-9999"
            />
            <p className="text-sm text-gray-500 mt-1">
              Digite apenas números. Exemplo: 5511999999999
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="inline mr-2" size={16} />
              Imagem da Navbar
            </label>
            <div className="mt-2 flex items-center">
              {settings.logo_url && (
                <div className="relative mr-4">
                  <img src={settings.logo_url} alt="Navbar Logo" className="h-12" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 hover:bg-red-100"
                    title="Remover imagem"
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                </div>
              )}
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={16} />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};