import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Images, 
  Users, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings
} from 'lucide-react';
import { Product, Category, CarouselItem, Admin } from '../types';
import { sanitizeInput, sanitizeHTML } from '../utils/security';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  carouselItems: CarouselItem[];
  admins: Admin[];
  whatsappNumber: string;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateCarousel: (items: CarouselItem[]) => void;
  onUpdateAdmins: (admins: Admin[]) => void;
  onUpdateWhatsappNumber: (whatsappNumber: string) => void;
  onLogout: () => void;
  getProductViews: (productId: string) => number;
}

export function AdminDashboard({
  products,
  categories,
  carouselItems,
  admins,
  whatsappNumber,
  onUpdateProducts,
  onUpdateCategories,
  onUpdateCarousel,
  onUpdateAdmins,
  onUpdateWhatsappNumber,
  onLogout,
  getProductViews
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'carousel' | 'admins' | 'settings'>('dashboard');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showEditAdminForm, setShowEditAdminForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingCarousel, setEditingCarousel] = useState<CarouselItem | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [whatsappInput, setWhatsappInput] = useState(whatsappNumber);

  // Product Form
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    featured: false
  });

  // Category Form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    image: ''
  });

  // Carousel Form
  const [carouselForm, setCarouselForm] = useState({
    image: '',
    title: '',
    description: '',
    link: ''
  });

  // Admin Form
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
    email: ''
  });

  // Edit Admin Form
  const [editAdminForm, setEditAdminForm] = useState({
    username: '',
    email: ''
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, ...productForm, name: sanitizeHTML(productForm.name), description: sanitizeHTML(productForm.description) }
          : p
      );
      onUpdateProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productForm,
        name: sanitizeHTML(productForm.name),
        description: sanitizeHTML(productForm.description),
        views: 0
      };
      onUpdateProducts([...products, newProduct]);
    }

    setProductForm({ name: '', description: '', price: 0, image: '', category: '', featured: false });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map(c => 
        c.id === editingCategory.id 
          ? { ...editingCategory, ...categoryForm, name: sanitizeHTML(categoryForm.name) }
          : c
      );
      onUpdateCategories(updatedCategories);
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        ...categoryForm,
        name: sanitizeHTML(categoryForm.name),
        productCount: 0
      };
      onUpdateCategories([...categories, newCategory]);
    }

    setCategoryForm({ name: '', image: '' });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleCarouselSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCarousel) {
      // Update existing carousel item
      const updatedItems = carouselItems.map(item => 
        item.id === editingCarousel.id 
          ? { ...editingCarousel, ...carouselForm, title: sanitizeHTML(carouselForm.title), description: sanitizeHTML(carouselForm.description) }
          : item
      );
      onUpdateCarousel(updatedItems);
    } else {
      // Add new carousel item
      const newItem: CarouselItem = {
        id: Date.now().toString(),
        ...carouselForm,
        title: sanitizeHTML(carouselForm.title),
        description: sanitizeHTML(carouselForm.description)
      };
      onUpdateCarousel([...carouselItems, newItem]);
    }

    setCarouselForm({ image: '', title: '', description: '', link: '' });
    setEditingCarousel(null);
    setShowCarouselForm(false);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAdmin: Admin = {
      id: Date.now().toString(),
      username: sanitizeInput(adminForm.username),
      password: sanitizeInput(adminForm.password), // In production, hash this
      email: sanitizeInput(adminForm.email),
      createdAt: new Date().toISOString()
    };
    
    onUpdateAdmins([...admins, newAdmin]);
    setAdminForm({ username: '', password: '', email: '' });
    setShowAdminForm(false);
  };

  const handleEditAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAdmin) {
      const updatedAdmins = admins.map(admin => 
        admin.id === editingAdmin.id 
          ? { 
              ...admin, 
              username: sanitizeInput(editAdminForm.username),
              email: sanitizeInput(editAdminForm.email)
            }
          : admin
      );
      onUpdateAdmins(updatedAdmins);
    }
    
    setEditAdminForm({ username: '', email: '' });
    setEditingAdmin(null);
    setShowEditAdminForm(false);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const deleteCategory = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      onUpdateCategories(categories.filter(c => c.id !== id));
    }
  };

  const deleteCarouselItem = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item do carrossel?')) {
      onUpdateCarousel(carouselItems.filter(item => item.id !== id));
    }
  };

  const deleteAdmin = (id: string) => {
    if (admins.length > 1 && window.confirm('Tem certeza que deseja excluir este administrador?')) {
      onUpdateAdmins(admins.filter(admin => admin.id !== id));
    }
  };

  const editAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setEditAdminForm({
      username: admin.username,
      email: admin.email
    });
    setShowEditAdminForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-rose-600 to-orange-600 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin LovelySexDay</h1>
        </div>
        
        <nav className="mt-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Produtos', icon: Package },
            { id: 'categories', label: 'Categorias', icon: Layers },
            { id: 'carousel', label: 'Carrossel', icon: Images },
                        { id: 'admins', label: 'Administradores', icon: Users },
            { id: 'settings', label: 'Configurações', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                activeTab === item.id ? 'bg-white/20' : ''
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-white/10 transition-colors rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Produtos</h3>
                <p className="text-3xl font-bold text-rose-600">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Categorias</h3>
                <p className="text-3xl font-bold text-orange-600">{categories.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Carrossel</h3>
                <p className="text-3xl font-bold text-purple-600">{carouselItems.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Visualizações</h3>
                <p className="text-3xl font-bold text-green-600">
                  {products.reduce((total, p) => total + getProductViews(p.id), 0)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Produtos Mais Visualizados</h2>
              <div className="space-y-3">
                {products
                  .map(p => ({ ...p, views: getProductViews(p.id) }))
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map(product => (
                    <div key={product.id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center space-x-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span>{product.views}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', description: '', price: 0, image: '', category: '', featured: false });
                  setShowProductForm(true);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Produto</span>
              </button>
            </div>

            {showProductForm && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <form onSubmit={handleProductSubmit} className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome do produto"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Preço"
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="url"
                    placeholder="URL da imagem"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                  <textarea
                    placeholder="Descrição"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="border rounded-lg px-3 py-2 md:col-span-2"
                    rows={3}
                    required
                  />
                  <label className="flex items-center space-x-2 md:col-span-2">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    />
                    <span>Produto em destaque</span>
                  </label>
                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      {editingProduct ? 'Atualizar' : 'Criar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Produto</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Categoria</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Preço</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Visualizações</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            {product.featured && <span className="text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full">Destaque</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-medium">R$ {product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getProductViews(product.id)}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setProductForm({
                                name: product.name,
                                description: product.description,
                                price: product.price,
                                image: product.image,
                                category: product.category,
                                featured: product.featured || false
                              });
                              setShowProductForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Categorias</h1>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({ name: '', image: '' });
                  setShowCategoryForm(true);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Categoria</span>
              </button>
            </div>

            {showCategoryForm && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
                <form onSubmit={handleCategorySubmit} className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome da categoria"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="url"
                    placeholder="URL da imagem"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      {editingCategory ? 'Atualizar' : 'Criar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow p-4 relative">
                  <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-gray-600">{category.productCount} produtos</p>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setCategoryForm({
                          name: category.name,
                          image: category.image,
                        });
                        setShowCategoryForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 bg-white/70 p-1 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800 bg-white/70 p-1 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Carousel */}
        {activeTab === 'carousel' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Carrossel</h1>
              <button
                onClick={() => {
                  setEditingCarousel(null);
                  setCarouselForm({ image: '', title: '', description: '', link: '' });
                  setShowCarouselForm(true);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Item</span>
              </button>
            </div>

            {showCarouselForm && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingCarousel ? 'Editar Item' : 'Novo Item'}
                </h2>
                <form onSubmit={handleCarouselSubmit} className="space-y-4">
                  <input
                    type="url"
                    placeholder="URL da imagem"
                    value={carouselForm.image}
                    onChange={(e) => setCarouselForm({ ...carouselForm, image: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Título"
                    value={carouselForm.title}
                    onChange={(e) => setCarouselForm({ ...carouselForm, title: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                  <textarea
                    placeholder="Descrição"
                    value={carouselForm.description}
                    onChange={(e) => setCarouselForm({ ...carouselForm, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={3}
                    required
                  />
                  <input
                    type="url"
                    placeholder="Link (opcional)"
                    value={carouselForm.link}
                    onChange={(e) => setCarouselForm({ ...carouselForm, link: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      {editingCarousel ? 'Atualizar' : 'Criar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCarouselForm(false);
                        setEditingCarousel(null);
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {carouselItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCarousel(item);
                          setCarouselForm({
                            image: item.image,
                            title: item.title,
                            description: item.description,
                            link: item.link || ''
                          });
                          setShowCarouselForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCarouselItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Configurações</h1>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-bold mb-4">Contato</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Número do WhatsApp"
                  value={whatsappInput}
                  onChange={(e) => setWhatsappInput(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                />
                <div className="md:col-span-2 flex space-x-2">
                  <button
                    onClick={() => onUpdateWhatsappNumber(whatsappInput)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admins */}
        {activeTab === 'admins' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Administradores</h1>
              <button
                onClick={() => setShowAdminForm(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Admin</span>
              </button>
            </div>

            {showAdminForm && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Novo Administrador</h2>
                <form onSubmit={handleAdminSubmit} className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome de usuário"
                    value={adminForm.username}
                    onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    className="border rounded-lg px-3 py-2 md:col-span-2"
                    required
                  />
                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Criar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdminForm(false)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showEditAdminForm && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Editar Administrador</h2>
                <form onSubmit={handleEditAdminSubmit} className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome de usuário"
                    value={editAdminForm.username}
                    onChange={(e) => setEditAdminForm({ ...editAdminForm, username: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={editAdminForm.email}
                    onChange={(e) => setEditAdminForm({ ...editAdminForm, email: e.target.value })}
                    className="border rounded-lg px-3 py-2"
                    required
                  />
                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      Atualizar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditAdminForm(false);
                        setEditingAdmin(null);
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Usuário</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Criado em</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 font-medium">{admin.username}</td>
                      <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(admin.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editAdmin(admin)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar administrador"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {admins.length > 1 && (
                            <button
                              onClick={() => deleteAdmin(admin.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Excluir administrador"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}