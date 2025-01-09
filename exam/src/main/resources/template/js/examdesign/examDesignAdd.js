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

		// 定义全局变量
		var readerList = '';  // 添加全局变量存储审批人ID列表

		// 获取当前登陆用户所属的学校列表
		schoolUtil.queryMyBelongSchoolList(function (json) {
			$("#schoolId").html(getDataUseHandlebars(getFileContent('tpl/template/select-option-must.tpl'), json));
			form.render("select");
			// 加载年级
			// initGrade();
			// 加载院系
			initFacultyId();
			// 加载学期
			initSemester();
		});
	    //学校监听事件
		form.on('select(schoolId)', function(data) {
			if(isNull(data.value) || data.value === '请选择'){
				$("#schoolId").html("");
				form.render('select');
			} else {
				//加载年级
				// initGrade();
				// 加载院系
				initFacultyId();
				//加载学期
				initSemester();
			}
		});

		// 所属院系
		function initFacultyId(){
			showGrid({
				id: "facultyId",
				url: schoolBasePath + "queryFacultyListBySchoolId",
				params: {schoolId: $("#schoolId").val()},
				pagination: false,
				template: getFileContent('tpl/template/select-option.tpl'),
				method: 'GET',
				ajaxSendLoadBefore: function(hdb) {},
				ajaxSendAfter:function (json) {
					form.render('select');
				}
			});
		}

		// 院系选择事件
		form.on('select(facultyId)', function(data) {
			if(isNull(data.value) || data.value === '请选择'){
				$("#majorId").html("");  // 清空专业
				$("#subjectId").html("");  // 清空科目
				form.render('select');
			} else {
				facultyId = data.value;  // 设置当前选中的院系ID
				initMajor();  // 加载专业
			}
		});

		// 初始化专业
		function initMajor(){
			showGrid({
				id: "majorId",
				url: schoolBasePath + "queryMajorListByFacultyId",
				params: {facultyId: facultyId},
				pagination: false,
				template: getFileContent('tpl/template/select-option.tpl'),
				method: 'GET',
				ajaxSendLoadBefore: function(hdb) {},
				ajaxSendAfter:function (json) {
					form.render('select');
				}
			});
		}

		// 专业选择事件
		form.on('select(majorId)', function(data) {
			if(isNull(data.value) || data.value === '请选择'){
				$("#subjectId").html("");
				form.render('select');
			} else {
				majorId = data.value;  // 设置当前选中的专业ID
				initSubject();
				initClass();
			}
		});

		//初始化年级
		// function initGrade(){
		// 	showGrid({
		// 	 	id: "gradeId",
		// 	 	url: schoolBasePath + "grademation006",
		// 	 	params: {schoolId: $("#schoolId").val()},
		// 	 	pagination: false,
		// 	 	template: getFileContent('tpl/template/select-option.tpl'),
		// 	 	ajaxSendLoadBefore: function(hdb) {},
		// 	 	ajaxSendAfter:function (json) {
		// 	 		form.render('select');
		// 	 	}
		//     });
		// }
		//年级监听事件
		// form.on('select(gradeId)', function(data) {
		// 	if(isNull(data.value) || data.value === '请选择'){
		// 		$("#subjectId").html("");
		// 		$("#sessionYear").html("");
		//  		$("#classList").html("");
		// 		form.render('select');
		// 	} else {
		// 		//加载科目
		// 		initSubject();
		// 		//加载班级
		// 		loadThisGradeNowYear();
		// 	}
		// });

		//初始化学期
		function initSemester(){
			showGrid({
			 	id: "semesterId",
			 	url: schoolBasePath + "queryAllSemesterList",
			 	params: {schoolId: $("#schoolId").val()},
			 	pagination: false,
			 	template: getFileContent('tpl/template/select-option.tpl'),
				method: 'GET',
			 	ajaxSendLoadBefore: function(hdb) {},
			 	ajaxSendAfter:function (json) {
			 		form.render('select');
			 	}
		    });
		}

		//初始化科目
		function initSubject(){
			showGrid({
			 	id: "subjectId",
			 	url: schoolBasePath + "querySubjectListByMajorId",
				params: {majorId: $("#majorId").val()},  // 修正参数名
				pagination: false,
			 	template: getFileContent('tpl/template/select-option.tpl'),
				method: 'GET',
			 	ajaxSendLoadBefore: function(hdb) {},
			 	ajaxSendAfter:function (json) {
			 		form.render('select');
			 	}
		    });
		}

		// 初始化班级
		function initClass() {
			showGrid({
				id: "classList",
				url: schoolBasePath + "queryClassListByMajorId",
				params: {majorId: $("#majorId").val()},  // 修正参数名
				pagination: false,
				template: getFileContent('tpl/template/checkbox-property.tpl'),
				method: 'GET',
				ajaxSendLoadBefore: function(hdb) {},
				ajaxSendAfter:function (json) {
					form.render('checkbox');
				}
			});
		}
		//加载当前选中的年级是哪一届的以及这一届的班级信息
		// function loadThisGradeNowYear(){
		// 	showGrid({
		// 	 	id: "classList",
		// 	 	url: schoolBasePath + "grademation009",
		// 	 	params: {gradeId: $("#gradeId").val()},
		// 	 	pagination: false,
		// 	 	template: getFileContent('tpl/template/checkbox-property.tpl'),
		// 	 	ajaxSendLoadBefore: function(hdb) {},
		// 	 	ajaxSendAfter:function(data) {
		// 	 		$("#sessionYear").html(data.bean.year + '届学生');
		// 	 		form.render('checkbox');
		// 	 	},
		// 	 	ajaxSendErrorAfter: function (json) {
		// 	 		$("#sessionYear").html("");
		// 	 		$("#classList").html("");
		// 	 	}
		//     });
		// }

		// 审批人选择
		$("body").on("click", "#approverSelPeople", function (e) {
			systemCommonUtil.userReturnList = [];
			systemCommonUtil.chooseOrNotMy = "1";
			systemCommonUtil.chooseOrNotEmail = "2";
			systemCommonUtil.checkType = "1";
			systemCommonUtil.openSysUserStaffChoosePage(function (userReturnList) {
				var approverNames = userReturnList.map(function(item) {
					return item.name;
				});
				$("#approver").val(approverNames.join(", "));
				
				// 更新全局变量
				readerList = userReturnList.map(function(item) {
					return item.id;
				}).join(",");

				if (isNull(readerList)) {
					winui.window.msg('请选择审批人', {icon: 2, time: 2000});
					return false;
				}
			});
		});

		matchingLanguage();
		form.render();
	    form.on('submit(formAddBean)', function (data) {
	        if (winui.verifyForm(data.elem)) {
	        	// 检查是否选择了审批人
	        	if (isNull(readerList)) {
	        		winui.window.msg('请选择审批人', {icon: 2, time: 2000});
	        		return false;
	        	}

	        	//获取选中的班级信息
	        	var propertyIds = "";
	        	$.each($('input:checkbox:checked'),function(){
	        		propertyIds = propertyIds + $(this).attr("rowId") + ",";
	            });
	            if(isNull(propertyIds)){
	            	winui.window.msg('请选择班级', {icon: 2, time: 2000});
	            	return false;
	            }

	        	var params = {
        			surveyName: $("#surveyName").val(),
        			schoolId: $("#schoolId").val(),
        			// gradeId: $("#gradeId").val(),
        			semesterId: $("#semesterId").val(),
					classId: propertyIds.slice(0, -1),  // 移除最后的逗号
        			subjectId: $("#subjectId").val(),
					whetherDelete: 1,
        			viewAnswer: $("input[name='viewAnswer']:checked").val(),
					surveyModel: $("input[name='surveyModel']:checked").val(),
					surveyState: 0,
					readerList: readerList
        			// propertyIds: propertyIds
	        	};
	        	AjaxPostUtil.request({url:schoolBasePath + "writeExamDirectory", params: params, type: 'json', callback: function (json) {
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