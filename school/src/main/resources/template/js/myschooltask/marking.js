layui.config({
    base: basePath, // 基础路径，根据实际情况设置
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'], function (exports) {
    winui.renderColor();
    var $ = layui.jquery,
        form = layui.form;

    // 获取试卷信息
    function getExamInfo() {
        $.ajax({
            url: schoolBasePath + "querySurveyAnswerById",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                surveyId: surveyId,
                objectId: objectId,
                companyId: companyId,
                state: state
            }),
            success: function (response) {
                if (response.code === 200) {
                    var data = response.data;
                    $("#examTitle").text(data.title);
                    $("#studentId").text(data.studentId);
                    $("#answer").val(data.answer);
                } else {
                    winui.window.msg(response.message, {icon: 2, time: 2000});
                }
            },
            error: function (xhr, status, error) {
                winui.window.msg("请求失败，请重试", {icon: 2, time: 2000});
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
        $.ajax({
            url: schoolBasePath + "updateSurveyAnswer",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                surveyId: surveyId,
                objectId: objectId,
                companyId: companyId,
                state: state,
                score: score
            }),
            success: function (response) {
                if (response.code === 200) {
                    winui.window.msg('提交成功', {icon: 1});
                    layer.closeAll(); // 关闭所有弹窗
                } else {
                    winui.window.msg(response.message, {icon: 2, time: 2000});
                }
            },
            error: function (xhr, status, error) {
                winui.window.msg("请求失败，请重试", {icon: 2, time: 2000});
            }
        });
    });

    // 取消按钮事件
    $("#cancel").on('click', function() {
        layer.closeAll(); // 关闭所有弹窗
    });

    // 初始化
    getExamInfo();

    exports('waitingMarkingStudentsList', {});
});