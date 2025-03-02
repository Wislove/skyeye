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


    var parentId = "";
    parentId = GetUrlParam("parentId");
    // 获取表格参数
    initTable();
    function initTable() {
        table.render({
            id: 'messageTable',
            elem: '#messageTable',
            method: 'POST',
            url: shopBasePath + 'queryOrderCommentPageListPC',
            where: getTableParams(),
            even: false,
            page: true,
            limits: getLimits(),
            limit: getLimit(),
            cols: [[
                { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
                { field: 'type', title: '评价类型', align: 'center', width: 100, templet: function (d) {
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("orderCommentType", 'id', d.type, 'name');
                    }},
                { field: 'context', title: '评价内容', align: 'left', width: 150 },
                { field: 'start', title: '星级', align: 'left', width: 150 },
                { field: 'isComment', title: '商家是否回复', align: 'center', width: 150,templet: function (d) {
                    if (d.isComment == '1') {
                        return '是';
                    }else if (d.isComment == '0') {
                        return '否';
                    }
                    }},
                { field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 150 },
                { field: 'lastUpdateTime', title: systemLanguage["com.skyeye.lastUpdateTime"][languageType], align: 'center', width: 150 },
                { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 200, toolbar: '#tableBar' }
            ]],
            done: function(json) {
                matchingLanguage();
                initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "请输入订单编号", function () {
                    table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
                },);
            }
        });

        // 操作按钮
        table.on('tool(messageTable)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'res') { //回复
                res(data);
            }
        });
    }

    // 回复
    function res(data) {
        _openNewWindows({
            url: "../../tpl/orderComment/writeOrderComment.html?id=" + data.id,
            title: systemLanguage["com.skyeye.recordPageTitle"][languageType],
            pageId: "orderCommentRes",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
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
        let params = {
        parentId: parentId,
        };
        return $.extend(true, params, initTableSearchUtil.getSearchValue("messageTable"));
    }

    exports('orderCommentList', {});
});
