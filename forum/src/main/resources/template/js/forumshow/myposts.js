var rowId = "";
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

    loadList();
    function loadList() {
        $("#addList").empty();
        //初始化数据
        showGrid({
            id: "addList",
            url: sysMainMation.admBasePath + "queryMyForumContentList",
            params: {},
            pagination: true,
            pagesize: 12,
            template: addListTemplate,
            ajaxSendLoadBefore: function (hdb) {
                // 如果需要注册其他 Handlebars 辅助函数，可以在这里添加
            },
            ajaxSendAfter: function (json) {
                if (json.returnCode == 0 && json.rows) {
                    // 如果需要在渲染后进行额外处理，可以在这里添加
                    matchingLanguage();
                }
            }
        });
    }

    $("body").on("click", "#addList .my-operator-list a", function (e) {
        rowId = $(this).parents('div[class^="my-forum-main"]').eq(0).attr("rowId");
        var type = $(this).attr("type");
        if (type == "edit") {
            edit();
        } else if (type == "delete") {
            del();
        }
    });

    //编辑
    function edit() {
        // 先获取帖子详情，然后跳转到编辑页面
        AjaxPostUtil.request({
            url: sysMainMation.admBasePath + "queryForumContentById",
            params: {
                id: rowId
            },
            type: 'json',
            method: 'post',
            callback: function (json) {
                if (json.returnCode == 0) {
                    // 将数据存储到 sessionStorage，以便编辑页面使用
                    sessionStorage.setItem('editForumData', JSON.stringify(json.bean));
                    // 跳转到编辑页面
                    location.href = '../../tpl/forumshow/myforumedit.html?id=' + rowId;
                } else {
                    winui.window.msg(json.returnMessage, { icon: 2, time: 2000 });
                }
            }
        });
    }

    //删除
    function del() {
        layer.confirm('确认删除该帖子吗？', { icon: 3, title: '删除帖子' }, function (index) {
            layer.close(index);
            AjaxPostUtil.request({
                url: sysMainMation.admBasePath + "deleteForumContentById", params: { id: rowId }, type: 'json', callback: function (json) {
                    winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], { icon: 1, time: 2000 });
                    loadList();
                }
            });
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
    $("body").on("click", "#addList .my-forum-main .forum-desc, .my-forum-main em", function (e) {
        rowId = $(this).parents('div[class^="my-forum-main"]').eq(0).attr("rowId");
        location.href = '../../tpl/forumshow/forumitem.html?id=' + rowId;
    });

    //标签点击事件
    $("body").on("click", "#addList .my-forum-main-span strong", function (e) {
        rowId = $(this).attr("rowId");
        location.href = "../../tpl/forumshow/forumtaglist.html?id=" + rowId;
    });

    exports('myposts', {});
});
