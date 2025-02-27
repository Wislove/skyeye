
var rowId = "";
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		form = layui.form,
		table = layui.table;
	
	authBtn('1565230333882');
	
	table.render({
	    id: 'messageTable',
	    elem: '#messageTable',
	    method: 'post',
	    url: sysMainMation.admBasePath + 'queryForumTagList',
	    where: {tagName: $("#tagName").val()},
	    even: false,
	    page: true,
		limits: getLimits(),
		limit: getLimit(),
	    cols: [[
	        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
	        { field: 'tagName', title: '标签名称', align: 'center', width: 120 },
	        { field: 'state', title: '状态', width: 120, align: 'center', templet: function (d) {
	        	if(d.state == '3'){
	        		return "<span class='state-down'>下线</span>";
	        	} else if (d.state == '2'){
	        		return "<span class='state-up'>上线</span>";
	        	} else if (d.state == '1'){
	        		return "<span class='state-new'>新建</span>";
	        	}
	        }},
	        { field: 'createName', title: systemLanguage["com.skyeye.createName"][languageType], align: 'left', width: 120 },
	        { field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 180 },
			{ field: 'lastUpdateName', title: systemLanguage["com.skyeye.lastUpdateName"][languageType], align: 'left', width: 120 },
			{ field: 'lastUpdateTime', title: systemLanguage["com.skyeye.lastUpdateTime"][languageType], align: 'center', width: 150 },
	        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 257, toolbar: '#tableBar'}
	    ]],
		done: function(json) {
			matchingLanguage();
			initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "请输入名称", function () {
				table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
			},);
		}
	});
	
	table.on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'edit') { //编辑
        	edit(data);
        } else if (layEvent === 'delet') { //删除
        	delet(data);
        } else if (layEvent === 'up') { //上线
        	up(data);
        } else if (layEvent === 'down') { //下线
        	down(data);
        } else if (layEvent === 'upMove') { //上移
        	upMove(data);
        } else if (layEvent === 'downMove') { //下移
        	downMove(data);
        }
    });
	
	form.render();

	$("body").on("click", "#reloadTable", function() {
		loadTable();
	});
	
	//添加
	$("body").on("click", "#addBean", function() {
    	_openNewWindows({
			url: "../../tpl/forumtag/forumtagWrite.html",
			title: "新增标签",
			pageId: "forumtagadd",
			area: ['500px', '20vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });

	//编辑
	function edit(data) {
		_openNewWindows({
			url: "../../tpl/forumtag/forumtagWrite.html?id="+data.id,
			title: "编辑论坛标签",
			pageId: "forumtagedit",
			area: ['500px', '20vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}
		});
	}
	//删除
	function delet(data) {
		var msg = '确认删除选中数据吗？';
		layer.confirm(msg, { icon: 3, title: '删除论坛标签' }, function (index) {
			layer.close(index);
            AjaxPostUtil.request({url: sysMainMation.forumBasePath + "forumtag003", params: {rowId: data.id}, type: 'json', callback: function (json) {
				winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
				loadTable();
    		}});
		});
	}
	
	//上线
	function up(data) {
		var msg = '确认上线选中数据吗？';
		layer.confirm(msg, { icon: 3, title: '上线论坛标签' }, function (index) {
			layer.close(index);
            AjaxPostUtil.request({url: sysMainMation.forumBasePath + "updateUpOrDownForumTagById", params: {id: data.id}, type: 'json', callback: function (json) {
				winui.window.msg("上线成功", {icon: 1, time: 2000});
				loadTable();
    		}});
		});
	}
	
	//下线
	function down(data) {
		var msg = '确认下线选中数据吗？';
		layer.confirm(msg, { icon: 3, title: '下线论坛标签' }, function (index) {
			layer.close(index);
            AjaxPostUtil.request({url: sysMainMation.forumBasePath + "updateUpOrDownForumTagById", params: {id: data.id}, type: 'json', callback: function (json) {
				winui.window.msg("下线成功", {icon: 1, time: 2000});
				loadTable();
    		}});
		});
	}
	

	
	//上移
	function upMove(data) {
        AjaxPostUtil.request({url: sysMainMation.forumBasePath + "editForumTagMationOrderNumUpById", params: {id: data.id}, type: 'json', callback: function (json) {
			winui.window.msg(systemLanguage["com.skyeye.moveUpOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
			loadTable();
		}});
	}
	
	//下移
	function downMove(data) {
        AjaxPostUtil.request({url: sysMainMation.forumBasePath + "editForumTagMationOrderNumDownById", params: {id: data.id}, type: 'json', callback: function (json) {
			winui.window.msg(systemLanguage["com.skyeye.moveDownOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
			loadTable();
		}});
	}
    
	//刷新数据
    $("body").on("click", "#reloadTable", function() {
    	loadTable();
    });

	function loadTable() {
		table.reloadData("messageTable", {where: getTableParams()});
	}

	function getTableParams() {
		return $.extend(true, {}, initTableSearchUtil.getSearchValue("messageTable"));
	}
    
    exports('forumtaglist', {});
});
