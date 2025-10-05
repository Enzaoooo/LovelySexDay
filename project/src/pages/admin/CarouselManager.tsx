import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { supabase, uploadImage } from '../../lib/supabase';
import { CarouselImage } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export const CarouselManager = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    order_index: '0',
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const { data } = await supabase
      .from('carousel_images')
      .select('*')
      .order('order_index');

    if (data) setImages(data);
  };

  const handleOpenModal = (image?: CarouselImage) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        title: image.title,
        link: image.link,
        order_index: image.order_index.toString(),
        is_active: image.is_active,
      });
    } else {
      setEditingImage(null);
      setFormData({
        title: '',
        link: '',
        order_index: '0',
        is_active: true,
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingImage?.image_url || '';

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'carousel');
      } else if (!editingImage) {
        alert('Por favor, selecione uma imagem');
        setLoading(false);
        return;
      }

      const carouselData = {
        ...formData,
        order_index: parseInt(formData.order_index),
        image_url: imageUrl,
      };

      if (editingImage) {
        await supabase
          .from('carousel_images')
          .update(carouselData)
          .eq('id', editingImage.id);
      } else {
        await supabase.from('carousel_images').insert(carouselData);
      }

      setIsModalOpen(false);
      loadImages();
    } catch (error) {
      console.error('Error saving carousel image:', error);
      alert('Erro ao salvar imagem');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta imagem?')) {
      await supabase.from('carousel_images').delete().eq('id', id);
      loadImages();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Carrossel</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Nova Imagem
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.id} className="card overflow-hidden">
            <div className="aspect-video bg-neutral-100">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{image.title || 'Sem título'}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className={`badge ${image.is_active ? 'badge-new' : 'badge'}`}>
                  {image.is_active ? 'Ativa' : 'Inativa'}
                </span>
                <span className="text-sm text-neutral-600">Ordem: {image.order_index}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(image)}
                  className="btn-outline flex-1 text-sm py-2"
                >
                  <Edit2 className="w-3 h-3" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 hover:bg-rose/10 text-rose rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingImage ? 'Editar Imagem' : 'Nova Imagem'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Título"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Input
            label="Link (opcional)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />

          <Input
            label="Ordem"
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Imagem {!editingImage && '(obrigatório)'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="input-field"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium text-neutral-700">Imagem ativa</span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
