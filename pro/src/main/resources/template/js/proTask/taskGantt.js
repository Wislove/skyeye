var objectKey = "";
var objectId = "";

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'form', 'laydate'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate;
    const selOption = getFileContent('tpl/template/select-option.tpl');
    objectKey = GetUrlParam("objectKey");
    objectId = GetUrlParam("objectId");
    if (isNull(objectKey) || isNull(objectId)) {
        winui.window.msg("请传入适用对象信息", {icon: 2, time: 2000});
        return false;
    }

    // 根据供应商id获取所有审批通过之后的里程碑列表
    let milestoneList = [];
    AjaxPostUtil.request({url: sysMainMation.projectBasePath + "queryAllApprovalMilestoneList", params: {objectId: objectId}, type: 'json', method: 'GET', callback: function (json) {
        $("#milestoneId").html(getDataUseHandlebars(selOption, json));
        milestoneList = json.rows;

        var authPermission = teamObjectPermissionUtil.checkTeamBusinessAuthPermission(objectId, 'taskAuthEnum');
        var btnStr = `<div style="" class="type-group" id="type">`;
        var firstBtn = true;
        if (authPermission['list']) {
            var defaultClassName = firstBtn ? 'plan-select' : '';
            firstBtn = false;
            btnStr += `<button type="button" class="layui-btn layui-btn-primary type-btn ${defaultClassName}" data-type="list" table-id="messageTable"><i class="layui-icon"></i>所有任务</button>`
        }
        if (authPermission['myExecute']) {
            var defaultClassName = firstBtn ? 'plan-select' : '';
            firstBtn = false;
            btnStr += `<button type="button" class="layui-btn layui-btn-primary type-btn ${defaultClassName}" data-type="myExecute" table-id="messageTable"><i class="layui-icon"></i>我执行的</button>`
        }
        if (authPermission['myCreate']) {
            var defaultClassName = firstBtn ? 'plan-select' : '';
            firstBtn = false;
            btnStr += `<button type="button" class="layui-btn layui-btn-primary type-btn ${defaultClassName}" data-type="myCreate" table-id="messageTable"><i class="layui-icon"></i>我创建的</button>`
        }
        if (authPermission['simpleByDepartment']) {
            var defaultClassName = firstBtn ? 'plan-select' : '';
            btnStr += `<button type="button" class="layui-btn layui-btn-primary type-btn ${defaultClassName}" data-type="simpleByDepartment" table-id="messageTable"><i class="layui-icon"></i>同部门其他人员</button>`
        }
        btnStr += `</div>`;
        $(".txtcenter").before(btnStr);
        getSameDepartmentMembers();

        matchingLanguage();
        form.render();
        renderPanel();
        render();
    }});

    function getSameDepartmentMembers() {
        const params = {
            chooseOrNotMy: 2,
            chooseOrNotEmail: 2
        }
        AjaxPostUtil.request({url: sysMainMation.reqBasePath + "commonselpeople005", params: params, type: 'json', method: 'GET', callback: function (json) {
            $("#chooseMembers").html(getDataUseHandlebars(selOption, json));
            if ($(".type-group").find(".plan-select").attr("data-type") != "simpleByDepartment") {
                $(".chooseMembersMation").hide();
            }
        }});
    }

    function renderPanel() {
        document.getElementById('device_load').style.cssText = 'height:' + ($(window).height() - 140) + 'px';
    }
    $(window).resize(function () {
        renderPanel();
    });

    // 时间格式
    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.scales = [
        {unit: "year", step: 1, format: "%Y"},
        {unit: "day", step: 1, date: "%m-%d"}
    ];
    gantt.config.reorder_grid_columns = true;
    gantt.config.columns = [{
        name: "text",
        label: "任务名称",
        width: 200,
        tree: true,
        resize: true
    }, {
        name: "start_date",
        label: "开始日期",
        width: 100,
        align: "center",
        resize: true
    }, {
        name: "duration",
        label: "持续时间",
        width: 100,
        align: "center",
        resize: true
    }];
    gantt.config.readonly = true;
    gantt.config.row_height = 40;
    gantt.config.scale_height = 50;
    gantt.config.drag_move = false;
    gantt.config.drag_resize = false;
    gantt.config.sort = true;
    gantt.config.show_quick_info = false;
    //  关闭点击事件
    gantt.attachEvent("onTaskDblClick", function (id, e) {
        return false;
    });
    gantt.config.show_tasks_outside_timescale = true;
    gantt.plugins({
        auto_scheduling: true,  //自动排程
        tooltip: true     //提示信息
    });
    // 样式
    gantt.config.layout = {
        css: "gantt_container",
        cols: [{
            width: 400,
            min_width: 300,
            rows: [
                {
                    view: "grid",
                    scrollX: "gridScroll",
                    scrollable: true,
                    scrollY: "scrollVer"
                },
                {view: "scrollbar", id: "gridScroll", group: "horizontal"}
            ]
        },
            {resizer: true, width: 1},
            {
                rows: [
                    {
                        view: "timeline",
                        scrollX: "scrollHor",
                        scrollY: "scrollVer"
                    },
                    {
                        view: "scrollbar",
                        id: "scrollHor",
                        group: "horizontal"
                    }
                ]
            },
            {view: "scrollbar", id: "scrollVer"}]
    };

    gantt.init("device_load");

    gantt.i18n.setLocale("cn");  //使用中文
    function render() {
        let milestoneId = $("#milestoneId").val();
        let params = {
            objectId: objectId,
            objectKey: objectKey,
            holderId: milestoneId,
            type: $("#type .plan-select").attr("data-type"),
            chargePersonId: $(".type-group").find(".plan-select").attr("data-type") == "simpleByDepartment" ? $("#chooseMembers").val() : ''
        };
        if (!isNull(milestoneId)) {
            var tem = getInPoingArr(milestoneList, "id", milestoneId, null);
            gantt.config.start_date = new Date(tem.startTime);
            gantt.config.end_date = new Date(tem.endTime);
        }

        AjaxPostUtil.request({url: sysMainMation.projectBasePath + "queryProTaskListForGantt", params: params, type: 'json', method: 'POST', callback: function (json) {
            gantt.clearAll();  //清空缓存
            let nodeList = json.bean.node;
            if (isNull(nodeList) || nodeList.length == 0) {
                return;
            }

            // 创建一个映射来存储所有节点ID
            const nodeMap = new Map();

            // 首先处理所有节点的日期并记录ID
            $.each(nodeList, function (i, item) {
                item.start_date = new Date(item.start_date);
                item.end_date = new Date(item.end_date);
                nodeMap.set(item.id, item);
            });

            // 处理节点，如果父节点不存在，则将其设置为顶层节点
            nodeList = nodeList.map(item => {
                if (item.parent !== '0' && !nodeMap.has(item.parent)) {
                    return { ...item, parent: '0' };
                }
                return item;
            });

            let linkList = json.bean.link;
            if (isNull(linkList) || linkList.length == 0) {
                linkList = [];
            }

            // 过滤连接，确保连接的两端节点都存在
            linkList = linkList.filter(link => {
                return nodeMap.has(link.source) && nodeMap.has(link.target);
            });

            // 解析
            gantt.parse({
                data: nodeList,
                links: linkList
            });
        }});
    }

    $("body").on("click", ".type-btn", function (e) {
        var type = $(this).attr("data-type");
        if (type == "simpleByDepartment") {
            $(".chooseMembersMation").show();
        } else {
            $(".chooseMembersMation").hide();
        }
        $(this).parent().find('.type-btn').removeClass("plan-select");
        $(this).addClass("plan-select");
        render();
    });

    form.on('submit(formSearch)', function (data) {
        if (winui.verifyForm(data.elem)) {
            render();
        }
        return false;
    });

    exports('taskGantt', {});
});