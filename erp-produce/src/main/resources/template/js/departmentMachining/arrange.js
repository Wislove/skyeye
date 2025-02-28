
layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'form', 'laydate'], function (exports) {
    winui.renderColor();
    var index = parent.layer.getFrameIndex(window.name);
    var $ = layui.$,
        form = layui.form,
        laydate = layui.laydate;
    var selTemplate = getFileContent('tpl/template/select-option.tpl');
    var id = GetUrlParam("id");

    AjaxPostUtil.request({url: sysMainMation.erpBasePath + "queryMachinProcedureById", params: {id: id}, type: 'json', method: 'GET', callback: function (json) {
        $("#showForm").html(getDataUseHandlebars($("#beanTemplate").html(), json));

        const oddNumberMap = {};
        (json.bean.machinProcedureFarmList || []).forEach((item, index) => {
            oddNumberMap[item.oddNumber] = item.id;
        });

        let par = {
            workProcedureId: json.bean.procedureId
        };
        let farmModelHtml = '';
        // 根据工序id查询可以执行该工序的车间
        AjaxPostUtil.request({url: sysMainMation.erpBasePath + "queryExecuteFarmByWorkProcedureId", params: par, type: 'json', method: 'GET', callback: function (json) {
            farmModelHtml = getDataUseHandlebars(selTemplate, json);
        }, async: false});

        initTableChooseUtil.initTable({
            id: "arrangeList",
            cols: [
                {id: 'farmId', title: '安排车间', formType: 'select', width: '200', verify: 'required', modelHtml: farmModelHtml },
                {id: 'targetNum', title: '安排任务数量', formType: 'input', width: '140', verify: 'required|number' },
                {id: 'oddNumber', title: '任务单号', formType: 'detail', width: '140', className: 'notice-title-click' },
                {id: 'stateName', title: '状态', formType: 'detail', width: '140' }
            ],
            form: form,
        });

        if (!isNull(json.bean.machinProcedureFarmList) && json.bean.machinProcedureFarmList.length > 0) {
            initTableChooseUtil.deleteAllRow('arrangeList');
        }
        $.each(json.bean.machinProcedureFarmList, function(i, item) {
            initFirst = true;
            item.stateName = skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("machinProcedureFarmState", 'id', item.state, 'name');
            var trcusid = initTableChooseUtil.resetData('arrangeList', item);
            var thisRowKey = trcusid.replace("tr", "");
            // 只有【待接收】的任务可以删除
            if (item.state != 'waitReceive') {
                let itemBox = $('input[type="checkbox"][rowId="row' + thisRowKey + '"]');
                disableElementAndSiblings(itemBox)
            }

            // 【待执行】的任务不可编辑
            if (item.state == 'waitExecuted'  || item.state == 'partialCompletion' || item.state == 'allCompleted' || item.state == 'excessCompleted') {
                let itemNum = $('input[type="text"][id="targetNum' + thisRowKey + '"]');
                let itemChoose = $('[id="farmId' + thisRowKey + '"]');
                disableElementAndSiblings(itemNum)
                disableElementAndSiblings(itemChoose)
            }
        });

        function disableElementAndSiblings(element) {
            element.prop('disabled', true);
            element.addClass('layui-btn-disabled');
            element.next().css("cursor", "not-allowed");
        }

        var planStartTime = laydate.render({
            elem: '#planStartTime', //指定元素
            format: 'yyyy-MM-dd',
            theme: 'grid',
            done:function(value, date){
                planEndTime.config.min = {
                    year: date.year,
                    month: date.month - 1,//关键
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds
                };
            }
        });

        var planEndTime = laydate.render({
            elem: '#planEndTime', //指定元素
            format: 'yyyy-MM-dd',
            theme: 'grid',
            done:function(value, date){
                planStartTime.config.max = {
                    year: date.year,
                    month: date.month - 1,//关键
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds
                }
            }
        });

        var actualStartTime = laydate.render({
            elem: '#actualStartTime', //指定元素
            format: 'yyyy-MM-dd',
            theme: 'grid',
            done:function(value, date){
                actualEndTime.config.min = {
                    year: date.year,
                    month: date.month - 1,//关键
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds
                };
            }
        });

        var actualEndTime = laydate.render({
            elem: '#actualEndTime', //指定元素
            format: 'yyyy-MM-dd',
            theme: 'grid',
            done:function(value, date){
                actualStartTime.config.max = {
                    year: date.year,
                    month: date.month - 1,//关键
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds
                }
            }
        });

        // 车间任务详情
        $("body").on("click", ".notice-title-click", function() {
            const dataStr = $(this).attr("data");
            const data = isNull(dataStr) ? {} : JSON.parse(dataStr);
            console.log(data);
            _openNewWindows({
                url: "../../tpl/workshopTasks/workshopdetails.html?id=" + data.id + "&serviceClassName=" + encodeURIComponent(data.serviceClassName),
                title: '详情',
                pageId: "workshopdetails",
                area: ['90vw', '90vh'],
                callBack: function (refreshCode) {
                }
            });
        });

        matchingLanguage();
        form.render();
        form.on('submit(formAddBean)', function (data) {
            if (winui.verifyForm(data.elem)) {
                var result = initTableChooseUtil.getDataList('arrangeList');
                if (!result.checkResult) {
                    return false;
                }
                let dataList = result.dataList;
                for (let i = 0; i < dataList.length; i++) {
                    dataList[i].id = oddNumberMap[dataList[i].oddNumber] || '';
                }

                var params = {
                    id: id,
                    planStartTime: $("#planStartTime").val(),
                    planEndTime: $("#planEndTime").val(),
                    actualStartTime: $("#actualStartTime").val(),
                    actualEndTime: $("#actualEndTime").val(),
                    machinProcedureFarmList: JSON.stringify(dataList),
                };
                AjaxPostUtil.request({url: sysMainMation.erpBasePath + "setMachinProcedureById", params: params, type: 'json', method: 'POST', callback: function (json) {
                    parent.layer.close(index);
                    parent.refreshCode = '0';
                }});
            }
            return false;
        });
    }});

    // 取消
    $("body").on("click", "#cancle", function() {
        parent.layer.close(index);
    });

});