import { asyncRoutes, constantRoutes } from '@/router'
import store from '..'

export function filterAsyncRoutes(allRoute, canVisitRoute, lastpath) {
  const res = []
  lastpath = lastpath === '' ? '' : lastpath + '/'
  allRoute.forEach(route => {
    const tmp = { ...route }
    let result = false
    for (var i = 0; i < canVisitRoute.length; i++) {
      if (canVisitRoute[i] === lastpath + tmp.path) {
        result = true
      }
    }

    if (result) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, canVisitRoute, lastpath + tmp.path)
      }
      res.push(tmp)
    }
  })

  return res
}
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, path) {
    return new Promise(resolve => {
      // 左侧菜单

      const accessedRoutes = filterAsyncRoutes(asyncRoutes, store.getters.customeroutes, '')
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
