import React, { useState, useEffect } from 'react';
import { Images, Plus, Edit, Trash2, Save, X, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { getAllCarouselImages, createCarouselImage, updateCarouselImage, deleteCarouselImage, updateCarouselOrder, getCategories, getPromotions } from '../../lib/database';
import { uploadImage, deleteImage } from '../../lib/supabase';
import { CarouselImage, Category, Promotion } from '../../lib/types';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const CarouselManager: React.FC = () => {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    button_link: '',
    is_active: true
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [imagesData, categoriesData, promotionsData] = await Promise.all([
        getAllCarouselImages(),
        getCategories(),
        getPromotions()
      ]);
      setCarouselImages(imagesData);
      setCategories(categoriesData);
      setPromotions(promotionsData);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      setMessage('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      button_link: '',
      is_active: true
    });
    setEditingImage(null);
    setImageFile(null);
  };

  const openModal = (image?: CarouselImage) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        title: image.title || '',
        image_url: image.image_url,
        button_link: image.button_link || '',
        is_active: image.is_active
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    setMessage('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, image_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'carousel');
      }

      const imageData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingImage) {
        await updateCarouselImage(editingImage.id, imageData);
        setMessage('Imagem atualizada com sucesso!');
      } else {
        const newImageData = {
          ...imageData,
          order_index: carouselImages.length + 1
        };
        await createCarouselImage(newImageData);
        setMessage('Imagem adicionada com sucesso!');
      }

      await loadInitialData();
      closeModal();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      setMessage('Erro ao salvar imagem');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (image: CarouselImage) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
      try {
        await deleteImage(image.image_url);
        await deleteCarouselImage(image.id);
        await loadInitialData();
        setMessage('Imagem excluída com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        setMessage('Erro ao excluir imagem');
      }
    }
  };

  const moveImage = async (imageId: number, direction: 'up' | 'down') => {
    const currentIndex = carouselImages.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;

    const newImages = [...carouselImages];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[currentIndex], newImages[targetIndex]] = [newImages[targetIndex], newImages[currentIndex]];
      
      const updatedImages = newImages.map((img, index) => ({
        ...img,
        order_index: index + 1,
      }));
      
      try {
        await updateCarouselOrder(updatedImages);
        setCarouselImages(updatedImages);
        setMessage('Ordem das imagens atualizada!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Erro ao atualizar ordem:', error);
        setMessage('Erro ao atualizar ordem das imagens');
      }
    }
  };

  const toggleActive = async (image: CarouselImage) => {
    try {
      const updatedData = { ...image, is_active: !image.is_active };
      await updateCarouselImage(image.id, updatedData);
      await loadInitialData();
      setMessage('Status da imagem atualizado!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setMessage('Erro ao atualizar status da imagem');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Images className="text-red-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Carrossel</h2>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <Plus className="mr-2" size={16} />
            Nova Imagem
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('sucesso') || message.includes('atualizada') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          {carouselImages
            .map((image, index) => (
            <div key={image.id} className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
              <img
                src={image.image_url}
                alt={image.title || ''}
                className="w-24 h-16 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{image.title}</h3>
                <p className="text-sm text-gray-600">Posição: {image.order_index}</p>
                <p className="text-sm text-gray-600 truncate">Link: {image.button_link || 'N/A'}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  image.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {image.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => moveImage(image.id, 'up')}
                  disabled={index === 0}
                  className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 p-1"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveImage(image.id, 'down')}
                  disabled={index === carouselImages.length - 1}
                  className="text-gray-600 hover:text-gray-900 disabled:text-gray-300 p-1"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => toggleActive(image)}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    image.is_active
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {image.is_active ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => openModal(image)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(image)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                {editingImage ? 'Editar Imagem' : 'Nova Imagem'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Imagem *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  placeholder="Ex: Coleção Verão 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link do Botão (Opcional)
                </label>
                <select
                  value={formData.button_link || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                >
                  <option value="">Nenhum</option>
                  <optgroup label="Páginas">
                    <option value="#/products">Todos os Produtos</option>
                    <option value="#/promotions">Página de Promoções</option>
                  </optgroup>
                  <optgroup label="Categorias">
                    {categories.map(category => (
                      <option key={category.id} value={`#/products?category=${category.slug}`}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Promoções">
                    {promotions.map(promo => (
                      <option key={promo.id} value={`#/promotions`}>
                        {promo.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem do Carrossel *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="carousel-image-upload"
                  />
                  <label
                    htmlFor="carousel-image-upload"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center cursor-pointer"
                  >
                    <Upload className="mr-2" size={16} />
                    Escolher Imagem
                  </label>
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-20 h-12 object-cover rounded-lg"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: 1200x400px ou superior
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Imagem Ativa
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
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
                      {editingImage ? 'Atualizar' : 'Adicionar'} Imagem
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};