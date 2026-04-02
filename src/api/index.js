import axios from 'axios';

const http = 'http://139.224.246.134:6180';  // test

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
    // 统一处理 401、500 等错误
    if (response.data?.code === 401) {
      // 跳转到登录页
      setTimeout(() => {
        localStorage.removeItem('token')
        location.href = '/login'
      }, 1000)
    } else {
      return response.data;
    }
  },
  (error) => Promise.reject(error)
  // (error) => {
  //   console.log(222, error);
  //   // 统一处理 401、500 等错误
  //   if (error.response?.code === 401) {
  //     // 跳转到登录页
  //     localStorage.removeItem('token');
  //     location.href = '/login'
  //   }
  //   return Promise.reject(error);
  // }
);

export default api;