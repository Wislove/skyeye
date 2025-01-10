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
			// 加载院系
			initFacultyId();
			loadData();
		});
	    //学校监听事件
		form.on('select(schoolId)', function(data) {
			if(isNull(data.value) || data.value === '请选择'){
				$("#schoolId").html("");
				form.render('select');
			} else {
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

		// 阅卷人选择
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

		function loadData(){
			// 如果问题id不为空，则说明是编辑，加载编辑信息
			if (!isNull(parent.rowId)){
				console.log(33,parent.rowId)
				AjaxPostUtil.request({url:schoolBasePath + "queryDirectoryById", params: {id: parent.rowId}, type: 'json', callback: function (json) {
						$("#surveyName").val(json.bean.surveyName);
						$("#schoolId").val(json.bean.schoolId);
						$("#approverSelPeople").val(json.bean.classesMation.facultyMation.name);
						// $("#majorId").val(json.bean.classesMation.majorMation.name);还是不行
						// $("#subjectId").val(json.bean.subjectMation.name);
						// $("#classList").val(json.bean.classesMation.name);
						showGrid({
							id: "facultyId",
							url: schoolBasePath + "queryFacultyListBySchoolId",//院系
							params: {schoolId: $("#schoolId").val()},
							method: 'GET',
							pagination: false,
							template: getFileContent('tpl/template/select-option.tpl'),
							ajaxSendLoadBefore: function(hdb) {},
							ajaxSendAfter:function(data) {
								$("#facultyId").val(json.bean.classesMation.facultyMation.name);
								showGrid({
									id: "majorId",
									url: schoolBasePath + "queryMajorListByFacultyId",//专业
									params: {facultyId: $("#facultyId").val()},
									method: 'GET',
									pagination: false,
									template: getFileContent('tpl/template/select-option.tpl'),
									ajaxSendLoadBefore: function (hdb) {},
									ajaxSendAfter: function (data) {
										$("#majorId").val(json.bean.classesMation.majorMation.name);
										console.log("majorId",json.bean.classesMation.majorMation.name)
										showGrid({
											id: "subjectId",
											url: schoolBasePath + "querySubjectListByMajorId",//科目
											params: {majorId: $("#majorId").val()},
											method: 'GET',
											pagination: false,
											template: getFileContent('tpl/template/select-option.tpl'),
											ajaxSendLoadBefore: function (hdb) {},
											ajaxSendAfter: function (data) {
												$("#subjectId").val(json.bean.subjectMation.name);
												showGrid({
													id: "classList",
													url: schoolBasePath + "queryClassListByMajorId",
													params: {majorId: $("#majorId").val()},  // 修正参数名
													pagination: false,
													template: getFileContent('tpl/template/checkbox-property.tpl'),
													method: 'GET',
													ajaxSendLoadBefore: function(hdb) {},
													ajaxSendAfter:function (json) {
														// form.render('checkbox');
														form.render();
													}
												});




											}
										});
									}
								})
							}
						});
						$("input:radio[name=type][value=" + json.bean.type + "]").attr("checked", true);
						$("#fraction").val(json.bean.fraction);


						// // 知识点赋值
						// schoolKnowledgeMationList = [].concat(json.bean.knowledgeList);
						// var str = "";
						// $.each(schoolKnowledgeMationList, function(i, item) {
	   					// 	str += '<br><span class="layui-badge layui-bg-blue" style="height: 25px !important; line-height: 25px !important; margin: 5px 0px;">' + item.title + '</span>';
						// });
						// $("#schoolKnowledgeChoose").parent().html('<button type="button" class="layui-btn layui-btn-primary layui-btn-xs" id="schoolKnowledgeChoose">知识点选择</button>' + str);
						//
						// // 题目信息赋值
						// $(".surveyQuItemBody").html(getDataUseHandlebars($("#template").html(), json));

						// // 设置tab
						// tabIndex = json.bean.fileType;
						// fileUrl = json.bean.fileUrl;
						// $('.layui-tab-title li').eq(tabIndex).addClass('layui-this').siblings().removeClass('layui-this');
						// $('.layui-tab-item').eq(tabIndex).addClass('layui-show').siblings().removeClass('layui-show');
						//
						// // 设置是否允许拍照/上传图片选中
						// $("input:radio[name=whetherUpload][value=" + json.bean.whetherUpload + "]").attr("checked", true);

						form.render();

						// 加载上传和切换监听事件
						// pageLoadAfter();
					}});
			} else {
				// 加载院系
				initFacultyId();
				// 加载专业
				initMajor();



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