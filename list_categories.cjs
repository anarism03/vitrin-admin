const axios = require('axios');

const API_URL = 'http://161.97.154.119/intern-api/api';
const EMAIL = 'ismayilzadeanar310@gmail.com';
const PASSWORD = '02112003aaA';

async function run() {
  try {
    const loginRes = await axios.post(`${API_URL}/auth/login`, { email: EMAIL, password: PASSWORD });
    let token = loginRes.data?.data?.accessToken || loginRes.data?.accessToken || loginRes.data?.data?.access_token || loginRes.data?.access_token;
    
    const axiosInstance = axios.create({
      baseURL: API_URL,
      headers: { Authorization: `Bearer ${token}` }
    });

    const catRes = await axiosInstance.get('/categories', { params: { pageSize: 100 } });
    let categories = catRes.data?.data?.data || catRes.data?.data || catRes.data || [];

    console.log(JSON.stringify(categories.map(c => ({id: c.id, name: c.name})), null, 2));
  } catch (err) {
    console.error('Error:', err?.response?.data || err.message);
  }
}

run();
