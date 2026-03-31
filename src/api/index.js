import axios from 'axios';
import { useRouter } from 'vue-router'

const router = useRouter()

// test
const http = 'http://139.224.246.134:6180';

// 1. 创建一个 axios 实例，配置基础地址和超时时间
const api = axios.create({
  baseURL: http + '/pinball', // 你的接口基础地址
  timeout: 15000,
});

// 2. 请求拦截器（例如：统一添加 Token）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. 响应拦截器（例如：统一处理错误码）
api.interceptors.response.use(
  (response) => {
    // 直接返回 data 部分，组件里不用再写 response.data
    return response.data;
  },
  (error) => {
    // 统一处理 401、500 等错误
    if (error.response?.status === 401) {
      // 跳转到登录页
      localStorage.removeItem('token');
      router.push({ name: 'login' })
    }
    return Promise.reject(error);
  }
);

export default api;