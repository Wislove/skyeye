layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'], function (exports) {
    winui.renderColor();
    var $ = layui.$;

    var addListTemplate = $('#addListTemplate').html();

    //公共标题
    $("#forumTitle").html(getFileContent("tpl/forumshow/commontitle.tpl"));
    //菜单
    $("body").append(getFileContent("tpl/forumshow/commonmenu.tpl"));

    //加载列表
    loadList();
    function loadList() {
        $("#addList").empty();
        AjaxPostUtil.request({
            url: sysMainMation.admBasePath + "queryForumMyBrowerList",
            params: {
                page: 1,
                limit: 12
            },
            type: 'json',
            callback: function (json) {
                if (json.returnCode == 0) {
                    if (json.rows && json.rows.length > 0) {
                        // 处理用户头像路径
                        for (var i = 0; i < json.rows.length; i++) {
                            if (json.rows[i].createMation && json.rows[i].createMation.userPhoto) {
                                json.rows[i].createMation.userPhoto = fileBasePath + json.rows[i].createMation.userPhoto;
                            }
                        }

                        // 渲染模板
                        var html = getDataUseHandlebars(addListTemplate, json);
                        $("#addList").html(html);

                        // 处理标签
                        var row = json.rows;
                        for (var i = 0; i < row.length; i++) {
                            var id = row[i].id;
                            var tagName = row[i].tagName;
                            if (!isNull(tagName)) {
                                var tagArr = tagName.split(",");
                                var tagStr = "";
                                for (var j = 0; j < tagArr.length; j++) {
                                    tagStr += "<strong rowId='" + tagArr[j].split("-")[1] + "'>" + tagArr[j].split("-")[0] + "</strong>"
                                }
                                $(".my-forum-main-span").each(function () {
                                    var thisId = $(this).parents('div[class^="forum-main"]').eq(0).attr("rowId");
                                    if (thisId == id) {
                                        $(this).append(tagStr);
                                    }
                                });
                            }
                        }
                    } else {
                        $("#addList").html('<div style="text-align:center;padding:20px;">暂无浏览记录</div>');
                    }
                } else {
                    winui.window.msg(json.returnMessage, { icon: 2, time: 2000 });
                }
                matchingLanguage();
            }
        });
    }

    //详情点击事件
    $("body").on("click", "#addList .forum-main .forum-desc, .forum-main em", function (e) {
        var rowId = $(this).parents('div[class^="forum-main"]').eq(0).attr("rowId");
        if (rowId) {
            location.href = '../../tpl/forumshow/forumitem.html?id=' + rowId;
        }
    });

    //标签点击事件
    $("body").on("click", "#addList .forum-main strong", function (e) {
        var rowId = $(this).attr("rowId");
        if (rowId) {
            location.href = "../../tpl/forumshow/forumtaglist.html?id=" + rowId;
        }
    });

    exports('mybrowse', {});
});
