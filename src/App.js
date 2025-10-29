import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, User, Menu, X, Package, CreditCard, Building2, 
  TrendingUp, Shield, Clock, Phone, Mail, MapPin, ChevronRight, 
  ImageOff, Zap, Star, Award, Truck, Search, Filter, ChevronDown,
  Box, Layers, Sparkles, Pizza, FileText, Factory,
  Wallet, Settings, LogOut,  // ← MapPin'i buradan çıkardık
  Plus, Minus, Trash2, Eye, Heart
} from 'lucide-react';

const AmbalajWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(34.50);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  // Sayfa geçiş animasyonu
  const navigateToPage = (page) => {
    setIsPageTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsPageTransitioning(false), 300);
    }, 300);
  };

  // Güncel dolar kuru çekme (gerçek API entegrasyonu)
useEffect(() => {
  const testSupabaseDirectly = async () => {
    try {
      console.log('Testing Supabase directly...');
      
      // Direct fetch (Supabase client kullanmadan)
      const response = await fetch('https://xdlaylmiwiukgcyqlvel.supabase.co/rest/v1/products', {
        headers: {
          'apikey': 'sb_publishable_LKRk8d_j0Smdz1qO6mVrUA_1HjlW7xD',
          'Authorization': 'Bearer sb_publishable_LKRk8d_j0Smdz1qO6mVrUA_1HjlW7xD',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Supabase response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Supabase data:', data);
        setProducts(data);
      } else {
        console.error('Supabase error:', response.status, response.statusText);
        // Fake API fallback
        const fallbackResponse = await fetch('https://fakestoreapi.com/products?limit=8');
        const fallbackData = await fallbackResponse.json();
        setProducts(fallbackData.map(/* format code */));
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };
  
  testSupabaseDirectly();
}, []);
  // Test ürünler

  // Kategoriler
  const categories = [
    { id: 'all', name: 'Tümü', Icon: Package, count: products.length },
    { id: 'karton', name: 'Karton Kutu', Icon: Box, count: products.filter(p => p.category === 'karton').length },
    { id: 'plastik', name: 'Plastik', Icon: Layers, count: products.filter(p => p.category === 'plastik').length },
    { id: 'premium', name: 'Premium', Icon: Sparkles, count: products.filter(p => p.category === 'premium').length },
    { id: 'gida', name: 'Gıda', Icon: Pizza, count: products.filter(p => p.category === 'gida').length },
    { id: 'koruyucu', name: 'Koruyucu', Icon: Shield, count: products.filter(p => p.category === 'koruyucu').length },
    { id: 'kagit', name: 'Kağıt', Icon: FileText, count: products.filter(p => p.category === 'kagit').length },
    { id: 'endustriyel', name: 'Endüstriyel', Icon: Factory, count: products.filter(p => p.category === 'endustriyel').length }
  ];

  // Filtrelenmiş ürünler
  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-high') return b.priceUSD - a.priceUSD;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });

  const convertToTL = (usdPrice) => {
    return (usdPrice * exchangeRate).toFixed(2);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Ürün zaten sepette, miktarı artır
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      alert(`${product.name} miktarı artırıldı!`);
    } else {
      // Yeni ürün ekle
      setCart([...cart, { ...product, quantity: 1 }]);
      alert(`${product.name} sepete eklendi!`);
    }
    
    // LocalStorage'a kaydet
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    localStorage.setItem('cart', JSON.stringify(cart.filter(item => item.id !== productId)));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.priceUSD * item.quantity), 0);
  };

  const getTotalPriceTL = () => {
    return (getTotalPrice() * exchangeRate).toFixed(2);
  };

  // Sayfa yüklendiğinde sepeti LocalStorage'dan al
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Sepet yüklenemedi:', e);
      }
    }
  }, []);

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg fixed w-full top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => navigateToPage('home')}>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Package className="h-7 w-7 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AmbalajTest</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <button onClick={() => navigateToPage('home')} className={`px-5 py-2 font-medium rounded-xl transition-all duration-300 ${currentPage === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}>
              Ana Sayfa
            </button>
            <button onClick={() => navigateToPage('products')} className={`px-5 py-2 font-medium rounded-xl transition-all duration-300 ${currentPage === 'products' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}>
              Ürünler
            </button>
            <button onClick={() => navigateToPage('about')} className={`px-5 py-2 font-medium rounded-xl transition-all duration-300 ${currentPage === 'about' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}>
              Hakkımızda
            </button>
            <button onClick={() => navigateToPage('contact')} className={`px-5 py-2 font-medium rounded-xl transition-all duration-300 ${currentPage === 'contact' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}>
              İletişim
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="relative p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>
            {user ? (
              <button onClick={() => navigateToPage('dashboard')} className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300">
                <User className="h-5 w-5" />
                <span className="font-semibold">Hesabım</span>
              </button>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold">
                Giriş Yap
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-all">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 animate-slideDown">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button onClick={() => { navigateToPage('home'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all">
              Ana Sayfa
            </button>
            <button onClick={() => { navigateToPage('products'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all">
              Ürünler
            </button>
            <button onClick={() => { navigateToPage('about'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all">
              Hakkımızda
            </button>
            <button onClick={() => { navigateToPage('contact'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all">
              İletişim
            </button>
            {!user && (
              <button onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl mt-2 font-semibold">
                Giriş Yap
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  // Home Page
  const HomePage = () => (
    <div className="pt-20">
      {/* Hero Section - Ultra Modern */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-semibold">Türkiye'nin #1 Ambalaj Mağazası</span>
              </div>
              
              <h1 className="text-6xl font-bold leading-tight">
                Profesyonel
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Ambalaj Çözümleri
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                İşletmeniz için kaliteli, uygun fiyatlı ve hızlı teslimat ile ambalaj ürünleri. Güvenli ödeme, anlık fiyatlandırma.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigateToPage('products')} className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <span>Ürünleri İncele</span>
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => setIsRegisterOpen(true)} className="border-2 border-white/50 backdrop-blur-lg bg-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 hover:scale-105 transition-all duration-300">
                  Hemen Başla
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-4xl font-bold">10K+</div>
                  <div className="text-blue-200 text-sm">Mutlu Müşteri</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-blue-200 text-sm">Ürün Çeşidi</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">24/7</div>
                  <div className="text-blue-200 text-sm">Destek</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image Placeholder */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="aspect-square bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center">
                    <Package className="h-32 w-32 text-white/50" />
                  </div>
                </div>
                {/* Floating Cards */}
                <div className="absolute -top-6 -right-6 bg-white text-gray-800 px-6 py-4 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    <div>
                      <div className="font-bold">Hızlı Teslimat</div>
                      <div className="text-sm text-gray-600">2-3 gün</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 px-6 py-4 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-green-500" />
                    <div>
                      <div className="font-bold">Güvenli Ödeme</div>
                      <div className="text-sm text-gray-600">SSL Korumalı</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Modern Cards */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Neden AmbalajTest?</h2>
            <p className="text-gray-600 text-lg">Size en iyi hizmeti sunmak için buradayız</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">Uygun Fiyat</h3>
              <p className="text-gray-600">Rekabetçi fiyatlarla kaliteli ürünler ve toplu alım indirimleri</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">Hızlı Teslimat</h3>
              <p className="text-gray-600">Türkiye geneli 2-3 gün içinde kapınızda</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">Güvenli Ödeme</h3>
              <p className="text-gray-600">SSL sertifikalı güvenli alışveriş ve çoklu ödeme seçenekleri</p>
            </div>
            
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3">Kalite Garantisi</h3>
              <p className="text-gray-600">Tüm ürünlerde kalite garantisi ve iade hakkı</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products - Modern Grid */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Öne Çıkan Ürünler</h2>
              <p className="text-gray-600">En popüler ambalaj çözümlerimiz</p>
            </div>
            <button onClick={() => navigateToPage('products')} className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center font-semibold">
              Tümünü Gör 
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {filteredProducts.slice(0, 3).map((product, index) => (
              <div key={product.id} className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100" style={{animationDelay: `${index * 100}ms`}}>
                {/* Image Placeholder with Icon */}
                <div className={`${product.color} h-56 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20"></div>
                  <ImageOff className="h-24 w-24 text-white/30" />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full text-white text-sm font-semibold">
                    {product.categoryName}
                  </div>
                  <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" /> {product.rating}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {convertToTL(product.priceUSD)} ₺
                      </div>
                      <div className="text-sm text-gray-500">${product.priceUSD} USD</div>
                    </div>
                    <button onClick={() => addToCart(product)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-xl hover:scale-110 transition-all duration-300">
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Modern */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">Hemen Başlayın!</h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Hesap oluşturun, bakiye yükleyin ve özel fiyatlardan yararlanın. İlk siparişinizde %10 indirim!
          </p>
          <button onClick={() => setIsRegisterOpen(true)} className="group bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg inline-flex items-center">
            <span>Ücretsiz Kayıt Ol</span>
            <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  // Products Page - Advanced Filtering
  const ProductsPage = () => (
    <div className="pt-28 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ürünlerimiz
          </h1>
          <p className="text-gray-600 text-lg">İşletmeniz için en uygun ambalaj çözümlerini keşfedin</p>
        </div>
        
        {/* Exchange Rate Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6" />
              <div>
                <div className="text-sm opacity-90">Güncel Döviz Kuru</div>
                <div className="text-2xl font-bold">1 USD = {exchangeRate} ₺</div>
              </div>
            </div>
            <div className="text-sm opacity-90">
              Fiyatlar anlık kurla güncellenmektedir
            </div>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-white"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-6 py-4 pr-12 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-white font-semibold cursor-pointer"
            >
              <option value="featured">Öne Çıkanlar</option>
              <option value="price-low">Fiyat: Düşükten Yükseğe</option>
              <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
              <option value="rating">En Yüksek Puan</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Categories - Horizontal Scroll */}
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 whitespace-nowrap flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <category.Icon className="h-5 w-5" />
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">{filteredProducts.length}</span> ürün bulundu
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-purple-600 font-semibold flex items-center"
            >
              <X className="h-4 w-4 mr-1" /> Aramayı Temizle
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                style={{
                  animation: 'fadeInUp 0.5s ease-out',
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Image Placeholder with Gradient */}
                <div className={`${product.color} h-48 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20"></div>
                  <ImageOff className="h-20 w-20 text-white/30 relative z-10" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full">
                    <span className="text-white text-xs font-semibold">{product.categoryName}</span>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" /> {product.rating}
                  </div>

                  {/* Stock Badge */}
                  {product.stock < 1000 && (
                    <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Son {product.stock} adet!
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {convertToTL(product.priceUSD)} ₺
                        </div>
                        <div className="text-xs text-gray-500">${product.priceUSD} USD</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => addToCart(product)} 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Sepete Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ürün bulunamadı</h3>
            <p className="text-gray-600 mb-6">Arama kriterlerinizi değiştirerek tekrar deneyin</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              Tüm Ürünleri Göster
            </button>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all">
            <Truck className="h-10 w-10 text-blue-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Ücretsiz Kargo</h3>
            <p className="text-gray-600 text-sm">500 TL üzeri tüm siparişlerde</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all">
            <Shield className="h-10 w-10 text-green-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Güvenli Alışveriş</h3>
            <p className="text-gray-600 text-sm">256-bit SSL şifreleme</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all">
            <Award className="h-10 w-10 text-purple-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Kalite Garantisi</h3>
            <p className="text-gray-600 text-sm">Tüm ürünlerde iade hakkı</p>
          </div>
        </div>
      </div>
    </div>
  );

  // About Page
  const AboutPage = () => (
    <div className="pt-28 pb-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Hakkımızda
        </h1>
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            AmbalajTest, Türkiye'nin önde gelen ambalaj çözümleri sağlayıcısıdır. 2024 yılından bu yana, işletmelere kaliteli, uygun fiyatlı ve güvenilir ambalaj ürünleri sunmaktayız.
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            Misyonumuz, müşterilerimize en iyi ambalaj çözümlerini en uygun fiyatlarla sunarak işlerini büyütmelerine yardımcı olmaktır. Modern teknoloji ve müşteri odaklı yaklaşımımızla sektörde fark yaratıyoruz.
          </p>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600 font-medium">Mutlu Müşteri</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Package className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Ürün Çeşidi</div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Müşteri Desteği</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Contact Page
  const ContactPage = () => (
    <div className="pt-28 pb-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          İletişim
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8">Bize Ulaşın</h2>
            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="bg-blue-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="font-bold text-lg text-gray-800">Telefon</div>
                  <div className="text-gray-600">+90 555 123 45 67</div>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="bg-purple-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="font-bold text-lg text-gray-800">E-posta</div>
                  <div className="text-gray-600">info@ambalajtest.com</div>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="bg-green-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="font-bold text-lg text-gray-800">Adres</div>
                  <div className="text-gray-600">Atatürk Mah. Sanayi Cad. No:123<br />Antalya, Türkiye</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8">Mesaj Gönderin</h2>
            <form className="space-y-5">
              <input 
                type="text" 
                placeholder="Adınız" 
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
              />
              <input 
                type="email" 
                placeholder="E-posta" 
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
              />
              <textarea 
                placeholder="Mesajınız" 
                rows="5" 
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
              ></textarea>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold">
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // Login Modal
  const LoginModal = () => (
    isLoginOpen && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Giriş Yap
            </h2>
            <button onClick={() => setIsLoginOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all">
              <X className="h-6 w-6" />
            </button>
          </div>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">E-posta</label>
              <input 
                type="email" 
                placeholder="ornek@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Şifre</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold">
              Giriş Yap
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} className="text-blue-600 hover:text-purple-600 font-semibold">
              Hesabınız yok mu? <span className="underline">Kayıt olun</span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Register Modal
  const RegisterModal = () => (
    isRegisterOpen && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kayıt Ol
            </h2>
            <button onClick={() => setIsRegisterOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all">
              <X className="h-6 w-6" />
            </button>
          </div>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Ad Soyad</label>
              <input 
                type="text" 
                placeholder="Ahmet Yılmaz"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">E-posta</label>
              <input 
                type="email" 
                placeholder="ornek@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Telefon</label>
              <input 
                type="tel" 
                placeholder="0555 123 45 67"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Şifre</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none" 
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold">
              Kayıt Ol
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} className="text-blue-600 hover:text-purple-600 font-semibold">
              Zaten hesabınız var mı? <span className="underline">Giriş yapın</span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Dashboard Page (User Panel)
  const DashboardPage = () => (
    <div className="pt-28 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Hesabım
        </h1>
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-3xl shadow-lg p-6 h-fit border border-gray-100">
            <div className="space-y-2">
              <button className="w-full text-left px-5 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg flex items-center space-x-3">
                <Wallet className="h-5 w-5" />
                <span>Bakiyem</span>
              </button>
              <button className="w-full text-left px-5 py-4 hover:bg-gray-50 rounded-2xl text-gray-700 font-medium transition-all flex items-center space-x-3">
                <Package className="h-5 w-5" />
                <span>Siparişlerim</span>
              </button>
              <button className="w-full text-left px-5 py-4 hover:bg-gray-50 rounded-2xl text-gray-700 font-medium transition-all flex items-center space-x-3">
                <MapPin className="h-5 w-5" />
                <span>Adreslerim</span>
              </button>
              <button className="w-full text-left px-5 py-4 hover:bg-gray-50 rounded-2xl text-gray-700 font-medium transition-all flex items-center space-x-3">
                <Settings className="h-5 w-5" />
                <span>Profil Ayarları</span>
              </button>
              <button onClick={() => setUser(null)} className="w-full text-left px-5 py-4 hover:bg-red-50 text-red-600 rounded-2xl font-medium transition-all mt-4 flex items-center space-x-3">
                <LogOut className="h-5 w-5" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Balance Card - Modern Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white rounded-3xl shadow-2xl p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Mevcut Bakiye</h2>
                  <div className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
                    <span className="text-sm font-semibold">₺ TRY</span>
                  </div>
                </div>
                <div className="text-5xl font-bold mb-8">0.00 ₺</div>
                <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Bakiye Yükle
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-4 rounded-2xl">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">0</div>
                    <div className="text-sm text-gray-500">Toplam Sipariş</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-4 rounded-2xl">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">0 ₺</div>
                    <div className="text-sm text-gray-500">Toplam Harcama</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-4 rounded-2xl">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">0</div>
                    <div className="text-sm text-gray-500">Bekleyen Sipariş</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Ödeme Yöntemleri</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="group border-2 border-blue-600 rounded-2xl p-6 flex items-center justify-center hover:shadow-xl transition-all cursor-pointer bg-blue-50">
                  <CreditCard className="h-10 w-10 text-blue-600 mr-4" />
                  <div>
                    <span className="font-bold text-lg text-gray-800">Kredi Kartı</span>
                    <div className="text-sm text-gray-500">Anında işlem</div>
                  </div>
                </div>
                <div className="group border-2 border-gray-200 rounded-2xl p-6 flex items-center justify-center hover:border-blue-600 hover:bg-blue-50 hover:shadow-xl transition-all cursor-pointer">
                  <Building2 className="h-10 w-10 text-gray-600 group-hover:text-blue-600 mr-4 transition-colors" />
                  <div>
                    <span className="font-bold text-lg text-gray-800">Havale/EFT</span>
                    <div className="text-sm text-gray-500">Banka transferi</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Son Siparişler</h2>
              <div className="text-center py-12">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">Henüz sipariş bulunmuyor</p>
                <button onClick={() => { navigateToPage('products'); }} className="mt-4 text-blue-600 hover:text-purple-600 font-semibold">
                  Alışverişe Başla →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Footer
  const Footer = () => (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Package className="h-7 w-7 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold">AmbalajTest</span>
            </div>
            <p className="text-gray-400 leading-relaxed">Profesyonel ambalaj çözümleri ile işinizi büyütün.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Kurumsal</h3>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => navigateToPage('about')} className="hover:text-white transition-colors">Hakkımızda</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Müşteri Hizmetleri</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">SSS</a></li>
              <li><button onClick={() => navigateToPage('contact')} className="hover:text-white transition-colors">İletişim</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Kargo Takip</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">İletişim</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center"><Phone className="h-5 w-5 mr-2" /> +90 555 123 45 67</li>
              <li className="flex items-center"><Mail className="h-5 w-5 mr-2" /> info@ambalajtest.com</li>
              <li className="flex items-start"><MapPin className="h-5 w-5 mr-2 mt-1" /> Antalya, Türkiye</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; 2025 AmbalajTest. Tüm hakları saklıdır.</p>
            <div className="flex items-center space-x-2">
              <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full text-sm">
                🇹🇷 Türkiye'den
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Transition Overlay */}
      {isPageTransitioning && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 z-[100] flex items-center justify-center animate-fadeIn">
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-3xl">
              <Package className="h-16 w-16 text-white mx-auto mb-4 animate-bounce" />
              <div className="text-white text-xl font-bold">Yükleniyor...</div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
      
      <Navigation />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'products' && <ProductsPage />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'dashboard' && <DashboardPage />}
      
      <LoginModal />
      <RegisterModal />
      
      <Footer />
    </div>
  );
};

export default AmbalajWebsite;
