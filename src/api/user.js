 import service from '@/api/request'
 export function login(data) {
     console.info('data:'+data)
    return service({
      url: '/api/user/login',
      method: 'post',
      data
    })
  }