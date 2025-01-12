var rowId = "";

var surveyName = "";

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'laydate'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form,
        table = layui.table;

    authBtn('1586066201570');

    // 获取当前登陆用户所属的学校列表
    schoolUtil.queryMyBelongSchoolList(function (json) {
        $("#schoolId").html(getDataUseHandlebars(getFileContent('tpl/template/select-option-must.tpl'), json));
        form.render("select");
        // 加载院系
        initFacultyId();
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

    //初始化科目
    function initSubject() {
        showGrid({
            id: "subjectId",
            url: schoolBasePath + "querySubjectListByMajorId",
            params: {majorId: $("#majorId").val()},  // 修正参数名
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

    function initTable() {
        table.render({
            id: 'messageTable',
            elem: '#messageTable',
            method: 'post',
            url: schoolBasePath + 'queryFilterExamLists',
            where: getTableParams(),
            even: false,
            page: true,
            limits: getLimits(),
            limit: getLimit(),
            cols: [[
                {title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers'},
                {
                    field: 'surveyName', width: 250, title: '试卷名称', templet: function (d) {
                        return '<a lay-event="details" class="notice-title-click">' + d.surveyName + '</a>';
                    }
                },
                {
                    field: 'surveyState', width: 80, title: '状态', templet: function (d) {
                        if (d.surveyState == 0) {
                            return "设计";
                        } else if (d.surveyState == 1) {
                            return "执行中" + '<i class="fa fa-pencil-square fa-fw cursor vary-color" lay-event="pcExaming" title="点击前往考试"></i>';
                        } else if (d.surveyState == 2) {
                            return "结束";
                        } else {
                            return d.surveyState; // 兜底返回，以防state值不在预期范围内

                        }
                    }
                },
                {
                    field: 'schoolMation.name', width: 200, title: '所属学校', templet: function (d) {
                        return d.classesMation ? d.classesMation?.schoolMation?.name : '';
                    }
                },
                {
                    field: 'facultyMation.name', width: 200, align: 'center', title: '所属院系', templet: function (d) {
                        return d.classesMation ? d.classesMation?.facultyMation?.name : '';
                    }
                },
                {
                    field: 'majorMation.name', width: 200, align: 'center', title: '所属专业', templet: function (d) {
                        return d.classesMation ? d.classesMation?.majorMation?.name : '';
                    }
                },
                {
                    field: 'subjectMation.name', width: 80, align: 'center', title: '科目', templet: function (d) {
                        return d.subjectMation ? d.subjectMation?.name : '';
                    }
                },
                {
                    field: 'createName',
                    width: 120,
                    title: systemLanguage["com.skyeye.createName"][languageType],
                    align: 'left',
                    templet: function (d) {
                        return d.createName || '';
                    }
                },
                {
                    field: 'createTime',
                    title: systemLanguage["com.skyeye.createTime"][languageType],
                    align: 'center',
                    width: 140
                },
                {
                    title: systemLanguage["com.skyeye.operation"][languageType],
                    fixed: 'right',
                    align: 'center',
                    width: 300,
                    toolbar: '#tableBar'
                }
            ]],
            done: function (json) {
                matchingLanguage();
            }
        });

        table.on('tool(messageTable)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'del') { //删除
                del(data, obj);
            } else if (layEvent === 'edit') { //设计
                edit(data);
            } else if (layEvent === 'fzWj') { //复制试卷
                fzWj(data);
            } else if (layEvent === 'showFb') { //发布
                showFb(data, obj);
            } else if (layEvent === 'endSurvey') { //结束
                endSurvey(data, obj);
            } else if (layEvent === 'details') { //详情
                details(data);
            } else if (layEvent === 'markExam') { //编辑
                markExam(data);
            }
            // else if (layEvent === 'fxWj') { //分析报告
            // 	fxWj(data);
            // }
        });

        form.render();
        form.on('submit(formSearch)', function (data) {
            if (winui.verifyForm(data.elem)) {
                refreshTable();
            }
            return false;
        });
    }

    //删除
    function del(data, obj) {
        var msg = obj ? '确认删除试卷【' + obj.data.surveyName + '】吗？' : '确认删除选中数据吗？';
        layer.confirm(msg, {icon: 3, title: '删除试卷'}, function (index) {
            layer.close(index);
            AjaxPostUtil.request({
                url: schoolBasePath + "changeWhetherDeleteById",
                params: {id: data.id},
                type: 'json',
                callback: function (json) {
                    winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {
                        icon: 1,
                        time: 2000
                    });
                    loadTable();
                }
            });
        });
    }

    //设计
    function edit(data) {
        rowId = data.id;
        _openNewWindows({
            url: "../../tpl/examdesign/examDesign.html",
            title: "设计试卷",
            pageId: "examDesign",
            area: ['100vw', '100vh'],
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }
        });
    }

    //复制试卷
    function fzWj(data) {
        console.log(22222, data)
        // id=data.id;
        rowId = data.id;
        surveyName = data.surveyName;
        _openNewWindows({
            url: "../../tpl/examdesigncopy/examDesignCopy.html",
            title: "复制试卷",
            pageId: "examDesignCopy",
            area: ['500px', '300px'],
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }
        });
    }

    //发布
    function showFb(data, obj) {
        console.log(data, obj)
        console.log(222)
        var msg = obj ? '确认发布试卷【' + obj.data.surveyName + '】吗？' : '确认发布选中数据吗？';
        layer.confirm(msg, {icon: 3, title: '试卷发布'}, function (index) {
            layer.close(index);
            AjaxPostUtil.request({
                url: schoolBasePath + "setUpExamDirectory",
                params: {id: data.id},
                type: 'json',
                callback: function (json) {
                    winui.window.msg("发布成功", {icon: 1, time: 2000});
                    loadTable();
                }
            });
        });
    }

    //结束调查
    function endSurvey(data, obj) {
        var msg = obj ? '确认结束试卷【' + obj.data.surveyName + '】的考试吗？' : '确认结束选中数据吗？';
        layer.confirm(msg, {icon: 3, title: '结束考试'}, function (index) {
            layer.close(index);
            AjaxPostUtil.request({
                url: schoolBasePath + "updateExamMationEndById",
                params: {id: data.id},
                type: 'json',
                callback: function (json) {
                    winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {
                        icon: 1,
                        time: 2000
                    });
                    loadTable();
                }
            });
        });
    }

    //详情
    function details(data) {
        rowId = data.id;
        _openNewWindows({
            url: "../../tpl/examDetail/examPCDetail.html",
            title: "试卷信息",
            pageId: "examPCDetail",
            area: ['100vw', '100vh'],
            callBack: function (refreshCode) {
            }
        });
    }

    //编辑
    function markExam(data) {
        // 清空并重新设置rowId
        rowId = data.id;
        parent.rowId = data.id;
        
        _openNewWindows({
            url: "../../tpl/examdesign/examDesignAdd.html",
            title: "编辑试卷",
            pageId: "examDesignEdit",
            area: ['90vw', '90vh'],
            beforeOpen: function() {
                // 确保编辑时rowId正确设置
                rowId = data.id;
                parent.rowId = data.id;
            },
            callBack: function(refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }
        });
    }

    //刷新数据
    $("body").on("click", "#reloadTable", function () {
        loadTable();
    });

    //新增
    $("body").on("click", "#addBean", function () {
        // 清空全局变量rowId
        rowId = "";
        parent.rowId = "";  // 同时清空parent.rowId

        _openNewWindows({
            url: "../../tpl/examdesign/examDesignAdd.html",
            title: "新增试卷",
            pageId: "examDesignAdd",
            area: ['70vw', '60vh'],
            beforeOpen: function () {
                // 确保打开窗口前rowId为空
                rowId = "";
                parent.rowId = "";
            },
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }
        });
    });

    function loadTable() {
        table.reloadData("messageTable", {where: getTableParams()});
    }

    function refreshTable() {
        table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
    }

    function getTableParams() {
        return {
            holderKey: $("#schoolId").val(),
            holderId: $("#facultyId").val(),
            objectKey: $("#majorId").val(),
            objectId: $("#subjectId").val(),
            keyword: $("#surveyName").val(),
            state: $("#surveyState").val()
            // gradeId: $("#gradeId").val(),
            // schoolId: $("#schoolId").val(),
            // subjectId: $("#subjectId").val()
        };
    }

    exports('examDesignList', {});
});

