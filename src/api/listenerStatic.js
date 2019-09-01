/**
 * @author zhuzhaofeng
 * @description Listener Static Load
 */
export default (callback) => {
    window.addEventListener("error", function (e) {
        let eventType = [].toString.call(e, e);
        // 过滤掉运行时错误
        if (eventType === "[object Event]") {
            // 上报加载错误
            let errJson = {};
            if (e.type === 'error') {
                let _self = e.target;
                errJson.el = (_self.nodeName).toLowerCase();
                if (errJson.el === 'img') {
                    errJson.msg = "图片加载异常"
                    errJson.src = _self.src
                    if (_self.id) {
                        errJson.id = _self.id
                    }

                    if (_self.className) {
                        errJson.classes = _self.className
                    }
                }

                if (errJson.el === 'script') {
                    errJson.msg = "脚本文件加载异常"
                    errJson.src = _self.src
                }

                if (errJson.el === 'link') {
                    errJson.msg = "样式表加载异常"
                    errJson.href = _self.href
                }
                errJson.html = _self.outerHTML
                callback ? callback({
                    type: 'static',
                    info: errJson
                }) : null;
            }
        }
    }, true);
}