var tagId = "";

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'], function (exports) {
    winui.renderColor();
    var $ = layui.$;

    var taglistTemplate = $('#taglistTemplate').html();
    var addListTemplate = $('#addListTemplate').html();

    //公共标题
    $("#forumTitle").html(getFileContent("tpl/forumshow/commontitle.tpl"));
    //菜单
    $("body").append(getFileContent("tpl/forumshow/commonmenu.tpl"));

    //标签切换
    $("body").on("click", "#taglist li", function (e) {
        tagId = $(this).attr("rowid");
        $("#taglist").find("li").removeClass('layui-this');
        $(this).addClass('layui-this');
        loadList();
    });

    //加载标签列表
    loadTaglist();
    function loadTaglist() {
        $("#taglist").empty();
        showGrid({
            id: "taglist",
            url: sysMainMation.admBasePath + "queryForumTagUpStateList",
            params: {},
            pagination: false,
            pagesize: 10,
            template: taglistTemplate,
            ajaxSendLoadBefore: function (hdb) {
            },
            ajaxSendAfter: function (json) {
            }
        });
    }

    tagId = GetUrlParam("id");
    if (!isNull(tagId)) {
        $("#taglist").find("li").removeClass('layui-this');
        $("#taglist").find("li[rowid='" + tagId + "']").addClass('layui-this');
        loadList();
    }

    //加载列表
    loadList();
    function loadList() {
        $("#addList").empty();

        // 如果是热门标签，使用热门帖子接口
        var apiUrl = tagId === "hot"
            ? sysMainMation.admBasePath + "queryHotForumList"
            : sysMainMation.admBasePath + "queryForumListByTagId";

        // 准备请求参数，热门接口不需要传objectId
        var params = tagId === "hot" ? {} : { objectId: tagId };

        showGrid({
            id: "addList",
            url: apiUrl,
            params: params,
            pagination: true,
            pagesize: 12,
            template: addListTemplate,
            ajaxSendLoadBefore: function (hdb, json) {
                // 处理用户头像路径和内容解码
                for (var i = 0; i < json.rows.length; i++) {
                    // 处理用户头像路径
                    if (json.rows[i].createMation && json.rows[i].createMation.userPhoto) {
                        json.rows[i].createMation.userPhoto = fileBasePath + json.rows[i].createMation.userPhoto;
                    }

                    // 处理内容解码
                    if (json.rows[i].forumContent) {
                        try {
                            json.rows[i].forumContent = decodeURIComponent(json.rows[i].forumContent);
                        } catch (e) {
                            // 解码失败，保持原内容
                        }
                    }
                }
            },
            ajaxSendAfter: function (json) {
                var row = json.rows;
                for (var i = 0; i < row.length; i++) {
                    var id = row[i].id;
                    var tagName = row[i].tagName;
                    if (!isNull(tagName)) {
                        var tagArr = tagName.split(",");
                        var tagStr = "";
                        for (var j = 0; j < tagArr.length; j++) {
                            tagStr += "<strong>" + tagArr[j].split("-")[0] + "</strong>"
                        }
                        $(".my-forum-main-span").each(function () {
                            var thisId = $(this).parents('div[class^="forum-main"]').eq(0).attr("rowId");
                            if (thisId == id) {
                                $(this).append(tagStr);
                            }
                        });
                    }
                }
                matchingLanguage();
            }
        });
    }

    //我的操作
    $("body").on("click", ".suspension-menu-icon", function (e) {
        if ($(".drop-down-menu").is(':hidden')) {
            $(".drop-down-menu").show();
            $(".suspension-menu-icon").removeClass("rotate").addClass("rotate1");
        } else {
            $(".drop-down-menu").hide();
            $(".suspension-menu-icon").removeClass("rotate1").addClass("rotate");
        }
    });

    //详情
    $("body").on("click", "#addList .forum-main .forum-desc, .forum-main em", function (e) {
        rowId = $(this).parents('div[class^="forum-main"]').eq(0).attr("rowId");
        location.href = '../../tpl/forumshow/forumitem.html?id=' + rowId;
    });

    exports('forumtaglist', {});
});
