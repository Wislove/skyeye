var surveyId = "";
var objectId = "";
var companyId = "";
var state = "";

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'laydate'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form,
        table = layui.table,
        objectKey = GetUrlParam("objectKey");
    laydate = layui.laydate;
    surveyId = GetUrlParam("surveyId");
    objectId = GetUrlParam("objectId");
    companyId = GetUrlParam("companyId");
    state = GetUrlParam("state");

    if (isNull(surveyId)) {
        winui.window.msg("请传入适用对象信息", {icon: 2, time: 2000});
        return false;
    }

    laydate.render({elem: '#year', type: 'year', max: 'date'});

    initTable();

    function initTable(){
        table.render({
            id: 'messageTable',
            elem: '#messageTable',
            method: 'post',
            url: schoolBasePath + 'queryAllSurveyAnswerListBySurveyId',
            where: getTableParams(),
            even: false,
            page: true,
            limits: getLimits(),
            limit: getLimit(),
            cols: [[
                { title: systemLanguage["com.skyeye.serialNumber"][languageType], rowspan: '2', type: 'numbers' },
                { field: 'studentName', rowspan: '2', width: 200, title: '姓名', templet: function (d) {
                        return '<a lay-event="details" class="notice-title-click">' + d.stuMation?.studentName + '</a>';
                    }},
                { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', rowspan: '2', align: 'center', width: 100, toolbar: '#tableBar'}
            ],[
                { field: 'bgAnDate', title: '开始时间', align: 'center', width: 120},
                { field: 'endAnDate', title: '结束时间', align: 'center', width: 120},
                { field: 'totalTime', title: '耗时(分钟)', align: 'center', width: 100}
            ]
            ],
            done: function(json) {
                matchingLanguage();
            }
        });

        table.on('tool(messageTable)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'examMarkingDetail') { //阅卷
                examMarkingDetail(data);
            }
        });

        form.render();
    }

    // 阅卷
    function examMarkingDetail(data) {
        var rowId = data.answerId;
        _openNewWindows({
            url: '../../tpl/myschooltask/marking.html?id=' + data.id,
            title: "阅卷",
            pageId: "examMarkingDetail",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }
        });
    }

    function _openNewWindows(params) {
        parent._openNewWindows(params);
    }

    function loadTable() {
        table.reload('messageTable', { // 使用表格的 ID 进行刷新
            where: getTableParams(),
            page: {curr: 1} // 刷新时从第一页开始
        });
    }

    // 刷新按钮点击事件
    $("body").on("click", "#reloadTable", function() {
        loadTable();
    });

    function getTableParams() {
        return {
            keyword: $("#surveyName").val(),
            surveyId: surveyId
        };
    }

    function getTableParams() {
        return $.extend(true, {
            companyId: companyId,
            state:state,
            objectId: objectId,
            holderId:surveyId
            },
            initTableSearchUtil.getSearchValue("messageTable"));
    }

    exports('waitingMarkingStudentsList', {});
});