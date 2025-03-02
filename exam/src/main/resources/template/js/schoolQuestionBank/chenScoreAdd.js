layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'fileUpload'], function (exports) {
    winui.renderColor();
    layui.use(['form'], function (form) {
        var index = parent.layer.getFrameIndex(window.name);
        var $ = layui.$,
            form = layui.form,
            element = layui.element;
        // tab当前下标
        var tabIndex = 0;
        var fileUrl = "";
        // 知识点选择必备参数
        var schoolKnowledgeCheckType = 2;// 知识点选择类型：1.单选schoolKnowledgeMation；2.多选schoolKnowledgeMationList
        var schoolKnowledgeMationList = new Array();

        // 要删除的行id
        var deleteRowList = new Array();
        var deleteColumnList = new Array();


        // 获取当前登陆用户所属的学校列表
        schoolUtil.queryMyBelongSchoolList(function (json) {
            $("#schoolId").html(getDataUseHandlebars(getFileContent('tpl/template/select-option-must.tpl'), json));
            form.render("select");
            loadData();
        });
        // 学校监听事件
        form.on('select(schoolId)', function (data) {
            if (isNull(data.value) || data.value === '请选择') {
                $("#schoolId").html("");
                form.render('select');
            } else {
                // 加载院系
                initFaculty();
            }
        });

        // 初始化院系
        function initFaculty() {
            showGrid({
                id: "facultyId",
                url: schoolBasePath + "queryFacultyListBySchoolId",
                params: {schoolId: $("#schoolId").val()},
                method: "GET",
                pagination: false,
                template: getFileContent('tpl/template/select-option.tpl'),
                ajaxSendLoadBefore: function (hdb) {
                },
                ajaxSendAfter: function (json) {
                    form.render('select');
                }
            });
        }

        // 院系监听事件
        form.on('select(facultyId)', function (data) {
            if (isNull(data.value) || data.value === '请选择') {
                $("#facultyId").html("");
                form.render('select');
            } else {
                // 加载专业
                initMajor();
            }
        });

        // 初始化专业
        function initMajor() {
            showGrid({
                id: "majorId",
                url: schoolBasePath + "queryMajorListByFacultyId",
                method: "GET",
                params: {facultyId: $("#facultyId").val()},
                pagination: false,
                template: getFileContent('tpl/template/select-option.tpl'),
                ajaxSendLoadBefore: function (hdb) {
                },
                ajaxSendAfter: function (json) {
                    form.render('select');
                }
            });
        }

        // 专业监听事件
        form.on('select(majorId)', function (data) {
            if (isNull(data.value) || data.value === '请选择') {
                $("#majorId").html("");
                form.render('select');
            } else {
                // 加载科目
                initSubject();
            }
        });

        // 初始化科目
        function initSubject() {
            showGrid({
                id: "subjectId",
                url: schoolBasePath + "querySubjectListByMajorId",
                params: {majorId: $("#majorId").val()},
                method: "GET",
                pagination: false,
                template: getFileContent('tpl/template/select-option.tpl'),
                ajaxSendLoadBefore: function (hdb) {
                },
                ajaxSendAfter: function (json) {
                    form.render('select');
                }
            });
        }

        function loadData() {
            // 如果问题id不为空，则说明是编辑，加载编辑信息
            if (!isNull(parent.rowId)) {
                AjaxPostUtil.request({
                    url: schoolBasePath + "selectQuestionById",
                    params: {ids: parent.rowId},
                    type: 'json',
                    method: 'post',
                    callback: function (json) {
                        $("#schoolId").val(json.rows[0].schoolId);
                        //院系
                        showGrid({
                            id: "facultyId",
                            url: schoolBasePath + "queryFacultyListBySchoolId",
                            method: 'GET',
                            params: {schoolId: $("#schoolId").val()},
                            pagination: false,
                            template: getFileContent('tpl/template/select-option.tpl'),
                            ajaxSendLoadBefore: function (hdb) {
                            },
                            ajaxSendAfter: function (data) {
                                $("#facultyId").val(json.rows[0].facultyId);
                                //专业
                                showGrid({
                                    id: "majorId",
                                    url: schoolBasePath + "queryMajorListByFacultyId",
                                    method: 'GET',
                                    params: {facultyId: $("#facultyId").val()},
                                    pagination: false,
                                    template: getFileContent('tpl/template/select-option.tpl'),
                                    ajaxSendLoadBefore: function (hdb) {
                                    },
                                    ajaxSendAfter: function (data) {
                                        $("#majorId").val(json.rows[0].majorId);
                                        //科目
                                        showGrid({
                                            id: "subjectId",
                                            url: schoolBasePath + "querySubjectListByMajorId",
                                            method: 'GET',
                                            params: {majorId: $("#majorId").val()},
                                            pagination: false,
                                            template: getFileContent('tpl/template/select-option.tpl'),
                                            ajaxSendLoadBefore: function (hdb) {
                                            },
                                            ajaxSendAfter: function (data) {
                                                $("#subjectId").val(json.rows[0].subjectId);
                                                form.render();
                                            }
                                        })
                                    }
                                });
                            }
                        });
                        $("input:radio[name=type][value=" + json.rows[0].type + "]").attr("checked", true);
                        $("#fraction").val(json.rows[0].fraction);
                        $("#quTitle").val(json.rows[0].quTitle);

                        // 知识点赋值
                        schoolKnowledgeMationList = [].concat(json.rows[0].knowledgeList || []);
                        var str = '<div class="knowledge-tags-container" style="display: inline-flex; flex-wrap: wrap; margin-top: 5px;">';
                        $.each(schoolKnowledgeMationList, function (i, item) {
                            // 使用name字段或title字段显示知识点名称
                            var displayName = item.name;
                            str += '<span class="layui-badge layui-bg-blue" style="height: 25px !important; line-height: 25px !important; margin: 5px 5px 0 0;">' + displayName + '</span>';
                        });
                        str += '</div>';
                        $("#schoolKnowledgeChoose").parent().html('<button type="button" class="layui-btn layui-btn-primary layui-btn-xs" id="schoolKnowledgeChoose">知识点选择</button>' + str);

                        // 解析列和行数据
                        var questionChenColumn = [];
                        var questionChenRow = [];

                        try {
                            if (json.rows[0].columnTd && typeof json.rows[0].columnTd === 'string') {
                                questionChenColumn = JSON.parse(decodeURIComponent(json.rows[0].columnTd));
                            } else if (Array.isArray(json.rows[0].columnTd)) {
                                questionChenColumn = json.rows[0].columnTd;
                            }

                            if (json.rows[0].rowTd && typeof json.rows[0].rowTd === 'string') {
                                questionChenRow = JSON.parse(decodeURIComponent(json.rows[0].rowTd));
                            } else if (Array.isArray(json.rows[0].rowTd)) {
                                questionChenRow = json.rows[0].rowTd;
                            }
                        } catch (e) {
                            console.error('解析选项数据失败:', e);
                        }

                        // 题目信息赋值
                        $(".surveyQuItemBody").html(getDataUseHandlebars($("#template").html(),
                            {
                                bean: json.rows[0],
                                questionChenColumn: questionChenColumn,
                                questionChenRow: questionChenRow
                            }
                        ));

                        // 设置tab
                        tabIndex = json.rows[0].fileType;
                        fileUrl = json.rows[0].fileUrl;
                        $('.layui-tab-title li').eq(tabIndex).addClass('layui-this').siblings().removeClass('layui-this');
                        $('.layui-tab-item').eq(tabIndex).addClass('layui-show').siblings().removeClass('layui-show');

                        // 设置是否允许拍照/上传图片选中
                        $("input:radio[name=whetherUpload][value=" + json.rows[0].whetherUpload + "]").attr("checked", true);

                        form.render();

                        // 在渲染模板后，手动构建表格
                        setTimeout(function () {
                            // 获取表格元素
                            var table = $(".surveyQuItemBody").find("table.quCoChenTable");
                            if (table.length === 0) {
                                console.error("找不到表格元素");
                                return;
                            }

                            // 清空表格
                            table.empty();

                            // 创建表头行
                            var headerRow = $("<tr></tr>");
                            headerRow.append("<td></td>"); // 左上角空单元格

                            // 添加列标题
                            $.each(questionChenColumn, function (i, column) {
                                var td = $("<td class='quChenColumnTd'></td>");
                                td.append("<label class='editAble quCoOptionEdit'>" + column.optionName + "</label>");
                                td.append("<div class='quItemInputCase'><input type='hidden' name='quItemId' value='" + column.id + "'></div>");
                                headerRow.append(td);
                            });

                            // 添加表头行到表格
                            table.append(headerRow);

                            // 添加数据行
                            $.each(questionChenRow, function (rowIndex, row) {
                                var tr = $("<tr class='quChenRowTr'></tr>");

                                // 添加行标题
                                var rowTd = $("<td class='quChenRowTd'></td>");
                                rowTd.append("<label class='editAble quCoOptionEdit'>" + row.optionName + "</label>");
                                rowTd.append("<div class='quItemInputCase'><input type='hidden' name='quItemId' value='" + row.id + "'></div>");
                                tr.append(rowTd);

                                // 添加单元格
                                $.each(questionChenColumn, function (colIndex, column) {
                                    var td = $("<td></td>");
                                    var select = $("<select class='quChenScoreSelect'></select>");
                                    select.append("<option value='0'>-评分-</option>");
                                    select.append("<option value='1'>1分</option>");
                                    select.append("<option value='2'>2分</option>");
                                    select.append("<option value='3'>3分</option>");
                                    select.append("<option value='4'>4分</option>");
                                    select.append("<option value='5'>5分</option>");
                                    td.append(select);
                                    tr.append(td);
                                });

                                // 添加行到表格
                                table.append(tr);
                            });

                            // 设置答案
                            var isDefaultAnswer = isJsonFormat(json.rows[0].isDefaultAnswer) ? JSON.parse(json.rows[0].isDefaultAnswer) : [];
                            var selects = $(".surveyQuItemBody").find("select.quChenScoreSelect");

                            $.each(isDefaultAnswer, function (i, answer) {
                                var rowIndex = answer.x - 1;
                                var colIndex = answer.y - 1;
                                var selectIndex = rowIndex * questionChenColumn.length + colIndex;

                                if (selectIndex < selects.length) {
                                    $(selects[selectIndex]).val(answer.value);
                                }
                            });

                            // 刷新表单
                            form.render('select');
                        }, 200);

                        // 加载上传和切换监听事件
                        pageLoadAfter();

                        // 处理知识点数据回显
                        if (json.rows[0].knowledgePointsMation && json.rows[0].knowledgePointsMation.length > 0) {
                            schoolKnowledgeMationList = [];
                            $.each(json.rows[0].knowledgePointsMation, function (i, item) {
                                schoolKnowledgeMationList.push({
                                    id: item.id,
                                    name: item.name
                                });
                            });

                            // 更新知识点显示
                            var knowledgeStr = '<div class="knowledge-tags-container" style="display: inline-flex; flex-wrap: wrap; margin-top: 5px;">';
                            $.each(schoolKnowledgeMationList, function (i, item) {
                                knowledgeStr += '<span class="layui-badge layui-bg-blue" style="height: 25px !important; line-height: 25px !important; margin: 5px 5px 0 0;">' + item.name + '</span>';
                            });
                            knowledgeStr += '</div>';
                            $("#schoolKnowledgeChoose").parent().html('<button type="button" class="layui-btn layui-btn-primary layui-btn-xs" id="schoolKnowledgeChoose">知识点选择</button>' + knowledgeStr);
                        }
                    }
                });
            } else {
                // 加载院系
                initFaculty();
                // 加载专业
                initMajor();
                // 题目信息赋值
                $(".surveyQuItemBody").html($("#noDataTemplate").html());
                // 加载上传和切换监听事件
                pageLoadAfter();
            }
        }


        matchingLanguage();
        form.render();
        form.on('submit(formAddBean)', function (data) {
            if (winui.verifyForm(data.elem)) {
                var quItemBody = $(".surveyQuItemBody");

                if (tabIndex != 0) {
                    // 1-视频,2-音频,3-图片
                    fileUrl = quItemBody.find(".layui-tab-content").find(".layui-show").find(".upload").find("input[type='hidden'][name='upload']").attr("oldurl");
                    if (isNull(fileUrl)) {
                        winui.window.msg('请上传文件.', {icon: 2, time: 2000});
                        return false;
                    }
                } else {
                    fileUrl = "";
                }
                var params = {
                    id: quItemBody.find("input[name='quId']").val(),
                    hv: quItemBody.find("input[name='hv']").val(),
                    // quType: quItemBody.find("input[name='quType']").val(),
                    randOrder: quItemBody.find("input[name='randOrder']").val(),
                    cellCount: quItemBody.find("input[name='cellCount']").val(),
                    quTitle: encodeURI(quItemBody.find(".quCoTitleEdit").html()),
                    fraction: $("#fraction").val(),
                    schoolId: $("#schoolId").val(),
                    facultyId: $("#facultyId").val(),
                    majorId: $("#majorId").val(),
                    subjectId: $("#subjectId").val(),
                    visibility: 1,
                    tag: 1,
                    type: $("input[name='type']:checked").val(),
                    schoolKnowledgeMationList: JSON.stringify(schoolKnowledgeMationList),
                    knowledgeIds: "", // 默认为空字符串
                    deleteRowList: JSON.stringify(deleteRowList),
                    deleteColumnList: JSON.stringify(deleteColumnList),
                    fileUrl: fileUrl,
                    fileType: tabIndex,
                    whetherUpload: data.field.whetherUpload,
                    quType: 18
                };

                // 处理知识点ID，将知识点ID数组转换为逗号分隔的字符串
                if (schoolKnowledgeMationList && schoolKnowledgeMationList.length > 0) {
                    var knowledgeIds = [];
                    $.each(schoolKnowledgeMationList, function (i, item) {
                        knowledgeIds.push(item.id);
                    });
                    params.knowledgeIds = knowledgeIds.join(',');
                }

                // 矩阵列选项td
                var quColumnOptions = quItemBody.find(".quCoItem table.quCoChenTable tr td.quChenColumnTd");
                var column = [];
                $.each(quColumnOptions, function (i) {
                    var s = {
                        optionName: encodeURI($(this).find("label.quCoOptionEdit").html()),
                        key: i
                    };
                    column.push(s);
                });
                params.columnTd = JSON.stringify(column);
                // 矩阵行选项td
                var quRowOptions = quItemBody.find(".quCoItem table.quCoChenTable tr td.quChenRowTd");
                var row = [];
                $.each(quRowOptions, function (i) {
                    var s = {
                        optionName: encodeURI($(this).find("label.quCoOptionEdit").html()),
                        key: i
                    };
                    row.push(s);
                });
                params.rowTd = JSON.stringify(row);
                if (quColumnOptions.length == 0 || quRowOptions.length == 0) {
                    winui.window.msg('选项不能为空', {icon: 2, time: 2000});
                    return false;
                }

                // 答案
                var answer = quItemBody.find(".quCoItem table.quCoChenTable tr select.quChenScoreSelect");
                var isDefaultAnswer = new Array();
                var columuLength = quColumnOptions.length;
                var xIndex = 0;
                var yIndex = 1;
                $.each(answer, function (i) {
                    if (i % columuLength == 0) {
                        xIndex++;
                        yIndex = 1;
                    } else {
                        yIndex++;
                    }
                    // if($(this).prop("checked")){
                    var s = {
                        x: xIndex,
                        y: yIndex,
                        value: $(this).val()
                    };
                    isDefaultAnswer.push(s);
                    // }

                });
                params.isDefaultAnswer = JSON.stringify(isDefaultAnswer);

                AjaxPostUtil.request({
                    url: schoolBasePath + "writeQuestion", params: params, type: 'json', callback: function (json) {
                        parent.layer.close(index);
                        parent.refreshCode = '0';
                    }
                });
            }
            return false;
        });

        function pageLoadAfter() {
            // 初始化视频上传
            $(".questionVedio").upload({
                "action": reqBasePath + "common003",
                "data-num": "1",
                "data-type": vedioType,
                "uploadType": 16,
                "data-value": (tabIndex == 1 && !isNull(fileUrl)) ? fileUrl : "",
                "function": function (_this, data) {
                    show(_this, data);
                }
            });

            // 初始化音频上传
            $(".questionAudio").upload({
                "action": reqBasePath + "common003",
                "data-num": "1",
                "data-type": audioType,
                "uploadType": 16,
                "data-value": (tabIndex == 2 && !isNull(fileUrl)) ? fileUrl : "",
                "function": function (_this, data) {
                    show(_this, data);
                }
            });

            // 初始化图片上传
            $(".questionPicture").upload({
                "action": reqBasePath + "common003",
                "data-num": "1",
                "data-type": imageType,
                "uploadType": 16,
                "data-value": (tabIndex == 3 && !isNull(fileUrl)) ? fileUrl : "",
                "function": function (_this, data) {
                    show(_this, data);
                }
            });

            element.on('tab(question-insert-type)', function (obj) {
                tabIndex = obj.index;
                $.each($(this).parent().find("img"), function (i) {
                    var src = $(this).attr("src");
                    if (src.indexOf("-choose") != -1) {
                        src = src.replace("-choose.png", '') + '.png';
                    }
                    $(this).attr("src", src);
                });
                if (obj.index != 0) {
                    var src = $(this).find("img").attr("src");
                    if (src.indexOf("-choose") != -1) {
                        src = src.replace("-choose.png", '') + '.png';
                    } else {
                        src = src.replace(".png", '') + '-choose.png';
                    }
                    $(this).find("img").attr("src", src);
                }
            });
        }

        $("body").on("click", "#cancle", function () {
            parent.layer.close(index);
        });

        // 知识点选择按钮点击事件
        $("body").on("click", "#schoolKnowledgeChoose", function () {
            // 将当前知识点列表传递给临时变量，供子窗口使用
            knowledgeReturnList = [].concat(schoolKnowledgeMationList);

            // 打开知识点选择弹窗
            _openNewWindows({
                url: "../../tpl/schoolKnowledgePoints/schoolKnowledgePointsChoose.html",
                title: "知识点选择",
                pageId: "schoolKnowledgePointsChoose",
                area: ['90vw', '90vh'],
                callBack: function (refreshCode) {
                    // 如果有返回值，则处理选择的知识点
                    if (refreshCode == '0') {
                        // 更新知识点列表
                        schoolKnowledgeMationList = [].concat(knowledgeReturnList);
                        // 更新显示
                        var str = '<div class="knowledge-tags-container" style="display: inline-flex; flex-wrap: wrap; margin-top: 5px;">';
                        $.each(schoolKnowledgeMationList, function (i, item) {
                            // 使用name字段显示知识点名称
                            var displayName = item.name;
                            str += '<span class="layui-badge layui-bg-blue" style="height: 25px !important; line-height: 25px !important; margin: 5px 5px 0 0;">' + displayName + '</span>';
                        });
                        str += '</div>';
                        $("#schoolKnowledgeChoose").parent().html('<button type="button" class="layui-btn layui-btn-primary layui-btn-xs" id="schoolKnowledgeChoose">知识点选择</button>' + str);
                    }
                }
            });
        });
    });
});