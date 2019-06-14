 import service from '@/api/request'
 import utils from '@/api/utils'
 //登录
 export function login(dataValue) {
    return service({
      url: '/api/SystemManage/User/Login',
      method: 'post',
      data:dataValue,
      headers:{"aaaaaaa":"bb"}
    })
  }
  //获取用户列表
  export function GetUserList(dataValue) {
    return service({
      url: '/api/SystemManage/User/GetUserList',
      method: 'post',
      data:dataValue,
    })
  }
//插入
  export function InsertUser(dataValue) {
    return service({
      url: '/api/SystemManage/User/InsertUser',
      method: 'post',
      data:dataValue,
    })
  }

///删除
  export function DeleteUser(dataValue) {
    return service({
      url: '/api/SystemManage/User/DeleteUser'+utils.queryParams(dataValue),
      method: 'get',
      // headers:{"contentType":"application/json"}
    })
  }
// 批量删除
  export function BatchRemoveUser(dataValue) {
    return service({
      url: '/api/SystemManage/User/batchRemoveUser',
      method: 'get',
      data:dataValue
    })
  }
  //修改
  export function UpdateUsers(dataValue) {
    return service({
      url: '/api/SystemManage/User/UpdateUsers',
      method: 'post',
      data:dataValue,
    })
  }