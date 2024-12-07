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
    var selTemplate = getFileContent('tpl/template/select-option-must.tpl');

    var schoolId = "";
    // 加载
    let schoolHtml = '';
    AjaxPostUtil.request({url: sysMainMation.schoolBasePath + "queryAllSchoolList", params: {}, type: 'json', method: "Get", callback: function (json) {
            schoolId = json.rows.length > 0 ? json.rows[0].id : '-';
            schoolHtml = getDataUseHandlebars(selTemplate, json);
            initTable();
        }});

    form.on('select(schoolId)', function (data) {
        console.log(data)
        var thisRowValue = data.value;
        schoolId = isNull(thisRowValue) ? "" : thisRowValue;
        loadTable();
    });

    function initTable() {
        table.render({
            id: 'messageTable',
            elem: '#messageTable',
            method: 'post',
            url: sysMainMation.schoolBasePath + 'queryRouteList',
            where: getTableParams(),
            page: true,
            limits: getLimits(),
            limit: getLimit(),
            cols: [[
                {title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers'},
                {
                    field: 'startName', title: '起点名称', width: 150, align: 'center', templet: function (d) {
                        return  d.startName ;
                    }
                },
                {
                    field: 'endName', title: '终点名称', width: 150, align: 'center', templet: function (d) {
                        return  d.endName ;
                    }
                },
                {
                    field: 'routeType', title: '类型', width: 100, align: 'center',templet: function (d) {
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("routeTypeEnum", 'id', d.enabled, 'name');
                    }
                },
                {
                    field: 'routeLength', title: '路线长度', width: 100, align: 'center', templet: function (d) {
                        return  d.routeLength +"米";
                    }
                },
                {
                    field: 'enabled', title: '状态', width: 100, align: 'center',templet: function (d) {
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("commonEnable", 'id', d.enabled, 'name');
                    }
                },
                {
                    field: 'createName',
                    align: 'left',
                    title: systemLanguage["com.skyeye.createName"][languageType],
                    width: 120
                },
                {
                    field: 'createTime',
                    title: systemLanguage["com.skyeye.createTime"][languageType],
                    align: 'center',
                    width: 150
                },
                {
                    field: 'lastUpdateName',
                    title: systemLanguage["com.skyeye.lastUpdateName"][languageType],
                    align: 'left',
                    width: 120
                },
                {
                    field: 'lastUpdateTime',
                    title: systemLanguage["com.skyeye.lastUpdateTime"][languageType],
                    align: 'center',
                    width: 150
                },
                {
                    title: systemLanguage["com.skyeye.operation"][languageType],
                    fixed: 'right',
                    align: 'center',
                    width: 200,
                    toolbar: '#tableBar'
                }

            ]],
            done: function (json) {
                matchingLanguage();
                initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "请输入名称", function () {
                    table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
                },`<label class="layui-form-label">学校</label><div class="layui-input-inline">
                        <select id="schoolId" name="schoolId" lay-filter="schoolId" lay-search="">
                        ${schoolHtml}
                    </select></div>`);}
        });
    }
    table.on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'del') {
            del(data);
        } else if (layEvent === 'edit') {
            edit(data);
        }
    });


    // 新增
    $("body").on("click", "#addBean", function () {
        _openNewWindows({
            url: "../../tpl/routeManagement/routeManagementWrite.html?schoolId=" + schoolId,
            title: systemLanguage["com.skyeye.addPageTitle"][languageType],
            pageId: "routeManagementAdd",
            area: ['90vw', '90vh'],//宽度和高度
            callBack: function () {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }
        });
    });
    // 编辑
    function edit(data) {
        _openNewWindows({
            url: "../../tpl/routeManagement/routeManagementWrite.html?id=" + data.id,
            title: systemLanguage["com.skyeye.editPageTitle"][languageType],
            pageId: "routeManagementEdit",
            area: ['90vw', '90vh'],
            callBack: function () {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }
        });
    }

    // 删除
    function del(data, obj) {
        console.log(data);
        layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function (index) {
            layer.close(index);
            AjaxPostUtil.request({url: sysMainMation.schoolBasePath + "deleteRouteById", params: {id: data.id}, type: 'json', method: 'DELETE', callback: function (json) {
                    winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
                    loadTable();
                }});
        });
    }

    form.render();
    $("body").on("click", "#reloadTable", function () {
        loadTable();
    });
    function loadTable() {
        table.reloadData("messageTable", {where: getTableParams()});
    }
    function getTableParams() {
        let params = {
            holderId: schoolId,
        };
        console.log(params);
        return $.extend(true, params, initTableSearchUtil.getSearchValue("messageTable"));
    }

});