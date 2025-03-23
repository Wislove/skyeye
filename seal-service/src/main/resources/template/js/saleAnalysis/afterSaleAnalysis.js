layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window',
    echarts: '../echarts/echarts',
    echartsTheme: '../echarts/echartsTheme'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'laydate', 'echarts'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate;

    // 初始化时间选择器
    laydate.render({
        elem: '#dateRange',
        type: 'date',
        range: true,
        value: getThirdDayToDate() + ' - ' + getYMDFormatDate()
    });

    sysMainMation.sealServiceBasePath = 'http://localhost:8108/'

    // 初始化工人效率表格
    var workerTable = table.render({
        id: 'workerTable',
        elem: '#workerTable',
        method: 'post',
        url: sysMainMation.sealServiceBasePath + 'querySealServiceOrderWorkerStats',
        even: false,
        page: true,
        limits: getLimits(),
        limit: getLimit(),
        cols: [[
            {
                field: 'userId', title: '工人姓名', width: 180, templet: function (d) {
                    return getNotUndefinedVal(d.userMation?.name);
                }
            },
            { field: 'completedOrders', title: '完成工单数', width: 200 },
            { field: 'avgProcessTime', title: '平均处理时长', width: 200 },
            { field: 'totalParts', title: '使用配件数', width: 200 }
        ]],
        done: function (json) {
            matchingLanguage();
        }
    });

    // 初始化图表
    var orderTypeChart = echarts.init(document.getElementById('orderTypeChart'));
    var orderTrendChart = echarts.init(document.getElementById('orderTrendChart'));

    // 工单类型分布图表配置
    var orderTypeOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: []
        },
        series: [{
            name: '工单类型',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: []
        }]
    };

    // 工单处理趋势图表配置
    var orderTrendOption = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['新增工单', '完成工单']
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '新增工单',
            type: 'line',
            data: []
        }, {
            name: '完成工单',
            type: 'line',
            data: []
        }]
    };

    // 渲染图表
    orderTypeChart.setOption(orderTypeOption);
    orderTrendChart.setOption(orderTrendOption);

    // 监听搜索按钮点击事件
    form.on('submit(searchBtn)', function (data) {
        var params = data.field;
        params.startTime = params.dateRange.split(' - ')[0];
        params.endTime = params.dateRange.split(' - ')[1];
        loadAnalysisData(params);
        return false;
    });

    // 加载统计数据
    function loadAnalysisData(params) {
        // 加载概览数据
        AjaxPostUtil.request({
            url: sysMainMation.sealServiceBasePath + "queryOverviewSealSeServiceOrder",
            params: params,
            type: 'json',
            method: "POST",
            callback: function (res) {
                $('#totalOrders').find('h2').text(res.bean.totalOrders);
                $('#completedOrders').find('h2').text(res.bean.completedOrders);
                $('#totalParts').find('h2').text(res.bean.useCount);
                $('#avgProcessTime').find('h2').text(res.bean.avgProcessTime + '小时');
            },
            async: false
        });

        // 更新工单类型分布图表
        AjaxPostUtil.request({
            url: sysMainMation.sealServiceBasePath + "querySealSeServiceOrderTypeStats",
            params: params,
            type: 'json',
            method: "POST",
            callback: function (res) {
                const result = (res.rows || [])
                const data = result.map(item => item.name)
                orderTypeOption.legend.data = data;
                orderTypeOption.series[0].data = result;
                orderTypeChart.setOption(orderTypeOption);
            },
            async: false
        });

        // 更新工单处理趋势图表
        AjaxPostUtil.request({
            url: sysMainMation.sealServiceBasePath + "querySealSeServiceOrderTrendStats",
            params: params,
            type: 'json',
            method: "POST",
            callback: function (res) {
                orderTrendOption.xAxis.data = res.bean.dayList;
                orderTrendOption.series[0].data = res.bean.allNewOrders;
                orderTrendOption.series[1].data = res.bean.completedOrders;
                orderTrendChart.setOption(orderTrendOption);
            },
            async: false
        });

        // 重载表格数据
        workerTable.reload({ where: params });
    }

    // 窗口调整时重置图表大小
    window.onresize = function () {
        orderTypeChart.resize();
        orderTrendChart.resize();
    };

    $("#searchBtn").click();

});