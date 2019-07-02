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
  // 修改密码
  export function ModifyUserPassord(dataValue) {
    return service({
      url: '/api/SystemManage/User/ModifyUserPassord',
      method: 'post',
      data:dataValue,
    })
  }
//重置密码
  export function ResetPassord(dataValue) {
    return service({
      url: '/api/SystemManage/User/ResetPassord',
      method: 'post',
      data:dataValue,
    })
  }
//刷新token
  export function RefreshToken(dataValue) {
    return service({
      url: '/api/SystemManage/User/RefreshToken',
      method: 'post',
      data:dataValue,
    })
  }
//获取当前用户的基本信息
export function GetCurrentUserInfo() {
  return service({
    url: '/api/SystemManage/User/GetCurrentUserInfo',
    method: 'get'
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
  //修改自己的信息
  export function UpdateMyselfInfo(dataValue) {
    return service({
      url: '/api/SystemManage/User/UpdateMyselfInfo',
      method: 'post',
      data:dataValue,
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
  //获取用户集合，包含部门id
  export function GetUsersRefDepartment(dataValue) {
    return service({
      url: '/api/SystemManage/User/GetUsersRefDepartment',
      method: 'post',
      data:dataValue,
    })
  }
  //获取用户与该角色的关系列表
  export function GetUsersRefRole(dataValue) {
    return service({
      url: '/api/SystemManage/User/GetUsersRefRole',
      method: 'post',
      data:dataValue,
    })
  }
  