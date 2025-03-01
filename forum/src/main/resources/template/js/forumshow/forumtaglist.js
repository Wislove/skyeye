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
            template: taglistTemplate,
            ajaxSendLoadBefore: function (hdb) {
            },
            ajaxSendAfter: function (json) {
                // 如果有 URL 参数中的 tagId，选中对应标签
                if (!isNull(tagId)) {
                    $("#taglist").find("li").removeClass('layui-this');
                    $("#taglist").find("li[rowid='" + tagId + "']").addClass('layui-this');
                } else {
                    // 默认选中"所有"
                    $("#taglist").find("li[rowid='']").addClass('layui-this');
                }
                loadList(); // 加载帖子列表
            }
        });
    }

    //加载帖子列表
    function loadList() {
        $("#addList").empty();
        showGrid({
            id: "addList",
            url: sysMainMation.admBasePath + "queryForumListByTagId",
            params: {
                objectId: tagId,
            },
            pagination: true,
            pagesize: 12,
            template: addListTemplate,
            ajaxSendLoadBefore: function (hdb) {
            },
            ajaxSendAfter: function (json) {
                if (json.returnCode == 0 && json.rows) {
                    matchingLanguage();
                }
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
