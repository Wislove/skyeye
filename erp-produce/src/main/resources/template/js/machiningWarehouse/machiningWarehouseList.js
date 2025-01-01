
// 加工入库单
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
    var serviceClassName = sysServiceMation["machiningWarehouse"]["key"];

    // 新增
    authBtn('1722236598520');

    table.render({
        id: 'messageTable',
        elem: '#messageTable',
        method: 'post',
        url: sysMainMation.erpBasePath + 'queryMachinPutList',
        where: getTableParams(),
        even: false,
        page: true,
        limits: getLimits(),
        limit: getLimit(),
        cols: [[
            { title: systemLanguage["com.skyeye.serialNumber"][languageType], rowspan: '2', type: 'numbers', },
            { field: 'oddNumber', title: '单号', width: 200, rowspan: '2', align: 'center', templet: function (d) {
                var str = '<a lay-event="details" class="notice-title-click">' + d.oddNumber + '</a>';
                if (!isNull(d.fromId)) {
                    str += '<span class="state-new">[转]</span>';
                }
                return str;
            }},
            { field: 'processInstanceId', title: '流程ID', rowspan: '2', width: 100, templet: function (d) {
                return '<a lay-event="processDetails" class="notice-title-click">' + getNotUndefinedVal(d.processInstanceId) + '</a>';
            }},
            { field: 'state', title: '状态', width: 90, rowspan: '2', templet: function (d) {
                return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("erpOrderStateEnum", 'id', d.state, 'name');
            }},
            { field: 'otherState', title: '入库状态', width: 90, rowspan: '2', templet: function (d) {
                return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("depotPutState", 'id', d.otherState, 'name');
            }},
            { colspan: '2', title: '来源单据信息', align: 'center' },
            { field: 'name', title: '部门', align: 'center', width: 100, rowspan: '2', templet: function (d) {
                return getNotUndefinedVal(d.departmentMation?.name);
            }},
            { field: 'name', title: '业务员', align: 'center', width: 100, rowspan: '2', templet: function (d) {
                return getNotUndefinedVal(d.salesmanMation?.name);
            }},
            { field: 'createName', title: systemLanguage["com.skyeye.createName"][languageType], rowspan: '2', width: 120 },
            { field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], rowspan: '2', align: 'center', width: 150 },
            { field: 'lastUpdateName', title: systemLanguage["com.skyeye.lastUpdateName"][languageType], rowspan: '2', align: 'left', width: 120 },
            { field: 'lastUpdateTime', title: systemLanguage["com.skyeye.lastUpdateTime"][languageType], rowspan: '2', align: 'center', width: 150 },
            { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', rowspan: '2', width: 200, toolbar: '#tableBar'}
        ], [
            { field: 'fromTypeId', title: '来源类型', width: 150, templet: function (d) {
                return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("machinPutFromType", 'id', d.fromTypeId, 'name');
            }},
            { field: 'fromId', title: '单据编号', width: 200, templet: function (d) {
                return getNotUndefinedVal(d.fromMation?.oddNumber);
            }}
        ]],
        done: function(json) {
            matchingLanguage();
            initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "请输入单号", function () {
                table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
            });
        }
    });

    table.on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'delete') { //删除
            erpOrderUtil.deleteOrderMation(data.id, serviceClassName, function() {
                loadTable();
            });
        } else if (layEvent === 'details') { //详情
            details(data);
        } else if (layEvent === 'edit') { //编辑
            edit(data);
        } else if (layEvent === 'subApproval') { //提交审核
            erpOrderUtil.submitOrderMation(data.id, serviceClassName, function() {
                loadTable();
            });
        } else if (layEvent === 'processDetails') { // 工作流流程详情查看
            activitiUtil.activitiDetails(data);
        } else if (layEvent === 'revoke') { //撤销
            erpOrderUtil.revokeOrderMation(data.processInstanceId, serviceClassName, function () {
                loadTable();
            });
        }
    });

    // 新增
    $("body").on("click", "#addBean", function() {
        _openNewWindows({
            url:  systemCommonUtil.getUrl('FP2024072600002', null),
            title: systemLanguage["com.skyeye.addPageTitle"][languageType],
            pageId: "machinungWarehouseAdd",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }});
    });

    // 编辑
    function edit(data) {
        _openNewWindows({
            url:  systemCommonUtil.getUrl('FP2024072600003&id=' + data.id, null),
            title: systemLanguage["com.skyeye.editPageTitle"][languageType],
            pageId: "machinungWarehouseEdit",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }});
    }

    // 详情
    function details(data) {
        _openNewWindows({
            url:  systemCommonUtil.getUrl('FP2024072600004&id=' + data.id, null),
            title: systemLanguage["com.skyeye.detailsPageTitle"][languageType],
            pageId: "machinungWarehouseDetail",
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
        return $.extend(true, {}, initTableSearchUtil.getSearchValue("messageTable"));
    }

    exports('machiningWarehouseList', {});
});
