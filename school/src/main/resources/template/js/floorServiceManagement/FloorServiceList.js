
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
    // 新增
    // authBtn('1731659909121');

    var schoolId = "";
    // 加载
    let schoolHtml = '';
    AjaxPostUtil.request({url: sysMainMation.schoolBasePath + "queryAllSchoolList", params: {}, type: 'json', method: "Get", callback: function (json) {
        schoolId = json.rows.length > 0 ? json.rows[0].id : '-';
        schoolHtml = getDataUseHandlebars(selTemplate, json);
        // initTable();
        schoolLocation(schoolId);
        initLoadTable()
        }});
    // 监听下拉框
    form.on('select(schoolId)', function (data) {
        var thisRowValue = data.value;
        schoolId = isNull(thisRowValue) ? "" : thisRowValue;
        // loadTable();
        schoolLocation(schoolId);
    });


    /********* tree 处理   start *************/
    function schoolLocation(schoolId){
        fsTree.render({
            id: "treeDemo",
            url: schoolBasePath + "queryTeachBuildingBySchoolId?schoolId="+schoolId,
            checkEnable: false,
            showLine: false,
            showIcon: true,
            addDiyDom: ztreeUtil.addDiyDom,
            clickCallback: onClickTree,
            onDblClick: onClickTree
        }, function(id) {
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
        console.log(placeTypeId);
        loadTable();
    }

    /********* tree 处理   end *************/
    function initLoadTable() {
        tableTree.render({
            id: 'messageTable',
            elem: '#messageTable',
            method: 'post',
            url: schoolBasePath + 'queryTeachBuildingById',
            where: getTableParams(),
            cols: [[
                { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
                { field: 'name', title: '楼层', width: 120 },
                { field: 'sortId', title: '排序', width: 60 },
                { field: 'state', title: '状态', align: 'center', width: 80, templet: function (d) {
                    console.log(d)
                        return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("commonEnable", 'id', d.state, 'name');
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
                }, `<label class="layui-form-label">学校</label><div class="layui-input-inline">
						<select id="schoolId" name="schoolId" lay-filter="schoolId" lay-search="">
						${schoolHtml}
					</select></div>`);
            }
        }, {
            keyId: 'id',
            keyPid: 'parentId',
            title: 'name',
        });
    }

    // 新增楼层
    $("body").on("click", "#addBean", function () {
        _openNewWindows({
            url: "../../tpl/floorServiceManagement/FloorServiceWrite.html?placeTypeId=" + placeTypeId,
            title: systemLanguage["com.skyeye.addPageTitle"][languageType],
            pageId: "FloorServiceWrite",
            area: ['90vw', '90vh'],//宽度和高度
            callBack: function (refreshCode) {
                winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
                loadTable();
            }
        });
    });
    // 删除楼层、教室、服务
    function del(data, obj) {
        layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function (index) {
            layer.close(index);
            AjaxPostUtil.request({url: schoolBasePath + "deleteTeachBuildingById", params: {id: data.id}, type: 'json', method: "DELETE", callback: function (json) {
                    winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
                    loadTable();
                }});
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
        } else if (layEvent === 'move') { // 移动
            move(data);
        }
    });



    $("body").on("click", "#reloadTable", function () {
        loadTable();
    });

    function loadTable() {
        tableTree.reload("messageTable", {where: getTableParams()});
    }

    function getTableParams() {
        return $.extend(true, {id: placeTypeId, isPaging: false}, initTableSearchUtil.getSearchValue("messageTable"));
    }


})