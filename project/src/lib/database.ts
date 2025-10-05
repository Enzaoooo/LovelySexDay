import { supabase } from './supabase';

// Dashboard
export const getProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data || [];
};

export const getCategories = async () => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data || [];
};

export const getCarouselImages = async () => {
  const { data, error } = await supabase.from('carousel_images').select('*');
  if (error) throw error;
  return data || [];
};

export const getMostAccessedProducts = async () => {
  const { data, error } = await supabase.from('products').select('*').order('access_count', { ascending: false });
  if (error) throw error;
  return data || [];
};

// Admin Users
export const getAdministrators = async () => {
  const { data, error } = await supabase.functions.invoke('get-admin-users');

  if (error) {
    const errorMessage = JSON.parse(error.message);
    throw new Error(errorMessage.error);
  }
  
  // The data from the function is { users: [...] }
  return data.users.map((user: any) => ({
    id: user.id,
    username: user.user_metadata.username || '',
    email: user.email || '',
    created_at: user.created_at,
  }));
};

export const createAdministrator = async (adminData: any) => {
  const { data, error } = await supabase.functions.invoke('create-admin-user', {
    body: {
      email: adminData.email,
      password: adminData.password,
      username: adminData.username
    },
  });

  if (error) {
    const errorMessage = JSON.parse(error.message);
    throw new Error(errorMessage.error);
  }
  return data;
};

export const updateAdministrator = async (id: string, adminData: any) => {
  const { data, error } = await supabase.functions.invoke(`update-admin-user`, {
    body: {
      id,
      ...adminData
    }
  });

  if (error) {
    const errorMessage = JSON.parse(error.message);
    throw new Error(errorMessage.error);
  }
  return data;
};

export const deleteAdministrator = async (id: string) => {
  const { data, error } = await supabase.functions.invoke(`delete-admin-user`, {
    body: { id }
  });

  if (error) {
    const errorMessage = JSON.parse(error.message);
    throw new Error(errorMessage.error);
  }
  return data;
};


// Carousel Images
export const getAllCarouselImages = async () => {
  const { data, error } = await supabase.from('carousel_images').select('*').order('order_index');
  if (error) throw error;
  return data || [];
};

export const createCarouselImage = async (imageData: any) => {
  const { data, error } = await supabase.from('carousel_images').insert([imageData]).select();
  if (error) throw error;
  return data;
};

export const updateCarouselImage = async (id: number, imageData: any) => {
  const { data, error } = await supabase.from('carousel_images').update(imageData).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const deleteCarouselImage = async (id: number) => {
  const { data, error } = await supabase.from('carousel_images').delete().eq('id', id);
  if (error) throw error;
  return data;
};

export const updateCarouselOrder = async (images: any[]) => {
  const updates = images.map(image => ({
    id: image.id,
    order_index: image.order_index,
  }));
  const { data, error } = await supabase.from('carousel_images').upsert(updates);
  if (error) throw error;
  return data;
};

// Categories
export const createCategory = async (categoryData: any) => {
  const { data, error } = await supabase.from('categories').insert([categoryData]).select();
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: number, categoryData: any) => {
  const { data, error } = await supabase.from('categories').update(categoryData).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: number) => {
  const { data, error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
  return data;
};

// Products
export const createProduct = async (productData: any) => {
  const { data, error } = await supabase.from('products').insert([productData]).select();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id: number, productData: any) => {
  const { data, error } = await supabase.from('products').update(productData).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: number) => {
  const { data, error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return data;
};

// Promotions
export const getPromotions = async () => {
  const { data, error } = await supabase.from('promotions').select('*');
  if (error) throw error;
  return data || [];
};

export const createPromotion = async (promotionData: any) => {
  const { data, error } = await supabase.from('promotions').insert([promotionData]).select();
  if (error) throw error;
  return data;
};

export const updatePromotion = async (id: number, promotionData: any) => {
  const { data, error } = await supabase.from('promotions').update(promotionData).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const deletePromotion = async (id: number) => {
  const { data, error } = await supabase.from('promotions').delete().eq('id', id);
  if (error) throw error;
  return data;
};

export const togglePromotionStatus = async (id: number) => {
    const { data: existingPromotion, error: fetchError } = await supabase
        .from('promotions')
        .select('is_active')
        .eq('id', id)
        .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
        .from('promotions')
        .update({ is_active: !existingPromotion.is_active })
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};

// Site Settings
export const getSiteSettings = async () => {
  const { data, error } = await supabase.from('site_settings').select('*').single();
  if (error) throw error;
  return data || {};
};

export const updateSiteSettings = async (settingsData: any) => {
  const { data, error } = await supabase.from('site_settings').update(settingsData).eq('id', 1).select();
  if (error) throw error;
  return data;
};