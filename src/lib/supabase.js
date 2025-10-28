import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// ÜRÜN FONKSİYONLARI
// ==========================================

// Tüm ürünleri getir
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Ürünler getirilemedi:', error);
    return { data: null, error };
  }
  
  return { data, error: null };
};

// Tek ürün getir
export const getProduct = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
};

// Kategoriye göre ürünleri getir
export const getProductsByCategory = async (category) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// ==========================================
// KULLANICI FONKSİYONLARI
// ==========================================

// Kullanıcı kaydı
export const signUp = async (email, password, fullName, phone) => {
  // Auth kaydı
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone
      }
    }
  });
  
  if (authError) {
    console.error('Kayıt hatası:', authError);
    return { data: null, error: authError };
  }
  
  // Users tablosuna ekle
  if (authData.user) {
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        { 
          id: authData.user.id, 
          email, 
          full_name: fullName,
          phone: phone,
          balance: 0
        }
      ]);
    
    if (insertError) {
      console.error('User insert hatası:', insertError);
    }
  }
  
  return { data: authData, error: null };
};

// Kullanıcı girişi
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Giriş hatası:', error);
    return { data: null, error };
  }
  
  // Kullanıcı bilgilerini getir
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  return { data: { ...data, userData }, error: userError };
};

// Çıkış
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Mevcut kullanıcı
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { data: null, error: null };
  
  // Kullanıcı detaylarını getir
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return { data: { ...user, ...userData }, error };
};

// ==========================================
// SİPARİŞ FONKSİYONLARI
// ==========================================

// Sipariş oluştur
export const createOrder = async (userId, cart, totalTL, totalUSD, exchangeRate, paymentMethod) => {
  // Sipariş kaydı
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: userId,
      total_amount_tl: totalTL,
      total_amount_usd: totalUSD,
      exchange_rate: exchangeRate,
      payment_method: paymentMethod,
      status: 'pending'
    }])
    .select()
    .single();

  if (orderError) {
    console.error('Sipariş oluşturma hatası:', orderError);
    return { data: null, error: orderError };
  }

  // Sipariş ürünlerini ekle
  const items = cart.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_usd: item.priceUSD,
    price_tl: item.priceUSD * exchangeRate
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(items);

  if (itemsError) {
    console.error('Sipariş ürünleri ekleme hatası:', itemsError);
    return { data: order, error: itemsError };
  }

  return { data: order, error: null };
};

// Kullanıcının siparişlerini getir
export const getUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// ==========================================
// BAKİYE FONKSİYONLARI
// ==========================================

// Bakiye güncelle
export const updateBalance = async (userId, amount) => {
  const { data, error } = await supabase
    .from('users')
    .update({ balance: amount })
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

// Bakiye işlemi kaydet
export const createTransaction = async (userId, amount, type, description) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      amount,
      type,
      description
    }])
    .select()
    .single();
  
  return { data, error };
};
