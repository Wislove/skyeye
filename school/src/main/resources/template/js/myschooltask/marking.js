
var objectKey = "";
var objectId = "";

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form,
        table = layui.table;
    objectKey = GetUrlParam("objectKey");
    objectId = GetUrlParam("objectId");
    if (isNull(objectKey) || isNull(objectId)) {
        winui.window.msg("请传入适用对象信息", {icon: 2, time: 2000});
        return false;
    }

    table.render({
        id: 'messageTable',
        elem: '#messageTable',
        method: 'get',
        url: sysMainMation.schoolBasePath + 'querySurveyAnswerBySurveyId',
        where: getTableParams(),
        even: false,
        page: false,
        cols: [[
            { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
            { field: 'section', title: '章节', align: 'center', width: 100, templet: function (d) {
                    return '第 ' + d.section + ' 章';
                }},
            { field: 'name', title: '名称', align: 'left', width: 300, templet: function (d) {
                    return '<a lay-event="details" class="notice-title-click">' + d.name + '</a>';
                }},
            { field: 'createName', title: systemLanguage["com.skyeye.createName"][languageType], align: 'left', width: 120 , templet: function(d) {
                    return getNotUndefinedVal(d.createMation?.name);
                }},
            { field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 150 },
            { field: 'lastUpdateName', title: systemLanguage["com.skyeye.lastUpdateName"][languageType], align: 'left', width: 120 , templet: function(d) {
                    return getNotUndefinedVal(d.lastUpdateMation?.name);
                }},
            { field: 'lastUpdateTime', title: systemLanguage["com.skyeye.lastUpdateTime"][languageType], align: 'center', width: 150 },
            { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 257, toolbar: '#tableBar' }
        ]],
        done: function(json) {
            matchingLanguage();
            initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "暂不支持搜索", function () {
                table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
            });
        }
    });

    table.on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if  (layEvent === 'details') { //详情
            details(data);
        }
    });

    // 详情
    function details(data) {
        parent._openNewWindows({
            url: systemCommonUtil.getUrl('FP2023082800012&objectId=' + objectId + '&objectKey=' + objectKey + '&id=' + data.id, null),
            title: systemLanguage["com.skyeye.detailsPageTitle"][languageType],
            pageId: "chapterDetails",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
            }});
    }

    form.render();
    $("body").on("click", "#reloadTable", function() {
        loadTable();
    });
    function loadTable() {
        table.reloadData("messageTable", {where: getTableParams()});
    }

    function getTableParams() {
        return $.extend(true, {subjectId: objectId}, initTableSearchUtil.getSearchValue("messageTable"));
    }

    exports('chapterList', {});
});