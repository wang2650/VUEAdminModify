<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
import Vue from 'vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import VueHead from 'vue-head'
Vue.prototype.NProgress = NProgress
export default {
 head: {
 link: [
     { rel: 'icon', href: 'favicon.ico' }
 ]
 }


}

</script>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>