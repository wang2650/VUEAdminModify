import service from '@/api/request'
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
export function GetDepartmentList() {
    return service({
      url: '/Api/SystemManage/Department/GetDepartmentList',
      method: 'post',
      data:''
    })
  }
  //获取部门的用户
export function GetUserListByDepartmentId(dataValue) {
    return service({
      url: '/Api/SystemManage/Department/GetUserListByDepartmentId'+utils.queryParams(dataValue),
      method: 'get',
      data:''
    })
  }


    //修改部门中的用户
export function ModifyUserForDepartment(dataValue) {
    return service({
      url: '/Api/SystemManage/Department/GetUserListByDepartmentId',
      method: 'post',
      data:dataValue
    })
  }
