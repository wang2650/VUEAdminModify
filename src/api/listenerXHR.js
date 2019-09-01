/**
 * @author zhuzhaofeng
 * @description Listener XHR
 */
export default (callback) => {
    let tempOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
        let startTime = 0,
            endTime = 0;
        this.addEventListener("readystatechange", function (evt) {
            if (this.readyState === 1) {
                startTime = evt.timeStamp;
            }
            if (this.readyState === 4) {
                endTime = evt.timeStamp;
                // 监听到xhr请求 回调
                callback({
                    type: 'xhr',
                    info: {
                        method: method,
                        url: url,
                        async: async,
                        status: evt.target.status ? evt.target.status : 'fail',
                        response: evt.target.response,
                        timeLoad: `${(endTime - startTime).toFixed(3)}ms`
                    }
                })
            }
        }, false);
        tempOpen.call(this, method, url, async, user, pass);
    }
}