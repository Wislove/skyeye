var rowId = "";//帖子id
var belongCommentId = "";//评论id
var commentUserId = "";//评论人id
var replyType = "";

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'], function (exports) {
    winui.renderColor();
    var $ = layui.$;
    var commentTemplate = $('#commentTemplate').html();
    var replyTemplate = $('#replyTemplate').html();
    var textareaTemplate = $('#textareaTemplate').html();

    //公共标题
    $("#forumTitle").html(getFileContent("tpl/forumshow/commontitle.tpl"));
    //菜单
    $("body").append(getFileContent("tpl/forumshow/commonmenu.tpl"));

    var rowId = GetUrlParam("id");
    var currentUserId = "";

    // 获取当前登录员工信息
    systemCommonUtil.getSysCurrentLoginUserMation(function (data) {
        currentUserId = data.bean.id;
    });

    //帖子信息展示
    AjaxPostUtil.request({
        url: sysMainMation.admBasePath + "queryForumContentById",
        params: { id: rowId },
        type: 'json',
        callback: function (json) {
            if (json.returnCode == 0 && json.bean) {
                // 如果不是用户自己的帖子，则显示举报按钮
                if (json.bean.createId != currentUserId) {
                    $("#forumReport").removeClass("layui-hide");
                }

                // 显示帖子内容
                $("#content").html(decodeURIComponent(json.bean.forumContent || ''));
                $("#title").html(json.bean.forumTitle || '');
                $("#createTime").html(json.bean.createTime || '');

                // 显示用户头像
                if (json.bean.createMation && json.bean.createMation.userPhoto) {
                    $("#photo").html("<img userId='" + json.bean.createId + "' alt='' src='" + json.bean.createMation.userPhoto + "'>");
                }

                // 加载评论列表
                loadCommentList();
            } else {
                winui.window.msg("获取帖子详情失败", { icon: 2, time: 2000 });
            }
        },
        errorCallback: function (err) {
            console.error("获取帖子详情失败:", err);
            winui.window.msg("获取帖子详情失败", { icon: 2, time: 2000 });
        }
    });

    //发表评论
    $("body").on("click", "#commentContentAdd", function (e) {
        var content = $("#commentContent").val();
        if (isNull(content)) {
            winui.window.msg("评论内容不能为空！", { icon: 2, time: 2000 });
        } else {
            AjaxPostUtil.request({
                url: sysMainMation.admBasePath + "insertForumCommentMation",
                params: { forumId: rowId, content: content },
                type: 'json',
                callback: function (json) {
                    loadCommentList();//刷新评论信息
                    $("#commentContent").val("");
                }
            });
        }
    });

    //评论下的回复按钮
    $("body").on("click", ".operator-btn span", function (e) {
        $(".comment-text-textarea").empty();
        $(".se-comment-text-textarea").empty();
        belongCommentId = $(this).attr("rowid");
        commentUserId = $(this).attr("rowUserid");
        rowUsername = $(this).attr("rowUsername");
        replyType = "1";
        var Item = $(this).parents(".comment-text").find(".comment-text-textarea");
        var params = { rowUsername: rowUsername };
        Item.append(getDataUseHandlebars(textareaTemplate, params));
    });

    //回复信息下的回复按钮
    $("body").on("click", ".se-operator-btn span", function (e) {
        $(".comment-text-textarea").empty();
        $(".se-comment-text-textarea").empty();
        belongCommentId = $(this).attr("rowid");
        commentUserId = $(this).attr("rowUserid");
        rowUsername = $(this).attr("rowUsername");
        replyType = "2";
        var Item = $(this).parents(".se-comment-text").find(".se-comment-text-textarea");
        var params = { rowUsername: rowUsername };
        Item.append(getDataUseHandlebars(textareaTemplate, params));
    });

    //点击发表回复评论
    $("body").on("click", "#forumCommentAdd", function (e) {
        var replyContent = $("#replyContent").val();
        if (isNull(replyContent)) {
            winui.window.msg("回复内容不能为空！", { icon: 2, time: 2000 });
        } else {
            AjaxPostUtil.request({
                url: sysMainMation.admBasePath + "insertForumCommentMation",
                params: {
                    forumId: rowId,
                    belongCommentId: belongCommentId,
                    content: replyContent,
                    replyId: commentUserId
                },
                type: 'json',
                callback: function (json) {
                    $(".comment-text-textarea").empty();
                    $(".se-comment-text-textarea").empty();
                    var commentName = "";
                    var commentUserId = "";
                    // 获取当前登录员工信息
                    systemCommonUtil.getSysCurrentLoginUserMation(function (data) {
                        commentName = data.bean.userName;
                        commentUserId = data.bean.id;
                    });
                    var params = {
                        belongCommentId: belongCommentId,
                        replyName: commentName,
                        commentName: rowUsername,
                        content: replyContent,
                        commentTime: '刚刚',
                        commentUserId: commentUserId
                    };
                    if (replyType == "1") {
                        $("span[rowid=" + belongCommentId + "]").parents('div[class^="comment-text"]').eq(0).find(".second-comment-item").removeClass("layui-hide");
                        $("span[rowid=" + belongCommentId + "]").parents('div[class^="first-comment-item"]').eq(0).find(".second-comment-item").append(getDataUseHandlebars(replyTemplate, params));
                    } else if (replyType == "2") {
                        $("span[rowid=" + belongCommentId + "]").parents('div[class^="se-comment-text"]').eq(0).after(getDataUseHandlebars(replyTemplate, params));
                    }
                }
            });
        }
    });

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

    //举报
    $("body").on("click", "#forumReport", function (e) {
        _openNewWindows({
            url: "../../tpl/forumshow/forumreport.html?forumId=" + rowId,
            title: "举报",
            pageId: "forumreport",
            area: ['600px', '400px'],
            callBack: function (refreshCode) {
                if (refreshCode == '0') {
                    winui.window.msg("举报成功", { icon: 1, time: 2000 });
                }
            }
        });
    });

    //加载评论列表
    function loadCommentList() {
        $("#addCommentList").empty();

        AjaxPostUtil.request({
            url: sysMainMation.admBasePath + "queryForumCommentList",
            params: {
                id: rowId,
                page: 1,
                limit: 999
            },
            type: 'json',
            callback: function (json) {
                if (json.returnCode == 0) {
                    // 直接使用整个数据对象进行渲染
                    var html = getDataUseHandlebars(commentTemplate, json);
                    $("#addCommentList").html(html);

                    // 处理回复评论
                    $.each(json.rows, function (i, item) {
                        if (item.belongCommentId) {
                            var mainComment = $(".second-comment-item[rowid='" + item.belongCommentId + "']");
                            if (mainComment.length > 0) {
                                mainComment.removeClass("layui-hide");
                                var replyParams = {
                                    belongCommentId: item.belongCommentId,
                                    replyName: item.createName,
                                    commentName: item.commentMation ? item.commentMation.userName : '',
                                    content: item.content,
                                    commentTime: item.createTime,
                                    commentUserId: item.createId
                                };
                                mainComment.append(getDataUseHandlebars(replyTemplate, replyParams));
                            }
                        }
                    });
                }
            }
        });
    }

    exports('forumitem', {});
});
