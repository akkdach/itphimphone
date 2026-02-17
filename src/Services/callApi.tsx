// api.ts
import axios, { AxiosRequestConfig } from 'axios';
interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}
const BASE_URL = process.env.REACT_APP_API_URL;
const callApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
callApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // หรือจาก secure storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error)
    Promise.reject(error)
  }
);

// Response Interceptor
callApi.interceptors.response.use(
  (response) => {
    console.log('response', response)
    return response;
  },
  (error) => {
    console.log(error)
    // จัดการ error เช่น token หมดอายุ

    if (error.response?.status === 401) {
      // redirect ไปหน้า login หรือ refresh token
      localStorage.clear();
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default callApi;
