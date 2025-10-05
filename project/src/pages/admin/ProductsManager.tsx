import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Upload } from 'lucide-react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Product, Category } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';

export const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    specifications: '',
    price: '',
    category_id: '',
    is_featured: false,
    stock: '0',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (productsData) setProducts(productsData);
    if (categoriesData) setCategories(categoriesData);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        specifications: product.specifications,
        price: product.price.toString(),
        category_id: product.category_id || '',
        is_featured: product.is_featured,
        stock: product.stock.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        specifications: '',
        price: '',
        category_id: '',
        is_featured: false,
        stock: '0',
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingProduct?.image_url || null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'products');
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: formData.category_id || null,
        image_url: imageUrl,
      };

      if (editingProduct) {
        await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert(productData);
      }

      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await supabase.from('products').delete().eq('id', id);
      loadData();
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Produtos</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Novo Produto
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-100 border-b border-neutral-200">
            <tr>
              <th className="text-left p-3 font-semibold">Imagem</th>
              <th className="text-left p-3 font-semibold">Nome</th>
              <th className="text-left p-3 font-semibold">Preço</th>
              <th className="text-left p-3 font-semibold">Estoque</th>
              <th className="text-left p-3 font-semibold">Destaque</th>
              <th className="text-right p-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                <td className="p-3">
                  <div className="w-12 h-12 bg-neutral-100 rounded overflow-hidden">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">R$ {product.price.toFixed(2)}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">{product.is_featured ? 'Sim' : 'Não'}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-2 hover:bg-neutral-200 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-rose/10 text-rose rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Nome"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (!editingProduct) {
                setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
              }
            }}
            required
          />

          <Input
            label="Slug (URL)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            <Input
              label="Estoque"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Categoria
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="input-field"
            >
              <option value="">Sem categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Textarea
            label="Especificações"
            value={formData.specifications}
            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Imagem
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
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium text-neutral-700">Produto em destaque</span>
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
