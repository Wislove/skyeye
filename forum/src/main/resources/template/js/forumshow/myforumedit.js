var tagList = new Array();

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'form', 'tagEditor'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form;
    var rowId = GetUrlParam("id");

    //公共标题
    $("#forumTitle").html(getFileContent("tpl/forumshow/commontitle.tpl"));
    //菜单
    $("body").append(getFileContent("tpl/forumshow/commonmenu.tpl"));

    // 从 sessionStorage 获取编辑数据
    var editData = JSON.parse(sessionStorage.getItem('editForumData') || '{}');

    if (!isNull(rowId) && editData) {
        showGrid({
            id: "showForm",
            url: sysMainMation.admBasePath + "queryForumContentById",
            params: { id: rowId },
            pagination: false,
            template: getFileContent('tpl/forumshow/myforumeditTemplate.tpl'),
            ajaxSendLoadBefore: function (hdb) {
                //是否匿名
                hdb.registerHelper("compare4", function (v1, options) {
                    if (v1 == '2') {
                        return 'checked';
                    }
                    return '';
                });
                hdb.registerHelper("compare5", function (v1, options) {
                    if (v1 == '2') {
                        return 'true';
                    }
                    return 'false';
                });
            },
            ajaxSendAfter: function (json) {
                if (json.returnCode == 0 && json.bean) {
                    // 设置标题
                    $("#title").val(json.bean.forumTitle);

                    // 初始化富文本编辑器
                    var ue = ueEditorUtil.initEditor('container');
                    ue.ready(function () {
                        // 编辑器准备就绪后设置内容
                        if (json.bean.forumContent) {
                            ue.setContent(json.bean.forumContent);
                        }
                    });

                    // 处理标签
                    if (json.bean.tagList && Array.isArray(json.bean.tagList)) {
                        var tagNames = [];
                        tagList = json.bean.tagList;
                        $.each(json.bean.tagList, function (i, item) {
                            tagNames.push(item.tagName);
                        });
                        $('#tagId').tagEditor({
                            initialTags: tagNames,
                            placeholder: '请选择标签',
                            editorTag: false,
                            beforeTagDelete: function (field, editor, tags, val) {
                                tagList = arrayUtil.removeArrayPointName(tagList, val);
                            }
                        });
                    }

                    // 设置匿名状态
                    if (json.bean.anonymous) {
                        $("#anonymous").prop("checked", json.bean.anonymous == "2").val(json.bean.anonymous == "2" ? "true" : "false");
                    }

                    // 设置发布形式
                    if (json.bean.type) {
                        $("input:radio[name=forumType][value=" + json.bean.type + "]").prop("checked", true);
                    }

                    form.render();
                }
            }
        });
    }

    // 表单提交
    form.on('submit(formEditBean)', function (data) {
        if (winui.verifyForm(data.elem)) {
            var params = {
                id: rowId,
                forumTitle: $("#title").val(),
                forumType: data.field.forumType,
                tagId: systemCommonUtil.tagEditorGetAllData('tagId', tagList)
            };

            if (isNull(params.tagId)) {
                winui.window.msg("请选择标签", { icon: 2, time: 2000 });
                return false;
            }

            var ue = UE.getEditor('container');
            params.content = encodeURIComponent(ue.getContent());
            params.forumContent = encodeURIComponent(ue.getContentTxt());

            if (isNull(params.content)) {
                winui.window.msg("请输入内容", { icon: 2, time: 2000 });
                return false;
            }

            params.anonymous = $("#anonymous").val() == 'true' ? '2' : '1';

            AjaxPostUtil.request({
                url: sysMainMation.admBasePath + "saveOrUpdateEntity",
                params: params,
                type: 'json',
                callback: function (json) {
                    if (json.returnCode == 0) {
                        winui.window.msg("保存成功", { icon: 1, time: 2000 }, function () {
                            location.href = '../../tpl/forumshow/myposts.html';
                        });
                    } else {
                        winui.window.msg(json.returnMessage, { icon: 2, time: 2000 });
                    }
                }
            });
        }
        return false;
    });

    // 标签选择
    $("body").on("click", "#chooseTag", function (e) {
        tagReturnList = [].concat(tagList);
        _openNewWindows({
            url: "../../tpl/forumshow/choosetag.html",
            title: "标签选择",
            pageId: "choosetagpage",
            area: ['600px', '500px'],
            callBack: function (refreshCode) {
                tagList = [].concat(systemCommonUtil.tagEditorResetData('tagId', tagReturnList));
            }
        });
    });

    // 取消按钮
    $("body").on("click", "#cancle", function () {
        location.href = '../../tpl/forumshow/myposts.html';
    });

    exports('myforumedit', {});
});
