
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		form = layui.form;
	var firstTemplate = $("#firstTemplate").html(),
		secondTemplate = $("#secondTemplate").html();
	var firstType = "", secondType = "";
	
	// 加载一级分类
	systemModelUtil.getSysEveModelTypeDataByPId("0", function (json){
		$("#firstType").html(getDataUseHandlebars(firstTemplate, json));
	});

	initData();
	function initData(){
	    showGrid({
		 	id: "showForm",
		 	url: reqBasePath + "sysevemodel001",
		 	params: getTableParams(),
		 	pagination: true,
		 	pagesize: 16,
		 	template: $("#beanTemplate").html(),
		 	ajaxSendLoadBefore: function(hdb) {
		 		hdb.registerHelper("compare1", function(v1, options){
					return fileBasePath + v1;
				});
		 	},
		 	options: {},
		 	ajaxSendAfter:function (json) {
		 		matchingLanguage();
		 		form.render();
		 	}
	    });
	}
    
    // 一级分类点击事件
    $("#firstType").on('click', "a", function (e) {
    	$("#firstType").find("li").removeClass("active");
    	$(this).parent().addClass("active");
		firstType = $(this).attr("rowid");
		secondType = "";
    	// 加载二级分类
		systemModelUtil.getSysEveModelTypeDataByPId(firstType == "0" ? "-" : firstType, function (json){
			$("#secondType").html(getDataUseHandlebars(secondTemplate, json));
			initData();
		});
    });
    
    // 二级分类点击事件
	$("#secondType").on('click', "a", function (e) {
		$("#secondType").find("li").removeClass("active");
		$(this).parent().addClass("active");
		secondType = $(this).attr("rowid");
		initData();
	});

    function getTableParams() {
    	return {
			title: "",
			firstTypeId: firstType == "0" ? "" : firstType,
			secondTypeId: secondType,
			type: 1
		};
	}
    
    exports('sysEveModelStore', {});
});
