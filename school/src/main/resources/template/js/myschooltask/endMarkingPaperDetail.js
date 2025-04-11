
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

    surveyId = GetUrlParam("surveyId");

    if (isNull(surveyId)) {
        winui.window.msg("请传入适用对象信息", {icon: 2, time: 2000});
        return false;
    }

    loadDetail();
    function loadDetail() {
        showGrid({
            id: "showForm",
            url: schoolBasePath + "querySurveyAnswerBySurveyId",
            params: {id: subjectClassesId},
            pagination: false,
            method: 'post',
            template: $("#beanTemplate").html(),
            ajaxSendLoadBefore: function (hdb, json) {
                json.bean.enabledName = skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("commonEnable", 'id', json.bean.enabled, 'name');
                json.bean.quitName = skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("whetherEnum", 'id', json.bean.quit, 'name');
            },
            ajaxSendAfter: function (json) {
                matchingLanguage();
                form.render();
            }
        });
    }
});