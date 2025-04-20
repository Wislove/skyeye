
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'], function (exports) {
	winui.renderColor();
	var $ = layui.$;
	
	//帖子信息展示
	AjaxPostUtil.request({url: sysMainMation.admBasePath + "queryForumContentById", params: {id: parent.forumId}, type: 'json', callback: function (json) {
		console.log(json.bean.forumTitle);
		$("#forumContent").html(json.bean.forumContent);
		$("#forumTitle").html(json.bean.forumTitle);
		$("#createTime").html(json.bean.createTime);
		$("#photo").html("<img userId=" + json.bean.userId + " alt='' src=" + json.bean.createMation.userPhoto + ">");
		matchingLanguage();
	}});
	
    exports('forumdetail', {});
});
