import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', false, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
const state = {
 
    username:'',
    sidebarMenu:[],
    canVisitroute:[]

}

const getters = {
    //用户名
    username: state => state.username,
    // 左侧菜单
    sidebarMenu:state=>state.sidebarMenu,
    //可访问路由
    canVisitroute:state=>state.canVisitroute,
    //token
    token:state=>state.token

}


const mutations = {
    setusername: (state, username) => {
      state.username=username
    },
    setsidebarMenu:(state, sidebarMenu) => {
        state.sidebarMenu=sidebarMenu
      },
      setcanVisitroute:(state, canVisitroute) => {
        state.canVisitroute=canVisitroute
      }
      ,
      settoken:(state, token) => {
        state.token=token
      }
    

  }

  const actions = {
    setusername({ commit }, username) {
      commit('setusername', username)
    },
    setsidebarMenu({ commit }, sidebarMenu) {
        commit('setsidebarMenu', sidebarMenu)
    },
    setcanVisitroute({ commit }, canVisitroute) {
        commit('setcanVisitroute', canVisitroute)
    }
    ,
    settoken({ commit }, token) {
        commit('settoken', token)
    }

  }


const store = new Vuex.Store({
  modules,
  state,
  getters,
  mutations,
  actions
})

export default store