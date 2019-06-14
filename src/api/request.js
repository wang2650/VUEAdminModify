import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import storage from "@/api/storage";

// create an axios instance
const service = axios.create({
    baseURL: process.env.baseUrl, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 10000 // request timeout
  })

  // request interceptor
service.interceptors.request.use(
    config => {
      // do something before request is sent
  
      if (storage.getValue('token')) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['Authorization'] =storage.getValue('token')
      }
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )


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
      const res = response.data
      // if the custom code is not 20000, it is judged as an error.
      if (res.Code != 0 ) {
        Message({
          message: res.Errors.join('  ') || '错误',
          type: 'error',
          duration: 5 * 1000
        })
         
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
     
        return Promise.reject(res.Errors.join('<br />') || '错误')
      } else {
        return res
      }
    },
    error => {
      
      let errormessage=error.message
      switch (error.status) {
        case 401:
            errormessage='weiapi没有访问权限'
          break;
          case 404:
              errormessage='weiapi地址没有'
            break;
          case 500:
              errormessage='weiapi服务器错误'
            break;
            default:
              break;

    }



      console.log('err' + errormessage) // for debug
      Message({
        message: errormessage,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  )
  
  export default service