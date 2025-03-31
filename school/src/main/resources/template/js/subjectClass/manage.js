
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'form'], function (exports) {
	winui.renderColor();
	var index = parent.layer.getFrameIndex(window.name);
    var $ = layui.$,
    	form = layui.form;
	var objectId = GetUrlParam("objectId");
	var objectKey = GetUrlParam("objectKey");
	var subjectClassesId = GetUrlParam("subjectClassesId");

	tabPageUtil.init({
		id: 'tab',
		prefixData: [{
			title: '详情',
			pageUrl: '../../tpl/subjectClass/detail.html?subjectClassesId=' + subjectClassesId
		}],
		suffixData: [{
			title: '作业',
			pageUrl: '../../tpl/homework/homeworkList.html?subjectClassesId=' + subjectClassesId
		}, {
			title: '公告',
			pageUrl: '../../tpl/announcement/announcementList.html?subjectClassesId=' + subjectClassesId
		}, {
			title: '话题',
			pageUrl: '../../tpl/topic/topicList.html?subjectClassesId=' + subjectClassesId
		}],
		element: layui.element,
		object: {
			objectId: objectId,
			objectKey: objectKey,
		}
	});

	form.render();

});