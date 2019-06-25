import service from '@/api/request'
import utils from '@/api/utils'

 //获取角色列表
 export function GetRoleList(dataValue) {
   return service({
     url: '/api/SystemManage/Role/GetRoleList',
     method: 'post',
     data:dataValue,
   })
 }
//插入
 export function InsertRole(dataValue) {
   return service({
     url: '/api/SystemManage/Role/InsertRole',
     method: 'post',
     data:dataValue,
   })
 }

///删除
 export function DeleteRoleByRoleId(dataValue) {
   return service({
     url: '/api/SystemManage/Role/DeleteRoleByRoleId'+utils.queryParams(dataValue),
     method: 'get',
     // headers:{"contentType":"application/json"}
   })
 }

 //修改
 export function UpdateRole(dataValue) {
   return service({
     url: '/api/SystemManage/Role/UpdateRole',
     method: 'post',
     data:dataValue,
   })
 }

 export function RemoveUserFromRole(dataValue) {
  return service({
    url: '/api/SystemManage/Role/RemoveUserFromRole',
    method: 'post',
    data:dataValue,
  })
}

export function AddUserForRole(dataValue) {
  return service({
    url: '/api/SystemManage/Role/AddUserForRole',
    method: 'post',
    data:dataValue,
  })
}
 