# 🚀 VDS'SİZ TAM KURULUM REHBERİ

## 🎯 HEDEF
Tamamen **ücretsiz** başlamak ve sadece domain için ödeme yapmak.

---

## 📋 GEREKLİ HESAPLAR

### 1️⃣ GitHub Hesabı
- https://github.com adresine git
- Ücretsiz hesap aç
- Kodlarını burada saklayacaksın

### 2️⃣ Vercel Hesabı  
- https://vercel.com adresine git
- "Sign Up" → GitHub ile giriş yap
- ✅ Tamamen ücretsiz
- ✅ Sınırsız bandwidth
- ✅ Otomatik SSL (HTTPS)

### 3️⃣ Supabase Hesabı
- https://supabase.com adresine git  
- "Start your project" → GitHub ile giriş yap
- ✅ 500 MB ücretsiz database
- ✅ 50,000 aylık kullanıcı
- ✅ Authentication hazır

### 4️⃣ Domain (Opsiyonel ama önerilen)
- https://www.hostinger.com.tr (ucuz)
- https://www.godaddy.com  
- **Fiyat:** ~₺200/yıl (.com domain)

---

## 🛠️ ADIM 1: SUPABASE KURULUMU (15 dakika)

### A) Yeni Proje Oluştur
1. Supabase dashboard'a git
2. "New Project" tıkla
3. Proje adı: `packpro`
4. Database şifresi: Güçlü bir şifre belirle (kaydet!)
5. Region: `West EU (Frankfurt)` (Türkiye'ye en yakın)
6. "Create new project" → Bekle (2-3 dakika)

### B) API Keys'i Kopyala
```bash
Project Settings → API → 
✅ Project URL: https://xyz.supabase.co
✅ anon/public key: eyJhbGciOi...
```
Bu bilgileri bir yere not et!

### C) Tabloları Oluştur

**SQL Editor'e git ve şu kodları çalıştır:**

```sql
-- 1. Users Tablosu
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Products Tablosu  
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_usd DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 5.0,
  color TEXT DEFAULT 'bg-blue-500',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Orders Tablosu
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  total_amount_tl DECIMAL(10,2),
  total_amount_usd DECIMAL(10,2),
  exchange_rate DECIMAL(10,4),
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Order Items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  price_usd DECIMAL(10,2),
  price_tl DECIMAL(10,2)
);

-- 5. Test Ürünleri Ekle
INSERT INTO products (name, description, price_usd, category, stock, rating, color) VALUES
('E-Ticaret Kargo Kutusu', 'Dayanıklı e-ticaret gönderi kutusu', 0.50, 'karton', 1000, 4.8, 'bg-blue-500'),
('Gıda Ambalaj Poşeti', 'Gıda onaylı güvenli ambalaj', 0.15, 'plastik', 5000, 4.9, 'bg-green-500'),
('Özel Tasarım Hediye Kutusu', 'Lüks markanız için özel tasarım', 1.20, 'premium', 500, 5.0, 'bg-purple-500'),
('Kozmetik Ürün Ambalajı', 'Kozmetik ürünler için şık ambalaj', 0.80, 'premium', 800, 4.7, 'bg-pink-500'),
('Bubble Wrap Naylon', 'Ürünleriniz için maksimum koruma', 0.25, 'koruyucu', 3000, 4.6, 'bg-orange-500'),
('Pizza Kutusu', 'Restoran ve pizzacılar için', 0.35, 'gida', 2000, 4.8, 'bg-red-500'),
('Kraft Kağıt Torba', 'Çevre dostu kağıt torba', 0.20, 'kagit', 4000, 4.5, 'bg-yellow-600'),
('Streç Film', 'Palet ambalajlama için', 0.30, 'endustriyel', 2500, 4.7, 'bg-cyan-500');
```

### D) Authentication Aç
```
Authentication → Providers → Email → Enable
```

### E) Row Level Security (RLS) Kapat (Başlangıç için)
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
```

✅ **Supabase Hazır!**

---

## 🎨 ADIM 2: KOD HAZIRLIĞI (10 dakika)

### A) Bilgisayarında Proje Klasörü Oluştur

```bash
# Klasör oluştur
mkdir packpro-website
cd packpro-website

# package.json oluştur
cat > package.json << 'EOF'
{
  "name": "packpro-ambalaj",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1",
    "@supabase/supabase-js": "^2.39.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
EOF

# .env dosyası oluştur (Supabase bilgilerini buraya yaz)
cat > .env << 'EOF'
REACT_APP_SUPABASE_URL=https://xyz.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGci...
EOF
```

### B) Ana Dosyaları Ekle

```bash
# src klasörü oluştur
mkdir -p src public

# packpro-complete.jsx dosyasını src/App.js olarak kaydet
# public/index.html oluştur
```

**public/index.html:**
```html
<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PackPro - Ambalaj Çözümleri</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

**src/index.js:**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### C) Supabase Entegrasyonu

**src/lib/supabase.js oluştur:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Ürünleri getir
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Kullanıcı kaydı
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });
  
  if (!error && data.user) {
    await supabase.from('users').insert([
      { id: data.user.id, email, full_name: fullName }
    ]);
  }
  
  return { data, error };
};

