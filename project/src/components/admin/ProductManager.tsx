import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../../lib/database';
import { uploadImage, deleteImage } from '../../lib/supabase';
import { Product, Category } from '../../lib/types';
import { formatPrice } from './utils/formatters';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    detailed_description: '',
    technical_specs: '',
    category_id: '',
    stock_quantity: '',
    is_featured: false,
    is_on_promotion: false,
    promotion_discount: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMessage('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      detailed_description: '',
      technical_specs: '',
      category_id: '',
      stock_quantity: '',
      is_featured: false,
      is_on_promotion: false,
      promotion_discount: ''
    });
    setEditingProduct(null);
    setImageFiles([]);
    setImageUrls([]);
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description || '',
        detailed_description: product.detailed_description || '',
        technical_specs: product.technical_specs || '',
        category_id: product.category_id?.toString() || '',
        stock_quantity: product.stock_quantity.toString(),
        is_featured: product.is_featured,
        is_on_promotion: product.is_on_promotion,
        promotion_discount: product.promotion_discount?.toString() || ''
      });
      setImageUrls(product.images && product.images.length > 0 ? product.images : (product.image_url ? [product.image_url] : []));
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
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setImageUrls(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const uploadedUrls = [...imageUrls];

      for (const file of imageFiles) {
        if (file instanceof File) {
          const url = await uploadImage(file, 'products');
          const fileIndex = imageFiles.indexOf(file);
          if (fileIndex !== -1) {
            uploadedUrls[uploadedUrls.findIndex(u => u.startsWith('data:'))] = url;
          }
        }
      }

      const finalUrls = uploadedUrls.filter(url => !url.startsWith('data:'));

      const productData = {
        ...formData,
        images: finalUrls,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        stock_quantity: parseInt(formData.stock_quantity),
        promotion_discount: parseFloat(formData.promotion_discount) || 0
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setMessage('Produto atualizado com sucesso!');
      } else {
        await createProduct(productData);
        setMessage('Produto criado com sucesso!');
      }

      await loadData();
      closeModal();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setMessage('Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        if (product.images && product.images.length > 0) {
          for (const imageUrl of product.images) {
            await deleteImage(imageUrl);
          }
        } else if (product.image_url) {
          await deleteImage(product.image_url);
        }
        await deleteProduct(product.id);
        await loadData();
        setMessage('Produto excluído com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        setMessage('Erro ao excluir produto');
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
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Package className="text-red-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h2>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <Plus className="mr-2" size={16} />
            Novo Produto
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const category = categories.find(c => c.id === product.category_id);
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image_url || ''}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {product.is_featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Destaque
                          </span>
                        )}
                        {product.is_on_promotion && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Promoção
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  />
                </div>
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Detalhada
                </label>
                <textarea
                  rows={4}
                  value={formData.detailed_description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especificações Técnicas
                </label>
                <textarea
                  rows={3}
                  value={formData.technical_specs || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, technical_specs: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagens do Produto (Múltiplas)
                </label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center cursor-pointer"
                    >
                      <Upload className="mr-2" size={16} />
                      Adicionar Imagens
                    </label>
                    <span className="text-sm text-gray-500">
                      {imageUrls.length} imagem(ns) selecionada(s)
                    </span>
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Principal
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                    Produto em Destaque
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_on_promotion"
                    checked={formData.is_on_promotion}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_on_promotion: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="is_on_promotion" className="text-sm font-medium text-gray-700">
                    Em Promoção
                  </label>
                </div>
              </div>

              {formData.is_on_promotion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.promotion_discount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, promotion_discount: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  />
                </div>
              )}

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
                      {editingProduct ? 'Atualizar' : 'Criar'} Produto
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