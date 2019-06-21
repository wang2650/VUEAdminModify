import service from '@/api/request'
import utils from '@/api/utils'
//获取用户的部门
export function GetDepartmentListByUserId(dataValue) {
   return service({
     url: '/Api/SystemManage/Department/GetDepartmentListByUserId'+utils.queryParams(dataValue),
     method: 'get',
     data:''
   })
 }

//获取当前用户的部门
export function GetDepartmentListForCurrentUser() {
    return service({
      url: '/Api/SystemManage/Department/GetDepartmentListForCurrentUser',
      method: 'get'
    })
  }
  //查找当前用户所在的部门和子部门
  export function GetDepartmentAndSubDepartmentForCurrentUser() {
    return service({
      url: '/Api/SystemManage/Department/GetDepartmentAndSubDepartmentForCurrentUser',
      method: 'get'
    })
  }
  
//添加部门
 export function InsertDepartment(dataValue) {
    return service({
      url: '/Api/SystemManage/Department/InsertDepartment',
      method: 'post',
      data:dataValue
    })
  }

//修改部门
export function UpdateDepartment(dataValue) {
  return service({
    url: '/Api/SystemManage/Department/UpdateDepartment',
    method: 'post',
    data:dataValue
  })
}
//删除部门
export function DeleteDepartmentByDepartmentId(dataValue) {
    return service({
      url: '/Api/SystemManage/Department/DeleteDepartmentByDepartmentId'+utils.queryParams(dataValue),
      method: 'get',
      data:''
    })
  }
  //获取所有部门列表
export function GetDepartmentList(dataValue) {
    return service({
      url: '/Api/SystemManage/Department/GetDepartmentList',
      method: 'post',
      data:dataValue
    })
  }
  //获取部门的用户
export function GetUserListByDepartmentId(dataValue) {
    return service({
      url: '/Api/SystemManage/Department/GetUserListByDepartmentId'+utils.queryParams(dataValue),
      method: 'get',
      data:dataValue
    })
  }


    //添加部门中的用户
export function AddUserForDepartment(dataValue) {
    return service({
      url: '/Api/SystemManage/Department/AddUserForDepartment',
      method: 'post',
      data:dataValue
    })
  }
  //移除部门中用户
  export function RemoveUserForDepartment(dataValue) {
    return service({
      url: '/Api/SystemManage/Department/RemoveUserForDepartment',
      method: 'post',
      data:dataValue
    })
  }