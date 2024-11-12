var rowId = "";
layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'soulTable'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form,
        table = layui.table,
        soulTable = layui.soulTable;

    var selTemplate = getFileContent('tpl/template/select-option-must.tpl');

    var appId = "";
    appId = GetUrlParam("appId");

    // 获取表格参数
    initTable();
    function initTable() {
        table.render({
            id: 'messageTable',
            elem: '#messageTable',
            method: 'post',
            url: reqBasePath + 'queryFileConfigList',
            where: getTableParams(),
            even: true,
            page: true,
            limits: getLimits(),
            limit: getLimit(),
            cols: [[
                { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
                { field: 'name', title: '名称', align: 'left', width: 120 },
                { field: 'isDefault', title: '是否默认', align: 'center', width: 100, templet: function (d) {
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("commonIsDefault", 'id', d.isDefault, 'name');
                    }},
                { field: 'storage', title: '存储器', align: 'left', width: 80, templet: function (d) {
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("fileStorageEnum", 'id', d.storage, 'name');
                    }},
                { field: 'createName', title: systemLanguage["com.skyeye.createName"][languageType], width: 120 },
                { field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 150 },
                { field: 'lastUpdateName', title: systemLanguage["com.skyeye.lastUpdateName"][languageType], align: 'left', width: 120 },
                { field: 'lastUpdateTime', title: systemLanguage["com.skyeye.lastUpdateTime"][languageType], align: 'center', width: 150 },
                { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 200, toolbar: '#tableBar' }
            ]],
            done: function(json) {
                matchingLanguage();
                initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "请输入名称", function () {
                    table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
                },);
            }
        });
        table.on('tool(messageTable)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'delet') { // 删除
                delet(data);
            } else if (layEvent === 'edit') { // 编辑
                edit(data);
            }
        });
    }

    // 添加
    $("body").on("click", "#addBean", function() {
        _openNewWindows({
            url: "../../tpl/fileConfig/writeFileConfig.html",
            title: systemLanguage["com.skyeye.recordPageTitle"][languageType],
            pageId: "fileConfigAdd",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }});
    });

    // 编辑
    function edit(data) {
        rowId = data.id;
        _openNewWindows({
            url: "../../tpl/fileConfig/writeFileConfig.html?id=" + data.id,
            title: systemLanguage["com.skyeye.recordPageTitle"][languageType],
            pageId: "fileConfigEdit",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }});
    }

    // 删除
    function delet(data) {
        layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function (index) {
            parent.layer.close(index);
            AjaxPostUtil.request({url: reqBasePath + "deleteFileConfigById", params: {id: data.id}, type: 'json', method: "DELETE", callback: function (json) {
                    winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
                    loadTable();
                }});
        });
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
            appId: appId,
        };
        return $.extend(true, params, initTableSearchUtil.getSearchValue("messageTable"));
    }

    exports('fileConfigList', {});
});
