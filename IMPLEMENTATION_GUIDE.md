# 🎯 PackPro Uygulama Rehberi

## 1️⃣ DÖVIZ API ENTEGRASYONU

### TCMB API (Ücretsiz)
```javascript
// src/services/exchangeAPI.js
export const getExchangeRate = async () => {
  try {
    // TCMB XML API
    const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml');
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const usd = xml.querySelector('Currency[Kod="USD"] ForexSelling');
    return parseFloat(usd.textContent);
  } catch (error) {
    console.error('Döviz kuru alınamadı:', error);
    return 34.50; // Fallback
  }
};

// Alternatif: ExchangeRate-API (Ücretsiz)
export const getExchangeRateAlternative = async () => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return data.rates.TRY;
  } catch (error) {
    return 34.50;
  }
};
```

### Component'te Kullanım
```javascript
useEffect(() => {
  const fetchRate = async () => {
    const rate = await getExchangeRate();
    setExchangeRate(rate);
  };
  
  fetchRate();
  // Her 1 saatte bir güncelle
  const interval = setInterval(fetchRate, 3600000);
  return () => clearInterval(interval);
}, []);
```

---

## 2️⃣ SUPABASE BACKEND KURULUMU

### Adım 1: Supabase Projesi Oluştur
1. https://supabase.com adresine git
2. "New Project" tıkla
3. Database şifresi belirle
4. API keys'i kopyala

### Adım 2: Tabloları Oluştur

```sql
-- Users Tablosu
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products Tablosu  
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_usd DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 5.0,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders Tablosu
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

-- Order Items Tablosu
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  price_usd DECIMAL(10,2),
  price_tl DECIMAL(10,2)
);

-- Transactions Tablosu (Bakiye işlemleri)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2),
  type TEXT, -- 'deposit' or 'payment'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Adım 3: Row Level Security (RLS)

```sql
-- Users tablosu için
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Orders tablosu için
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Adım 4: Supabase Client Oluştur

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth fonksiyonları
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });
  
  if (!error && data.user) {
    // Users tablosuna ekle
    await supabase.from('users').insert([
      { id: data.user.id, email, full_name: fullName }
    ]);
  }
  
  return { data, error };
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
```

---

## 3️⃣ IYZICO ÖDEME ENTEGRASYonu

### Adım 1: Iyzico Hesabı Aç
1. https://www.iyzico.com adresine git
2. Sandbox hesabı oluştur
3. API keys al

### Adım 2: Backend API Oluştur (Node.js)

```javascript
// server.js (Express.js)
const express = require('express');
const Iyzipay = require('iyzipay');

const app = express();
app.use(express.json());

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com' // Production: 'https://api.iyzipay.com'
});

app.post('/api/payment/create', async (req, res) => {
  const { cart, user, totalAmount } = req.body;
  
  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: '123456789',
    price: totalAmount,
    paidPrice: totalAmount,
    currency: Iyzipay.CURRENCY.TRY,
    installment: '1',
    basketId: 'B67832',
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: req.body.cardHolderName,
      cardNumber: req.body.cardNumber,
      expireMonth: req.body.expireMonth,
      expireYear: req.body.expireYear,
      cvc: req.body.cvc,
      registerCard: '0'
    },
    buyer: {
      id: user.id,
      name: user.name,
      surname: user.surname,
      gsmNumber: user.phone,
      email: user.email,
      identityNumber: '74300864791',
      registrationAddress: user.address,
      city: user.city,
      country: 'Turkey'
    },
    shippingAddress: {
      contactName: user.name,
      city: user.city,
      country: 'Turkey',
      address: user.address
    },
    billingAddress: {
      contactName: user.name,
      city: user.city,
      country: 'Turkey',
      address: user.address
    },
    basketItems: cart.map(item => ({
      id: item.id.toString(),
      name: item.name,
      category1: item.category,
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.priceUSD * exchangeRate * item.quantity).toFixed(2)
    }))
  };

  iyzipay.payment.create(request, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json(result);
  });
});

app.listen(3001, () => {
  console.log('Payment server running on port 3001');
});
```

### Adım 3: Frontend'den Çağır

```javascript
// src/services/paymentAPI.js
export const processPayment = async (paymentData) => {
  try {
    const response = await fetch('http://localhost:3001/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return await response.json();
  } catch (error) {
    console.error('Ödeme hatası:', error);
    throw error;
  }
};
```

---

## 4️⃣ VERCEL'E DEPLOY

### Adım 1: Vercel Hesabı
1. https://vercel.com adresine git
2. GitHub ile bağlan
3. Repository'yi import et

### Adım 2: Build Ayarları
```
Framework Preset: Create React App
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### Adım 3: Environment Variables
Vercel dashboard → Settings → Environment Variables:
```
REACT_APP_SUPABASE_URL=your_url
REACT_APP_SUPABASE_ANON_KEY=your_key
REACT_APP_IYZICO_API_KEY=your_key
```

### Adım 4: Domain Bağla
```
Settings → Domains → Add Domain
your-domain.com → Add
```

### DNS Ayarları
```
A Record: 76.76.21.21
CNAME Record: cname.vercel-dns.com
```

---

## 5️⃣ PRODUCTION HAZIRLIĞI

### Security
- [ ] HTTPS zorunlu
- [ ] API keys ortam değişkenlerinde
- [ ] CORS ayarları
- [ ] Rate limiting
- [ ] Input validation

### Performance
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] CDN kullanımı
- [ ] Caching stratejisi

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring
- [ ] Performance monitoring

---

## 📞 Yardıma İhtiyacınız mı var?

Her adımda size yardımcı olacağım! Hangi kısmı uygulamak istersiniz?

