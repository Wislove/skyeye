// layui.config({
// 	base: basePath,
// 	version: skyeyeVersion
// }).extend({
//     window: 'js/winui.window'
// }).define(['window', 'jquery', 'winui'], function (exports) {
// 	winui.renderColor();
// 	layui.use(['form'], function (form) {
// 		var index = parent.layer.getFrameIndex(window.name);
// 	    var $ = layui.$,
// 	    	form = layui.form;
//
// 	    $("#surveyName").val("复制 - " + parent.surveyName);
//
// 	    matchingLanguage();
// 		form.render();
// 	    form.on('submit(formAddBean)', function (data) {
// 	        if (winui.verifyForm(data.elem)) {
// 	        	var params = {
//         			rowId: parent.rowId,
// 					id: $("#id").val(),
// 	        	};
// 				console.log("提交参数：", params);
// 	        	AjaxPostUtil.request({url: sysMainMation.surveyBasePath + "copyDwDirectory", params: params, type: 'json', callback: function (json) {
// 					parent.layer.close(index);
// 					parent.refreshCode = '0';
// 	 	   		}});
// 	        }
// 	        return false;
// 	    });
//
// 	    // 取消
// 	    $("body").on("click", "#cancle", function() {
// 	    	parent.layer.close(index);
// 	    });
// 	});
//
// });

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

		// 关键修改：从父页面获取原始ID并设置到隐藏域
		$("#id").val(parent.rowId);  // 假设父页面通过rowId传递原始目录ID

		$("#surveyName").val("复制 - " + parent.surveyName);

		matchingLanguage();
		form.render();
		form.on('submit(formAddBean)', function (data) {
			if (winui.verifyForm(data.elem)) {
				var params = {
					rowId: parent.rowId,
					id: $("#id").val(),
				};
				console.log("提交参数：", params);
				AjaxPostUtil.request({url: sysMainMation.surveyBasePath + "copyDwDirectory", params: params, type: 'json', callback: function (json) {
						parent.layer.close(index);
						parent.refreshCode = '0';
					}});
			}
			return false;
		});

		$("body").on("click", "#cancle", function() {
			parent.layer.close(index);
		});
	});
});