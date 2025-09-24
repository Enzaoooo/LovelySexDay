import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { generateSecureId, sanitizeInput } from '../../utils/security';
import { Plus, Edit, Trash2 } from 'lucide-react';

export function AdminCategories() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', image: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitizar dados de entrada
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      slug: sanitizeInput(formData.slug),
      image: sanitizeInput(formData.image)
    };
    
    const categoryData: Category = {
      ...sanitizedData,
      id: editingCategory?.id || generateSecureId(),
      slug: sanitizedData.slug || sanitizedData.name.toLowerCase().replace(/\s+/g, '-')
    };

    if (editingCategory) {
      dispatch({ type: 'UPDATE_CATEGORY', payload: categoryData });
    } else {
      dispatch({ type: 'ADD_CATEGORY', payload: categoryData });
    }

    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', image: '' });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image || ''
    });
    setShowForm(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            {editingCategory ? 'Editar Categoria' : 'Adicionar Categoria'}
          </h1>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-white"
          >
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome da Categoria
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug (URL amigável)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Será gerado automaticamente se vazio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL da Imagem (opcional)
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700"
            >
              {editingCategory ? 'Atualizar' : 'Criar'} Categoria
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gerenciar Categorias</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Categoria</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300">Imagem</th>
              <th className="text-left p-4 text-gray-300">Nome</th>
              <th className="text-left p-4 text-gray-300">Slug</th>
              <th className="text-left p-4 text-gray-300">Produtos</th>
              <th className="text-left p-4 text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            {state.categories.map((category) => {
              const productCount = state.products.filter(p => p.category === category.id).length;
              return (
                <tr key={category.id} className="border-t border-gray-700">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-white">{category.name}</td>
                  <td className="p-4 text-gray-300">{category.slug}</td>
                  <td className="p-4 text-purple-400">{productCount}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {state.categories.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhuma categoria cadastrada
          </div>
        )}
      </div>
    </div>
  );
}