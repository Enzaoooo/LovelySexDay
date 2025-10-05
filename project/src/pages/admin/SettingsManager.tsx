import { useState, useEffect, FormEvent } from 'react';
import { supabase, uploadImage } from '../../lib/supabase';
import { SiteSettings } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Save } from 'lucide-react';

export const SettingsManager = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    site_name: '',
    whatsapp_number: '',
    email: '',
    instagram: '',
    facebook: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
      setFormData({
        site_name: data.site_name,
        whatsapp_number: data.whatsapp_number,
        email: data.email,
        instagram: data.instagram,
        facebook: data.facebook,
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = settings?.logo_url || null;

      if (logoFile) {
        logoUrl = await uploadImage(logoFile, 'settings');
      }

      const settingsData = {
        ...formData,
        logo_url: logoUrl,
      };

      if (settings) {
        await supabase
          .from('site_settings')
          .update(settingsData)
          .eq('id', settings.id);
      } else {
        await supabase.from('site_settings').insert(settingsData);
      }

      alert('Configurações salvas com sucesso!');
      loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Configurações do Site</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Input
          label="Nome do Site"
          value={formData.site_name}
          onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Logo da Navbar
          </label>
          {settings?.logo_url && (
            <div className="mb-3 p-4 bg-neutral-100 rounded-lg">
              <img
                src={settings.logo_url}
                alt="Logo atual"
                className="h-12 w-auto object-contain"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            className="input-field"
          />
        </div>

        <Input
          label="Número do WhatsApp"
          placeholder="5511999999999"
          value={formData.whatsapp_number}
          onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="contato@lovelysexday.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          label="Instagram"
          placeholder="@lovelysexday"
          value={formData.instagram}
          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
        />

        <Input
          label="Facebook"
          placeholder="lovelysexday"
          value={formData.facebook}
          onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
        />

        <Button type="submit" disabled={loading} size="lg">
          <Save className="w-5 h-5" />
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </form>
    </div>
  );
};
