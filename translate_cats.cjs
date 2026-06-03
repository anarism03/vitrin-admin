const axios = require('axios');
const { API_URL, getAdminCredentials } = require('./scriptConfig.cjs');

const translations = {
  "0fb911e0-111d-49fb-8b42-c113e60ec12b": "Ağıllı Ev", // Smart Home
  "08388f62-d5a0-4be9-87a1-7ececd0167d2": "Aksesuarlar", // Accessories
  "2f3e8aad-9f9d-4790-bea8-df3157b08802": "Səs Sistemləri", // Audio
  "3fa408db-1b38-42e4-9c19-5de90b9a55f1": "Oyun Avadanlıqları", // Gaming
  "2e675b55-2134-4b31-bb6b-56547d0691ce": "Digər Elektronika", // Electr123onics
  "317c7133-5d37-47c1-b9c3-b1c4712f8e9f": "Elektronika" // Electronics
};

async function run() {
  try {
    const credentials = getAdminCredentials();
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    });
    let token = loginRes.data?.data?.accessToken || loginRes.data?.accessToken || loginRes.data?.data?.access_token || loginRes.data?.access_token;
    
    const axiosInstance = axios.create({
      baseURL: API_URL,
      headers: { Authorization: `Bearer ${token}` }
    });

    for (const [id, newName] of Object.entries(translations)) {
      console.log(`Updating category ${id} to "${newName}"...`);
      await axiosInstance.patch(`/categories/${id}`, { name: newName });
    }

    console.log('Category names successfully translated to Azerbaijani!');
  } catch (err) {
    console.error('Error:', err?.response?.data || err.message);
  }
}

run();
