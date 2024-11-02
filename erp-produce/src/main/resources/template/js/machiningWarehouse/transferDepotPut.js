
// 以下两个参数开启团队权限时有值
var objectId = '', objectKey = '';
// 根据以下两个参数判断：工作流的判断是否要根据serviceClassName的判断
var serviceClassName;

// 车间任务转加工入库
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
    let initFirst = false

    // 车间任务转加工入库单时，根据车间任务id查询对应的成品信息
    AjaxPostUtil.request({url: sysMainMation.erpBasePath + "queryMachinProcedureFarmToInOrOutList", params: {id: id}, type: 'json', method: 'GET', callback: function (json) {
        let data = json.bean;
        if (data.erpOrderItemList.length > 0) {
            data.erpOrderItemList.forEach(function (item, index) {
                item.unitPrice = item.normsMation.estimatePurchasePrice;
                item.taxRate = 0;
            });
        }
        // 加工入库的【编辑布局】
        dsFormUtil.initEditPageForStatic('content', 'FP2024072600003', data, {
            savePreParams: function (params) {
                params.fromId = id
                params.id = null
            },

            saveData: function (params) {
                // 保存数据
                AjaxPostUtil.request({url: sysMainMation.erpBasePath + "writeMachinPut", params: params, type: 'json', method: "POST", callback: function(json) {
                    parent.layer.close(index);
                    parent.refreshCode = '0';
                }});
            },

            tableDeleteRowCallback: function (tableId) {
                if (!initFirst && data.erpOrderItemList.length == 0) {
                    initFirst = true;
                    $("#addRow" + tableId).click();
                }
            }
        });
    }});
});