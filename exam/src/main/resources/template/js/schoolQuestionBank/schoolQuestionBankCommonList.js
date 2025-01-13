var rowId = "";
// 定义题型映射对象
var quTypeMap = {
    0: "是非题",
    1: "单选题",
    2: "多选题",
    3: "填空题",
    4: "多项填空题",
    5: "多行填空题",
    6: "大题",
    7: "枚举题",
    8: "评分题",
    9: "排序题",
    10: "比重题",
    11: "矩阵单选题",
    12: "矩阵填空题",
    13: "矩阵多选题",
    14: "复合矩阵单选题",
    18: "矩阵评分题"
};

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

    var facultyId = "";
    var majorId = "";
    var subjectId = "";

    // 获取当前登陆用户所属的学校列表
    schoolUtil.queryMyBelongSchoolList(function (json) {
        $("#schoolId").html(getDataUseHandlebars(getFileContent('tpl/template/select-option-must.tpl'), json));
        form.render("select");
        initFacultyId();
        initTable();
    });
    form.on('select(schoolId)', function (data) {
        initFacultyId();
        facultyId = "";
        majorId = "";
        subjectId = "";
        $("#setting1").html("");
        $("#setting3").html("");
    });

    // 所属院系
    function initFacultyId() {
        showGrid({
            id: "setting",
            url: schoolBasePath + "queryFacultyListBySchoolId",
            params: {schoolId: $("#schoolId").val()},
            pagination: false,
            template: $("#facultyTemplate").html(),
            method: 'GET',
            ajaxSendLoadBefore: function (hdb) {
            },
            ajaxSendAfter: function (json) {
                form.render('select');
            }
        });
    }

    // 初始化专业
    function initMajor() {
        showGrid({
            id: "setting1",
            url: schoolBasePath + "queryMajorListByFacultyId",
            params: {facultyId: facultyId},
            pagination: false,
            template: $("#majorTemplate").html(),
            method: 'GET',
            ajaxSendLoadBefore: function (hdb) {
            },
            ajaxSendAfter: function (json) {
                form.render('select');
            }
        });
    }

    // 初始化科目
    function initSubject() {
        showGrid({
            id: "setting3",
            url: schoolBasePath + "querySubjectListByMajorId",
            params: {majorId: majorId},
            pagination: false,
            template: $("#subjectTemplate").html(),
            method: 'GET',
            ajaxSendLoadBefore: function (hdb) {
            },
            ajaxSendAfter: function (json) {
                form.render('select');
            }
        });
    }

    function initTable() {
        // 表格渲染
        table.render({
            id: 'messageTable',
            elem: '#messageTable',
            method: 'post',
            url: schoolBasePath + 'selectQuestionBySubjectId',
            where: getTableParams(),
            even: false,
            page: true,
            limits: getLimits(),
            limit: getLimit(),
            cols: [[
                {title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers'},
                {
                    field: 'quTitle', width: 250, title: '题目', templet: function (d) {
                        return d.quTitle;
                    }
                },
                {
                    field: 'type', width: 80, title: '类型', align: 'center', templet: function (d) {
                        if (d.quTag == 1) {
                            return '<span style="color: blue">' + d.quTag + '默认题</span>';
                        } else if (d.quTag == 2) {
                            return '<span style="color: goldenrod">' + d.quTag + '大题</span>';
                        } else {
                            return '<span style="color: goldenrod">' + d.quTag + '小题</span>';
                        }
                    }
                },
                {
                    field: 'cName', width: 100, title: '题型', templet: function (d) {
                        return quTypeMap[d.quType] || d.quType;
                    }
                },
                {
                    field: 'schoolName', width: 150, title: '学校', templet: function (d) {
                        return d.schoolMation?.name
                    }
                },
                {
                    field: 'facultyName', width: 80, align: 'center', title: '院系', templet: function (d) {
                        return d.facultyMation?.name
                    }
                },
                {
                    field: 'majorName', width: 80, align: 'center', title: '专业', templet: function (d) {
                        return d.majorMation?.name
                    }
                },
                {
                    field: 'subjectName', width: 80, align: 'center', title: '科目', templet: function (d) {
                        return d.subjectMation?.name
                    }
                }, {
                    field: 'subjectName', width: 80, align: 'center', title: '创建人', templet: function (d) {
                        return d.createName
                    }
                },
                {
                    field: 'createTime',
                    title: systemLanguage["com.skyeye.createTime"][languageType],
                    align: 'center',
                    width: 140
                }
            ]],
            done: function (json) {
                matchingLanguage();
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
        form.on('submit(formSearch)', function (data) {
            if (winui.verifyForm(data.elem)) {
                refreshTable();
            }
            return false;
        });
    }

    // 详情
    function details(data) {
        rowId = data.id;
        _openNewWindows({
            url: "",
            title: "试题信息",
            pageId: "",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
            }
        });
    }

    // 对左侧菜单项的点击事件--院系
    $("body").on("click", "#setting a", function (e) {
        $("#setting a").removeClass("selected");
        $(this).addClass("selected");
        facultyId = $(this).attr("rowid");
        if (isNull(facultyId)) {
            $("#setting1").html("");
            $("#setting3").html("");
        } else {
            initMajor();
        }
        refreshTable();
    });

    // 对左侧菜单项的点击事件--专业
    $("body").on("click", "#setting1 a", function (e) {
        $("#setting1 a").removeClass("selected");
        $(this).addClass("selected");
        majorId = $(this).attr("rowid");
        if (isNull(majorId)) {
            $("#setting3").html("");
        } else {
            initSubject();
        }
        refreshTable();
    });

    // 对左侧菜单项的点击事件--科目
    $("body").on("click", "#setting3 a", function (e) {
        $("#setting3 a").removeClass("selected");
        $(this).addClass("selected");
        subjectId = $(this).attr("rowid");
        refreshTable();
    });

    function refreshTable() {
        table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
    }

    function getTableParams() {
        return {
            limit: getLimit(),
            page: 1,
            holderId: subjectId
        };
    }

    exports('schoolQuestionBankCommonList', {});
});
