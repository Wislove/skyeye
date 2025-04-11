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
    
    // 添加全局变量，用于保存所有分页中选中的知识点
    var allSelectedPoints = [];
    
    // 初始化时从父窗口获取已选知识点
    $(function() {
        if(parent.knowledgeReturnList && parent.knowledgeReturnList.length > 0) {
            allSelectedPoints = JSON.parse(JSON.stringify(parent.knowledgeReturnList));
            
            // 初始化tableCheckBoxUtil的选中状态
            var ids = [];
            $.each(allSelectedPoints, function(i, item) {
                ids.push(item.id);
            });
            
            tableCheckBoxUtil.setIds({
                gridId: 'knowledgeTable',
                fieldName: 'id',
                ids: ids
            });
        }
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
            
            // 监听复选框选中事件，将选中的数据保存到全局变量
            table.on('checkbox(knowledgeTable)', function(obj) {
                if(obj.type === 'all') { // 如果是全选/全不选
                    var checkStatus = table.checkStatus('knowledgeTable');
                    if(obj.checked) { // 全选
                        // 将当前页所有数据添加到全局变量
                        checkStatus.data.forEach(function(item) {
                            // 检查是否已存在
                            var exists = allSelectedPoints.some(function(selected) {
                                return selected.id === item.id;
                            });
                            if(!exists) {
                                allSelectedPoints.push(item);
                            }
                        });
                    } else { // 全不选
                        // 从全局变量中移除当前页所有数据
                        checkStatus.data.forEach(function(item) {
                            allSelectedPoints = allSelectedPoints.filter(function(selected) {
                                return selected.id !== item.id;
                            });
                        });
                    }
                    
                    // 同步tableCheckBoxUtil的选中状态
                    var selectedIds = allSelectedPoints.map(function(item) {
                        return item.id;
                    });
                    tableCheckBoxUtil.setIds({
                        gridId: 'knowledgeTable',
                        fieldName: 'id',
                        ids: selectedIds
                    });
                } else { // 单个复选框
                    if(obj.checked) { // 选中
                        // 检查是否已存在
                        var exists = allSelectedPoints.some(function(selected) {
                            return selected.id === obj.data.id;
                        });
                        if(!exists) {
                            allSelectedPoints.push(obj.data);
                        }
                    } else { // 取消选中
                        allSelectedPoints = allSelectedPoints.filter(function(selected) {
                            return selected.id !== obj.data.id;
                        });
                    }
                    
                    // 同步tableCheckBoxUtil的选中状态
                    var selectedIds = allSelectedPoints.map(function(item) {
                        return item.id;
                    });
                    tableCheckBoxUtil.setIds({
                        gridId: 'knowledgeTable',
                        fieldName: 'id',
                        ids: selectedIds
                    });
                }
            });
        }
    });

    // 修改确认选择按钮点击事件
    $("body").on("click", "#confirmSelection", function() {
        // 获取当前页选中的数据，与全局变量合并
        var currentSelectedData = table.checkStatus('knowledgeTable').data;
        
        // 将当前页选中的数据添加到全局变量（避免遗漏最后一页的选择）
        currentSelectedData.forEach(function(item) {
            var exists = allSelectedPoints.some(function(selected) {
                return selected.id === item.id;
            });
            if(!exists) {
                allSelectedPoints.push(item);
            }
        });
        
        // 检查数量限制
        if(allSelectedPoints.length > MAX_SELECTED_POINTS) {
            winui.window.msg("最多只能选择" + MAX_SELECTED_POINTS + "个知识点", {icon: 2, time: 2000});
            return false;
        }
        
        // 更新父窗口数据，包含所有页面选中的知识点
        parent.knowledgeReturnList = allSelectedPoints;
        parent.selectedKnowledgeIds = allSelectedPoints.map(item => item.id).join(",");
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
