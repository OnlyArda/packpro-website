# 🚀 PackPro Kurulum Talimatları

## 📋 Ön Gereksinimler

- Node.js 16+ yüklü olmalı
- npm veya yarn yüklü olmalı
- Git yüklü olmalı

## 🛠️ Kurulum Adımları

### 1. Projeyi İndirin veya Oluşturun

```bash
# Yeni klasör oluştur
mkdir packpro-website
cd packpro-website

# Tüm dosyaları bu klasöre kopyalayın
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

Bu kurulacak paketler:
- react & react-dom
- react-scripts
- lucide-react (ikonlar)
- @supabase/supabase-js
- axios
- tailwindcss

### 3. Environment Dosyası Oluşturun

```bash
# .env.example dosyasını kopyalayın
cp .env.example .env

# Ardından .env dosyasını düzenleyin
```

**.env dosyasına Supabase bilgilerinizi ekleyin:**

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Ana Component Dosyasını Ekleyin

`src/App.js` dosyasını oluşturun ve `packpro-complete.jsx` içeriğini buraya kopyalayın.

### 5. Geliştirme Sunucusunu Başlatın

```bash
npm start
# veya
yarn start
```

Tarayıcınız otomatik açılacak: http://localhost:3000

## 📁 Dosya Yapısı

```
packpro-website/
├── node_modules/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── lib/
│   │   └── supabase.js          # Supabase client
│   ├── services/
│   │   └── exchangeAPI.js       # Döviz API
│   ├── App.js                   # Ana component (packpro-complete.jsx içeriği)
│   ├── index.js
│   └── index.css
├── .env                          # Environment variables (GİT'e eklemeyin!)
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

## 🗄️ Supabase Kurulumu

### 1. Hesap Oluşturun
- https://supabase.com adresine gidin
- "Start your project" tıklayın
- GitHub ile giriş yapın

### 2. Yeni Proje Oluşturun
- "New Project" → Proje adı: `packpro`
- Güçlü bir database şifresi belirleyin
- Region: "West EU (Frankfurt)"
- "Create project" → 2-3 dakika bekleyin

### 3. API Keys'i Alın
```
Settings → API → 
- Project URL
- anon/public key
```

Bu bilgileri `.env` dosyasına ekleyin!

### 4. SQL Tabloları Oluşturun

SQL Editor'e gidin ve şu komutları çalıştırın:

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
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

-- Orders
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

-- Order Items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  price_usd DECIMAL(10,2),
  price_tl DECIMAL(10,2)
);

-- Test ürünleri ekle
INSERT INTO products (name, description, price_usd, category, stock, rating, color) VALUES
('E-Ticaret Kargo Kutusu', 'Dayanıklı e-ticaret gönderi kutusu', 0.50, 'karton', 1000, 4.8, 'bg-blue-500'),
('Gıda Ambalaj Poşeti', 'Gıda onaylı güvenli ambalaj', 0.15, 'plastik', 5000, 4.9, 'bg-green-500'),
('Özel Tasarım Hediye Kutusu', 'Lüks markanız için özel tasarım', 1.20, 'premium', 500, 5.0, 'bg-purple-500');
```

### 5. Authentication'ı Açın
```
Authentication → Providers → Email → Enable
```

### 6. RLS'yi Kapatın (Geliştirme için)
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
```

## 🌐 Production'a Alma (Vercel)

### 1. GitHub'a Yükleyin

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/packpro.git
git push -u origin main
```

### 2. Vercel'e Deploy Edin

1. https://vercel.com adresine gidin
2. "Import Project" → GitHub repository seçin
3. Environment Variables ekleyin:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
4. "Deploy" butonuna basın

⏳ 2-3 dakika → Site yayında! 🎉

## 🐛 Sorun Giderme

### Port 3000 kullanımda hatası
```bash
# Farklı port kullan
PORT=3001 npm start
```

### Module not found hatası
```bash
# node_modules'u sil ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### Supabase bağlanamıyor
- `.env` dosyasının doğru konumda olduğundan emin olun
- Supabase URL ve Key'in doğru olduğunu kontrol edin
- Sunucuyu yeniden başlatın: `npm start`

## 📞 Yardım

Sorun yaşarsanız:
1. Console'daki hata mesajlarını kontrol edin (F12)
2. Network sekmesinden API isteklerini inceleyin
3. Supabase logs'larına bakın

---

**Başarılar! 🚀**
