import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { generateSecureId, sanitizeInput } from '../../utils/security';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export function AdminProducts() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    shortDescription: '',
    category: '',
    images: [],
    specifications: {},
    usage: '',
    status: 'active',
    featured: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitizar todos os campos de entrada
    const sanitizedData = {
      ...formData,
      name: sanitizeInput(formData.name || ''),
      description: sanitizeInput(formData.description || ''),
      shortDescription: sanitizeInput(formData.shortDescription || ''),
      usage: sanitizeInput(formData.usage || '')
    };
    
    const productData: Product = {
      ...sanitizedData,
      id: editingProduct?.id || generateSecureId(),
    } as Product;

    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: productData });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: productData });
    }

    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      description: '',
      shortDescription: '',
      category: '',
      images: [],
      specifications: {},
      usage: '',
      status: 'active',
      featured: false
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    }
  };

  const toggleStatus = (product: Product) => {
    dispatch({
      type: 'UPDATE_PRODUCT',
      payload: {
        ...product,
        status: product.status === 'active' ? 'inactive' : 'active'
      }
    });
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
          </h1>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-white"
          >
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome do Produto
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
                Preço
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Selecione uma categoria</option>
              {state.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição Curta
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição Detalhada
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Modo de Uso
            </label>
            <textarea
              value={formData.usage}
              onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                Produto em Destaque
              </label>
            </div>
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
              {editingProduct ? 'Atualizar' : 'Criar'} Produto
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gerenciar Produtos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Produto</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300">Imagem</th>
              <th className="text-left p-4 text-gray-300">Nome</th>
              <th className="text-left p-4 text-gray-300">Categoria</th>
              <th className="text-left p-4 text-gray-300">Preço</th>
              <th className="text-left p-4 text-gray-300">Status</th>
              <th className="text-left p-4 text-gray-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            {state.products.map((product) => {
              const category = state.categories.find(c => c.id === product.category);
              return (
                <tr key={product.id} className="border-t border-gray-700">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-white">{product.name}</td>
                  <td className="p-4 text-gray-300">{category?.name}</td>
                  <td className="p-4 text-purple-400 font-semibold">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(product)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
                        product.status === 'active'
                          ? 'bg-green-900/20 text-green-400'
                          : 'bg-red-900/20 text-red-400'
                      }`}
                    >
                      {product.status === 'active' ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      <span>{product.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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

        {state.products.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhum produto cadastrado
          </div>
        )}
      </div>
    </div>
  );
}