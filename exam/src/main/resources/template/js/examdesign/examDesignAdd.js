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
			loadData();
		});
	    //学校监听事件
		form.on('select(schoolId)', function(data) {
			if(isNull(data.value) || data.value === '请选择'){
				$("#schoolId").html("");
				form.render('select');
			} else {
				// 加载院系
				initFaculty();
				initSemester();//初始化学期
			}
		});

		// 所属院系
		function initFaculty(){
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
				params: {facultyId: $("#facultyId").val()},
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

		// 阅卷人选择
		$("body").on("click", "#approverSelPeople", function (e) {
			// 初始化选择器参数
			systemCommonUtil.userReturnList = readerList ? systemCommonUtil.userReturnList : [];
			systemCommonUtil.chooseOrNotMy = "1";
			systemCommonUtil.chooseOrNotEmail = "2";
			systemCommonUtil.checkType = "1";
			
			// 打开选择页面
			systemCommonUtil.openSysUserStaffChoosePage(function (userReturnList) {
				if (userReturnList && userReturnList.length > 0) {
					// 构建显示字符串
					var approverNames = userReturnList.map(function(item) {
						return item.userName + (item.userSex === 1 ? '(男)' : '(女)');
					});
					$("#approver").val(approverNames.join("，"));

					// 保存阅卷人ID列表
					readerList = userReturnList.map(function(item) {
						return item.id;
					}).join(",");
				} else {
					$("#approver").val("");
					readerList = "";
				}
			});
		});

		function loadData() {
			// 如果试卷id不为空，则说明是编辑，加载编辑信息
			if (!isNull(parent.rowId)) {
				console.log("编辑模式，有parent.rowId");
				AjaxPostUtil.request({
					url: schoolBasePath + "queryDirectoryById",
					params: {id: parent.rowId},
					type: 'json',
					callback: function (json) {
						console.log("获取到的试卷数据:", json);
						// 基础信息赋值
						$("#schoolId").val(json.bean.schoolId);
						$("#surveyName").val(json.bean.surveyName);
						$("#semesterId").val(json.bean.semesterId);//学期
						
						// 设置单选按钮状态
						$("input[name='viewAnswer'][value='" + json.bean.viewAnswer + "']").prop("checked", true);
						$("input[name='surveyModel'][value='" + json.bean.surveyModel + "']").prop("checked", true);
						
						// 加载院系、专业、科目和班级的级联数据
						showGrid({
							id: "facultyId",
							url: schoolBasePath + "queryFacultyListBySchoolId",//院系
							params: {schoolId: $("#schoolId").val()},
							method: "GET",
							pagination: false,
							template: getFileContent('tpl/template/select-option.tpl'),
							ajaxSendLoadBefore: function (hdb) {},
							ajaxSendAfter: function (data) {
								$("#facultyId").val(json.bean.facultyId);
								
								// 加载专业
								showGrid({
									id: "majorId",
									url: schoolBasePath + "queryMajorListByFacultyId",//专业
									params: {facultyId: $("#facultyId").val()},
									method: "GET",
									pagination: false,
									template: getFileContent('tpl/template/select-option.tpl'),
									ajaxSendLoadBefore: function (hdb) {},
									ajaxSendAfter: function (data) {
										$("#majorId").val(json.bean.majorId);
										
										// 加载科目
										showGrid({
											id: "subjectId",//科目
											url: schoolBasePath + "querySubjectListByMajorId",
											method: "GET",
											params: {majorId: $("#majorId").val()},
											pagination: false,
											template: getFileContent('tpl/template/select-option.tpl'),
											ajaxSendLoadBefore: function (hdb) {},
											ajaxSendAfter: function (data) {
												$("#subjectId").val(json.bean.subjectId);
												
												// 加载班级并设置选中状态
												showGrid({
													id: "classList",
													url: schoolBasePath + "queryClassListByMajorId",
													params: {majorId: $("#majorId").val()},
													pagination: false,
													template: getFileContent('tpl/template/checkbox-property.tpl'),
													method: "GET",
													ajaxSendLoadBefore: function (hdb) {},
													ajaxSendAfter: function (data) {
														// 设置班级选中状态
														if(json.bean.classId) {
															var classIds = json.bean.classId.split(',');
															classIds.forEach(function(classId) {
																$("input[type='checkbox'][rowId='" + classId + "']").prop("checked", true);
															});
														}
														form.render('checkbox');
													}
												});
												
												form.render('select');
											}
										});
										
										// 加载学期
										showGrid({
											id: "semesterId",
											url: schoolBasePath + "queryAllSemesterList",
											params: {schoolId: json.bean.schoolId},
											pagination: false,
											template: getFileContent('tpl/template/select-option.tpl'),
											method: "GET",
											ajaxSendLoadBefore: function (hdb) {},
											ajaxSendAfter: function (data) {
												$("#semesterId").val(json.bean.semesterId);
												form.render('select');
											}
										});

										// 回显阅卷人信息
										if(json.bean.readerMationList && json.bean.readerMationList.length > 0) {
											systemCommonUtil.userReturnList = json.bean.readerMationList;
											var approverNames = json.bean.readerMationList.map(function(item) {
												return item.userName + (item.userSex === 1 ? '(男)' : '(女)');
											});
											$("#approver").val(approverNames.join("，"));
											readerList = json.bean.readerMationList.map(function(item) {
												return item.id;
											}).join(",");
										}
										
										form.render();
									}
								});
							}
						});
					}
				});
			} else {
				console.log("新增模式，无parent.rowId")
				initFaculty();
				initSemester();
			}
		}


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
        			semesterId: $("#semesterId").val(),
					classId: propertyIds.slice(0, -1),  // 移除最后的逗号
        			subjectId: $("#subjectId").val(),
					facultyId: $("#facultyId").val(),
					majorId: $("#majorId").val(),
					whetherDelete: 1,
        			viewAnswer: $("input[name='viewAnswer']:checked").val(),
					surveyModel: $("input[name='surveyModel']:checked").val(),
					surveyState: 0,
					readerList: readerList
        			// propertyIds: propertyIds
	        	};
	        	AjaxPostUtil.request({url:schoolBasePath + "createExamDirectory", params: params, type: 'json', callback: function (json) {
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