layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'], function (exports) {
	winui.renderColor();
	layui.use(['form'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$,
	    	form = layui.form;
	    
	    matchingLanguage();
		form.render();
	    form.on('submit(formAddBean)', function (data) {
	        if (winui.verifyForm(data.elem)) {
	        	// var params = {
				// 	surveyName: $("#surveyName").val(),
				// 	effectiveTime: $("#effectiveTime").val(),
				// 	rule: $("#rule").val(),
				// 	answerNum: $("#answerNum").val(),
				// 	dirType: $("#dirType").val(),
				// 	endType: $("#endType").val(),
				// 	whetherDelete: $("#whetherDelete").val(),
				// 	surveyModel: $("#surveyModel").val(),
	        	// };
				var params = {
					surveyName: $("#surveyName").val(),
					surveyModel: $("#surveyModel").val(),       // 问卷模块 1/2
					dirType: $("#dirType").val(),                 // 目录类型 1/2
					rule: $("input[name='rule']:checked").val(),  // 规则 1/2/3
					answerNum: parseInt($("#answerNum").val()), // 回答次数（整数）
					effectiveTime: parseInt($("#effectiveTime").val()), // 冷却时间（分钟）
					endType: $("#endType").val(),                // 结束方式 1/2/3
					whetherDelete: $("#whetherDelete").is(":checked") ? 2 : 1 // 删除状态 1/2
				};
				console.log("effectiveTime:", $("#effectiveTime").val());
				console.log("answerNum:", $("#answerNum").val());// 其他字段同理
				console.log("提交参数：", params);
	        	AjaxPostUtil.request({url: sysMainMation.surveyBasePath + "writeDwDirectory", params: params, type: 'json', method: "POST",callback: function (json) {
					parent.layer.close(index);
					parent.refreshCode = '0';
	 	   		}});
	        }
	        return false;
	    });
	    
	    // 取消
	    $("body").on("click", "#cancle", function() {
	    	parent.layer.close(index);
	    });
	});
	    
});