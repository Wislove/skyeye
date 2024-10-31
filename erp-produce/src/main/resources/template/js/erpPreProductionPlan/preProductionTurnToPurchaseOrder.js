
// 以下两个参数开启团队权限时有值
var objectId = '', objectKey = '';
// 根据以下两个参数判断：工作流的判断是否要根据serviceClassName的判断
var serviceClassName;

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery'], function (exports) {
    winui.renderColor();
    var index = parent.layer.getFrameIndex(window.name);
    var $ = layui.$;
    var id = GetUrlParam("id");

    // 出货计划转采购订单
    AjaxPostUtil.request({url: sysMainMation.erpBasePath + "queryProductionPlanTransPurchaseOrderById", params: {id: id}, type: 'json', method: 'GET', callback: function (json) {
        let data = json.bean;
        data.erpOrderItemList = data.productionPlanChildList;
        data.erpOrderItemList.forEach(function (item) {
            item.unitPrice = item.normsMation.estimatePurchasePrice;
            item.taxRate = 0;
        });
        // 采购订单的【编辑布局】
        dsFormUtil.initEditPageForStatic('content', 'FP2023042000002', data, {
            savePreParams: function (params) {
                params.id = id
            },
            saveData: function (params) {
                // 保存数据
                AjaxPostUtil.request({url: sysMainMation.erpBasePath + "insertProductionPlanToPurchaseOrder", params: params, type: 'json', method: "POST", callback: function(json) {
                    parent.layer.close(index);
                    parent.refreshCode = '0';
                }});

            },
            loadComponentCallback: function () {
                $("div[controlType='purchaseOrderFromType']").remove();
            },
            tableAddRowCallback: function (tableId) {
                $("#addRow" + tableId).remove();
                $("div[controlType='simpleTable']").find(".chooseProductBtn").prop('disabled', true);
                $("div[controlType='simpleTable']").find(".normsId").prop('disabled', true);
            }
        });
    }});

});