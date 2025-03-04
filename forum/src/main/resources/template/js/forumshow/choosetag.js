layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'form'], function (exports) {
    var index = parent.layer.getFrameIndex(window.name);
    winui.renderColor();
    var $ = layui.$,
        form = layui.form;

    var tagReturnList = new Array();

    // 加载标签列表
    function loadTags() {
        AjaxPostUtil.request({
            url: sysMainMation.admBasePath + "queryForumTagUpStateList",
            params: {
                limit: 999,
                page: 1,
                rows: 999
            },
            type: 'json',
            callback: function (json) {
                if (json.returnCode == 0) {
                    var html = '';
                    // 处理返回的数据
                    if (json.bean) {
                        // 如果是单个对象，转换为数组
                        var tags = Array.isArray(json.bean) ? json.bean : [json.bean];

                        // 遍历标签数据
                        $.each(tags, function (i, item) {
                            if (item.state === 1) { // 假设 state=1 表示可用状态
                                html += '<input type="checkbox" lay-filter="checkboxProperty" ' +
                                    'rowId="' + item.id + '" title="' + item.tagName + '" ' +
                                    'name="' + item.tagName + '" lay-skin="primary">';
                            }
                        });
                    }

                    $("#showForm").html(html);

                    // 如果有已选标签，设置选中状态
                    if (parent.tagReturnList && parent.tagReturnList.length > 0) {
                        tagReturnList = [].concat(parent.tagReturnList);
                        num = tagReturnList.length;
                        for (var j = 0; j < tagReturnList.length; j++) {
                            $('input:checkbox[rowId="' + tagReturnList[j].id + '"]').prop("checked", true);
                        }
                    }

                    // 渲染复选框
                    form.render('checkbox');
                } else {
                    winui.window.msg(json.returnMessage || "获取标签失败", { icon: 2, time: 2000 });
                }
            },
            errorCallback: function (err) {
                console.error("获取标签失败:", err);
                winui.window.msg("获取标签失败", { icon: 2, time: 2000 });
            }
        });
    }

    var num = 0;
    form.on('checkbox(checkboxProperty)', function (data) {
        if (data.elem.checked) {
            if (num < 3) {
                num++;
            } else {
                winui.window.msg("最多选三个标签！", { icon: 2, time: 2000 });
                $(data.elem).prop("checked", false);
                form.render('checkbox');
                return false;
            }
        } else {
            num--;
        }
    });

    // 确定按钮
    $("body").on("click", "#confimChoose", function () {
        tagReturnList = [];
        $('input:checkbox:checked').each(function () {
            tagReturnList.push({
                id: $(this).attr("rowId"),
                name: $(this).attr("title")
            });
        });
        parent.tagReturnList = [].concat(tagReturnList);
        parent.layer.close(index);
        parent.refreshCode = '0';
    });

    // 取消按钮
    $("body").on("click", "#cancle", function () {
        parent.layer.close(index);
    });

    // 初始化加载标签
    loadTags();

    // 添加多语言支持
    matchingLanguage();

    exports('choosetag', {});
});
