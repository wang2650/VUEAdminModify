import service from '@/api/request'
import utils from '@/api/utils'
//获取用户的菜单
export function GetMenuByUser(dataValue) {
   return service({
     url: '/Api/SystemManage/Menu/GetMenuByUser',
     method: 'post',
     data:dataValue
   })
 }
 //获取用户部门的菜单和角色已设置的菜单
 export function GetMenuTreeForCurrentUserByDeparentId(dataValue) {
  return service({
    url: '/Api/SystemManage/Menu/GetMenuTreeForCurrentUserByDeparentId'+utils.queryParams(dataValue),
    method: 'get',
    data:''
  })
}
 


//获取当前用户的菜单
 export function GetMenuTreeForCurrentUser() {
    return service({
      url: '/Api/SystemManage/Menu/GetMenuTreeForCurrentUser',
      method: 'get',
      data:''
    })
  }

//获取当前用户可访问的地址
export function GetUrlRightForCurrentUser() {
  return service({
    url: '/Api/SystemManage/Menu/GetUrlRightForCurrentUser',
    method: 'get',
    data:''
  })
}
//设置角色的菜单
export function ModifyMentForRole(dataValue) {
  return service({
    url: '/Api/SystemManage/Menu/ModifyMentForRole',
    method: 'post',
    data:dataValue
  })
}




  