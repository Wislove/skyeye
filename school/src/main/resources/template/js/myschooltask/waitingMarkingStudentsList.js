var rowId = "";
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
        laydate = layui.laydate;

    surveyId = GetUrlParam("surveyId");

    if (isNull(surveyId)) {
        winui.window.msg("请传入适用对象信息", {icon: 2, time: 2000});
        return false;
    }

    laydate.render({elem: '#year', type: 'year', max: 'date'});

    initTable();

    function initTable(){
        table.render({
            elem: '#messageTable',
            method: 'post',
            url: schoolBasePath + 'querySurveyAnswerBySurveyId',
            where: getTableParams(),
            even: false,
            page: true,
            limits: getLimits(),
            limit: getLimit(),
            cols: [[
                { title: systemLanguage["com.skyeye.serialNumber"][languageType], rowspan: '2', type: 'numbers' },
                { field: 'studentName', rowspan: '2', width: 200, title: '姓名', templet: function (d) {
                        return '<a lay-event="details" class="notice-title-click">' + d.stuMation?.studentName + '</a>';
                    }}
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
        rowId = data.answerId;
        _openNewWindows({
            url: "../../tpl/examMarkingDetail/examMarkingDetail.html",
            title: "阅卷",
            pageId: "examMarkingDetail",
            area: ['100vw', '100vh'],
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }});
    }
// 打开阅卷弹窗
    function _openNewWindows(params) {
        parent._openNewWindows(params);
    }

    parent._openNewWindows({
        url: "../../tpl/examMarkingDetail/examMarkingDetail.html",
        title: "阅卷",
        pageId: "examMarkingDetail",
        area: ['100vw', '100vh'],
        callBack: function (refreshCode) {
            winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
            loadTable();
        }
    });

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

    function loadTable() {
        table.reload('messageTable', { // 使用表格的 ID 进行刷新
            where: getTableParams(),
            page: {curr: 1} // 刷新时从第一页开始
        });
    }

    function getTableParams() {
        return {
            keyword: $("#surveyName").val()
        };
    }

    exports('waitMarkingStudentsList', {});
});
