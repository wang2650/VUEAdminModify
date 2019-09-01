/**
 * @author zhuzhaofeng
 * @description Listener Window Error
 */
export default (callback) => {
    /**
     * @author zhuzhaofeng
     * @description 运行时错误处理器
     * @param {string} message 错误信息
     * @param {string} source 发生错误的脚本URL
     * @param {number} lineno 发生错误的行号
     * @param {number} colno 发生错误的列号
     * @param {object} error Error对象
     */
    function unError(message, source, lineno, colno, error) {
        let errJson = {
            message,
            source,
            lineno,
            colno
        }
        callback ? callback({
            type: 'error',
            info: errJson
        }) : null;
    }
    window.onerror = unError;
}