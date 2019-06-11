import service from '@/api/request'
//获取用户的菜单
export function GetMenuByUser(userId) {
   return service({
     url: '/Api/SystemManage/Menu/',
     method: 'post',
     data:userId
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


  