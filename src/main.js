import Vue from 'vue'
import Vuex from "vuex";
import App from './App.vue'
import router from './router'
import storage from "@/api/storage";
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.prototype.$axios = axios;
import { MessageBox, Message } from 'element-ui'
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/main.css';
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
Vue.config.productionTip = false
console.log('process:'+process.env.VUE_APP_URL)
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
import moment from 'moment'
Vue.prototype.momentplug = moment
const i18n = new VueI18n({
    locale: 'zh',
    messages
})

import { GetUrlRightForCurrentUser } from "@/api/menu";

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    NProgress.start()
    // document.title = to.meta.title;
    const whileList=['/login','/help','contact']

    const token =  storage.getValue("token");

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
            // if ( storage.getValue('canVisitroute')) {
            //     canVisitroute = JSON.parse(storage.getValue('canVisitroute'));
            //   } else {
            //     GetUrlRightForCurrentUser()
            //       .then(function(response) {
            //         if (response.Code === 0) {
            //           storage.set('canVisitroute',JSON.stringify(response.Data.Result) )
            //           canVisitroute= response.Data.Result;
            //         }
            //       })
            //       .catch(function(error) {
            //         Message.error('获取用户可访问地址方法错误')
            //       });
            //   }

               if(canVisitroute.indexOf(to.path)>=0){
                next();
               }else{
                next();
                //Message.error('没有该地址权限');
               }


           

            
        }
    }
})
router.afterEach(() => {
    NProgress.done()
  })

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')