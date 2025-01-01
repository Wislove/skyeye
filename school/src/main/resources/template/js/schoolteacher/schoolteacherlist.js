
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
		soulTable = layui.soulTable;
	function initTable() {
		table.render({
			id: 'messageTable',
			elem: '#messageTable',
			method: 'post',
			url: reqBasePath + 'querySysUserStaffList',
			where: getTableParams(),
			even: false,
			page: true,
			limits: getLimits(),
			limit: getLimit(),
			overflow: {
				type: 'tips',
				header: true,
				total: true
			},
			cols: [[
				{
					title: systemLanguage["com.skyeye.serialNumber"][languageType],
					rowspan: '3',
					fixed: 'left',
					type: 'numbers'
				},
				{
					field: 'userName',
					title: '姓名',
					rowspan: '3',
					align: 'left',
					width: 100,
					fixed: 'left',
					templet: function (d) {
						return '<a lay-event="details" class="notice-title-click">' + d.userName + '</a>';
					}
				},
				{field: 'jobNumber', title: '工号', rowspan: '3', align: 'left', width: 100, fixed: 'left'},
				{
					field: 'type', title: '类型', rowspan: '3', align: 'left', width: 90, templet: function (d) {
						return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("userStaffType", 'id', d.type, 'name');
					}
				},
				{field: 'email', title: '邮箱', rowspan: '3', align: 'left', width: 170},
				{
					field: 'userPhoto', title: '头像', rowspan: '3', align: 'center', width: 60, templet: function (d) {
						if (isNull(d.userPhoto)) {
							return '<img src="../../assets/images/os_windows.png" class="photo-img">';
						} else {
							return '<img src="' + systemCommonUtil.getFilePath(d.userPhoto) + '" class="photo-img" lay-event="userPhoto">';
						}
					}
				},
				{
					field: 'userId',
					title: '系统账号',
					rowspan: '3',
					align: 'center',
					width: 80,
					templet: function (d) {
						if (!isNull(d.userId)) {
							return "<span class='state-up'>已分配</span>";
						} else {
							return "<span class='state-down'>未分配</span>";
						}
					}
				},
				{field: 'userIdCard', title: '身份证', rowspan: '3', align: 'center', width: 160},
				{
					field: 'userSex', title: '性别', width: 80, rowspan: '3', align: 'center', templet: function (d) {
						return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("sexEnum", 'id', d.userSex, 'name');
					}
				},
				{
					field: 'state', title: '状态', rowspan: '3', width: 180, align: 'center', templet: function (d) {
						return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("userStaffState", 'id', d.state, 'name');
					}
				},
				{title: '公司信息', align: 'center', colspan: '3'},
				{title: '入职信息', align: 'center', colspan: '2'},
				{field: 'phone', title: '手机号', rowspan: '3', align: 'center', width: 100},
				{field: 'homePhone', title: '家庭电话', rowspan: '3', align: 'center', width: 100},
				{field: 'qq', title: 'QQ', rowspan: '3', align: 'left', width: 100},
				{
					field: 'createName',
					title: systemLanguage["com.skyeye.createName"][languageType],
					rowspan: '3',
					width: 140
				},
				{
					field: 'createTime',
					title: systemLanguage["com.skyeye.createTime"][languageType],
					rowspan: '3',
					align: 'center',
					width: 150
				},
				{
					field: 'lastUpdateName',
					title: systemLanguage["com.skyeye.lastUpdateName"][languageType],
					rowspan: '3',
					align: 'left',
					width: 140
				},
				{
					field: 'lastUpdateTime',
					title: systemLanguage["com.skyeye.lastUpdateTime"][languageType],
					rowspan: '3',
					align: 'center',
					width: 150
				},
				{
					title: systemLanguage["com.skyeye.operation"][languageType],
					rowspan: '3',
					fixed: 'right',
					align: 'center',
					width: 200,
					toolbar: '#tableBar'
				}
			], [
				{field: 'companyName', title: '公司', align: 'left', width: 120},
				{field: 'departmentName', title: '部门', align: 'left', width: 120},
				{field: 'jobName', title: '职位', align: 'left', width: 120},

				{field: 'entryTime', title: '入职时间', align: 'center', width: 150},
				{
					field: 'quitTime', title: '司龄', align: 'left', width: 80, templet: function (d) {
						if (!isNull(d.entryTime)) {
							// 计算司龄，结合入职时间和离职时间
							var entryTime = new Date(d.entryTime);
							var nowTime = isNull(d.quitTime) ? new Date() : new Date(d.quitTime);
							var diffTime = nowTime.getTime() - entryTime.getTime();
							var years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
							years = years < 0 ? 0 : years;
							return years + "年";
						} else {
							return "";
						}
					}
				}
			]],
			done: function (json) {
				soulTable.render(this);
				matchingLanguage();
				initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "请输入员工姓名、员工工号", function () {
					table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
				});
			}
		});

		table.on('tool(messageTable)', function (obj) {
			var data = obj.data;
			var layEvent = obj.event;
			if (layEvent === 'edit') { //编辑
				edit(data);
			} else if (layEvent === 'userPhoto') { //头像预览
				systemCommonUtil.showPicImg(systemCommonUtil.getFilePath(data.userPhoto));
			} else if (layEvent === 'details') { //员工详情
				details(data);
			} else if (layEvent === 'leave') { //离职
				leave(data);
			} else if (layEvent === 'turnTeacher') { //转教职工
				turnTeacher(data);
			} else if (layEvent === 'addCertificate') { //录入证书
				addCertificate(data);
			} else if (layEvent === 'addEducation') { //录入教育背景
				addEducation(data);
			}
		});
	}

	// 获取当前登陆用户所属的学校列表
	schoolUtil.queryMyBelongSchoolList(function (json) {
		$("#schoolId").html(getDataUseHandlebars(getFileContent('tpl/template/select-option-must.tpl'), json));
		form.render("select");
		initTable();
	});

	// 学校教师列表
    //function initTable(){
		// table.render({
		//     id: 'messageTable',
		//     elem: '#messageTable',
		//     method: 'post',
		//     url: schoolBasePath + 'schoolteacher001',
		//     where: getTableParams(),
		//     even: false,
		//     page: true,
		//     limits: getLimits(),
	    // 	limit: getLimit(),
		//     cols: [[
		//         { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
		//         { field: 'userName', title: '姓名', rowspan: '3', align: 'left', width: 150, templet: function (d) {
		//         	return '<a lay-event="details" class="notice-title-click">' + d.jobNumber + ' ' + d.userName + '</a>';
		//         }},
		//         { field: 'email', title: '邮箱', align: 'left', width: 170 },
		//         { field: 'userPhoto', title: '头像', align: 'center', width: 60, templet: function (d) {
		//         	if(isNull(d.userPhoto)){
		//         		return '<img src="../../assets/images/os_windows.png" class="photo-img">';
		//         	} else {
		//         		return '<img src="' + fileBasePath + d.userPhoto + '" class="photo-img" lay-event="userPhoto">';
		//         	}
		//         }},
		//         { field: 'userIdCard', title: '身份证', align: 'center', width: 160 },
		// 		{ field: 'userSex', title: '性别', width: 60, rowspan: '2', templet: function (d) {
		// 			return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("sexEnum", 'id', d.userSex, 'name');
		// 		}},
		//         { field: 'state', title: '状态', width: 60, align: 'center', templet: function (d) {
		//         	if(d.state == '1'){
		//         		return "<span class='state-up'>在职</span>";
		//         	} else if (d.state == '2'){
		//         		return "<span class='state-down'>离职</span>";
		//         	} else {
		//         		return "参数错误";
		//         	}
		//         }},
		//         { field: 'schoolName', title: '学校', align: 'left', width: 120},
		//         { field: 'phone', title: '手机号', align: 'center', width: 100},
		//         { field: 'qq', title: 'QQ', align: 'center', width: 100}
		//     ]],
		//     done: function(json) {
		//     	matchingLanguage();
		//     }
		// });
		
	// 	table.on('tool(messageTable)', function (obj) {
	//         var data = obj.data;
	//         var layEvent = obj.event;
	// 		if (layEvent === 'edit') { // 编辑
	// 			edit(data);
	// 		} else if (layEvent === 'userPhoto') { // 头像预览
	// 			systemCommonUtil.showPicImg(fileBasePath + data.userPhoto);
	// 		} else if (layEvent === 'details') { // 教师详情
	// 			details(data);
	// 		}
	//     });
	//     form.render();
    // }
	
	$("body").on("click", "#formSearch", function() {
		refreshTable();
	});
	
	// 教师详情
	function details(data) {
		rowId = data.id;
		_openNewWindows({
			url: "../../tpl/sysEveUserStaff/sysEveUserStaffDetails.html",
			title: systemLanguage["com.skyeye.detailsPageTitle"][languageType],
			pageId: "sysEveUserStaffDetails",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
			}});
	}
	
    $("body").on("click", "#reloadTable", function() {
    	loadTable();
    });
    
    function loadTable() {
    	table.reloadData("messageTable", {where: getTableParams()});
    }
    
    function refreshTable(){
    	table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
    }

    function getTableParams() {
    	return {
    		userName: $("#userName").val(),
			userSex: $("#userSex").val(),
			userIdCard: $("#userIdCard").val(),
			schoolId: $("#schoolId").val()
    	};
	}
    
    exports('schoolteacherlist', {});
});
