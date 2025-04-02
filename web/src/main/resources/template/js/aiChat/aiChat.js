layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'form'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form;
    let beanMessageTemplate = $("#beanMessageTemplate").html();
    let tabTitle = $("#tabTitle").html();
    let listMessageTemplate = $("#listMessageTemplate").html();
    let userMation = {};
    let listIndex = 0;
    let page = 1;
    let loadData = true;
    let apiKeyId = '';

    let onMsgStr = '';

    let aiChatObject = [];
    systemCommonUtil.getSysCurrentLoginUserMation(function (data) {
        userMation = data.bean;

        AjaxPostUtil.request({
            url: sysMainMation.admBasePath + "queryAiApiKeyList",
            params: {},
            type: 'json',
            method: 'POST',
            callback: function (json) {
                $("#navbar").html(getDataUseHandlebars(tabTitle, json));
                aiChatObject = json.rows || [];
                if (json.rows.length > 0) {
                    apiKeyId = json.rows[0].id;
                    $("#navbar").find("li:eq(0)").addClass("layui-this");
                    loadChatHistory();
                }
                form.render();
            }, async: false});

        // 返回的消息
        webSocketUtil.init({
            url: sysMainMation.aiSocketPath,
            // url: 'ws://192.168.3.8:8120/',
            path: 'aiMessageWebSocket',
            userId: data.bean.id,
            onMessage: function (data) {
                let json = JSON.parse(data);
                if (!json.end) {
                    onMsgStr += json.message;
                    if (json.orderBy == 0) {
                        // 添加回答
                        let bean = {
                            aiId: "aiContentId" + listIndex,
                            avatar: fileBasePath + userMation.userPhoto,
                        }
                        let str = getDataUseHandlebars(beanMessageTemplate, bean);
                        $('.chat-box').append(str);
                        $('.chat-box').append(`<img id="loadding" src="../../js/aiChat/loaing.gif" style="width: 60px; margin-left: 60px;" />`);
                        editormd.markdownToHTML(bean.aiId, {markdown: onMsgStr});
                    } else {
                        $("#aiContentId" + listIndex).html(onMsgStr);
                    }
                } else {
                    $("#aiContentId" + listIndex).html('');
                    editormd.markdownToHTML("aiContentId" + listIndex, {markdown: onMsgStr});
                    onMsgStr = '';
                    $('#loadding').remove();
                }
                // 滚动到底部
                $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));
            }
        });
    });

    // 历史记录
    function loadChatHistory() {
        let params = {
            page: page,
            limit: 15,
            holderId: apiKeyId,
        }
        AjaxPostUtil.request({
            url: sysMainMation.admBasePath + "queryPageMessageList",
            params: params,
            type: 'json',
            method: 'POST',
            callback: function (json) {
                // 将数据转为正序排序
                let rows = resetList(json.rows);
                rows.sort(function (a, b) {
                    return b.orderBy - a.orderBy; // 升序排序
                });
                $('.chat-box').prepend(getDataUseHandlebars(listMessageTemplate, rows));
                $.each(rows, function (ii, item) {
                    if (!isNull(item.aiId)) {
                        editormd.markdownToHTML(item.aiId, {markdown: item.content});
                    }
                });
                if (page * 15 > json.total && loadData) {
                    loadData = false;
                    $('.chat-box').prepend("<div class='more'>没有更多数据..</div>");
                }
                if (page == 1) {
                    // 滚动到底部
                    $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));
                }
            }
        });
    }

    // 向上滚动加载
    $(document).ready(function () {
        $('#chat-box').scroll(function (e) {
            var elem = e.target;
            var scrollTop = elem.scrollTop;
            var scrollHeight = elem.scrollHeight;
            var height = elem.offsetHeight;
            var direction = 'down'; // 默认向下滚动
            if (scrollTop === 0) {
                direction = 'up'; // 当滚动到顶部时
            } else if (scrollTop + height === scrollHeight) {
                direction = 'down'; // 当滚动到底部时
            }
            if (direction === 'up' && loadData) {
                page++;
                loadChatHistory();
            }
        });
    });

    // 遍历历史聊天记录
    function resetList(list) {
        let newList = [];
        const aiChat = aiChatObject.find(item => item.id === apiKeyId);
        $.each(list, function (ii, item) {
            listIndex++;
            newList.push({
                aiId: "aiContentId" + listIndex,
                content: item.content,
                avatar: fileBasePath + aiChat.roleMation?.logo,
                orderBy: listIndex
            });
            listIndex++;
            newList.push({
                message: item.message,
                avatar: fileBasePath + userMation.userPhoto,
                orderBy: listIndex
            });
        });
        return newList;
    }

    // 点击发送
    $("body").on("click", "#sendMessage", function (e) {
        var messageInput = $("#messageInput").val().trim();
        if (!isNull(messageInput)) {
            let params = {
                content: messageInput,
                avatar: fileBasePath + userMation.userPhoto,
                apiKeyId: apiKeyId,
            }
            // 发送请求
            AjaxPostUtil.request({
                url: sysMainMation.admBasePath + "sendChatMessage",
                params: params,
                type: 'json',
                method: 'POST',
                callback: function (json) {
                    var message = getDataUseHandlebars(beanMessageTemplate, params);
                    $('.chat-box').append(message);
                    // 清空输入框
                    $('textarea').val('');
                    // 滚动到底部
                    $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));

                    listIndex++;
                    // 清空输入框
                    $('textarea').val('');
                    // 滚动到底部
                    $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));
                }
            });
        }
    });

    $("body").on("click", ".layui-nav-item", function (e) {
        $(".layui-nav-item").removeClass("layui-this");
        $(this).addClass("layui-this");
        apiKeyId = $(this).attr("dataId");
        $('#chat-box').empty();
        loadChatHistory();
    });

    // 一键清空
    $("body").on("click", "#clear", function (e) {
        let params = {
            apiKeyId: apiKeyId,
        }
        AjaxPostUtil.request({
            url: sysMainMation.admBasePath + "deleteAllByApiKeyId",
            params: params,
            type: 'json',
            method: 'POST',
            callback:function (json) {
                $('#chat-box').empty();
                loadChatHistory();
            }
        })
    });
    exports('aiChat', {});
});
