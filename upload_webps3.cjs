const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp');
const { API_URL, getAdminCredentials } = require('./scriptConfig.cjs');

const keywords = {
  "Apple iPhone 15 Pro Max": "iphone",
  "Samsung Galaxy S24 Ultra": "samsung+phone",
  "Apple MacBook Air M3": "macbook",
  "Asus ROG Strix G16": "gaming+laptop",
  "Zara Qara Dəri Gödəkçə": "leather+jacket",
  "Levi's 501 Original Cins": "blue+jeans",
  "Mango Klassik Qara Paltar": "black+dress",
  "H&M Yay Köynəyi": "summer+shirt",
  "Nike Air Force 1": "white+sneakers",
  "Adidas Ultraboost 22": "running+shoes",
  "Bosch İkiqapılı Soyuducu": "refrigerator",
  "Samsung Paltaryuyan Maşın": "washing+machine",
  "IKEA Minimalist İş Masası": "office+desk",
  "Rahat Künc Divan": "sofa",
  "Reebok Qantel Dəsti 20kg": "dumbbells",
  "Treadmill Qaçış Aparatı": "treadmill",
  "Xəyalpərəstlər - Roman": "novel+book",
  "Dəri Üzlük Qeyd Dəftəri": "leather+notebook",
  "Lego Technic Porsche": "lego+car",
  "Pultlu Oyuncaq Maşın": "rc+car",
  "L'Oreal Gündüz Kremi": "face+cream",
  "Dior Sauvage Ətir 100ml": "perfume",
  "Michelin Təkər Pompası": "car+tire+pump",
  "Bose Maşın Üçün Səs Sistemi": "car+audio",
  "Rolex Submariner": "rolex+watch",
  "Swarovski Gümüş Boyunbağı": "silver+necklace",
  "Sony 65 düym 4K OLED TV": "smart+tv",
  "JBL Flip 6 Bluetooth Kalonka": "bluetooth+speaker",
  "Amazon Echo Dot 5": "amazon+echo",
  "Xiaomi Ağıllı Lampa": "smart+lamp"
};

async function run() {
  try {
    console.log('Logging in...');
    const credentials = getAdminCredentials();
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    });
    let token = loginRes.data?.data?.accessToken || loginRes.data?.accessToken || loginRes.data?.data?.access_token || loginRes.data?.access_token;
    
    if (!token) throw new Error("Token missing");

    const axiosInstance = axios.create({
      baseURL: API_URL,
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Fetching products...');
    const prodRes = await axiosInstance.get('/products', { params: { pageSize: 100 } });
    let products = prodRes.data?.data?.data || prodRes.data?.data || prodRes.data || [];

    for (const prod of products) {
      if (prod.imageUrl) {
        console.log(`Skipping ${prod.name}, already has image.`);
        continue;
      }

      const keyword = keywords[prod.name] || "product";
      console.log(`Processing ${prod.name} (keyword: ${keyword})...`);
      
      try {
        const searchUrl = `https://loremflickr.com/1080/1080/${keyword}?lock=${Math.floor(Math.random() * 1000)}`;
        const imgRes = await axios.get(searchUrl, { responseType: 'arraybuffer' });
        
        const webpBuffer = await sharp(imgRes.data).webp({ quality: 90 }).toBuffer();
        
        const form = new FormData();
        form.append('images', webpBuffer, { filename: `${keyword.replace(/\+/g, '_')}.webp`, contentType: 'image/webp' });
        
        const uploadRes = await axiosInstance.post('/uploads/product-images', form, {
          headers: form.getHeaders()
        });
        
        const uploadedUrl = uploadRes.data?.urls?.[0] || uploadRes.data?.data?.urls?.[0];
        if (!uploadedUrl) {
          console.error("Upload failed for", prod.name, uploadRes.data);
          continue;
        }
        
        const fullImageUrl = new URL(uploadedUrl, 'http://161.97.154.119').toString();
        
        await axiosInstance.patch(`/products/${prod.id}`, {
          imageUrl: fullImageUrl,
          images: [{ url: uploadedUrl, isMain: true, sortOrder: 0 }]
        });
        console.log(`Successfully updated ${prod.name} with ${uploadedUrl}`);
      } catch (e) {
        console.error(`Error processing ${prod.name}:`, e.response?.data || e.message);
      }
    }
    
    console.log('Completed adding high quality WEBP images to all products!');
  } catch (err) {
    console.error('Error:', err?.response?.data || err.message);
  }
}

run();
