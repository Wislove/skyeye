layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'form'], function (exports) {
    winui.renderColor();
    var index = parent.layer.getFrameIndex(window.name);
    var $ = layui.$,
        form = layui.form;

    // // 从URL获取参数
    // var objectId = getUrlParam("id");
    // var serviceClassName = decodeURIComponent(getUrlParam("serviceClassName"));

    console.log("11Parameters:", parent.objectId, parent.serviceClassName);

    showGrid({
        id: "showForm",
        url: reqBasePath + "getDataByObjectId",
        params: {
            objectId: parent.objectId,
            serviceClassName: parent.serviceClassName
        },
        pagination: false,
        method: "GET",
        template: $("#showBaseTemplate").html(),
        ajaxSendLoadBefore: function (hdb, json) {
            json.bean.enabled = skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("commonEnable", 'id', json.bean.enabled, 'name');
        },
        ajaxSendAfter: function (json) {
            matchingLanguage();
            form.render();
        }
    });

    $("body").on("click", "#cancle", function () {
        parent.layer.close(index);
    });
});