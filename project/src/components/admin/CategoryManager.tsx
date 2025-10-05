import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../lib/database';
import { uploadImage, deleteImage } from '../../lib/supabase';
import { Category } from '../../lib/types';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setMessage('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: ''
    });
    setEditingCategory(null);
    setImageFile(null);
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image_url: category.image_url || ''
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
        imageUrl = await uploadImage(imageFile, 'categories');
      }

      const categoryData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
        setMessage('Categoria atualizada com sucesso!');
      } else {
        await createCategory(categoryData);
        setMessage('Categoria criada com sucesso!');
      }

      await loadCategories();
      closeModal();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      setMessage('Erro ao salvar categoria');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        if (category.image_url) {
          await deleteImage(category.image_url);
        }
        await deleteCategory(category.id);
        await loadCategories();
        setMessage('Categoria excluída com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        setMessage('Erro ao excluir categoria');
      }
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
            <Tag className="text-red-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Categorias</h2>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <Plus className="mr-2" size={16} />
            Nova Categoria
          </button>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <img
                src={category.image_url || ''}
                alt={category.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => openModal(category)}
                  className="text-blue-600 hover:text-blue-900 p-2"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="text-red-600 hover:text-red-900 p-2"
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
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
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
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  placeholder="Ex: Lingeries, Perfumes, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  placeholder="Descreva a categoria..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem da Categoria
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="category-image-upload"
                  />
                  <label
                    htmlFor="category-image-upload"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center cursor-pointer"
                  >
                    <Upload className="mr-2" size={16} />
                    Escolher Imagem
                  </label>
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                </div>
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
                      {editingCategory ? 'Atualizar' : 'Criar'} Categoria
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