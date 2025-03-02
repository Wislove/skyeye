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

    var id = GetUrlParam("id");
    console.log(id);
    if (!isNull(id)) {
        AjaxPostUtil.request({
            id: "showForm",
            url: sysMainMation.admBasePath + "selectForumSensitiveWordsById",
            params: { id: id },
            type: 'json',
            method: 'post',
            callback: function (json) {
                $("#sensitiveWord").val(json.bean.sensitiveWord);
                form.render();
            }
        });
    } else {
        form.render();
    }

    // 表单提交
    form.on('submit(formAddBean)', function (data) {
        if (winui.verifyForm(data.elem)) {
            var params = {
                sensitiveWord: $("#sensitiveWord").val(),
                id: isNull(id) ? '' : id,
            };

            AjaxPostUtil.request({
                url: sysMainMation.admBasePath + "insertForumSensitiveWordsMation",
                params: params,
                type: 'json',
                callback: function (json) {
                    if (json.returnCode == 0) {
                        parent.layer.close(index);
                        parent.refreshCode = '0';
                    } else {
                        winui.window.msg(json.returnMessage, { icon: 2, time: 2000 });
                    }
                }
            });
        }
        return false;
    });

    // 取消按钮
    $("body").on("click", "#cancle", function () {
        parent.layer.close(index);
    });

    // 添加多语言支持
    matchingLanguage();
});