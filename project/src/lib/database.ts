import { supabase } from './supabase';

// Mock data for development when Supabase is not configured
const mockCategories = [
  {
    id: 1,
    name: 'Lingeries',
    image_url: 'https://images.pexels.com/photos/6980357/pexels-photo-6980357.jpeg',
    description: 'Coleção completa de lingeries sensuais',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Perfumes',
    image_url: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    description: 'Fragrâncias aphrodisíacas e sensuais',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Fantasias',
    image_url: 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg',
    description: 'Fantasias para momentos especiais',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockProducts = [
  {
    id: 1,
    name: 'Conjunto Sensual Ruby',
    price: 89.90,
    description: 'Conjunto íntimo em renda delicada',
    detailed_description: 'Conjunto composto por sutiã e calcinha em renda francesa premium, proporcionando conforto e sensualidade.',
    technical_specs: 'Material: 90% Poliamida, 10% Elastano. Disponível nos tamanhos P, M, G, GG.',
    image_url: 'https://images.pexels.com/photos/6980357/pexels-photo-6980357.jpeg',
    category_id: 1,
    access_count: 0,
    is_featured: true,
    is_on_promotion: false,
    promotion_discount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Perfume Sedução Intensa',
    price: 129.90,
    description: 'Perfume aphrodisíaco com notas florais',
    detailed_description: 'Fragância exclusiva com blend de sândalo, jasmin e almíscar, criada especialmente para momentos íntimos.',
    technical_specs: 'Volume: 50ml. Concentração: Eau de Parfum. Fixação: 8-12 horas.',
    image_url: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    category_id: 2,
    access_count: 0,
    is_featured: true,
    is_on_promotion: false,
    promotion_discount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Fantasia Elegante Dreams',
    price: 159.90,
    description: 'Fantasia completa para noites especiais',
    detailed_description: 'Conjunto completo incluindo vestido, acessórios e meias 7/8, confeccionado em tecido premium.',
    technical_specs: 'Material: Cetim e renda. Tamanhos: P ao GG. Inclui: vestido, tanga, meias e acessórios.',
    image_url: 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg',
    category_id: 3,
    access_count: 0,
    is_featured: true,
    is_on_promotion: false,
    promotion_discount: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockCarouselImages = [
  {
    id: 1,
    image_url: 'https://images.pexels.com/photos/6980357/pexels-photo-6980357.jpeg',
    title: 'Coleção Verão 2024',
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    image_url: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    title: 'Perfumes Exclusivos',
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    image_url: 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg',
    title: 'Fantasias Premium',
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    if (!supabase) {
      console.log('Supabase not configured, using mock data');
      return true;
    }
    
    // Check if tables exist by trying to fetch from them
    const { error: productsError } = await supabase.from('products').select('id').limit(1);
    const { error: categoriesError } = await supabase.from('categories').select('id').limit(1);
    
    if (productsError || categoriesError) {
      console.log('Database tables need to be created. Please run the SQL migrations in Supabase.');
      return false;
    }
    
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

// Database functions
export const dbFunctions = {
  // Products
  async getProducts() {
    if (!supabase) {
      return mockProducts;
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  async getProductById(id: number) {
    if (!supabase) {
      return mockProducts.find(p => p.id === id) || null;
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    // Increment access count
    if (data) {
      await supabase
        .from('products')
        .update({ access_count: (data.access_count || 0) + 1 })
        .eq('id', id);
    }
    
    return data;
  },
  
  async getProductsByCategory(categoryId: number) {
    if (!supabase) {
      return mockProducts.filter(p => p.category_id === categoryId);
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  async getFeaturedProducts() {
    if (!supabase) {
      return mockProducts.filter(p => p.is_featured);
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  async getMostAccessedProducts() {
    if (!supabase) {
      return mockProducts.slice(0, 10);
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('access_count', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data || [];
  },

  async createProduct(productData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id: number, productData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { data, error } = await supabase
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProduct(id: number) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Categories
  async getCategories() {
    if (!supabase) {
      return mockCategories;
    }
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createCategory(categoryData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCategory(id: number, categoryData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { data, error } = await supabase
      .from('categories')
      .update({ ...categoryData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: number) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Carousel
  async getCarouselImages() {
    if (!supabase) {
      return mockCarouselImages;
    }
    
    const { data, error } = await supabase
      .from('carousel_images')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getAllCarouselImages() {
    if (!supabase) {
      return mockCarouselImages;
    }
    
    const { data, error } = await supabase
      .from('carousel_images')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createCarouselImage(imageData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { data, error } = await supabase
      .from('carousel_images')
      .insert([imageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCarouselImage(id: number, imageData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { data, error } = await supabase
      .from('carousel_images')
      .update({ ...imageData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCarouselImage(id: number) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { error } = await supabase
      .from('carousel_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async updateCarouselOrder(images: any[]) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    for (let i = 0; i < images.length; i++) {
      await supabase
        .from('carousel_images')
        .update({ order_index: i + 1 })
        .eq('id', images[i].id);
    }
    return true;
  },
  
  // Site Settings
  async getSiteSettings() {
    if (!supabase) {
      return { whatsapp_number: '5511999999999', site_name: 'Lovely Sex Day' };
    }
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || { whatsapp_number: '5511999999999', site_name: 'Lovely Sex Day' };
  },
  
  async updateSiteSettings(settings: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    // First try to update existing record
    const { data: existingData } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)
      .single();
    
    if (existingData) {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Insert new record if none exists
      const { data, error } = await supabase
        .from('site_settings')
        .insert([settings])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Administrators
  async getAdministrators() {
    if (!supabase) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('administrators')
      .select('id, username, email, created_at, updated_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createAdministrator(adminData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { data, error } = await supabase
      .from('administrators')
      .insert([{
        username: adminData.username,
        email: adminData.email,
        password_hash: adminData.password
      }])
      .select('id, username, email, created_at, updated_at')
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAdministrator(id: number, adminData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const updateData: any = {
      username: adminData.username,
      email: adminData.email,
      updated_at: new Date().toISOString()
    };
    
    if (adminData.password) {
      updateData.password_hash = adminData.password;
    }
    
    const { data, error } = await supabase
      .from('administrators')
      .update(updateData)
      .eq('id', id)
      .select('id, username, email, created_at, updated_at')
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAdministrator(id: number) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { error } = await supabase
      .from('administrators')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async authenticateAdmin(username: string, password: string) {
    if (!supabase) {
      // Allow default admin login for development
      if (username === 'admin' && password === 'admin123') {
        return { id: 1, username: 'admin', email: 'admin@lovelysexday.com' };
      }
      return null;
    }
    
    const { data, error } = await supabase
      .from('administrators')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Promotions
  async getPromotions() {
    if (!supabase) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async createPromotion(promotionData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { data, error } = await supabase
      .from('promotions')
      .insert([promotionData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Apply promotion to products
    if (promotionData.is_active && promotionData.product_ids.length > 0) {
      await supabase
        .from('products')
        .update({
          is_on_promotion: true,
          promotion_discount: promotionData.discount_percentage
        })
        .in('id', promotionData.product_ids);
    }
    
    return data;
  },

  async updatePromotion(id: number, promotionData: any) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    // Get old promotion data
    const { data: oldPromotion } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single();
    
    // Remove old promotion from products
    if (oldPromotion && oldPromotion.product_ids.length > 0) {
      await supabase
        .from('products')
        .update({
          is_on_promotion: false,
          promotion_discount: 0
        })
        .in('id', oldPromotion.product_ids);
    }
    
    // Update promotion
    const { data, error } = await supabase
      .from('promotions')
      .update({ ...promotionData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Apply new promotion to products
    if (promotionData.is_active && promotionData.product_ids.length > 0) {
      await supabase
        .from('products')
        .update({
          is_on_promotion: true,
          promotion_discount: promotionData.discount_percentage
        })
        .in('id', promotionData.product_ids);
    }
    
    return data;
  },

  async deletePromotion(id: number) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    // Get promotion data
    const { data: promotion } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single();
    
    // Remove promotion from products
    if (promotion && promotion.product_ids.length > 0) {
      await supabase
        .from('products')
        .update({
          is_on_promotion: false,
          promotion_discount: 0
        })
        .in('id', promotion.product_ids);
    }
    
    // Delete promotion
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async togglePromotionStatus(id: number) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    
    const { data: promotion } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!promotion) throw new Error('Promotion not found');
    
    const newStatus = !promotion.is_active;
    
    // Update promotion status
    await supabase
      .from('promotions')
      .update({ is_active: newStatus })
      .eq('id', id);
    
    // Apply/remove promotion from products
    if (newStatus) {
      await supabase
        .from('products')
        .update({
          is_on_promotion: true,
          promotion_discount: promotion.discount_percentage
        })
        .in('id', promotion.product_ids);
    } else {
      await supabase
        .from('products')
        .update({
          is_on_promotion: false,
          promotion_discount: 0
        })
        .in('id', promotion.product_ids);
    }
    
    return true;
  }
};
