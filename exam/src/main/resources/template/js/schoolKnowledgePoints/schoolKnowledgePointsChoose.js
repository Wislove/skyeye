/**
 * 知识点选择
 */
layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'tableCheckBoxUtil'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form,
        table = layui.table,
        tableCheckBoxUtil = layui.tableCheckBoxUtil;
    
    // 获取父窗口索引，用于关闭窗口
    var index = parent.layer.getFrameIndex(window.name);
    
    // 最大可选知识点数量
    var MAX_SELECTED_POINTS = 20;
    
    // 设置提示信息
    var s = '知识点选择上限为' + MAX_SELECTED_POINTS + '个';
    $("#showInfo").html(s);
    
    // 在打开知识点选择页面时，清空父窗口的历史选择记录
    parent.knowledgeReturnList = [];
    parent.selectedKnowledgeIds = '';
    
    // 初始化选中的知识点ID数组
    var ids = [];
    $.each(parent.knowledgeReturnList, function(i, item) {
        ids.push(item.id);
    });
    
    // 初始化tableCheckBoxUtil
    tableCheckBoxUtil.setIds({
        gridId: 'knowledgeTable',
        fieldName: 'id',
        ids: ids
    });
    
    // 渲染表格
    table.render({
        id: 'knowledgeTable',
        elem: '#knowledgeTable',
        method: 'post',
        url: sysMainMation.schoolBasePath + 'queryKnowledgePointsList',
        where: getTableParams(),
        even: false,
        page: true,
        limits: getLimits(),
        limit: getLimit(),
        cols: [[
            { type: 'checkbox' },
            { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
            { field: 'section', title: '章节', align: 'center', width: 100, templet: function (d) {
                return d.chapterMation ? '第 ' + d.chapterMation.section + ' 章' : '';
            }},
            { field: 'name', title: '名称', align: 'left', width: 300 },
            { field: 'content', title: '内容', align: 'left' },
            { field: 'createName', title: systemLanguage["com.skyeye.createName"][languageType], align: 'left', width: 120 },
            { field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 150 }
        ]],
        done: function(json) {
            matchingLanguage();
            initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "请输入名称", function () {
                table.reloadData("knowledgeTable", {page: {curr: 1}, where: getTableParams()});
            });
            
            // 初始化tableCheckBoxUtil
            tableCheckBoxUtil.init({
                gridId: 'knowledgeTable',
                filterId: 'knowledgeTable',
                fieldName: 'id'
            });
            
            // 设置选中状态
            tableCheckBoxUtil.checkedDefault({
                gridId: 'knowledgeTable',
                fieldName: 'id'
            });
            
        }
    });

    // 修改确认选择按钮点击事件
    $("body").on("click", "#confirmSelection", function() {
        // 只获取当前页面新选择的知识点
        var currentSelectedData = table.checkStatus('knowledgeTable').data;
        var selectedIds = currentSelectedData.map(item => item.id);
        
        // 检查数量限制
        if (currentSelectedData.length > MAX_SELECTED_POINTS) {
            winui.window.msg("最多只能选择" + MAX_SELECTED_POINTS + "个知识点", {icon: 2, time: 2000});
            return false;
        }
        
        // 更新父窗口数据，只包含当前新选择的
        parent.knowledgeReturnList = currentSelectedData;
        parent.selectedKnowledgeIds = selectedIds.join(",");
        parent.refreshCode = '0';
        parent.layer.close(index);
    });
    
    // 清空选择按钮点击事件
    $("body").on("click", "#clearSelection", function() {
        // 清空选中数据
        tableCheckBoxUtil.setIds({
            gridId: 'knowledgeTable',
            fieldName: 'id',
            ids: []
        });
        
        // 重新加载表格
        loadTable();
    });
    
    // 取消按钮点击事件
    $("body").on("click", "#cancelSelection", function() {
        parent.layer.close(index);
    });

    // 刷新表格
    $("body").on("click", "#reloadTable", function() {
        $("#keyWord").val("");
        loadTable();
    });

    // 搜索按钮点击事件
    $("body").on("click", "#searchBtn", function() {
        loadTable();
    });

    // 加载表格数据
    function loadTable() {
        table.reloadData("knowledgeTable", {where: getTableParams()});
    }

    // 获取表格参数
    function getTableParams() {
        var params = {};
        var keyWord = $("#keyWord").val();
        if (!isNull(keyWord)) {
            params.name = keyWord;
        }
        return $.extend(true, params, initTableSearchUtil.getSearchValue("knowledgeTable"));
    }
    
    exports('schoolKnowledgePointsChoose', {});
});
