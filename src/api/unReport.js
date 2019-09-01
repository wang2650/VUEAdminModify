import listenerMemory from '@/api/listenerMemory';
import listenerXHR from '@/api/listenerXHR';
import listenerError from '@/api/listenerError';
import listenerStatic from '@/api/listenerStatic';
/**
 * @author zhuzhaofeng
 * @description 初始化方法
 */
const unReport = {
    config: [],
    init(args = {}) {
        let defaultConfig = {
            time: 3000,
            ignore: ['*'],
            callback: (data) => {
                //  console.log("sss:" + data)
            }
        }
        this.config = Object.assign(defaultConfig, args);
        this.reader();
    },
    reader() {
        // listenerMemory(this.config.time, this.config.callback)
        // listenerXHR(this.config.callback)
        listenerError(this.config.callback)
        listenerStatic(this.config.callback)
    }
}
export default unReport;