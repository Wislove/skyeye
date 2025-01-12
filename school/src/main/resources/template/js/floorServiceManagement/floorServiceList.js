
var rowId = "";

var parentNode = null;

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'tableTreeDj', 'jquery', 'winui', 'form', 'fsTree'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form,
        fsTree = layui.fsTree,
        tableTree = layui.tableTreeDj;
    var placeTypeId = '';
    var selTemplate = getFileContent('tpl/template/select-option-must.tpl');

    var schoolId = "";
    // 加载学校列表
    let schoolHtml = '';
    AjaxPostUtil.request({url: sysMainMation.schoolBasePath + "queryAllSchoolList", params: {}, type: 'json', method: "Get", callback: function (json) {
        schoolId = json.rows.length > 0 ? json.rows[0].id : '-';
        schoolHtml = getDataUseHandlebars(selTemplate, json);
        $("#schoolId").html(schoolHtml);
        $("#schoolId").val(schoolId);
        form.render('select');
        schoolLocation();
        }});
    // 监听下拉框
    form.on('select(schoolId)', function (data) {
        var thisRowValue = data.value;
        schoolId = isNull(thisRowValue) ? "" : thisRowValue;
        // 刷新树
        var nownode = ztree.getNodesByParam("id", '', null);
        ztree.setting.async.url = schoolBasePath + "queryTeachBuildingBySchoolId?schoolId=" + schoolId;
        ztree.reAsyncChildNodes(nownode[0], "refresh");
    });


    /********* tree 处理   start *************/
    var ztree = null;
    function schoolLocation(){
        fsTree.render({
            id: "treeDemo",
            url: schoolBasePath + "queryTeachBuildingBySchoolId?schoolId=" + schoolId,
            checkEnable: false,
            showLine: false,
            showIcon: true,
            addDiyDom: ztreeUtil.addDiyDom,
            clickCallback: onClickTree,
            onDblClick: onClickTree
        }, function(id) {
            ztree = $.fn.zTree.getZTreeObj(id);
            fuzzySearch(id, '#name', null, true);
            initLoadTable();
            ztreeUtil.initEventListener(id);
        });
    }

    //异步加载的方法
    function onClickTree(event, treeId, treeNode) {
        if(treeNode == undefined) {
            placeTypeId = "";
        } else {
            placeTypeId = treeNode.id;
        }
        loadTable();
    }

    /********* tree 处理   end *************/
    function initLoadTable() {
        tableTree.render({
            id: 'messageTable',
            elem: '#messageTable',
            method: 'post',
            url: schoolBasePath + 'queryFloorInfosByLocationId',
            where: getTableParams(),
            cols: [[
                { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
                { field: 'name', title: '名称', width: 120 },
                { field: 'sortOrder', title: '排序', width: 60 },
                { field: 'nodeType', title: '类型', align: 'center', width: 80, templet: function (d) {
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("floorInfoEnum", 'id', d.nodeType, 'name');
                    }},
                { field: 'status', title: '状态', align: 'center', width: 80, templet: function (d) {
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("commonEnable", 'id', d.status, 'name');
                    }},
                { field: 'remark', title: '备注', width: 150 },
                { field: 'createName', title: systemLanguage["com.skyeye.createName"][languageType], width: 120 },
                { field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 150 },
                { field: 'lastUpdateName', title: systemLanguage["com.skyeye.lastUpdateName"][languageType], align: 'left', width: 120 },
                { field: 'lastUpdateTime', title: systemLanguage["com.skyeye.lastUpdateTime"][languageType], align: 'center', width: 150 },
                { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 240, toolbar: '#tableBar' }
            ]],
            isPage: false,
            done: function(json) {
                matchingLanguage();
                initTableSearchUtil.initAdvancedSearch($("#messageTable")[0], json.searchFilter, form, "请输入名称", function () {
                    tableTree.reload("messageTable", {page: {curr: 1}, where: getTableParams()});
                });
            }
        }, {
            keyId: 'id',
            keyPid: 'parentId',
            title: 'name',
        });
    }


    tableTree.getTable().on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'del') { // 删除
            del(data, obj);
        } else if (layEvent === 'edit') { // 编辑
            edit(data);
        } else if (layEvent === 'add') { // 新增子节点
            parentNode = data;
            addPage();
        }
    });

    // 新增楼层
    $("body").on("click", "#addBean", function () {
        parentNode = null;
        addPage();
    });

    function addPage() {
        _openNewWindows({
            url: "../../tpl/floorServiceManagement/floorServiceWrite.html?placeTypeId=" + placeTypeId,
            title: systemLanguage["com.skyeye.addPageTitle"][languageType],
            pageId: "FloorServiceAdd",
            area: ['90vw', '90vh'],//宽度和高度
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }
        });
    }

    // 删除楼层、教室、服务
    function del(data, obj) {
        layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function (index) {
            layer.close(index);
            AjaxPostUtil.request({url: schoolBasePath + "deleteFloorInfoById", params: {id: data.id}, type: 'json', method: "DELETE", callback: function (json) {
                    winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
                    loadTable();
                }});
        });
    }

    // 编辑
    function edit(data) {
        rowId = data.id;
        _openNewWindows({
            url: "../../tpl/floorServiceManagement/floorServiceWrite.html?placeTypeId=" + placeTypeId+'&id='+rowId,
            title: systemLanguage["com.skyeye.editPageTitle"][languageType],
            pageId: "FloorServiceEdit",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }});
    }



    $("body").on("click", "#reloadTable", function () {
        loadTable();
    });

    function loadTable() {
        tableTree.reload("messageTable", {where: getTableParams()});
    }

    function getTableParams() {
        return $.extend(true, {holderId: placeTypeId}, initTableSearchUtil.getSearchValue("messageTable"));
    }
})