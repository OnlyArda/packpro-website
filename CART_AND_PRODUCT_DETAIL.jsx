// SEPET ve ÜRÜN DETAY SAY FALARI
// Ana dosyaya eklenecek componentler

// ================================
// SEPET SAYFASI COMPONENT'İ
// ================================

const CartPage = () => (
  <div className="pt-28 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Sepetim
      </h1>

      {cart.length === 0 ? (
        // Boş Sepet
        <div className="text-center py-20">
          <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Sepetiniz Boş</h2>
          <p className="text-gray-600 mb-8">Harika ürünlerimize göz atın ve sepetinize ekleyin</p>
          <button
            onClick={() => navigateToPage('products')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold"
          >
            Alışverişe Başla
          </button>
        </div>
      ) : (
        // Dolu Sepet
        <div className="grid md:grid-cols-3 gap-8">
          {/* Ürün Listesi */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex items-center gap-6">
                {/* Ürün Resmi */}
                <div className={`${item.color} w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <ImageOff className="h-12 w-12 text-white/30" />
                </div>

                {/* Ürün Bilgileri */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.categoryName}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {convertToTL(item.priceUSD * item.quantity)} ₺
                    </span>
                    <span className="text-sm text-gray-500">
                      ({item.quantity} × {convertToTL(item.priceUSD)} ₺)
                    </span>
                  </div>
                </div>

                {/* Miktar Kontrolleri */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl flex items-center justify-center transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Sil Butonu */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl flex items-center justify-center transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Sipariş Özeti */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-28">
              <h2 className="text-2xl font-bold mb-6">Sipariş Özeti</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam:</span>
                  <span className="font-semibold">{getTotalPriceTL()} ₺</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>KDV (%20):</span>
                  <span className="font-semibold">{(getTotalPriceTL() * 0.20).toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo:</span>
                  <span className="font-semibold text-green-600">Ücretsiz</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 flex justify-between">
                  <span className="text-xl font-bold">Toplam:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {(getTotalPriceTL() * 1.20).toFixed(2)} ₺
                  </span>
                </div>
                <div className="text-sm text-gray-500 text-center">
                  (${getTotalPrice().toFixed(2)} USD)
                </div>
              </div>

              {/* Döviz Kuru Bilgisi */}
              <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Güncel Kur:</span>
                  <span className="font-bold text-blue-600">1 USD = {exchangeRate} ₺</span>
                </div>
              </div>

              {/* Ödeme Butonları */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold flex items-center justify-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Kredi Kartı ile Öde
                </button>
                <button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center justify-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Havale/EFT ile Öde
                </button>
              </div>

              {/* Güvenlik */}
              <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-2" />
                256-bit SSL Şifreli Ödeme
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

// ================================
// ÜRÜN DETAY SAYFASI COMPONENT'İ
// ================================

const ProductDetailPage = () => {
  if (!selectedProduct) return null;

  const product = selectedProduct;
  const relatedProducts = filteredProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button onClick={() => navigateToPage('home')} className="hover:text-blue-600">
            Ana Sayfa
          </button>
          <ChevronRight className="h-4 w-4" />
          <button onClick={() => navigateToPage('products')} className="hover:text-blue-600">
            Ürünler
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>

        {/* Ana İçerik */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Ürün Görseli */}
          <div>
            <div className={`${product.color} aspect-square rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl`}>
              <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20"></div>
              <ImageOff className="h-48 w-48 text-white/30 relative z-10" />
              
              {/* Badges */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-current" /> {product.rating}
                </div>
                {product.stock < 1000 && (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Son {product.stock} adet!
                  </div>
                )}
              </div>
            </div>

            {/* Küçük Resimler (Placeholder) */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`${product.color} aspect-square rounded-2xl flex items-center justify-center opacity-50 hover:opacity-100 cursor-pointer transition-opacity`}>
                  <ImageOff className="h-8 w-8 text-white/30" />
                </div>
              ))}
            </div>
          </div>

          {/* Ürün Bilgileri */}
          <div>
            <div className="bg-blue-50 inline-block px-4 py-2 rounded-full text-blue-600 font-semibold mb-4">
              {product.categoryName}
            </div>
            
            <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
            
            <p className="text-gray-600 text-lg mb-8">{product.description}</p>

            {/* Fiyat */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="text-sm text-gray-500 mb-2">Fiyat</div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {convertToTL(product.priceUSD)} ₺
              </div>
              <div className="text-gray-500">${product.priceUSD} USD</div>
              
              <div className="mt-6 bg-blue-50 rounded-2xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Güncel Döviz Kuru:</span>
                  <span className="font-bold text-blue-600">1 USD = {exchangeRate} ₺</span>
                </div>
              </div>
            </div>

            {/* Özellikler */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">Stok Durumu</div>
                  <div className="text-sm text-gray-600">{product.stock} adet mevcut</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Teslimat</div>
                  <div className="text-sm text-gray-600">2-3 iş günü içinde kargoda</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold">Garanti</div>
                  <div className="text-sm text-gray-600">14 gün iade garantisi</div>
                </div>
              </div>
            </div>

            {/* Sepete Ekle Butonları */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  addToCart(product);
                  navigateToPage('cart');
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center"
              >
                <ShoppingCart className="h-6 w-6 mr-2" />
                Sepete Ekle
              </button>
              
              <button
                onClick={() => addToCart(product)}
                className="bg-white border-2 border-gray-300 text-gray-700 py-5 px-6 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                <Heart className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* İlgili Ürünler */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Benzer Ürünler</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => {
                    setSelectedProduct(relatedProduct);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer"
                >
                  <div className={`${relatedProduct.color} h-48 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20"></div>
                    <ImageOff className="h-16 w-16 text-white/30 relative z-10" />
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {convertToTL(relatedProduct.priceUSD)} ₺
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ================================
// NASIL KULLANILIR?
// ================================
/*

1. Ana dosyada (packpro-complete.jsx) currentPage kontrolünü güncelleyin:

{currentPage === 'home' && <HomePage />}
{currentPage === 'products' && <ProductsPage />}
{currentPage === 'cart' && <CartPage />}              // YENİ
{currentPage === 'product-detail' && <ProductDetailPage />}  // YENİ
{currentPage === 'about' && <AboutPage />}
{currentPage === 'contact' && <ContactPage />}
{currentPage === 'dashboard' && <DashboardPage />}

2. Navigation'da sepet ikonuna tıklama ekleyin:

<button 
  onClick={() => navigateToPage('cart')} 
  className="relative p-3 text-gray-700..."
>
  <ShoppingCart className="h-6 w-6" />
  ...
</button>

3. Ürün kartlarında "Detay" butonu ekleyin:

<button
  onClick={() => {
    setSelectedProduct(product);
    navigateToPage('product-detail');
  }}
  className="..."
>
  <Eye className="h-4 w-4 mr-2" />
  Detayları Gör
</button>

*/
