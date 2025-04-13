var quIndex = 0, quLeftIndex = 0;//问题序号

// 要删除的行选项ID列表
var deleteRowList = new Array();

// 要删除的列选项ID列表（用于矩阵题）
var deleteColumnList = new Array();

layui.config({
	base: basePath,
	version: skyeyeVersion
}).extend({
	window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'validate','fileUpload'], function (exports) {
	winui.renderColor();
	layui.use(['form', 'jqueryUI'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
		var $ = layui.$,
			form = layui.form;

		var svTag = 2;//表示题目是问卷题还是题库中题

		$("#_basemodel").html(_basemodel);
		$("#_rectanglemodel").html(_rectanglemodel);
		$("#_auxiliarymodel").html(_auxiliarymodel);
		$("#_operationmodel").html(_operationmodel);
		$("#_commonlyusedmodel").html(_commonlyusedmodel);
		$("body").append(_varioustemplates);

		var loadPageJson;

		initPageJson();

		//获取问卷信息
		function initPageJson(callback) {
			AjaxPostUtil.request({
				url: sysMainMation.surveyBasePath + "queryDirectoryById",
				params: { id: parent.rowId },
				pagination: false,
				type: 'json',
				callback: function (json) {
					json.total = 1;
					$.each(json.rows, function (i, item) {
						item.saveTag = 1;
					});
					loadPageJson = json;
					if (typeof (callback) == "function") {
						callback();
					} else {
						initPage();
					}
				}
			});
		}

		function initPage() {
			showGrid({
				id: "dw_body",
				data: loadPageJson,
				pagination: false,
				template: getFileContent('tpl/dwsurveydesign/dwsurveydesignbean.tpl'),
				ajaxSendLoadBefore: function (hdb, json) {
					$.each(json.rows, function (i, item) {
							if (isNull(item.id)) {
								item.id = getRandomValueToString();
								item.noQuId = 1;
							}
					});
					hdb.registerHelper("showIndex", function (v1, options) {
						return parseInt(v1) + 1;
					});

					hdb.registerHelper("showQuestionIndex", function (v1, options) {
						if (v1 == '16' || v1 == '17') {
						} else {
							quIndex++;
							return quIndex;
						}
					});

					hdb.registerHelper("showQuestionLeftIndex", function (v1, options) {
						if (v1 == '16' || v1 == '17') {
						} else {
							quLeftIndex++;
							return quLeftIndex;
						}
					});
					//根据参数 v1 生成指定数量的表格列，用于矩阵题布局
					hdb.registerHelper("showParamInt02", function (v1, options) {
						var str = "";
						for (var i = 1; i <= v1; i++) {
							str += "<td>" + i + "</td>";
						}
						return str;
					});
					//条件渲染，布局方式条件判断
					hdb.registerHelper('compare1', function (v1, v2, options) {
						if (v1 == v2) {
							return options.fn(this);
						} else {
							return options.inverse(this);
						}
					});

					hdb.registerHelper('showQuestion', function (v1, i, options) {
						switch (v1) {
							case 1://1单选题radio
								return new Handlebars.SafeString(getDataUseHandlebars($("#radioTemplate").html(), json.rows[i]));
								break;
							case 2://2多选题checkbox
								return new Handlebars.SafeString(getDataUseHandlebars($("#checkBoxTemplate").html(), json.rows[i]));
								break;
							case 3://3填空题fillblank
								return new Handlebars.SafeString(getDataUseHandlebars($("#fillblankTemplate").html(), json.rows[i]));
								break;
							case 4://4多项填空题multi-fillblank
								return new Handlebars.SafeString(getDataUseHandlebars($("#multiFillblankTemplate").html(), json.rows[i]));
								break;
							case 8://8评分题score
								return new Handlebars.SafeString(getDataUseHandlebars($("#scoreTemplate").html(), json.rows[i]));
								break;
							case 9://9排序题orderby
								return new Handlebars.SafeString(getDataUseHandlebars($("#orderbyTemplate").html(), json.rows[i]));
								break;
							case 11://11矩阵单选题chen-radio
								return new Handlebars.SafeString(getDataUseHandlebars($("#chenRadioTemplate").html(), json.rows[i]));
								break;
							case 12://12矩阵填空题chen-fbk
								return new Handlebars.SafeString(getDataUseHandlebars($("#chenFbkTemplate").html(), json.rows[i]));
								break;
							case 13://13矩阵多选题chen-checkbox
								return new Handlebars.SafeString(getDataUseHandlebars($("#chenCheckboxTemplate").html(), json.rows[i]));
								break;
							case 16://16分页pagetag
								return new Handlebars.SafeString(getDataUseHandlebars($("#pagetagTemplate").html(), json.rows[i]));
								break;
							case 17://17段落paragraph
								return new Handlebars.SafeString(getDataUseHandlebars($("#paragraphTemplate").html(), json.rows[i]));
								break;
							case 18://18矩阵评分题chen-score
								return new Handlebars.SafeString(getDataUseHandlebars($("#chenScoreTemplate").html(), json.rows[i]));
								break;
						}
					});

					//右侧设计目录显示
					hdb.registerHelper('compareShowLeft', function (v1, options) {
						if (v1 != '16' && v1 != '17') {
							return options.fn(this);
						} else {
							return options.inverse(this);
						}
					});
					//动态样式控制
					hdb.registerHelper('compare2', function (v1, v2, options) {
						if (v1 == v2) {
							return 'display: none;';//隐藏元素
						} else {
							return '';// 默认显示
						}
					});
					// 矩阵题选项列生成
					hdb.registerHelper("cellCount001", function (v1, options) {
						var str = "";
						var width = 600 / v1;
						for (var i = 1; i <= v1; i++) {
							str += '<td width="' + width + 'px">' +
								'<input type="radio"><label style="width:' + width + 'px;" class="editAble quCoOptionEdit">{{optionName}}</label>' +
								'<input type="text" class="optionInpText" style="{{#compare2 isNote 0}}{{/compare2}}" />' +
								'<div class="quItemInputCase">' +
								'<input type="hidden" name="quItemId" value="{{id}}"><input type="hidden" name="quItemSaveTag" value="1">' +
								'<input type="hidden" name="isNote" value="{{isNote}}">' +
								'<input type="hidden" name="checkType" value="{{checkType}}">' +
								'<input type="hidden" name="isRequiredFill" value="{{isRequiredFill}}">' +
								'</div>' +
								'</td>';
						}
						str += '<div class="emptyTd"></div>';
						return str;
					});

					hdb.registerHelper("cellCount002", function (v1, options) {
						var str = "";
						var width = 600 / v1;
						for (var i = 1; i <= v1; i++) {
							str += '<td width="' + width + 'px">' +
								'<input type="checkbox"><label style="width:' + width + 'px;" class="editAble quCoOptionEdit">{{optionName}}</label>' +
								'<input type="text" class="optionInpText" style="{{#compare2 isNote 0}}{{/compare2}}" />' +
								'<div class="quItemInputCase">' +
								'<input type="hidden" name="quItemId" value="{{id}}"><input type="hidden" name="quItemSaveTag" value="1">' +
								'<input type="hidden" name="isNote" value="{{isNote}}">' +
								'<input type="hidden" name="checkType" value="{{checkType}}">' +
								'<input type="hidden" name="isRequiredFill" value="{{isRequiredFill}}">' +
								'</div>' +
								'</td>';
						}
						str += '<div class="emptyTd"></div>';
						return str;
					});
				},
				ajaxSendAfter: function (json) {

					loadAddr();//初始化地址区域

					// 加载拖拽事件
					loadDrag();

					matchingLanguage();
					form.render();

					//绑定变动
					bindQuHoverItem();

					// 初始化右侧目录
					resetQuLeftItem(); // 确保在页面加载时调用

					$("#dwSurveyName").click(function () {
						editAble($(this));
						return false;
					});
					$("#dwSurveyNoteEdit").click(function () {
						editAble($(this));
						return false;
					});
				}
			});
		}

		var survey = {
			"RADIO": deleteRadioOption, // 删除单选题选项
			"CHECKBOX": deleteCheckboxOption, // 删除多选题选项
			"SCORE": deleteScoreOption, // 删除评分题选项
			"ORDERBY": deleteOrderquOption, //删除排序题选项
			"MULTIFILLBLANK": deleteMultiFillblankOption, // 删除多行天空题选项
			"CHENRADIO": deleteChenOption, // 删除矩阵题
			"CHENCHECKBOX": deleteChenOption, // 删除矩阵题
			"CHENFBK": deleteChenOption, // 删除矩阵题
			"CHENSCORE": deleteChenOption, // 删除矩阵题
			"SAVEQUS": saveQus,// 保存题目信息
			// 添加类型转换函数
			convertQuType: function (quType) {
				// 数字到字符串的映射
				var quTypeMap = {
					1: 'RADIO',
					2: 'CHECKBOX',
					3: 'FILLBLANK',
					4: 'MULTIFILLBLANK',
					8: 'SCORE',
					9: 'ORDERBY',
					11: 'CHENRADIO',
					12: 'CHENFBK',
					13: 'CHENCHECKBOX',
					16: 'PAGETAG',
					17: 'PARAGRAPH',
					18: 'CHENSCORE'
				};

				// 如果是数字或数字字符串，转换为对应的类型字符串
				if (!isNaN(quType)) {
					return quTypeMap[parseInt(quType)] || quType;
				}
				// 如果已经是字符串类型，直接返回
				return quType;
			}
		};
		layui.survey = survey;

		// 删除题目
		$("body").on("click", ".dwQuDelete", function () {
			var quBody = $(this).parents(".surveyQuItemBody");
			layer.confirm("确认要删除此题吗？", { icon: 3, title: '删除题目' }, function (index) {
				layer.close(index);
				var quId = quBody.find("input[name='quId']").val();
				if (!isNull(quId)) {
					quBody.data("deleteTag", true);
					quBody.hide("slow", function () {
						$(this).parent().remove();
						// 重置序号
						resetQuItem();
						// 重置左侧设计目录序号
						resetQuLeftItem();
					})

				} else {
					quBody.hide("slow", function () {
						$(this).parent().remove();
						// 重置序号
						resetQuItem();
						// 重置左侧设计目录序号
						resetQuLeftItem();
					});
				}
			});
			return false;
		});

		/**
		 * 删除矩陈单选题选项
		 */
		function deleteChenOption() {
			var optionParent = null;
			var quItemBody = $(curEditObj).parents(".surveyQuItemBody");

			// 判断是删除行还是列
			if ($(curEditObj).parents("td.quChenColumnTd")[0]) {
				// 删除列
				optionParent = $(curEditObj).parents("td.quChenColumnTd");
				var columnIndex = $(optionParent).index();
				var quCoChenTable = quItemBody.find("table.quCoChenTable");
				var columnCount = quCoChenTable.find("tr:first td").length;

				// 检查是否只剩最后一列（减1是因为第一列是标题列）
				if (columnCount <= 2) {
					winui.window.msg("至少需要保留一个选项", { icon: 2, time: 2000 });
					return;
				}

				// 记录要删除的选项ID
				var quOptionId = $(optionParent).find("input[name='quItemId']").val();
				if (quOptionId != "" && quOptionId != "0") {
					deleteColumnList.push(quOptionId);
				}

				// 删除该列所有单元格
				quCoChenTable.find("tr").each(function () {
					$(this).find("td").eq(columnIndex).remove();
				});

			} else {
				// 删除行
				optionParent = $(curEditObj).parents("tr.quChenRowTr");
				if (!optionParent.length) {
					optionParent = $(curEditObj).parents("tr");
				}

				var rowCount = quItemBody.find("table.quCoChenTable tr").length;

				// 检查是否只剩最后一行（减1是因为第一行是标题行）
				if (rowCount <= 2) {
					winui.window.msg("至少需要保留一个选项", { icon: 2, time: 2000 });
					return;
				}

				// 记录要删除的选项ID
				var quOptionId = $(optionParent).find("input[name='quItemId']").val();
				if (quOptionId != "" && quOptionId != "0") {
					deleteRowList.push(quOptionId);
				}

				// 直接从UI移除整行
				$(optionParent).remove();
			}
		}

		// 取消
		$("body").on("click", "#cancle", function () {
			parent.layer.close(index);
		});

		//保存
		$("body").on("click", "#saveBtn", function () {
			allSave();
		});

		function allSave() {
			curEditCallback();
			dwCommonDialogHide();
			resetQuItemHover(null);

			var surveyData = {
				id: loadPageJson.bean.id || "",
				belongId: parent.rowId,
				dwQuestionMation: [],
				surveyName: $("#dwSurveyName").text(),
				surveyNote: $("#dwSurveyNoteEdit").text(),
				surveyModel: loadPageJson.bean.surveyModel,
				dirType: loadPageJson.bean.dirType,
				rule: loadPageJson.bean.rule,
				answerNum: loadPageJson.bean.answerNum,
				effectiveTime: loadPageJson.bean.effectiveTime,
				endType: loadPageJson.bean.endType,
				whetherDelete: loadPageJson.bean.whetherDelete || 1,
			};
			// 调用 saveQus方法收集所有题目的参数
			saveQus(function (dwQuestionMation) {
				// 遍历题目，处理删除逻辑
				dwQuestionMation = dwQuestionMation.map(question => {
					if (question.deleteTag) {
						// 如果是删除的题目，移除 belongId
						delete question.belongId;
					}
					return question;
				});
				surveyData.dwQuestionMation = dwQuestionMation; // 将题目参数添加到试卷数据中
				surveyData.dwQuestionMation = JSON.stringify(surveyData.dwQuestionMation);
				surveyData.whetherDelete = 1;
				saveSurvey(surveyData); // 调用统一接口保存试卷
			});

		}

		/**
		 * 公共获取提交参数部分
		 */
		function getCommonParams(quItemBody) {
			var checkNameIn = getNameCheckIn(quItemBody);
			var whetherUpload = quItemBody.find("input[name='whetherUpload" + checkNameIn + "']:checked").val() || '2';

			// 获取题目标题
			var quTitle = '';
			if (quItemBody.find("input[name='quType']").val() == '16') {  // 如果是分页题目
				quTitle = '分页标记';  // 设置默认标题
			} else {
				quTitle = quItemBody.find(".quCoTitleEdit").html() || '';  // 如果其他题目没有标题，至少设置为空字符串
			}
			return {
				id: quItemBody.find("input[name='quId']").val(),
				belongId: parent.rowId,
				tag: svTag,
				hv: quItemBody.find("input[name='hv']").val(),
				randOrder: quItemBody.find("input[name='randOrder']").val(),
				cellCount: quItemBody.find("input[name='cellCount']").val(),
				isRequired: quItemBody.find("input[name='isRequired']").val(),
				// quTitle: encodeURI(quItemBody.find(".quCoTitleEdit").html()),
				quType: quItemBody.find("input[name='quType']").val(),
				quTitle: JSON.stringify(quTitle).slice(1, -1),
				orderById: quItemBody.find("input[name='orderById']").val(),
				whetherUpload: whetherUpload,
			};
		}

		/** 保存单选题 **/
		function saveRadio(quItemBody, callback) {
				var data = {
					contactsAttr: quItemBody.find("input[name='contactsAttr']").val(),
					contactsField: quItemBody.find("input[name='contactsField']").val(),
				};
				$.extend(data, getCommonParams(quItemBody));
				var quItemOptions = null;
				if (quItemBody.find("input[name='hv']").val() == 3) {
					//还有是table的情况需要处理
					quItemOptions = quItemBody.find(".quCoItem table.tableQuColItem tr td");
				} else {
					quItemOptions = quItemBody.find(".quCoItem li.quCoItemUlLi");
				}
				var radioTd = [];
				$.each(quItemOptions, function (i) {
					var quItemSaveTag = $(this).find(".quItemInputCase input[name='quItemSaveTag']").val();
					// if (quItemSaveTag == 0) {
						var s = {
							optionName: encodeURI($(this).find("label.quCoOptionEdit").html()),
							// optionValue: encodeURI($(this).find("label.quCoOptionEdit").html()),
							optionId: $(this).find(".quItemInputCase input[name='quItemId']").val(),
							isNote: $(this).find(".quItemInputCase input[name='isNote']").val(),
							checkType: $(this).find(".quItemInputCase input[name='checkType']").val(),
							isRequiredFill: $(this).find(".quItemInputCase input[name='isRequiredFill']").val(),
							orderById: i,
							quId: quItemBody.find("input[name='quId']").val()
						};
						if (callback) {
							s.optionId = $(this).find(".quItemInputCase input[name='quItemId']").val();
						}
						radioTd.push(s);
					// }
					//更新 字母 title标记到选项上.
					$(this).addClass("quOption_" + i);
				});
				data.radioTd = JSON.stringify(radioTd);
				return data;
		}

		//保存
		// $("body").on("click", "#saveBtn", function() {
		// 	curEditCallback();
		// 	dwCommonDialogHide();
		// 	resetQuItemHover(null);
		//
		// 	winui.window.msg('保存中', {icon: 1,time: 1000});
		//
		// 	// 调用writeDwDirectory接口保存问卷
		// 	AjaxPostUtil.request({
		// 		url: sysMainMation.surveyBasePath + "writeDwDirectory",
		// 		params: {
		// 			id: parent.rowId,
		// 			// content: JSON.stringify(getQuestionData()),
		// 			surveyName: loadPageJson.bean.surveyName,
		// 			surveyModel: loadPageJson.bean.surveyModel,
		// 			dirType: loadPageJson.bean.dirType,
		// 			rule: loadPageJson.bean.rule,
		// 			answerNum: loadPageJson.bean.answerNum,
		// 			effectiveTime: loadPageJson.bean.effectiveTime,
		// 			endType: loadPageJson.bean.endType,
		// 			whetherDelete: loadPageJson.bean.whetherDelete
		// 		},
		// 		type: 'json',
		// 		callback: function(json) {
		// 			if(json.returnCode == 0) {
		// 				winui.window.msg("保存成功", {icon: 1,time: 2000});
		// 				saveSurvey(function(){
		// 					isSaveProgress = false;
		// 				});
		// 			} else {
		// 				winui.window.msg(json.returnMessage, {icon: 2,time: 2000});
		// 			}
		// 		}
		// 	});
		// });
		//
		// 获取问卷数据
		// function getQuestionData() {
		// 	var questions = [];
		// 	$("#dwSurveyQuContentAppUl .li_surveyQuItemBody").each(function() {
		// 		var $this = $(this);
		// 		var question = {
		// 			quId: $this.find("input[name='quId']").val(),
		// 			quType: $this.find("input[name='quType']").val(),
		// 			quTitle: $this.find(".quCoTitleEdit").html(),
		// 			orderById: $this.find("input[name='orderById']").val()
		// 		};
		// 		questions.push(question);
		// 	});
		// 	return questions;
		// }

		function saveSurvey(surveyData) {
			AjaxPostUtil.request({
				url: sysMainMation.surveyBasePath + "writeDwDirectory", // 统一接口
				params: surveyData,
				type: 'json',
				callback: function (json) {
					if (json.bean) {
						winui.window.msg("保存成功", { icon: 1, time: 2000 });
					} else {
						winui.window.msg("保存失败：" + json.message, { icon: 2, time: 2000 });
					}
				}
			});
		}

		/**
		 * 保存标记说明
		 * saveTag  标记本题有无变动
		 * quTitleSaveTag  标记题标题变动
		 * quItemSaveTag 标记题选项变动
		 * 0=表示有变动，未保存
		 * 1=表示已经保存同步
		 */
		function saveQus(callback) {
			var dwQuestionMation = [];

			//定义题型映射
			var quTypeMap = {
				// 数字到字符串的映射
				1: 'RADIO',
				2: 'CHECKBOX',
				3: 'FILLBLANK',
				4: 'MULTIFILLBLANK',
				8: 'SCORE',
				9: 'ORDERBY',
				11: 'CHENRADIO',
				12: 'CHENFBK',
				13: 'CHENCHECKBOX',
				16: 'PAGETAG',
				18: 'CHENSCORE',
				// 字符串到数字的映射
				'RADIO': 1,
				'CHECKBOX': 2,
				'FILLBLANK': 3,
				'MULTIFILLBLANK': 4,
				'SCORE': 8,
				'ORDERBY': 9,
				'CHENRADIO': 11,
				'CHENFBK': 12,
				'CHENCHECKBOX': 13,
				'PAGETAG': 16,
				'CHENSCORE': 18
			};

			// 遍历所有题目
			$("#dwSurveyQuContent .surveyQuItemBody").each(function () {
				var quItemBody = $(this);
				var quType = quItemBody.find("input[name='quType']").val();

				// 统一处理 quType
				var quTypeStr, quTypeNum;

				if (!isNaN(parseInt(quType))) {
					// 如果 quType 是数字字符串，转换为数字
					quTypeNum = parseInt(quType);
					quTypeStr = quTypeMap[quTypeNum]; // 根据数字获取对应的题型字符串
				} else if (quTypeMap[quType]) {
					// 如果 quType 是字符串形式的题型名称（如 "RADIO"），转换为数字
					quTypeStr = quType;
					quTypeNum = quTypeMap[quType]; // 根据字符串获取对应的数字
				} else {
					winui.window.msg("未知题型：" + quType, { icon: 2, time: 2000 });
				}
				var quId = quItemBody.find("input[name='quId']").val(); // 获取题目 ID
				// 判断是新增还是编辑
				var callback = !isNull(quId); // 如果 quId 存在，则是编辑；否则是新增

				// 根据题型调用对应的保存方法
				var questionData;
				switch (quTypeStr) {
					case 'RADIO':
						questionData = saveRadio(quItemBody, callback);
						break;
					case 'CHECKBOX':
						questionData = saveCheckbox(quItemBody, callback);
						break;
					case 'FILLBLANK':
						questionData = saveFillblank(quItemBody, callback);
						break;
					case 'SCORE':
						questionData = saveScore(quItemBody, callback);
						break;
					case 'ORDERBY':
						questionData = saveOrderqu(quItemBody, callback);
						break;
					case 'MULTIFILLBLANK':
						questionData = saveMultiFillblank(quItemBody, callback);
						break;
					case 'CHENRADIO':
					case 'CHENCHECKBOX':
					case 'CHENFBK':
					case 'CHENSCORE':
						questionData = saveChen(quItemBody, callback);
						break;
					case 'PAGETAG':
						questionData = savePagetag(quItemBody, callback);
						break;
					default:
						winui.window.msg("未知题型：" + quTypeStr, { icon: 2, time: 2000 });
						return;
				}

				// 将转换后的 quType 添加到 questionData
				questionData.quType = quTypeNum;
				// 将题目参数对象添加到 dwQuestionMation 数组
				dwQuestionMation.push(questionData);
			});

			// 调用回调函数
			if (typeof callback === "function") {
				callback(dwQuestionMation);
			}
		}

		/**
		 * 删除单选题选项
		 */
		function deleteRadioOption() {
			console.log("删除单选题选项");
			//判断是否是table类型
			var quItemBody = $(curEditObj).parents(".surveyQuItemBody");
			var hv = quItemBody.find("input[name='hv']").val();
			var optionParent = null;
			if (hv == 3) {
				optionParent = $(curEditObj).parents("td");
				if (quItemBody.find(".quCoItem td").length <= 1) {
					winui.window.msg('至少需要保留一个选项', {icon: 2, time: 2000});
					return false;
				}
			}else {
				optionParent = $(curEditObj).parents("li.quCoItemUlLi");
				if (quItemBody.find(".quCoItem li.quCoItemUlLi").length <= 1) {
					winui.window.msg('至少需要保留一个选项', {icon: 2, time: 2000});
					return false;
				}
			}
			var quOptionId = $(optionParent).find("input[name='quItemId']").val();
			if (quOptionId != "" && quOptionId != "0") {
				$(optionParent).remove();
			} else {
				delQuOptionCallBack(optionParent);
			}

		}


		/** 保存多选题 **/
		function saveCheckbox(quItemBody, callback) {
				var data = {
					contactsAttr: quItemBody.find("input[name='contactsAttr']").val(),
					contactsField: quItemBody.find("input[name='contactsField']").val()
				};
				$.extend(data, getCommonParams(quItemBody));
				var quItemOptions = null;
				if (data.hv == 3) {
					//还有是table的情况需要处理
					quItemOptions = quItemBody.find(".quCoItem table.tableQuColItem tr td");
				} else {
					quItemOptions = quItemBody.find(".quCoItem li.quCoItemUlLi");
				}
				var checkboxTd = [];
				$.each(quItemOptions, function (i) {
					var quItemSaveTag = $(this).find(".quItemInputCase input[name='quItemSaveTag']").val();
					// if (quItemSaveTag == 0) {
						var s = {
							optionName: encodeURI($(this).find("label.quCoOptionEdit").html()),
							optionId: $(this).find(".quItemInputCase input[name='quItemId']").val(),
							isNote: $(this).find(".quItemInputCase input[name='isNote']").val(),
							checkType: $(this).find(".quItemInputCase input[name='checkType']").val(),
							isRequiredFill: $(this).find(".quItemInputCase input[name='isRequiredFill']").val(),
							orderById: i,
							quId: quItemBody.find("input[name='quId']").val()
						};
						// 如果是编辑，传入 optionId
						if (callback) {
							s.optionId = $(this).find(".quItemInputCase input[name='quItemId']").val();
						}
						checkboxTd.push(s);
					// }
					//更新 字母 title标记到选项上.
					$(this).addClass("quOption_" + i);
				});
				data.checkboxTd = JSON.stringify(checkboxTd);

				return data;
		}

		/**
		 * 删除多选题选项
		 */
		function deleteCheckboxOption() {
			//判断是否是table类型
			var quItemBody = $(curEditObj).parents(".surveyQuItemBody");
			var hv = quItemBody.find("input[name='hv']").val();
			var optionParent = null;
			if(hv == 3) {
				optionParent = $(curEditObj).parents("td");
				if (quItemBody.find(".quCoItem td").length <= 1) {
					winui.window.msg('至少需要保留一个选项', { icon: 2, time: 2000 });
					return false;
				}
			} else {
				optionParent = $(curEditObj).parents("li.quCoItemUlLi");
				if (quItemBody.find(".quCoItem li.quCoItemUlLi").length <= 1) {
					winui.window.msg('至少需要保留一个选项', { icon: 2, time: 2000 });
					return false;
				}
			}
			var quOptionId = $(optionParent).find("input[name='quItemId']").val();
			if(quOptionId != "" && quOptionId != "0") {
				AjaxPostUtil.request({url: sysMainMation.surveyBasePath + "dwsurveydirectory019", params: {quItemId: quOptionId}, type: 'json', callback: function (json) {
						delQuOptionCallBack(optionParent);
					}});
			} else {
				delQuOptionCallBack(optionParent);
			}
		}

		function delQuOptionCallBack(optionParent) {
			var quItemBody = $(optionParent).parents(".surveyQuItemBody");
			var quType = quItemBody.find("input[name='quType']").val();
			if (quType == "CHECKBOX" || quType == "RADIO") {
				var hv = quItemBody.find("input[name='hv']").val();
				if (hv == 3) {
					//emptyTd
					var optionTr = $(optionParent).parents("tr");
					var optionNextTr = optionTr.next();
					if (optionNextTr[0]) {
						//则后面还有是中间选项，则删除，再依次后面的td往前移动
						$(optionParent).remove();
						moveTabelTd(optionNextTr);
					} else {
						//非中间选项，删除-再添加一个空td
						$(optionParent).remove();
						movePareseLastTr(optionTr);
					}
				} else {
					optionParent.remove();
				}
			} else if (quType == "CHENRADIO" || quType == "CHENCHECKBOX" || quType == "CHENFBK" || quType == "CHENSCORE") {
				var quCoChenTable = optionParent.parents("table.quCoChenTable");
				var optionParentClass = optionParent.attr("class");
				if (optionParentClass.indexOf("Column") >= 0) {
					var removeTrs = quCoChenTable.find("tr:gt(0)");
					$.each(removeTrs, function () {
						$(this).find("td:last").remove();
					});
					optionParent.remove();
				} else {
					optionParent.parent().remove();
				}
			} else {
				optionParent.remove();
			}
			dwCommonEditHide();
			bindQuHoverItem();
		}

		function moveTabelTd(nextTr) {
			if (nextTr[0]) {
				var prevTr = nextTr.prev();
				var nextTds = nextTr.find("td");
				$(nextTds.get(0)).appendTo(prevTr);
				//判断当前next是否是最后一个，是则：判断如果没有选项，则删除tr,如果有选项，则填一个空td
				var nextNextTr = nextTr.next();
				if (!nextNextTr[0]) {
					movePareseLastTr(nextTr);
				}
				moveTabelTd($(nextTr).next());
			}
		}

		function movePareseLastTr(nextTr) {
			var editAbles = nextTr.find(".editAble");
			if (editAbles[0]) {
				//有选项，则补充一个空td
				var editAbleTd = editAbles.parents("td");
				editAbleTd.clone().prependTo(nextTr);
				nextTr.find("td").last().html("<div class='emptyTd'></div>");
			} else {
				nextTr.remove();
			}
		}

		/** 保存填空题 **/
		function saveFillblank(quItemBody, callback) {
				var data = {
					answerInputWidth: quItemBody.find("input[name='answerInputWidth']").val(),
					answerInputRow: quItemBody.find("input[name='answerInputRow']").val(),
					contactsAttr: quItemBody.find("input[name='contactsAttr']").val(),
					contactsField: quItemBody.find("input[name='contactsField']").val(),
					checkType: quItemBody.find("input[name='checkType']").val()
				};
				$.extend(data, getCommonParams(quItemBody));
				return data;
		}

		/** 保存评分题 **/
		function saveScore(quItemBody, callback) {
				var data = {
					paramInt01: quItemBody.find("input[name='paramInt01']").val(),
					paramInt02: quItemBody.find("input[name='paramInt02']").val()
				};
				$.extend(data, getCommonParams(quItemBody));
				//评分题选项td
				var quItemOptions = quItemBody.find(".quCoItem table.quCoItemTable tr td.quOptionEditTd");
				var scoreTd = [];
				$.each(quItemOptions, function (i) {
					var quItemSaveTag = $(this).find(".quItemInputCase input[name='quItemSaveTag']").val();
					// if (quItemSaveTag == 0) {
						var s = {
							optionName: encodeURI($(this).find("label.quCoOptionEdit").html()),
							optionId: $(this).find(".quItemInputCase input[name='quItemId']").val(),
							orderById: i,
							quId: quItemBody.find("input[name='quId']").val()
						};
						scoreTd.push(s);
					// }
					//更新 字母 title标记到选项上.
					$(this).addClass("quOption_" + i);
				});
				data.scoreTd = JSON.stringify(scoreTd);
				return data;
		}

		/**
		 * 删除评分Score选项
		 */
		function deleteScoreOption() {
			var optionParent = null;
			optionParent = $(curEditObj).parents("tr.quScoreOptionTr");
			var quOptionId = $(optionParent).find("input[name='quItemId']").val();
			// 检查是否只剩最后一个选项
			var quItemBody = $(optionParent).parents(".surveyQuItemBody");
			var scoreOptions = quItemBody.find("tr.quScoreOptionTr");
			if (scoreOptions.length <= 1) {
				layer.msg("至少需要保留一个选项", { icon: 2, time: 2000 });
				return;
			}
			// 记录要删除的选项ID
			if(quOptionId != "" && quOptionId != "0") {
				deleteRowList.push(quOptionId);
			} else {
				delQuOptionCallBack(optionParent);
			}
			// 直接从UI移除
			$(optionParent).remove();
		}

		/** 保存排序题 **/
		function saveOrderqu(quItemBody, callback) {
				var data = {};
				$.extend(data, getCommonParams(quItemBody));
				//评分题选项td
				var quItemOptions = quItemBody.find(".quCoItem .quOrderByLeft  li.quCoItemUlLi");
				var orderByTd = [];
				$.each(quItemOptions, function (i) {
					var quItemSaveTag = $(this).find(".quItemInputCase input[name='quItemSaveTag']").val();
					// if (quItemSaveTag == 0) {
						var s = {
							optionName: encodeURI($(this).find("label.quCoOptionEdit").html()),
							optionId: $(this).find(".quItemInputCase input[name='quItemId']").val(),
							orderById: i,
							quId: quItemBody.find("input[name='quId']").val()
						};
						orderByTd.push(s);
					// }
					$(this).addClass("quOption_" + i);
				});
				data.orderByTd = JSON.stringify(orderByTd);
				return data;
		}

		/**
		 * 删除排序选项
		 */
		function deleteOrderquOption() {
			var optionParent = null;
			optionParent = $(curEditObj).parents("li.quCoItemUlLi");
			var quItemBody = $(curEditObj).parents(".surveyQuItemBody");
			var rmQuOrderTableTr = quItemBody.find(".quOrderByRight table.quOrderByTable tr:last");
			var quOptionId = $(optionParent).find("input[name='quItemId']").val();
			// 检查是否只剩最后一个选项
			var quItemBody = $(optionParent).parents(".surveyQuItemBody");
			var orderOptions = quItemBody.find("li.quCoItemUlLi");
			if (orderOptions.length <= 1) {
				layer.msg("至少需要保留一个选项", { icon: 2, time: 2000 });
				return;
			}
			if(quOptionId != "" && quOptionId != "0") {
				deleteRowList.push(quOptionId);
			}
			// else {
			// 	delQuOptionCallBack(optionParent);
			// 	rmQuOrderTableTr.remove();
			// }

			// 同时删除右侧序号表格中对应的行
			var orderTableTr = quItemBody.find(".quOrderByRight table.quOrderByTable tr").eq($(optionParent).index());
			$(orderTableTr).remove();

			// 直接从UI移除
			$(optionParent).remove();

			// 重新排序右侧序号
			var quOrderByTable = quItemBody.find(".quOrderByRight table.quOrderByTable");
			refquOrderTableTdNum(quOrderByTable);
		}
		/** 保存分页标记 **/
		function savePagetag(quItemBody, callback) {
				var data = {};
				$.extend(data, getCommonParams(quItemBody));
				return data;
		}

		/** 保存段落题 **/
		function saveParagraph(quItemBody, callback) {
				var data = {};
				$.extend(data, getCommonParams(quItemBody));
				return data;
			}


		/** 保存多项填空题 **/
		function saveMultiFillblank(quItemBody, callback) {
				var data = {
					paramInt01: quItemBody.find("input[name='paramInt01']").val(),
					paramInt02: quItemBody.find("input[name='paramInt02']").val()
				};
				$.extend(data, getCommonParams(quItemBody));
				//评分题选项td
				var quItemOptions = quItemBody.find(".quCoItem table.mFillblankTable tr td.mFillblankTableEditTd");
				var multifillblankTd = [];
				$.each(quItemOptions, function (i) {
					var quItemSaveTag = $(this).find(".quItemInputCase input[name='quItemSaveTag']").val();
					// if (quItemSaveTag == 0) {
						var s = {
							optionName: encodeURI($(this).find("label.quCoOptionEdit").html()),
							optionId: $(this).find(".quItemInputCase input[name='quItemId']").val(),
							orderById: i,
							quId: quItemBody.find("input[name='quId']").val()
						};
						multifillblankTd.push(s);
					// }
					//更新 字母 title标记到选项上.
					$(this).addClass("quOption_" + i);
				});
				data.multifillblankTd = JSON.stringify(multifillblankTd);
				return data;
		}

		/**
		 * 删除多项填空题选项
		 */
		function deleteMultiFillblankOption() {
			var optionParent = null;
			optionParent = $(curEditObj).parents("tr.mFillblankTableTr");
			var quOptionId = $(optionParent).find("input[name='quItemId']").val();
			// 检查是否只剩最后一个选项
			var quItemBody = $(optionParent).parents(".surveyQuItemBody");
			var fillblankOptions = quItemBody.find("tr.mFillblankTableTr");
			if (fillblankOptions.length <= 1) {
				layer.msg("至少需要保留一个选项", { icon: 2, time: 2000 });
				return;
			}
			if(quOptionId != "" && quOptionId != "0") {
				deleteRowList.push(quOptionId);
			} else {
				delQuOptionCallBack(optionParent);
			}
			// 直接从UI移除
			$(optionParent).remove();
		}


		/** 保存矩阵题 **/
		function saveChen(quItemBody, callback) {
				var data = {
					quType: quItemBody.find("input[name='quType']").val()
				};
				$.extend(data, getCommonParams(quItemBody));
				//矩阵列选项td
				var quColumnOptions = quItemBody.find(".quCoItem table.quCoChenTable tr td.quChenColumnTd");
				var columnTd = [];
				$.each(quColumnOptions, function (i) {
					var quItemSaveTag = $(this).find(".quItemInputCase input[name='quItemSaveTag']").val();
					if (quItemSaveTag == 0) {
						var s = {
							optionName: encodeURI($(this).find("label.quCoOptionEdit").html()),
							optionId: $(this).find(".quItemInputCase input[name='quItemId']").val(),
							orderBy: i,
							visibility: 1,
							quId: quItemBody.find("input[name='quId']").val(),
						};
						columnTd.push(s);
					}
					//更新 字母 title标记到选项上.
					$(this).addClass("quColumnOption_" + i);
				});
				data.columnTd = JSON.stringify(columnTd);
				//矩阵行选项td
				var quColumnOptions = quItemBody.find(".quCoItem table.quCoChenTable tr td.quChenRowTd");
				var rowTd = [];
				$.each(quColumnOptions, function (i) {
					var quItemSaveTag = $(this).find(".quItemInputCase input[name='quItemSaveTag']").val();
					if (quItemSaveTag == 0) {
						var s = {
							optionName: encodeURI($(this).find("label.quCoOptionEdit").html()),
							optionId: $(this).find(".quItemInputCase input[name='quItemId']").val(),
							orderBy: i,
							visibility: 1,
							quId: quItemBody.find("input[name='quId']").val(),
						};
						// 如果是编辑，传入 optionId
						if (callback) {
							s.optionId = $(this).find(".quItemInputCase input[name='quItemId']").val();
						}
						rowTd.push(s);
					}
					//更新 字母 title标记到选项上.
					$(this).addClass("quRowOption_" + i);
				});
				data.rowTd = JSON.stringify(rowTd);
				return data;
		}
	});
})