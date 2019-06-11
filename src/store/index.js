import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    username:'',
    sidebarMenu:[],
    canVisitroute:[],
    token:''
  },
  getters: {
    //用户名
    username: state => state.username,
    // 左侧菜单
    sidebarMenu:state=>state.sidebarMenu,
    //可访问路由
    canVisitroute:state=>state.canVisitroute,
    //token
    token:state=>state.token
  },
  mutations: {
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
  },
  actions: {
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

});


export default store