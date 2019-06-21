import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import storage from '@/api/storage';

// create an axios instance
const service = axios.create({
  baseURL: process.env.baseUrl, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (storage.getValue('token')) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = storage.getValue('token');
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.Code != 0) {
      Message({
        message: res.Errors.join('  ') || '错误',
        type: 'error',
        duration: 5 * 1000
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('你要退出吗，之后要重新登录', '确认退出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     localStorage.clear()
      //     this.$router.push('/login');
      //       location.reload()

      //   })
      // }

      return Promise.reject(res.Errors.join('<br />') || '错误');
    } else {
      return res;
    }
  },
  error => {
    let errormessage = error.message;
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errormessage = '未知请求';
          break;
        case 401:
          errormessage = 'weiapi没有访问权限';
          break;
        case 403:
          errormessage = 'webapi拒绝请求';
          break;
        case 404:
          errormessage = 'weiapi地址不存在';
          break;
        case 405:
          errormessage = '禁用请求中指定的方法';
          break;
        case 406:
          errormessage = '无法使用请求的内容特性响应请求的网页';
          break;
        case 408:
          errormessage = '服务器等候请求时发生超时';
          break;
        case 409:
          errormessage =
            '服务器在完成请求时发生冲突。 服务器必须在响应中包含有关冲突的信息';
          break;
        case 410:
          errormessage = '请求的资源已永久删除，服务器就会返回此响应';
          break;
        case 413:
          errormessage = '请求实体过大';
          break;
        case 414:
          errormessage = '请求的 URI（通常为网址）过长，服务器无法处理';
          break;
        case 415:
          errormessage = '不支持的媒体类型';
          break;
        case 500:
          errormessage = 'weiapi服务器内部错误';
          break;
        case 501:
          errormessage = '服务器不具备完成请求的功能';
          break;
        case 502:
          errormessage = '服务器作为网关或代理，从上游服务器收到无效响应';
          break;
        case 503:
          errormessage = '服务不可用';
          break;
        case 504:
          errormessage =
            '服务器作为网关或代理，但是没有及时从上游服务器收到请求';
          break;
        case 505:
          errormessage = '服务器不支持请求中所用的 HTTP 协议版本';
          break;
        default:
          break;
      }
    }
    Message({
      message: errormessage,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