// Kullanıcı girişi
export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

// Sipariş oluştur
export const createOrder = async (userId, cart, totalTL, totalUSD, exchangeRate, paymentMethod) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: userId,
      total_amount_tl: totalTL,
      total_amount_usd: totalUSD,
      exchange_rate: exchangeRate,
      payment_method: paymentMethod
    }])
    .select()
    .single();

  if (orderError) return { error: orderError };

  // Order items ekle
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

  return { data: order, error: itemsError };
};
```

---

## 🌐 ADIM 3: GITHUB'A YÜKLE (5 dakika)

### A) Git Başlat
```bash
git init
git add .
git commit -m "Initial commit"
```

### B) GitHub'da Repository Oluştur
1. https://github.com → "New repository"
2. İsim: `packpro-website`
3. Public veya Private seç
4. "Create repository"

### C) Kodu Yükle
```bash
git remote add origin https://github.com/KULLANICI_ADIN/packpro-website.git
git branch -M main
git push -u origin main
```

✅ **Kod GitHub'da!**

---

## ⚡ ADIM 4: VERCEL'E DEPLOY (5 dakika)

### A) Vercel'e Git
1. https://vercel.com/dashboard
2. "Add New..." → "Project"
3. GitHub repository seç: `packpro-website`
4. "Import"

### B) Environment Variables Ekle
```
REACT_APP_SUPABASE_URL = https://xyz.supabase.co
REACT_APP_SUPABASE_ANON_KEY = eyJhbGci...
```

### C) Deploy!
"Deploy" butonuna bas → 2-3 dakika bekle

✅ **Siteniz yayında!**

**URL:** `https://packpro-website.vercel.app`

---

## 🌍 ADIM 5: DOMAIN BAĞLA (Opsiyonel - 10 dakika)

### A) Domain Al
- Hostinger.com.tr → `.com` domain ~₺200/yıl
- Örnek: `packpro.com`

### B) Vercel'de Domain Ekle
```
Vercel Project → Settings → Domains → Add
packpro.com → Add
```

### C) DNS Ayarları
Hostinger/GoDaddy DNS yönetiminde:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

⏳ Bekle (1-24 saat)

✅ **Domain bağlandı!** `https://packpro.com`

---

## 💳 ADIM 6: ÖDEME SİSTEMİ (İleride)

### Seçenek 1: Vercel Serverless Functions (Önerilen)

```bash
# api/payment.js dosyası oluştur
```

**Avantajları:**
- ✅ Aynı Vercel projesinde
- ✅ Ek sunucu yok
- ✅ Otomatik ölçeklenir

### Seçenek 2: Supabase Edge Functions

```bash
# Supabase içinde function oluştur
```

**Avantajları:**
- ✅ Veritabanına yakın
- ✅ TypeScript desteği
- ✅ Ücretsiz

---

## 📊 MALİYET ÖZETI

| Süre | Hizmet | Maliyet |
|------|--------|---------|
| **İlk Yıl** | Domain | ₺200 |
| **İlk Yıl** | Vercel | ₺0 |
| **İlk Yıl** | Supabase | ₺0 |
| **TOPLAM** | **İlk Yıl** | **₺200** |

### Ne Zaman Ücretli Plana Geçilir?

**Vercel Pro ($20/ay) gerekir:**
- ❌ 100GB/ay bandwidth aşarsan
- ❌ Özel SSL sertifikası istersen
- ❌ Öncelikli destek istersen

**Supabase Pro ($25/ay) gerekir:**
- ❌ 500 MB database dolarsa
- ❌ 50,000 aylık kullanıcı aşarsan
- ❌ Günlük backup istersen

**Ortalama:** İlk 6-12 ay **tamamen ücretsiz** gidebilirsin!

---

## 🎉 SONUÇ

### ✅ İhtiyaç Var:
- GitHub (ücretsiz)
- Vercel (ücretsiz)
- Supabase (ücretsiz)
- Domain (₺200/yıl)

### ❌ İhtiyaç YOK:
- VDS/VPS ❌
- Hosting paketi ❌
- Sunucu kiralama ❌
- Aylık hosting ücreti ❌

**TOPLAM MALİYET: ₺200/yıl (sadece domain)**

---

## 🆘 YARDIM

Herhangi bir adımda takılırsan bana sor! 
Her adımı birlikte yapabiliriz. 😊
