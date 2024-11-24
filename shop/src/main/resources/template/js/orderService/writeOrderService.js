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

    if (!isNull(id)) {
        AjaxPostUtil.request({
            url: shopBasePath + "selectOrderById",
            params: {id: id},
            type: 'json',
            method: 'POST',
            callback: function (json) {
                $("#adjustPrice").val(json.bean.adjustPrice);
                console.log(json.bean.adjustPrice);
                initData(json);
                form.render();
            }
        });
    }

    function initData(json) {
            $("#adjustPrice").val(json.bean.adjustPrice);
    }

    matchingLanguage();
    form.render();
    form.on('submit(formWriteBean)', function (data) {
        if (winui.verifyForm(data.elem)) {
            const params = {
                className: className,
                adjustPrice: $("#adjustPrice").val(),
                id: id || ''
            };

            AjaxPostUtil.request({
                url: shopBasePath + "changeOrderAdjustPrice",
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