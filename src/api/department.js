import service from '@/api/request'
//获取用户的部门
export function GetDepartmentListByUserId(userId) {
   return service({
     url: '/Api/SystemManage/Department/GetDepartmentListByUserId',
     method: 'post',
     data:userId
   })
 }

//获取当前用户的部门
export function GetDepartmentListForCurrentUser() {
    return service({
      url: '/Api/SystemManage/Department/GetDepartmentListForCurrentUser',
      method: 'get'
    })
  }

 
//添加部门
 export function InsertDepartment() {
    return service({
      url: '/Api/SystemManage/Department/InsertDepartment',
      method: 'post',
      data:''
    })
  }

//修改部门
export function UpdateDepartment() {
  return service({
    url: '/Api/SystemManage/Department/UpdateDepartment',
    method: 'post',
    data:''
  })
}
//删除部门
export function DeleteDepartmentByDepartmentId() {
    return service({
      url: '/Api/SystemManage/Department/DeleteDepartmentByDepartmentId',
      method: 'get',
      data:''
    })
  }
  //获取部门列表
export function GetDepartmentList() {
    return service({
      url: '/Api/SystemManage/Department/GetDepartmentList',
      method: 'post',
      data:''
    })
  }
  //获取部门的用户
export function GetUserListByDepartmentId() {
    return service({
      url: '/Api/SystemManage/Department/GetUserListByDepartmentId',
      method: 'get',
      data:''
    })
  }


    //修改部门中的用户
export function ModifyUserForDepartment() {
    return service({
      url: '/Api/SystemManage/Department/GetUserListByDepartmentId',
      method: 'post',
      data:''
    })
  }
