import Vue from 'vue'
import { isString, isArray } from '@/utils/validate'

if (checkNeed()) {
  Vue.config.errorHandler = function(err, vm, info, a) {
    Vue.nextTick(() => {
       //window.location.href
      console.error(err, info)
    })
  }
}
