var rowId = "";
var surveyName = "";
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'tableCheckBoxUtil'], function (exports) {
	
	winui.renderColor();
	var index = parent.layer.getFrameIndex(window.name);
	
	var $ = layui.$,
		form = layui.form,
		table = layui.table,
		tableCheckBoxUtil = layui.tableCheckBoxUtil;
	
	// 选择的试题列表
	var questionMationList = [].concat(parent.questionMationList);
	
	// 设置提示信息
	var s = "试题选择规则：1.多选；2.包含所有公开试题以及个人的私有试题。如没有查到要选择的试题，请检查试题信息是否满足当前规则。";
	$("#showInfo").html(s);

	// 获取当前登陆用户所属的学校列表
	schoolUtil.queryMyBelongSchoolList(function (json) {
		$("#schoolId").html(getDataUseHandlebars(getFileContent('tpl/template/select-option-must.tpl'), json));
		form.render("select");
		initTable();
	});

	form.on('select(schoolId)', function (data) {
		// 加载院系
		initFacultyId();
	});

	// 所属院系
	function initFacultyId() {
		showGrid({
			id: "facultyId",
			url: schoolBasePath + "queryFacultyListBySchoolId",
			params: {schoolId: $("#schoolId").val()},
			pagination: false,
			template: getFileContent('tpl/template/select-option.tpl'),
			method: 'GET',
			ajaxSendLoadBefore: function (hdb) {
			},
			ajaxSendAfter: function (json) {
				form.render('select');
			}
		});
	}

	// 院系选择事件
	form.on('select(facultyId)', function (data) {
		if (isNull(data.value) || data.value === '请选择') {
			$("#majorId").html("");  // 清空专业
			$("#subjectId").html("");  // 清空科目
			form.render('select');
		} else {
			facultyId = data.value;  // 设置当前选中的院系ID
			initMajor(); } // 加载专业

	});

	// 初始化专业
	function initMajor() {
		showGrid({
			id: "majorId",
			url: schoolBasePath + "queryMajorListByFacultyId",
			params: {facultyId: facultyId},
			pagination: false,
			template: getFileContent('tpl/template/select-option.tpl'),
			method: 'GET',
			ajaxSendLoadBefore: function (hdb) {
			},
			ajaxSendAfter: function (json) {
				form.render('select');
			}
		});
	}

	// 专业选择事件
	form.on('select(majorId)', function (data) {
		if (isNull(data.value) || data.value === '请选择') {
			$("#subjectId").html("");
			form.render('select');
		} else {
			majorId = data.value;  // 设置当前选中的专业ID
			initSubject();
		}
	});

	// 初始化科目
	function initSubject() {
		showGrid({
			id: "subjectId",
			url: schoolBasePath + "querySubjectListByMajorId",
			params: {majorId: $("#majorId").val()},  // 修正参数名
			pagination: false,
			template: getFileContent('tpl/template/select-option.tpl'),
			method: 'GET',
			ajaxSendLoadBefore: function (hdb) {},
			ajaxSendAfter: function (json) {
				form.render('select');
			}
		});
	}
	
	function initTable(){
		// 初始化值
		var ids = [];
		$.each(questionMationList, function(i, item) {
			ids.push(item.id);
		});
		tableCheckBoxUtil.setIds({
			gridId: 'messageTable',
			fieldName: 'id',
			ids: ids
		});
		tableCheckBoxUtil.init({
			gridId: 'messageTable',
			filterId: 'messageTable',
			fieldName: 'id'
		});

		table.render({
		    id: 'messageTable',
		    elem: '#messageTable',
		    method: 'post',
		    url: schoolBasePath + 'queryFilterQuestionList',
		    where: getTableParams(),
			even: false,
		    page: true,
		    limits: getLimits(),
	    	limit: getLimit(),
		    cols: [[
		    	{ type: 'checkbox'},
		        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
		        { field: 'quTitle', width:100, title: '题目', templet: function (d) {
			        return d.quTitle;
			    }},
		        { field: 'isPublic', width:80, title: '类型', align: 'center', templet: function (d) {
		        	if(d.isPublic == 0){
		        		return '<span style="color: blue">' + "公开" + '</span>';
		        	} else if(d.isPublic == 1){
		        		return '<span style="color: goldenrod">' + "私有" + '</span>';
		        	}else {
						return d.isPublic; // 兜底返回，以防isPublic值不在预期范围内
					}}},
		        { field: 'quType', width: 100, title: '题型',templet: function (d) {
						if (d.quType == 0) {
							return "判断题";
						} else if (d.quType == 1) {
							return "单选题" + '<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
						} else if (d.quType == 2) {
							return "多选题"+'<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
						} else if (d.quType == 3) {
							return "填空题"+'<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
						}else if (d.quType == 4) {
							return "多项填空题"+'<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
						}else if (d.quType == 8) {
							return "评分题"+'<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
						}else if (d.quType == 9) {
							return "排序题"+'<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
						}else if (d.quType == 11) {
							return "矩阵单选题"+'<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
						}else if (d.quType == 12) {
							return "矩阵填空题"+'<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
						}else if (d.quType == 13) {
							return "矩阵多选题"+'<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
						}else if (d.quType == 18) {
							return "矩阵评分题"+'<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
						}else {
							return d.quType; // 兜底返回，以防quType值不在预期范围内
						}
				}},
		        { field: 'schoolName', width: 100, title: '学校', templet: function (d) {
						return d.schoolMation.name;
					}},
	            // { field: 'gradeName', width: 80, align: 'center', title: '年级'},
				{ field: 'facultyName', width: 80, align: 'center', title: '院系', templet: function (d) {
						return d.facultyMation.name;
					}},
				{ field: 'subjectName', width: 80, align: 'center', title: '专业', templet: function (d) {
						return d.majorMation.name;
					}},
	            { field: 'subjectName', width: 80, align: 'center', title: '科目', templet: function (d) {
						return d.subjectMation.name;
					}},
		        { field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 140 }
		    ]],
		    done: function(res, curr, count){
		    	matchingLanguage();
	    		//设置选中
	    		tableCheckBoxUtil.checkedDefault({
					gridId: 'messageTable',
					fieldName: 'quInBankId'
				});
		    }
		});
		table.on('tool(messageTable)', function (obj) {
	        var data = obj.data;
	        var layEvent = obj.event;
	        if (layEvent === 'details') { //详情
	        	details(data);
	        }
	    });
		form.render();
	}
	
	// 详情
	function details(data) {
		rowId = data.productId;
		_openNewWindows({
			url: "", 
			title: systemLanguage["com.skyeye.detailsPageTitle"][languageType],
			pageId: "",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
			}});
	}
	
	// 保存
	$("body").on("click", "#saveChoose", function() {
		var selectedData = tableCheckBoxUtil.getValue({
			gridId: 'messageTable'
		});
		if(selectedData.length == 0){
			winui.window.msg("请选择试题", {icon: 2, time: 2000});
			return false;
		}
		console.log(99,selectedData,selectedData.length)
		AjaxPostUtil.request({url:schoolBasePath + "selectQuestionById", params: {ids: selectedData.toString()}, type: 'json', callback: function (json) {
			parent.questionMationList = [].concat(json.rows);
			parent.layer.close(index);
			parent.refreshCode = '0';
   		}});
	});
	
	// 搜索表单
    form.render();
    form.on('submit(formSearch)', function (data) {
        if (winui.verifyForm(data.elem)) {
            refreshTable();
        }
        return false;
    });
	
	$("body").on("click", "#reloadTable", function() {
    	loadTable();
    });
    
    function loadTable() {
    	table.reloadData("messageTable", {where: getTableParams()});
    }
    
    function refreshTable(){
    	table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
    }
	console.log($("#isPublic").val(),3423)
	function getTableParams() {
		return {
			holderKey: $("#schoolId").val(),
			holderId: $("#facultyId").val(),
			objectKey: $("#majorId").val(),//专业
			objectId: $("#subjectId").val(),//科目
			keyword: $("#quTitle").val(),//题目
			type: $("#quType").val(),//题型
			enabled: $("#isPublic").val(),  //类型，公开/私有
		};
	}
	
    exports('schoolQuestionBankChoose', {});
});