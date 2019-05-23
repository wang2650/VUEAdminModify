import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoutes = store.getters.customeroutes && store.getters.customeroutes.length > 0

      if (!hasRoutes) {
        await store.dispatch('user/getInfo')
        try {
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            to.path
          )

          // // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          //     // hack method to ensure that addRoutes is complete
          //     // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          //     // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        const customeRoute = store.getters.customeroutes
        let result = false
        for (var i = 0; i < customeRoute.length; i++) {
          if (customeRoute[i] === to.path) {
            result = true
          }
        }
        result = true // 不对子页面的路由验证
        if (result) {
          next()
        } else {
          console.info('path' + to.path)
          Message.error('没有该页面的权限')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      console.info('xxx:' + to.path)
      Message.error('没有该页面的权限')
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
