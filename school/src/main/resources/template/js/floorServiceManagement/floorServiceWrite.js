
// 以下两个参数开启团队权限时有值
var objectId = '', objectKey = '';
var nodeType=1;
// 根据以下两个参数判断：工作流的判断是否要根据serviceClassName的判断
var serviceClassName;

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery'], function (exports) {
    winui.renderColor();
    var $ = layui.$;
    var id = GetUrlParam("id");
    var locationId = GetUrlParam("placeTypeId");

    if (isNull(id)) {
        if (isNull(locationId)) {
            winui.window.msg('请选择地点', {icon: 2, time: 2000});
            return false;
        }
        dsFormUtil.initAddPageForStatic('content', 'FP2024111900001', {
            savePreParams: function (params) {
                params.locationId = locationId;
                params.nodeType=isNull(parent.parentNode) ? 1 : parent.parentNode.level + 1;
                params.parentId=isNull(parent.parentNode) ? "0" : parent.parentNode.id;
            }
        });

    } else {
        AjaxPostUtil.request({
            url: sysMainMation.schoolBasePath + "queryFloorInfoById",
            params: {id: id},
            type: 'json',
            method: 'GET',
            callback: function (json) {
                let data = json.bean;
                locationId = json.bean.locationId;
                dsFormUtil.initEditPageForStatic('content', 'FP2024111900006', data, {
                    savePreParams: function (params) {
                        params.locationId = locationId;
                        params.nodeType=isNull(parent.parentNode) ? 1 : parent.parentNode.level + 1;
                        params.parentId=isNull(parent.parentNode) ? "0" : parent.parentNode.id;
                    }
                });
            }
        });
    }
});