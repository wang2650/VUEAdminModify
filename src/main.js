import Vue from 'vue'
import Vuex from "vuex";
import App from './App.vue'
import router from './router'
import store from '@/store/index'
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import { GetUrlRightForCurrentUser } from "@/api/menu";
import { MessageBox, Message } from 'element-ui'
Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;

const i18n = new VueI18n({
    locale: 'zh',
    messages
})

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    // document.title = to.meta.title;
    const whileList=['/login','/help','contact']
    const token = store.getters.token;
    if (whileList.indexOf(to.path)>=0) {
        next();
    }
    else if (!token) {
        next('/login');
    }
    else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
             let canVisitroute=[]
            if (store.getters.canVisitroute && store.getters.canVisitroute.length > 0) {
                canVisitroute = store.getters.canVisitroute;
              } else {
                GetUrlRightForCurrentUser()
                  .then(function(response) {
                    if (response.Code === 0) {
                      store.commit("setcanVisitroute", response.Data.result);
                      canVisitroute= store.getters.canVisitroute;
                    }
                  })
                  .catch(function(error) {
                    Message.error('获取用户可访问地址方法错误')
                  });
              }

               if(canVisitroute.indexOf(to.path)>=0){
                next();
               }else{
                next();
                //Message.error('没有该地址权限');
               }


           

            
        }
    }
})


new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')