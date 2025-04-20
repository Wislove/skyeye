var rowId = "";
var state=1
layui.config({
	base: basePath,
	version: skyeyeVersion
}).extend({
	window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'laydate'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		form = layui.form,
		table = layui.table,
		laydate = layui.laydate;

	laydate.render({elem: '#year', type: 'year', max: 'date'});

	// 获取当前登陆用户所属的学校列表
	schoolUtil.queryMyBelongSchoolList(function (json) {
		$("#schoolId").html(getDataUseHandlebars(getFileContent('tpl/template/select-option-must.tpl'), json));
		form.render("select");
		// 加载年级
		// initGradeId();
		initTable();
		initFaculty();
	});

	// 学校监听事件
	form.on('select(schoolId)', function(data) {
		if(isNull(data.value) || data.value === '请选择'){
			$("#schoolId").html("");
			form.render('select');
		} else {
			// 加载院系
			initFaculty();
		}
	});

	//所属院系
	function initFaculty(){
		showGrid({
			id: "facultyId",
			url: schoolBasePath + "queryFacultyListBySchoolId",
			params: {schoolId: $("#schoolId").val()},
			method: "GET",
			pagination: false,
			template: getFileContent('tpl/template/select-option.tpl'),
			ajaxSendLoadBefore: function(hdb) {
			},
			ajaxSendAfter:function (json) {
				form.render('select');
			}
		});
	}

	// 院系监听事件
	form.on('select(facultyId)', function(data) {
		if(isNull(data.value) || data.value === '请选择'){
			$("#facultyId").html("");
			form.render('select');
		} else {
			// 加载专业
			initMajor();
		}
	});

	// 初始化专业
	function initMajor(){
		showGrid({
			id: "majorId",
			url: schoolBasePath + "queryMajorListByFacultyId",
			method: "GET",
			params: {facultyId: $("#facultyId").val()},
			pagination: false,
			template: getFileContent('tpl/template/select-option.tpl'),
			ajaxSendLoadBefore: function(hdb) {
			},
			ajaxSendAfter:function (json) {
				form.render('select');
			}
		});
	}

	// 专业监听事件
	form.on('select(majorId)', function(data) {
		if(isNull(data.value) || data.value === '请选择'){
			$("#majorId").html("");
			form.render('select');
		} else {
			// 加载科目
			initSubject();
		}
	});

	//初始化科目
	function initSubject(){
		showGrid({
			id: "subjectId",
			url: schoolBasePath + "querySubjectListByMajorId",
			params: {majorId: $("#majorId").val()},
			method: "GET",
			pagination: false,
			template: getFileContent('tpl/template/select-option.tpl'),
			ajaxSendLoadBefore: function(hdb) {},
			ajaxSendAfter:function (json) {
				form.render('select');
			}
		});
	}

	function initTable(){
		table.render({
			id: 'messageTable',
			elem: '#messageTable',
			method: 'post',
			url: schoolBasePath + 'queryFilterApprovedSurveys',//接口文档在 试卷回答信息表管理
			// url: schoolBasePath + 'myschooltask002',
			where: getTableParams(),
			even: false,
			page: true,
			limits: getLimits(),
			limit: getLimit(),
			cols: [[
				{ title: systemLanguage["com.skyeye.serialNumber"][languageType], rowspan: '2', type: 'numbers' },
				{ field: 'surveyName', rowspan: '2', width: 200, title: '试卷名称', templet: function (d) {
						return '<a lay-event="details" class="notice-title-click">' + d.surveyMation?.surveyName + '</a>';
					}},
				{ field: 'studentNo', rowspan: '2', width: 140, align: 'center', title: '学号',templet:function (d) {
						return d.studentNumber}},
				{ field: 'schoolName', rowspan: '2', width: 150, title: '学校',templet:function (d) {
						return d.surveyMation?.schoolMation?.name}},
				{ field: 'facultyName', rowspan: '2', width: 80, align: 'center', title: '院系',templet:function (d) {
						return d.surveyMation?.facultyMation?.name}},
				{ field: 'majorName', rowspan: '2', width: 80, align: 'center', title: '专业',templet:function (d) {
						return d.surveyMation?.majorMation?.name}},
				{ field: 'subjectName', rowspan: '2', width: 80, align: 'center', title: '科目',templet:function (d) {
						return d.surveyMation?.subjectMation?.name}},
				{ title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', rowspan: '2', align: 'center', width: 100, toolbar: '#tableBar'}
			],],
			done: function(json) {
				matchingLanguage();
			}
		});

		table.on('tool(messageTable)', function (obj) {
			var data = obj.data;
			var layEvent = obj.event;
			if (layEvent === 'examMarkingDetail') {
				examMarkingDetail(data);
			} else if (layEvent === 'details') { // 详情
				details(data);
			}
		});

		form.render();
	}

	function examMarkingDetail(data) {
		parent._openNewWindows({
			url: "../../tpl/myschooltask/waitingMarkingStudentsList.html?surveyId=" + data.surveyId + '&companyId=' + data?.surveyMation?.classId + '&state=' + state + '&objectId=' + data?.surveyMation?.subjectId,
			title: "待批阅学生列表",
			pageId: "waitingMarkingStudentsList",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
	}

	// 详情
	function details(data) {
		rowId = data.id;
		_openNewWindows({
			url: "../../tpl/examDetail/examPCDetail.html",
			title: "试卷信息",
			pageId: "examPCDetail",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
			}
		});
	}

	form.on('submit(formSearch)', function (data) {
		if (winui.verifyForm(data.elem)) {
			table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
		}
		return false;
	});

	// 刷新按钮点击事件
	$("body").on("click", "#reloadTable", function() {
		loadTable();
	});

	function loadTable() {
		table.reload('messageTable', { // 使用表格的 ID 进行刷新
			where: getTableParams(),
			page: {curr: 1} // 刷新时从第一页开始
		});
	}

	function getTableParams() {
		return {
			keyword: $("#surveyName").val(),
			holderId: $("#facultyId").val(),
			state: state // 确保传递 state 参数
		};
	}

	exports('myWaitMarkingList', {});
});