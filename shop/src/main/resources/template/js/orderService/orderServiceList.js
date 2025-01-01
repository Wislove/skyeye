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

    var oddNumber = "";
    oddNumber = GetUrlParam("oddNumber");

    // 获取表格参数
    initTable();
    function initTable() {
        table.render({
            id: 'messageTable',
            elem: '#messageTable',
            method: 'POST',
            url: shopBasePath + 'queryOrderPageListPC',
            where: getTableParams(),
            even: false,
            page: true,
            limits: getLimits(),
            limit: getLimit(),
            cols: [[
                { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
                { field: 'oddNumber', title: '订单编号', align: 'left', width: 150 },
                { field: 'type', title: '订单类型', align: 'center', width: 100, templet: function (d) {
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("shopOrderType", 'id', d.type, 'name');
                    }},
                { field: 'terminal', title: '订单来源', align: 'left', width: 120, templet: function (d) {
                        d.terminal = d.terminal || 0;
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("shopOrderTerminal", 'id', d.terminal, 'name');
                    }},
                { field: 'state', title: '订单状态', align: 'center', width: 100, templet: function (d) {
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("shopOrderState", 'id', d.state, 'name');
                    }},
                {
                    field: 'payPrice', title: '订单价格', width: 100, align: 'left', templet: function (d) {
                        return  d.payPrice ;
                    }
                },
                {
                    field: 'totalPrice', title: '订单总价', width: 100, align: 'left', templet: function (d) {
                        d.totalPrice = d.totalPrice || 0;
                        return  d.totalPrice;
                    }
                },
                {
                    field: 'adjustPrice', title: '订单调价', width: 100, align: 'center', templet: function (d) {
                        d.adjustPrice = d.adjustPrice || 0;
                        return d.adjustPrice;
                    }
                },
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
            if (layEvent === 'editPrice') { // 调价
                editPrice(data);
            }
        });
    }

    // 调价
    function editPrice(data) {
        _openNewWindows({
            url: "../../tpl/orderService/writeOrderService.html?id=" + data.id,
            title: systemLanguage["com.skyeye.recordPageTitle"][languageType],
            pageId: "OrderServiceEdit",
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
            oddNumber: oddNumber,
        };
        return $.extend(true, params, initTableSearchUtil.getSearchValue("messageTable"));
    }

    exports('orderServiceList', {});
});
