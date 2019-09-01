/**
 * @author zhuzhaofeng
 * @description Listener Memory
 */
export default (time, callback) => {
    setInterval(() => {
        let size = performance.memory;
        let result = {
            type: 'memory',
            info: {
                usedJSHeapSize: (size.usedJSHeapSize / 1048576).toFixed(2),
                totalJSHeapSize: (size.totalJSHeapSize / 1048576).toFixed(2),
                jsHeapSizeLimit: (size.jsHeapSizeLimit / 1048576).toFixed(2),
                state: size.usedJSHeapSize > size.totalJSHeapSize ? "可能出现内存泄漏" : "正常"
            }
        }
        callback(result);
    }, time)
}