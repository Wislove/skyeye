layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'], function (exports) {
    winui.renderColor();
    var index = parent.layer.getFrameIndex(window.name);
    var $ = layui.$,
        form = layui.form;
    var className = GetUrlParam("className");
    var id = GetUrlParam("id");
     var type = '';
    var parentId = '';
    var normsId = '';
    var materialId = '';
    var orderId = '';
    var orderItemId = '';

    if (!isNull(id)) {
        AjaxPostUtil.request({
            url: shopBasePath + "selectOrderCommentById",
            params: {id: id},
            type: 'json',
            method: 'POST',
            callback: function (json) {
                type = 2;
                parentId = json.bean.id;
                normsId = json.bean.normsId;
                materialId = json.bean.materialId;
                orderId = json.bean.orderId;
                orderItemId = json.bean.orderItemId;
                form.render();
            }
        });
    }


    matchingLanguage();
    form.render();
    form.on('submit(formWriteBean)', function (data) {
        if (winui.verifyForm(data.elem)) {
            const params = {
                className: className,
                type:  type,
                parentId: parentId,
                normsId: normsId,
                materialId: materialId,
                orderId: orderId,
                orderItemId: orderItemId,
                context: $("#context1").val(),
                id: id || ''
            };

            AjaxPostUtil.request({
                url: shopBasePath + "insertOrderComment",
                params: params,
                type: 'json',
                method: 'POST',
                callback: function (json) {
                    parent.layer.close(index);
                    parent.refreshCode = '0';
                }
            });
        }
        return false;
    });

    $("body").on("click", "#cancle", function () {
        parent.layer.close(index);
    });
});