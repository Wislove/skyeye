var id="";
var state="";
layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'laydate'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form;
    id = GetUrlParam("id");
    if (isNull(id)) {
        winui.window.msg("请传入适用对象信息", {icon: 2, time: 2000});
        return false;
    }

    // 获取试卷信息
    function getExamInfo() {
        AjaxPostUtil.request({
            url: schoolBasePath + "querySurveyAnswerById",
            params: {
                id: id,
                state: state
            },
            type: 'json',
            method: 'GET',
            callback: function (json) {
                if (json.code === 200) {
                    var data = json.bean;
                    $("#examTitle").text(data.title);
                    $("#studentId").text(data.studentId);
                    $("#answer").val(data.answer);

                    // 遍历questionMation
                    if (data.surveyMation && data.surveyMation.questionMation) {
                        data.surveyMation.questionMation.forEach(function(question, index) {
                            $("#questionList").append(
                                "<div class='exam-question'>" +
                                "<h3>" + (index + 1) + ". " + question.quTitle + "</h3>" +
                                "<div>" + question.content + "</div>" +
                                "</div>"
                            );
                        });
                    }
                } else {
                    winui.window.msg(json.message, {icon: 2, time: 2000});
                }
            }
        });
    }

    // 提交按钮事件
    $("#submit").on('click', function() {
        var score = $("#score").val();
        if (!score) {
            winui.window.msg('请评分', {icon: 2});
            return;
        }
        AjaxPostUtil.request({
            url: schoolBasePath + "writeExamSurveyQuAnswer",
            params: {
                surveyId: surveyId,
                objectId: objectId,
                companyId: companyId,
                state: state,
                score: score
            },
            type: 'json',
            method: 'POST',
            callback: function (json) {
                if (json.code === 200) {
                    winui.window.msg('提交成功', {icon: 1});
                    layer.closeAll(); // 关闭所有弹窗
                } else {
                    winui.window.msg(json.message, {icon: 2, time: 2000});
                }
            }
        });
    });

    // 取消按钮事件
    $("#cancel").on('click', function() {
        layer.closeAll(); // 关闭所有弹窗
    });

    // 初始化
    getExamInfo();

    exports('marking', {});
});