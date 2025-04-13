
// 以下两个参数开启团队权限时有值
var objectId = '', objectKey = '';
// 根据以下两个参数判断：工作流的判断是否要根据serviceClassName的判断
var serviceClassName;

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery'], function (exports) {
    winui.renderColor();
    var index = parent.layer.getFrameIndex(window.name);
    var $ = layui.$;
    let id = GetUrlParam("id") || '',
        className = GetUrlParam("className"),
        appId = GetUrlParam("appId");

    if (isNull(id)) {
        dsFormUtil.initAddPageForStatic('content', 'FP2025041200001', {
            savePreParams: function (params) {
                params.className = className;
                params.appId = appId;
                params.modelAttribute = 0;
                params.whetherInputParams = 1;
            }
        });
    } else {
        AjaxPostUtil.request({url: sysMainMation.reqBasePath + "queryAttrDefinitionById", params: {id: id}, type: 'json', method: 'GET', callback: function (json) {
            let data = json.bean;
            // 【编辑布局】
            dsFormUtil.initEditPageForStatic('content', 'FP2025041200002', data, {
                savePreParams: function (params) {
                    params.className = className;
                    params.appId = appId;
                    params.modelAttribute = 0;
                    params.whetherInputParams = 1;
                }
            });
        }});
    }

});