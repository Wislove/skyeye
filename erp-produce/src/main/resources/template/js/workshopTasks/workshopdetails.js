layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui'], function (exports) {
    winui.renderColor();
    layui.use(['form'], function (form) {
        var index = parent.layer.getFrameIndex(window.name);
        var $ = layui.$,
            table = layui.table;
        var objectId = GetUrlParam("id");
        var serviceClassName = GetUrlParam("serviceClassName");

        showGrid({
            id: "showForm",
            url: sysMainMation.erpBasePath + "getDataByObjectId",
            params: {
                objectId: objectId,
                serviceClassName: serviceClassName
            },
            pagination: false,
            method: "GET",
            template: $("#beanTemplate").html(),
            ajaxSendLoadBefore: function (hdb, json) {
                if (json && json.bean) {
                    // 处理状态显示
                    if (json.bean.state) {
                        json.bean.state = skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("machinProcedureFarmState", 'id', json.bean.state, 'name');
                    }
                }
            },
            ajaxSendAfter: function (json) {
                matchingLanguage();
                form.render();
            }
        });

        // 加工单号点击事件
        $("body").on("click", "[lay-event='machinDetails']", function () {
            var machinId = $(this).attr("machinId");
            _openNewWindows({
                url: systemCommonUtil.getUrl('FP2023100300003&id=' + machinId, null),
                title: systemLanguage["com.skyeye.detailsPageTitle"][languageType],
                pageId: "machiningDetail",
                area: ['90vw', '90vh'],
                callBack: function (refreshCode) {
                }
            });
        });

        $("body").on("click", "#userPhoto", function () {
            systemCommonUtil.showPicImg($(this).attr("src"));
        });
    });
});