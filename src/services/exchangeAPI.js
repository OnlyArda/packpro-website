// Döviz Kuru API Servisi

const EXCHANGE_API_URL = process.env.REACT_APP_EXCHANGE_API || 'https://api.exchangerate-api.com/v4/latest/USD';
const TCMB_API_URL = 'https://www.tcmb.gov.tr/kurlar/today.xml';

// ExchangeRate-API ile kur getirme (Önerilen - Ücretsiz)
export const getExchangeRate = async () => {
  try {
    const response = await fetch(EXCHANGE_API_URL);
    
    if (!response.ok) {
      throw new Error('API yanıt vermedi');
    }
    
    const data = await response.json();
    
    if (data && data.rates && data.rates.TRY) {
      console.log('Döviz kuru güncellendi:', data.rates.TRY);
      return {
        rate: data.rates.TRY,
        success: true,
        source: 'ExchangeRate-API',
        date: data.date
      };
    }
    
    throw new Error('TRY kuru bulunamadı');
  } catch (error) {
    console.error('ExchangeRate-API hatası:', error);
    
    // Fallback: TCMB'yi dene
    return await getExchangeRateFromTCMB();
  }
};

// TCMB (Merkez Bankası) ile kur getirme (Alternatif)
export const getExchangeRateFromTCMB = async () => {
  try {
    const response = await fetch(TCMB_API_URL);
    
    if (!response.ok) {
      throw new Error('TCMB API yanıt vermedi');
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    
    const usdSelling = xml.querySelector('Currency[Kod="USD"] ForexSelling');
    
    if (usdSelling) {
      const rate = parseFloat(usdSelling.textContent);
      console.log('TCMB döviz kuru:', rate);
      
      return {
        rate: rate,
        success: true,
        source: 'TCMB',
        date: new Date().toISOString()
      };
    }
    
    throw new Error('USD kuru bulunamadı');
  } catch (error) {
    console.error('TCMB API hatası:', error);
    
    // Son çare: Sabit fallback değer
    return {
      rate: 34.50,
      success: false,
      source: 'Fallback',
      date: new Date().toISOString(),
      error: 'API\'lere erişilemedi, varsayılan kur kullanılıyor'
    };
  }
};

// Kur çevirme fonksiyonu
export const convertUSDtoTRY = (usdAmount, rate) => {
  return (usdAmount * rate).toFixed(2);
};

// Kur çevirme fonksiyonu (ters)
export const convertTRYtoUSD = (tryAmount, rate) => {
  return (tryAmount / rate).toFixed(2);
};

// Para formatı (TL)
export const formatTRY = (amount) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Para formatı (USD)
export const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
