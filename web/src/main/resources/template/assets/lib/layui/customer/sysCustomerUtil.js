
// 客户工具类
var sysCustomerUtil = {

    /**
     * 已经选的的客户信息
     */
    customerMation: {},

    /**
     * 客户选择页面
     *
     * @param callback 回调函数
     */
    openSysCustomerChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/customerManage/customerChoose.html",
            title: "选择客户",
            pageId: "customerChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if(typeof(callback) == "function") {
                    callback(sysCustomerUtil.customerMation);
                }
            }});
    },

};


// 考勤相关工具类
var checkWorkUtil = {

    checkWorkTimeColor: ['layui-bg-gray', 'layui-bg-blue', 'layui-bg-orange'],

    /**
     * 获取当前登陆人的考勤班次
     *
     * @param callback 回执函数
     */
    getCurrentUserCheckWorkTimeList: function (callback) {
        AjaxPostUtil.request({url: sysMainMation.checkworkBasePath + "checkworktime007", params: {}, type: 'json', method: "GET", callback: function(json) {
            if(typeof(callback) == "function") {
                callback(json);
            }
        }, async: false});
    },

    // 类型为1初始化单休
    resetSingleBreak: function(id){
        var _box;
        if(isNull(id)){
            _box = $(".weekDay");
        } else {
            _box = $("#" + id + " .weekDay");
        }
        $.each(_box, function(i, item) {
            var clas = getArrIndexOfPointStr(checkWorkUtil.checkWorkTimeColor, $(item).attr("class"));
            $(item).removeClass(clas);
            if(i < 6){
                $(item).addClass('layui-bg-blue');
            } else {
                $(item).addClass('layui-bg-gray');
            }
        });
    },

    // 类型为2初始化双休
    resetWeekend: function(id){
        var _box;
        if (isNull(id)) {
            _box = $(".weekDay");
        } else {
            _box = $("#" + id + " .weekDay");
        }
        $.each(_box, function (i, item) {
            var clas = getArrIndexOfPointStr(checkWorkUtil.checkWorkTimeColor, $(item).attr("class"));
            $(item).removeClass(clas);
            if (i < 5) {
                $(item).addClass('layui-bg-blue');
            } else {
                $(item).addClass('layui-bg-gray');
            }
        });
    },

    // 类型为3初始化单双休
    resetSingleAndDoubleBreak: function(id){
        var _box;
        if (isNull(id)) {
            _box = $(".weekDay");
        } else {
            _box = $("#" + id + " .weekDay");
        }
        $.each(_box, function (i, item) {
            var clas = getArrIndexOfPointStr(checkWorkUtil.checkWorkTimeColor, $(item).attr("class"));
            $(item).removeClass(clas);
            if (i < 5) {
                $(item).addClass('layui-bg-blue');
            } else if (i == 5) {
                $(item).addClass('layui-bg-orange');
            } else {
                $(item).addClass('layui-bg-gray');
            }
        });
    },

    // 类型为4初始化自定休
    resetCustomizeDay: function(days, id){
        checkWorkUtil.resetCustomize(id);
        if (isNull(days)) {
            return;
        }
        $.each(days, function (i, item) {
            var _this = $("span[value='" + item.weekNumber + "']");
            if (!isNull(id)) {
                _this = $("#" + id).find("span[value='" + item.weekNumber + "']");
            }
            var clas = getArrIndexOfPointStr(checkWorkUtil.checkWorkTimeColor, _this.attr("class"));
            _this.removeClass(clas);
            if (item.type == 1) {
                _this.addClass('layui-bg-blue');
            } else if (item.type == 2) {
                _this.addClass('layui-bg-orange');
            }
        });
    },

    // 类型为4初始化自定休
    resetCustomize: function(id){
        var _box;
        if (isNull(id)) {
            _box = $(".weekDay");
        } else {
            _box = $("#" + id + " .weekDay");
        }
        $.each(_box, function (i, item) {
            var clas = getArrIndexOfPointStr(checkWorkUtil.checkWorkTimeColor, $(item).attr("class"));
            $(item).removeClass(clas);
            $(item).addClass('layui-bg-gray');
        });
    }

};

// 招聘模块工具函数
var bossUtil = {

    /**
     * 打开我负责的未入职的面试者选择页面--表单组件中使用
     *
     * @param callback 回调函数
     */
    openBossIntervieweeChoosePage: function (callback) {
        _openNewWindows({
            url: systemCommonUtil.getUrl('FP2023061200001', null),
            title: "面试者",
            pageId: "myChargeBossIntervieweeListChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof(callback) == "function") {
                    callback(chooseItemMation);
                }
            }});
    },

    /**
     * 打开我负责的人员需求选择页面--表单组件中使用
     *
     * @param callback 回调函数
     */
    bossPersonRequireChooseMation: {}, // 已经选择的人员需求信息
    openBossPersonRequireChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/bossPersonRequire/bossPersonRequireMyChargeListChoose.html",
            title: "人员需求",
            pageId: "bossPersonRequireMyChargeListChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if(typeof(callback) == "function") {
                    callback(bossUtil.bossPersonRequireChooseMation);
                }
            }});
    }

};

// 财务模块工具类
var sysIfsUtil = {

    /**
     * 会计科目选择页面
     *
     * @param callback 回调函数
     */
    chooseAccountSubjectMation: {}, // 已经选择的会计科目信息
    openSysAccountSubjectChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/ifsAccountSubject/ifsAccountSubjectListChoose.html",
            title: "会计科目选择",
            pageId: "ifsAccountSubjectListChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof (callback) == "function") {
                    callback(sysIfsUtil.chooseAccountSubjectMation);
                }
            }
        });
    },

    /**
     * 凭证选择页面
     *
     * @param callback 回调函数
     */
    chooseVoucherMation: {}, // 已经选择的凭证信息
    openIfsVoucherChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/ifsVoucher/ifsVoucherListChoose.html",
            title: "凭证选择",
            pageId: "ifsVoucherListChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof (callback) == "function") {
                    callback(sysIfsUtil.chooseVoucherMation);
                }
            }
        });
    },

    /**
     * 账套选择页面
     *
     * @param callback 回调函数
     */
    ifsSetOfBooksMation: {},
    openIfsSetOfBooksListChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/ifsSetOfBooks/ifsSetOfBooksListChoose.html",
            title: "账套选择",
            pageId: "ifsSetOfBooksListChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof (callback) == "function") {
                    callback(sysIfsUtil.ifsSetOfBooksMation);
                }
            }
        });
    }

}

// 系统文件相关处理工具
var sysFileUtil = {

    /**
     * 获取文件路径后缀
     *
     * @param url 文件路径
     */
    getFileExt: function (url) {
        return (/[.]/.exec(url)) ? /[^.]+$/.exec(url.toLowerCase()) : '';
    },

    /**
     * 下载
     * @param  {String} url 目标文件地址
     * @param  {String} filename 想要保存的文件名称
     */
    download: function (url, filename) {
        sysFileUtil.getBlob(url, function (blob) {
            sysFileUtil.saveAs(blob, filename);
        });
    },

    /**
     * 下载图片
     *
     * @param path
     * @param imgName
     */
    downloadImage: function (path, imgName) {
        var _OBJECT_URL;
        var request = new XMLHttpRequest();
        request.addEventListener('readystatechange', function (e) {
            if (request.readyState == 4) {
                _OBJECT_URL = URL.createObjectURL(request.response);
                var $a = $("<a></a>").attr("href", _OBJECT_URL).attr("download", imgName);
                $a[0].click();
            }
        });
        request.responseType = 'blob';
        request.open('get', path);
        request.send();
    },

    /**
     * 获取 blob
     * @param  {String} url 目标文件地址
     * @return {cb}
     */
    getBlob: function (url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (xhr.status === 200) {
                cb(xhr.response);
            }
        };
        xhr.send();
    },

    /**
     * 根据文件路径转换成File对象
     *
     * @param url 文件路径
     * @param callback 回调函数
     */
    getFileByUrl: function (url, callback) {
        sysFileUtil.getBlob(url, function (blob) {
            const files = new File(
                [blob],
                sysFileUtil.getFileNameByUrl(url)
            );
            callback(files);
        });
    },

    /**
     * 根据文件路径获取文件名
     *
     * @param url 文件路径
     * @returns {*}
     */
    getFileNameByUrl: function (url) {
        // 通过\分隔字符串，成字符串数组
        var arr = url.split('\\');
        // 取最后一个，就是文件全名,含后缀
        var fileName = arr[arr.length - 1];
        return fileName;
    },

    /**
     * 保存
     * @param  {Blob} blob
     * @param  {String} filename 想要保存的文件名称
     */
    saveAs: function (blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement('a');
            var body = document.querySelector('body');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            // fix Firefox
            link.style.display = 'none';
            body.appendChild(link);
            link.click();
            body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }
        ;
    }

}

// 附件插件
var skyeyeEnclosure = {
    enclosureListKey: 'skyeyeJsonKey',
    enclosureBtnTemplate: '<button type="button" class="layui-btn layui-btn-primary layui-btn-xs" id="{{btnId}}">附件上传</button>',
    /**
     * 初始化附件插件，多个使用逗号隔开，只支持id
     *
     * @param ids 需要初始化的附件盒子的id
     * @param callback 回调函数
     */
    init: function (ids, callback) {
        var idsArray = ids.split(',');
        $.each(idsArray, function (i, id) {
            // 按钮id
            var btnId = id + "Btn";
            // 初始化数据为[]
            $("#" + id).attr(skyeyeEnclosure.enclosureListKey, JSON.stringify([]));
            // 加载dom对象
            skyeyeEnclosure.loadEnclosureHTML(id, btnId, 1);
            // 添加[附件上传]按钮的监听事件
            skyeyeEnclosure.initClick(id, btnId, callback);
        });
    },

    /**
     * 初始化附件插件，多个使用逗号隔开，只支持id
     *
     * @param param {需要初始化的附件盒子的id: 默认数据}
     * @param callback 回调函数
     */
    initTypeISData: function (param, callback) {
        $.each(param, function (boxId, data) {
            // 按钮id
            var btnId = boxId + "Btn";
            var dataList = skyeyeEnclosure.getDataList(data);
            // 初始化数据
            $("#" + boxId).attr(skyeyeEnclosure.enclosureListKey, JSON.stringify(dataList));
            // 加载dom对象
            skyeyeEnclosure.loadEnclosureHTML(boxId, btnId, 1);
            // 添加[附件上传]按钮的监听事件
            skyeyeEnclosure.initClick(boxId, btnId, callback);
        });
    },

    getDataList: function (data) {
        var dataList = [];
        if (!isNull(data)) {
            if (!isNull(data.enclosureInfoList)) {
                dataList = [].concat(data.enclosureInfoList);
            } else {
                dataList = [].concat(data);
            }
        }
        return dataList;
    },

    /**
     * 初始化点击事件
     *
     * @param id 盒子id
     * @param btnId 按钮id
     * @param callback 回调函数
     */
    initClick: function (id, btnId, callback){
        $("body").on("click", "#" + btnId, function() {
            _openNewWindows({
                url: "../../tpl/sysEnclosure/enclosureBusinessChoose.html?boxId=" + id,
                title: "上传附件",
                pageId: "enclosureBusinessChoose",
                area: ['70vw', '70vh'],
                callBack: function (refreshCode) {
                    // 重新加载dom对象
                    skyeyeEnclosure.loadEnclosureHTML(id, btnId, 1);
                    if(typeof(callback) == "function") {
                        callback(skyeyeEnclosure.getJSONEnclosureListByBoxId(id));
                    }
                }});
        });
    },

    /**
     * 附件详情展示
     *
     * @param param
     */
    showDetails: function (param) {
        $.each(param, function (boxId, data) {
            // 按钮id
            var btnId = boxId + "Btn";
            var dataList = skyeyeEnclosure.getDataList(data);
            // 初始化数据
            $("#" + boxId).attr(skyeyeEnclosure.enclosureListKey, JSON.stringify(dataList));
            // 加载dom对象
            skyeyeEnclosure.loadEnclosureHTML(boxId, btnId, 2);
        });
    },

    /**
     * 加载附件列表
     *
     * @param boxId 盒子id
     * @param btnId 按钮id
     * @param type 1.允许出现[附件上传]按钮 2.不允许出现[附件上传]按钮
     */
    loadEnclosureHTML: function (boxId, btnId, type){
        var enclosureList = skyeyeEnclosure.getJSONEnclosureListByBoxId(boxId);
        var str = "";
        $.each(enclosureList, function(i, item) {
            if(type == 1){
                str += '<br><a rowid="' + item.id + '" class="enclosureItem" rowpath="' + item.fileAddress + '" href="javascript:;" style="color:blue;">' + item.name + '</a>';
            } else {
                str += '<a rowid="' + item.id + '" class="enclosureItem" rowpath="' + item.fileAddress + '" href="javascript:;" style="color:blue;">' + item.name + '</a><br>';
            }
        });
        var btnHtml = "";
        if(type == 1){
            btnHtml += getDataUseHandlebars(skyeyeEnclosure.enclosureBtnTemplate, {btnId: btnId});
        }
        $("#" + boxId).html(btnHtml + str);

        // 加载点击下载事件
        skyeyeEnclosure.initDownloadEvent();
    },

    /**
     * 加载点击下载事件
     */
    initDownloadEvent: function () {

        $("body").on("click", ".enclosureItem", function() {
            download(fileBasePath + $(this).attr("rowpath"), $(this).html());
        });

    },

    /**
     * 获取指定id的附件
     *
     * @param id 盒子id
     */
    getJSONEnclosureListByBoxId: function (id) {
        return [].concat(JSON.parse($("#" + id).attr(skyeyeEnclosure.enclosureListKey)));
    },

    /**
     * 获取指定id的附件id，逗号隔开
     *
     * @param id 盒子id
     */
    getEnclosureIdsByBoxId: function (id){
        var enclosureList = skyeyeEnclosure.getJSONEnclosureListByBoxId(id);
        var enclosureInfo = "";
        $.each(enclosureList, function (i, item) {
            enclosureInfo += item.id + ',';
        })
        return enclosureInfo;
    }
};

// 集合工具类函数
var arrayUtil = {

    /**
     * 移除集合中指定name的元素
     *
     * @param list 集合
     * @param name 指定name
     */
    removeArrayPointName: function (list, name) {
        return arrayUtil.removeArrayPointKey(list, 'name', name);
    },

    /**
     * 移除集合中指定key的元素
     *
     * @param list 集合
     * @param key 指定key
     * @param value 指定的值
     */
    removeArrayPointKey: function (list, key, value) {
        var inArray = -1;
        $.each(list, function(i, item) {
            if(value === item[key]) {
                inArray = i;
                return false;
            }
        });
        if(inArray != -1) {
            list.splice(inArray, 1);
        }
        return [].concat(list);
    }

}

// 工作流工具函数
var activitiUtil = {

    /**
     * 流程id
     */
    processInstanceId: "",

    /**
     * 任务id
     */
    taskId: "",

    /**
     * 审批结果,是否通过：1.通过2.不通过
     */
    flag: "",

    /**
     * 已经选择的审批人员信息
     */
    chooseApprovalPersonMation: {},

    /**
     * 该地址为 sysServiceMation.json的key，因为刚启动流程，还没有流程id和任务id,所以只能用这种方式
     */
    actKey: "",

    /**
     * 根据业务数据判断走哪条工作流，该值为对象json字符串
     */
    businessData: "",

    /**
     * 工作流流程详情查看
     *
     * @param data
     */
    activitiDetails: function (data) {
        taskType = data.taskType;
        processInstanceId = data.processInstanceId;
        _openNewWindows({
            url: "../../tpl/activitiCommon/processInstanceDetails.html",
            title: systemLanguage["com.skyeye.processInstenceDetailsPageTitle"][languageType],
            pageId: "processDetails",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
            }
        });
    },

    /**
     * 根据业务对象的serviceClassName和流程模型id加载表单布局
     *
     * @param businessId 业务数据id
     * @param serviceClassName 业务对象的serviceClassName
     * @param actFlowId 流程模型id
     * @param showType 展示类型  details: 详情  edit: 编辑
     */
    loadBusiness: function (businessId, serviceClassName, actFlowId, showType) {
        var params = {
            serviceClassName: serviceClassName,
            actFlowId: actFlowId
        };
        AjaxPostUtil.request({url: reqBasePath + "queryDsFormPageForProcess", params: params, type: 'json', method: 'GET', callback: function (json) {
                pageMation = json.bean;
                if (isNull(pageMation)) {
                    winui.window.msg("该布局信息不存在", {icon: 2, time: 2000});
                    return false;
                } else {
                    // 这里为什么要给objectId和objectKey赋值，因为表单组件中有用到该值
                    if (showType == 'details') {
                        dsFormUtil.getBusinessData(businessId, serviceClassName, pageMation, function (data) {
                            if (pageMation.serviceBeanCustom.serviceBean.teamAuth) {
                                objectId = data.objectId;
                                objectKey = data.objectKey;
                            }
                            dsFormUtil.initDetailsPage('showForm', pageMation, data);
                        });
                    } else if (showType == 'edit') {
                        dsFormUtil.getBusinessData(businessId, serviceClassName, pageMation, function (data) {
                            if (pageMation.serviceBeanCustom.serviceBean.teamAuth) {
                                objectId = data.objectId;
                                objectKey = data.objectKey;
                            }
                            dsFormUtil.initEditPage('showForm', pageMation, data);
                        });
                    }
                }
            }});
    },

    /**
     * 加载审批人选择项
     *
     * @param appendDomId 指定dom结构后面加载
     * @param processInstanceId 流程id
     * @param taskId 任务id
     * @param flag 审批结果,是否通过：1.通过2.不通过
     */
    initApprovalPerson: function (appendDomId, processInstanceId, taskId, flag) {
        activitiUtil.processInstanceId = processInstanceId;
        activitiUtil.taskId = taskId;
        activitiUtil.flag = flag;
        var params = {
            processInstanceId: processInstanceId,
            taskId: taskId,
            flag: flag
        };
        // 优先请求一次获取下个用户节点的信息，如果没有审批节点信息，则不加载审批人选项
        AjaxPostUtil.request({url: flowableBasePath + "activitiProcess001", params: params, type: 'json', callback: function(json) {
                if (!isNull(json.bean) && !$.isEmptyObject(json.bean)) {
                    var approvalPersonChooseDom = '<div class="layui-form-item layui-col-xs12">' +
                        '<label class="layui-form-label">下一个审批人<i class="red">*</i></label>' +
                        '<div class="layui-input-block input-add-icon">' +
                        '<input type="text" id="approvalPersonName" name="approvalPersonName" placeholder="请选择下一个审批人" win-verify="required" class="layui-input" readonly="readonly"/>' +
                        '<i class="fa fa-plus-circle input-icon chooseApprovalPersonBtn"></i>' +
                        '</div>' +
                        '</div>';
                    $("#" + appendDomId).append(approvalPersonChooseDom);
                    activitiUtil.initApprovalPersonChooseBtnEvent();
                }
            }, async: false});
    },

    /**
     * 初始化审批人选择按钮事件
     */
    initApprovalPersonChooseBtnEvent: function () {
        $("body").on("click", ".chooseApprovalPersonBtn", function() {
            activitiUtil.openApprovalPersonChoosePage();
        });
    },

    /**
     * 打开审批人选择页面
     */
    openApprovalPersonChoosePage: function () {
        _openNewWindows({
            url: "../../tpl/approvalActiviti/approvalPersonChoose.html",
            title: "审批人选择",
            pageId: "approvalPersonChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                $("#approvalPersonName").val(activitiUtil.chooseApprovalPersonMation.jobNumber + "_" + activitiUtil.chooseApprovalPersonMation.userName);
                $("#approvalPersonName").attr("chooseData", JSON.stringify(activitiUtil.chooseApprovalPersonMation));
            }
        });
    },

    /**
     * 获取选择的审批人
     */
    getApprovalPersonId: function () {
        var chooseDataStr = $("#approvalPersonName").attr("chooseData");
        if (isNull(chooseDataStr)) {
            return "";
        }
        var chooseData = JSON.parse(chooseDataStr);
        return chooseData.id;
    },

    /**
     * 启动流程时选择审批人
     *
     * @param actKey 该地址为 sysServiceMation.json的key
     * @param businessData 业务数据的对象，不支持集合
     * @param callback 回调函数
     */
    startProcess: function (actKey, businessData, callback) {
        activitiUtil.actKey = actKey;
        activitiUtil.businessData = isNull(businessData) ? '' : JSON.stringify(businessData);
        _openNewWindows({
            url: "../../tpl/approvalActiviti/startProcessPersonChooseBtn.html",
            title: "审批人选择",
            pageId: "startProcessPersonChooseBtn",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof callback === 'function') {
                    callback(activitiUtil.chooseApprovalPersonMation.id);
                }
            }
        });
    },

    /**
     * 用户节点转为会签节点-----该功能未实现
     *
     * @param processInstanceId 流程id
     * @param taskId 任务id
     * @param callback 回调函数
     */
    turnMultiInstance: function (processInstanceId, taskId, callback) {
        var params = {
            processInstanceId: processInstanceId,
            taskId: taskId,
            sequential: false,
            userIds: JSON.stringify(["300b878c5c6744f2b48e6bc40beefd11", "0f17e3da88bc4e22841156388964e12e"])
        };
        AjaxPostUtil.request({url: flowableBasePath + "activitiProcess003", params: params, method: "POST", type: 'json', callback: function(json) {
                if (typeof callback === 'function') {
                    callback();
                }
            }, async: false});
    },

    /**
     * 工作流的其他操作
     *
     * @param boxId 按钮展示的位置
     * @param task 任务信息
     * @param callback 回调函数
     */
    activitiMenuOperator: function (boxId, task, callback) {
        var operatorBtnHtml = '';
        if ((task.nrOfInstances == 0 && !isNull(task.nrOfInstances)) || isNull(task.nrOfInstances)) {
            // 不是多实例会签||是会签但是还没有设定会签人
            if (!task.delegation) {
                // 不是委派任务节点可以委派
                operatorBtnHtml += '<a class="layui-btn layui-btn-normal" id="delegate" style="height: 30px; line-height: 30px; padding: 0 15px;">委派</a>';
            }
            operatorBtnHtml += '<a class="layui-btn layui-btn-normal" id="transfer" style="height: 30px; line-height: 30px; padding: 0 15px;">转办</a>';
            operatorBtnHtml += '<a class="layui-btn layui-btn-normal" id="beforeAddSignTask" style="height: 30px; line-height: 30px; padding: 0 15px;">前加签</a>';
            operatorBtnHtml += '<a class="layui-btn layui-btn-normal" id="afterAddSignTask" style="height: 30px; line-height: 30px; padding: 0 15px;">后加签</a>';
        }
        if (task.isMultiInstance) {
            // 会签节点进行加签
            operatorBtnHtml += '<a class="layui-btn layui-btn-normal" id="jointlySign" style="height: 30px; line-height: 30px; padding: 0 15px;">会签设定</a>';
        }
        $("#" + boxId).html(operatorBtnHtml);
        // 初始化监听事件
        activitiUtil.activitiMenuEvent(task, callback);
    },

    /**
     * 工作流的其他操作监听事件
     *
     * @param task 任务信息
     * @param callback 回调函数
     */
    activitiMenuEvent: function (task, callback) {
        // 委派
        $("body").on("click", "#delegate", function() {
            systemCommonUtil.userReturnList = [];
            systemCommonUtil.chooseOrNotMy = "2"; // 人员列表中是否包含自己--1.包含；其他参数不包含
            systemCommonUtil.chooseOrNotEmail = "2"; // 人员列表中是否必须绑定邮箱--1.必须；其他参数没必要
            systemCommonUtil.checkType = "2"; // 人员选择类型，1.多选；其他。单选
            systemCommonUtil.openSysUserStaffChoosePage(function (userReturnList){
                var params = {
                    taskId: task.taskId,
                    principalUserId: userReturnList[0].id
                };
                AjaxPostUtil.request({url: flowableBasePath + "activitiTask001", params: params, method: "POST", type: 'json', callback: function(json) {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }, async: false});
            });
        });

        // 转办
        $("body").on("click", "#transfer", function() {
            systemCommonUtil.userReturnList = [];
            systemCommonUtil.chooseOrNotMy = "2"; // 人员列表中是否包含自己--1.包含；其他参数不包含
            systemCommonUtil.chooseOrNotEmail = "2"; // 人员列表中是否必须绑定邮箱--1.必须；其他参数没必要
            systemCommonUtil.checkType = "2"; // 人员选择类型，1.多选；其他。单选
            systemCommonUtil.openSysUserStaffChoosePage(function (userReturnList){
                var params = {
                    taskId: task.taskId,
                    transferredPersonId: userReturnList[0].id
                };
                AjaxPostUtil.request({url: flowableBasePath + "activitiTask002", params: params, method: "POST", type: 'json', callback: function(json) {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }, async: false});
            });
        });

        // 前加签
        $("body").on("click", "#beforeAddSignTask", function() {
            _openNewWindows({
                url: "../../tpl/addSignTask/beforeAddSignTask.html?taskId=" + task.taskId,
                title: "前加签",
                pageId: "beforeAddSignTaskPage",
                area: ['90vw', '90vh'],
                callBack: function (refreshCode) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        });

        // 后加签
        $("body").on("click", "#afterAddSignTask", function() {
            _openNewWindows({
                url: "../../tpl/addSignTask/afterAddSignTask.html?taskId=" + task.taskId,
                title: "后加签",
                pageId: "afterAddSignTaskPage",
                area: ['90vw', '90vh'],
                callBack: function (refreshCode) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        });

        // 会签设定人员
        $("body").on("click", "#jointlySign", function() {
            _openNewWindows({
                url: "../../tpl/addSignTask/jointlySign.html?taskId=" + task.taskId,
                title: "会签设定",
                pageId: "jointlySignPage",
                area: ['90vw', '90vh'],
                callBack: function (refreshCode) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        });

    },

    showStateName: function (state, submitType) {
        if (submitType == 1) {
            if (state == '0') {
                return "<span class='state-down'>未审核</span>";
            } else if (state == '1') {
                return "<span class='state-up'>审核中</span>";
            } else if (state == '2') {
                return "<span class='state-new'>审核通过</span>";
            } else if (state == '3') {
                return "<span class='state-down'>拒绝通过</span>";
            } else if (state == '4') {
                return "<span class='state-new'>已完成</span>";
            } else if (state == '5') {
                return "<span class='state-error'>撤销</span>";
            } else {
                return "参数错误";
            }
        } else if (submitType == 2) {
            if (state == '0') {
                return "<span class='state-down'>未提交</span>";
            } else if (state == '2') {
                return "<span class='state-new'>已提交</span>";
            } else if (state == '4') {
                return "<span class='state-new'>已完成</span>";
            } else {
                return "参数错误";
            }
        }
    },

    showStateName2: function (state, submitType) {
        if (submitType == 1) {
            if (state == '0') {
                return "<span>草稿</span>";
            } else if (state == '1') {
                return "<span class='state-up'>审核中</span>";
            } else if (state == '2') {
                return "<span class='state-new'>审核通过</span>";
            } else if (state == '3') {
                return "<span class='state-down'>拒绝通过</span>";
            } else if (state == '4') {
                return "<span class='state-down'>作废</span>";
            } else if (state == '5') {
                return "<span class='state-error'>撤销</span>";
            } else {
                return "参数错误";
            }
        } else if (submitType == 2) {
            if (state == '0') {
                return "<span>草稿</span>";
            } else if (state == '2') {
                return "<span class='state-new'>已提交</span>";
            } else if (state == '4') {
                return "<span class='state-new'>作废</span>";
            } else {
                return "参数错误";
            }
        }
    },

};

// erp工具函数
var erpOrderUtil = {

    /**
     * 删除订单信息
     *
     * @param id 订单id
     * @param serviceClassName 单据类型
     */
    deleteOrderMation: function (id, serviceClassName, callback) {
        layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function(index) {
            AjaxPostUtil.request({url: sysMainMation.erpBasePath + "erpcommon005", params: {id: id, serviceClassName: serviceClassName}, method: "DELETE", type: 'json', callback: function(json) {
                    winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
                    if (typeof (callback) == "function") {
                        callback();
                    }
                }});
        });
    },

    /**
     * 提交订单信息
     *
     * @param id 订单id
     * @param serviceClassName 单据类型
     * @param submitType 单据提交类型  1.走工作流提交  2.直接提交
     * @param actKey 该地址为 sysServiceMation.json的key
     */
    submitOrderMation: function (id, serviceClassName, callback) {
        layer.confirm('确认要提交吗？', { icon: 3, title: '提交操作' }, function (index) {
            layer.close(index);
            activitiUtil.startProcess(serviceClassName, null, function (approvalId) {
                var params = {
                    id: id,
                    serviceClassName: serviceClassName,
                    approvalId: approvalId
                };
                AjaxPostUtil.request({url: sysMainMation.erpBasePath + "erpcommon006", params: params, method: "PUT", type: 'json', callback: function(json) {
                        winui.window.msg("提交成功", {icon: 1, time: 2000});
                        if (typeof (callback) == "function") {
                            callback();
                        }
                    }});
            });
        });
    },

    /**
     * 撤销订单信息
     *
     * @param processInstanceId 流程实例id
     * @param serviceClassName 单据类型
     */
    revokeOrderMation: function (processInstanceId, serviceClassName, callback) {
        layer.confirm('确认要撤销吗？', { icon: 3, title: '撤销操作' }, function (index) {
            var params = {
                processInstanceId: processInstanceId,
                serviceClassName: serviceClassName
            };
            AjaxPostUtil.request({url: sysMainMation.erpBasePath + "erpcommon003", params: params, type: 'json', method: "PUT", callback: function(json) {
                    winui.window.msg("提交成功", {icon: 1, time: 2000});
                    if (typeof(callback) == "function") {
                        callback();
                    }
                }});
        });
    },

    /**
     * 获取所有仓库信息
     *
     * @param callback 回执函数
     */
    getDepotList: function (callback) {
        AjaxPostUtil.request({url: sysMainMation.erpBasePath + "queryAllStoreHouseList", params: {}, type: 'json', method: "GET", callback: function(json) {
                if (typeof(callback) == "function") {
                    callback(json);
                }
            }, async: false});
    },

    /**
     * ERP商品选择对象以及工具函数
     */
    productCheckType: 1, // 商品选择类型：1.单选；2.多选
    chooseProductMation: {}, // 如果productCheckType=1，则为对象；如果productCheckType=2，则为集合
    openMaterialChooseChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/material/materialChoose.html",
            title: "选择商品",
            pageId: "productlist",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof (callback) == "function") {
                    callback(erpOrderUtil.chooseProductMation);
                }
            }
        });
    },

};

// 通讯录工具函数
var mailUtil = {

    mailChooseList: [],

    /**
     * 通讯录选择页面
     *
     * @param callback 回调函数
     */
    openMailChoosePage: function (callback) {
        _openNewWindows({
            url: systemCommonUtil.getUrl('FP2024022300008', null),
            title: "通讯录选择",
            pageId: "mailListChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof(callback) == "function") {
                    callback(chooseListMation);
                }
            }});
    }

};

// 会员工具类
var sysMemberUtil = {

    /**
     * 已经选的的会员信息
     */
    memberMation: {},

    /**
     * 会员选择页面
     *
     * @param callback 回调函数
     */
    openSysMemberChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/member/memberSearchChoose.html",
            title: "选择会员",
            pageId: "memberSearchChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof (callback) == "function") {
                    callback(sysMemberUtil.memberMation);
                }
            }
        });
    },

}

// 供应商相关工具类
var sysSupplierUtil = {

    /**
     * 已经选的的供应商信息
     */
    supplierMation: {},

    /**
     * 供应商选择页面
     *
     * @param callback 回调函数
     */
    openSysSupplierChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/supplier/supplierChoose.html",
            title: "选择供应商",
            pageId: "supplierChoosePage",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof (callback) == "function") {
                    callback(sysSupplierUtil.supplierMation);
                }
            }
        });
    },

};


// 商城相关工具类
var shopUtil = {

    // 启用/禁用状态
    enableState: {
        "enable": {"type": 1, "name": "启用"},
        "disable": {"type": 2, "name": "禁用"}
    },

    /**
     * 根据启用/禁用状态获取对应的名称
     *
     * @param enabled 状态
     * @returns {string}
     */
    getEnableStateName: function (enabled){
        if(enabled == 1){
            return "<span class='state-up'>启用</span>";
        } else if (enabled == 2){
            return "<span class='state-down'>禁用</span>";
        } else {
            return "<span class='state-error'>参数错误</span>";
        }
    },

    /**
     * 根据启用/禁用状态获取对应的名称--适用于车辆
     *
     * @param enabled 状态
     * @returns {string}
     */
    getMemberCarEnableStateName: function (enabled){
        if(enabled == 1){
            return "<span class='state-up'>启用</span>";
        } else if (enabled == 2){
            return "<span class='state-down'>禁用</span>";
        } else if (enabled == 3){
            return "<span class='state-down'>已过户</span>";
        } else {
            return "<span class='state-error'>参数错误</span>";
        }
    },

    /**
     * 获取套餐订单是否赠送的字段信息
     *
     * @param data
     * @returns {string}
     */
    getMealOrderWhetherGiveName: function (data) {
        if (data.whetherGive == 1) {
            return "是";
        } else if (data.whetherGive == 2) {
            return "否";
        } else {
            return "";
        }
    },

    /**
     * 套餐订单获取状态名称
     *
     * @param data
     * @returns {string}
     */
    getMealOrderStateName: function (data) {
        if (data.cancleState == 1) {
            if (data.state == 1) {
                return "<span class='state-down'>待支付</span>";
            } else if (data.state == 2) {
                return "<span class='state-up'>已支付</span>";
            } else if (data.state == 3) {
                return "<span class=''>已收货</span>";
            } else if (data.state == 4) {
                return "<span class=''>已关闭</span>";
            } else if (data.state == 5) {
                return "<span class=''>已退款</span>";
            } else if (data.state == 0) {
                return "<span class=''>已提交订单</span>";
            } else if (data.state == 51) {
                return "<span class=''>退款中</span>";
            } else if (data.state == 6) {
                return "<span class=''>退款驳回</span>";
            }
        } else {
            return '已取消';
        }
    },

    /**
     * 保养订单获取状态名称
     *
     * @param data
     * @returns {string}
     */
    getKeepFitOrderStateName: function (data) {
        if (data.cancleState == 1) {
            if (data.state == 1){
                return "<span class='state-down'>保养中</span>";
            } else if (data.state == 2){
                return "<span class='state-up'>待核销</span>";
            } else if (data.state == 3){
                return "<span class='state-up'>已核销</span>";
            }
        } else {
            return '已取消';
        }
    },

    /**
     * 获取区域信息
     *
     * @param callback 回执函数
     */
    getShopAreaMation: function (callback) {
        AjaxPostUtil.request({url: sysMainMation.shopBasePath + "queryAllEnabledAreaList", params: {}, type: 'json', method: "GET", callback: function(json) {
                if (typeof(callback) == "function") {
                    callback(json);
                }
            }, async: false});
    },

    /**
     * 获取当前登陆用户所属的区域列表
     *
     * @param callback 回执函数
     */
    queryStaffBelongAreaList: function (callback) {
        AjaxPostUtil.request({url: sysMainMation.shopBasePath + "storeStaff004", params: {}, type: 'json', method: "GET", callback: function(json) {
                if(typeof(callback) == "function") {
                    callback(json);
                }
            }, async: false});
    },

    /**
     * 获取当前登陆用户所属的门店列表
     *
     * @param callback 回执函数
     */
    queryStaffBelongStoreList: function (callback) {
        AjaxPostUtil.request({url: sysMainMation.shopBasePath + "storeStaff005", params: {}, type: 'json', method: "GET", callback: function(json) {
                if (typeof (callback) == "function") {
                    callback(json);
                }
            }, async: false});
    },

    /**
     * 获取指定区域下的门店列表
     *
     * @param areaId 区域id
     * @param callback 回执函数
     */
    queryStoreListByAreaId: function (areaId, callback){
        if (isNull(areaId)) {
            return [];
        }
        AjaxPostUtil.request({url: sysMainMation.shopBasePath + "queryStoreListByParams", params: {shopAreaId: areaId}, type: 'json', method: "GET", callback: function(json) {
                if (typeof (callback) == "function") {
                    callback(json);
                }
            }, async: false});
    },

    /**
     * 获取所有门店列表
     *
     * @param callback 回执函数
     */
    queryAllStoreList: function (callback) {
        var params = {
            limit: 1000,
            page: 1
        };
        AjaxPostUtil.request({url: sysMainMation.shopBasePath + "store001", params: params, type: 'json', method: "POST", callback: function(json) {
                if(typeof(callback) == "function") {
                    callback(json);
                }
            }, async: false});
    },

    /**
     * 门店员工选择页面
     *
     * @param callback 回调函数
     */
    staffMation: {},
    openStoreStaffChoosePage: function (callback, storeId) {
        _openNewWindows({
            url: "../../tpl/storeStaff/storeStaffChoose.html?storeId=" + storeId,
            title: "选择店员",
            pageId: "storeStaffChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if(typeof(callback) == "function") {
                    callback(shopUtil.staffMation);
                }
            }});
    },

};


// 组织机构工具类--组件管理中使用
var organizationUtil = {

    // 企业树
    companyTree: null,
    // 部门树
    departmentTree: null,
    // 岗位树
    jobTree: null,
    // 岗位定级树
    jobScoreTree: null,

    dtree: null,

    // 初始化新增页面的组织机构
    initAddOrganization: function (dtree) {
        organizationUtil.dtree = dtree;
        // 初始化公司
        organizationUtil.companyTree = dtree.render({
            elem: "#demoTree1",
            url: reqBasePath + 'queryCompanyMationListTree',
            dataStyle: 'layuiStyle',
            done: function(json) {
                if($("#demoTree1 li").length > 0){
                    $("#demoTree1 li").eq(0).children('div').click();
                }
            }
        });

        dtree.on("node('demoTree1')" ,function(param) {
            var choose = dtree.getNowParam(organizationUtil.companyTree);
            // 初始化部门
            organizationUtil.departmentTree = dtree.render({
                elem: "#demoTree2",
                url: reqBasePath + 'companydepartment006?companyId=' + choose.nodeId,
                dataStyle: 'layuiStyle',
                done: function(json) {
                    if($("#demoTree2 li").length > 0){
                        $("#demoTree2 li").eq(0).children('div').click();
                    }
                }
            });
        });

        dtree.on("node('demoTree2')" ,function(param){
            var choose = dtree.getNowParam(organizationUtil.departmentTree);
            // 初始化职位
            organizationUtil.jobTree = dtree.render({
                elem: "#demoTree3",
                url: reqBasePath + 'companyjob006?departmentId=' + choose.nodeId,
                dataStyle: 'layuiStyle',
                done: function(json) {
                    if($("#demoTree3 li").length > 0){
                        $("#demoTree3 li").eq(0).children('div').click();
                    }
                }
            });
        });

        dtree.on("node('demoTree3')" ,function(param){
            var choose = dtree.getNowParam(organizationUtil.jobTree);
            // 初始化职位定级
            organizationUtil.jobScoreTree = dtree.render({
                elem: "#demoTree4",
                url: reqBasePath + 'companyjobscore008?jobId=' + choose.nodeId,
                dataStyle: 'layuiStyle',
                method: 'GET',
                done: function(json) {
                    if($("#demoTree4 li").length > 0){
                        $("#demoTree4 li").eq(0).children('div').click();
                    }
                }
            });
        });
    },

    // 初始化编辑页面的组织机构
    initEditOrganization: function (dtree, mation) {
        organizationUtil.dtree = dtree;
        // 初始化公司
        organizationUtil.companyTree = dtree.render({
            elem: "#demoTree1",
            url: reqBasePath + 'queryCompanyMationListTree',
            dataStyle: 'layuiStyle',
            done: function(json) {
                if($("#demoTree1 li").length > 0){
                    for(var i = 0; i < $("#demoTree1 li").length; i++){
                        if($("#demoTree1 li").eq(i).attr("data-id") == mation.companyId){
                            $("#demoTree1 li").eq(i).children('div').click();
                            return;
                        }
                    }
                }
            }
        });

        dtree.on("node('demoTree1')" ,function(param) {
            var choose = dtree.getNowParam(organizationUtil.companyTree);
            // 初始化部门
            organizationUtil.departmentTree = dtree.render({
                elem: "#demoTree2",
                url: reqBasePath + 'companydepartment006?companyId=' + choose.nodeId,
                dataStyle: 'layuiStyle',
                done: function(json) {
                    if($("#demoTree2 li").length > 0){
                        for(var i = 0; i < $("#demoTree2 li").length; i++){
                            if($("#demoTree2 li").eq(i).attr("data-id") == mation.departmentId){
                                $("#demoTree2 li").eq(i).children('div').click();
                                return;
                            }
                        }
                    }
                }
            });
        });

        dtree.on("node('demoTree2')" ,function(param){
            var choose = dtree.getNowParam(organizationUtil.departmentTree);
            // 初始化职位
            organizationUtil.jobTree = dtree.render({
                elem: "#demoTree3",
                url: reqBasePath + 'companyjob006?departmentId=' + choose.nodeId,
                dataStyle: 'layuiStyle',
                done: function(json) {
                    if($("#demoTree3 li").length > 0){
                        for(var i = 0; i < $("#demoTree3 li").length; i++){
                            if($("#demoTree3 li").eq(i).attr("data-id") == mation.jobId){
                                $("#demoTree3 li").eq(i).children('div').click();
                                return;
                            }
                        }
                    }
                }
            });
        });

        dtree.on("node('demoTree3')" ,function(param){
            var choose = dtree.getNowParam(organizationUtil.jobTree);
            // 初始化职位定级
            organizationUtil.jobScoreTree = dtree.render({
                elem: "#demoTree4",
                url: reqBasePath + 'companyjobscore008?jobId=' + choose.nodeId,
                dataStyle: 'layuiStyle',
                method: 'GET',
                done: function(json) {
                    if($("#demoTree4 li").length > 0){
                        for(var i = 0; i < $("#demoTree4 li").length; i++){
                            if($("#demoTree4 li").eq(i).attr("data-id") == mation.jobScoreId){
                                $("#demoTree4 li").eq(i).children('div').click();
                                return;
                            }
                        }
                    }
                }
            });
        });
    },

    /**
     * 获取企业信息
     */
    getCompanyMation: function (dtree) {
        return organizationUtil.judgeNullRetuenObject(organizationUtil.getTreeObject(dtree).getNowParam(organizationUtil.companyTree));
    },

    /**
     * 获取部门信息
     */
    getDepartmentMation: function (dtree) {
        return organizationUtil.judgeNullRetuenObject(organizationUtil.getTreeObject(dtree).getNowParam(organizationUtil.departmentTree));
    },

    /**
     * 获取岗位信息
     */
    getJobMation: function (dtree) {
        return organizationUtil.judgeNullRetuenObject(organizationUtil.getTreeObject(dtree).getNowParam(organizationUtil.jobTree));
    },

    /**
     * 获取岗位定级信息
     */
    getJobScoreMation: function (dtree) {
        return organizationUtil.judgeNullRetuenObject(organizationUtil.getTreeObject(dtree).getNowParam(organizationUtil.jobScoreTree));
    },

    getTreeObject: function (dtree) {
        if (isNull(dtree)) {
            return organizationUtil.dtree
        } else {
            return dtree
        }
    },

    judgeNullRetuenObject: function (object) {
        return isNull(object) ? {} : object;
    }

}


// 行政管理模块相关工具
var adminAssistantUtil = {

    /**
     * 资产选择页面---组件管理使用
     *
     * @param callback 回调函数
     */
    assetCheckType: false, // 选择类型，默认单选，true:多选，false:单选
    checkAssetMation: [], // 选择时返回的对象
    openAssetChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/assetManage/assetManageChoose.html",
            title: "资产选择",
            pageId: "assetManageChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof (callback) == "function") {
                    callback(adminAssistantUtil.checkAssetMation);
                }
            }
        });
    },

    /**
     * 未申领资产明细选择页面---组件管理使用
     *
     * @param callback 回调函数
     */
    assetReportCheckType: false, // 选择类型，默认单选，true:多选，false:单选
    checkAssetReportMation: [], // 选择时返回的对象
    openAssetReportChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/assetReportManage/assetReportUnUseChoose.html",
            title: "资产选择",
            pageId: "assetReportUnUseChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof (callback) == "function") {
                    callback(adminAssistantUtil.checkAssetReportMation);
                }
            }
        });
    },

    /**
     * 我申领中的资产明细选择页面---组件管理使用
     *
     * @param callback 回调函数
     */
    myUseAssetReportCheckType: false, // 选择类型，默认单选，true:多选，false:单选
    checkMyUseAssetReportMation: [], // 选择时返回的对象
    openMyUseAssetReportChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/assetReportManage/assetReportMyUseChoose.html",
            title: "资产选择",
            pageId: "assetReportUnUseChoose",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof (callback) == "function") {
                    callback(adminAssistantUtil.checkMyUseAssetReportMation);
                }
            }
        });
    },

};



var sysDictDataUtil = {

    dictDataMap: {},

    /**
     * 获取指定状态的数据字典分类
     *
     * @param enabled 状态（1 启用  2.停用）
     * @param callback 回执函数
     */
    queryDictTypeListByEnabled: function (enabled, callback) {
        var params = {
            enabled: enabled
        };
        AjaxPostUtil.request({url: reqBasePath + "queryDictTypeListByEnabled", params: params, type: 'json', method: "GET", callback: function(json) {
                if (typeof(callback) == "function") {
                    callback(json);
                }
            }, async: false});
    },

    /**
     * 获取指定分类下的的数据字典
     *
     * @param dictTypeCode 数据字典所属分类的Code
     * @param callback 回执函数
     */
    showDictDataListByDictTypeCode: function (dictTypeCode, showType, showBoxId, defaultId, form, callback, chooseCallback) {
        sysDictDataUtil.queryDictDataListByDictTypeCode(dictTypeCode, function (json) {
            dataShowType.showData(json, showType, showBoxId, defaultId, form, callback, chooseCallback);
        });
    },

    getShowTteeHtml: function (showBoxId, isRoot) {
        var _html = `<link href="../../assets/lib/layui/lay/modules/ztree/css/zTreeStyle/zTreeStyle.css" rel="stylesheet" />
                    <link href="../../assets/lib/layui/lay/modules/contextMenu/jquery.contextMenu.min.css" rel="stylesheet" />
                    <div class="layui-inline" style="width: 100%">
                        <div class="layui-input-inline" style="width: 100%">
                            <input type="text" id="${showBoxId}Name" name="${showBoxId}Name" placeholder="请输入要搜索的节点" class="layui-input" />
                            <input type="hidden" id="${showBoxId}Choose" name="${showBoxId}Choose" class="layui-input" />
                        </div>
                    </div>
                    <div class="layui-inline" style="width: 100%;">
                    <ul id="${showBoxId}Tree" class="ztree fsTree" method="get" isRoot="${isRoot}" isLoad="0" treeIdKey="id" inputs="parentId" treePIdKey="parentId" 
                        clickCallbackInputs="parentId:$id" treeName="name" style="overflow-y: auto; height: 100%;"></ul>
                    </div>
                    <script type="text/javascript" src="../../assets/lib/layui/lay/modules/contextMenu/jquery.contextMenu.min.js"></script>
                    <script type="text/javascript" src="../../assets/lib/layui/lay/modules/ztree/js/jquery.ztree.all.min.js"></script>
                    <script type="text/javascript" src="../../assets/lib/layui/lay/modules/ztree/js/jquery.ztree.exhide.min.js"></script>
                    <script type="text/javascript" src="../../assets/lib/layui/lay/modules/ztree/js/fuzzysearch.js"></script>`;
        return _html;
    },

    /**
     * 获取指定分类下的的数据字典
     *
     * @param dictTypeCode 数据字典所属分类的Code
     * @param callback 回执函数
     */
    queryDictDataListByDictTypeCode: function (dictTypeCode, callback) {
        if (isNull(sysDictDataUtil.dictDataMap[dictTypeCode])) {
            var params = {
                dictTypeCode: dictTypeCode
            };
            AjaxPostUtil.request({url: reqBasePath + "queryDictDataListByDictTypeCode", params: params, type: 'json', method: "GET", callback: function(json) {
                    sysDictDataUtil.dictDataMap[dictTypeCode] = json;
                }, async: false});
        }
        if (typeof(callback) == "function") {
            callback(sysDictDataUtil.dictDataMap[dictTypeCode]);
        }
    },

    getDictDataNameByCodeAndKey: function (dictTypeCode, key) {
        var displayName = '';
        sysDictDataUtil.queryDictDataListByDictTypeCode(dictTypeCode, function (json) {
            $.each(json.rows, function (i, item) {
                if (item.id == key) {
                    displayName = item.name;
                }
            });
        });
        return displayName;
    }

};


// 枚举类相关的工具类
var skyeyeClassEnumUtil = {

    classEnumMap: {},

    /**
     * 展示枚举类的集合数据
     *
     * @param code 枚举类对应的前台code
     * @param showType 展示类型
     * @param showBoxId 展示位置
     * @param defaultId 默认回显值
     * @param form form对象
     * @param callback 回调函数
     * @param valueKey value展示的key
     */
    showEnumDataListByClassName: function (code, showType, showBoxId, defaultId, form, callback, valueKey) {
        var json = skyeyeClassEnumUtil.getEnumDataListByClassName(code);
        dataShowType.showData(json, showType, showBoxId, defaultId, form, callback, null, valueKey);
    },

    getEnumDataNameByClassName: function (code, key, value, getKey) {
        var json = skyeyeClassEnumUtil.getEnumDataListByClassName(code);
        var result = getInPoingArr(json.rows, key, value, getKey);
        return isNull(result) ? '' : result;
    },
    getEnumDataListByClassName: function (code) {
        if (isNull(skyeyeClassEnumUtil.classEnumMap[code])) {
            var params = {
                className: encodeURIComponent(skyeyeClassEnum[code]["className"])
            };
            if (!isNull(skyeyeClassEnum[code]["filterValue"])) {
                params["filterValue"] = skyeyeClassEnum[code]["filterValue"];
                params["filterKey"] = skyeyeClassEnum[code]["filterKey"];
            }
            AjaxPostUtil.request({url: reqBasePath + "getEnumDataByClassName", params: params, type: 'json', method: "POST", callback: function(json) {
                    skyeyeClassEnumUtil.classEnumMap[code] = json;
                }, async: false});
        }
        return skyeyeClassEnumUtil.classEnumMap[code];
    },
    getEnumDataListByClassNameStr: function (className) {
        var params = {
            className: encodeURIComponent(className)
        };
        let result = [];
        AjaxPostUtil.request({url: reqBasePath + "getEnumDataByClassName", params: params, type: 'json', method: "POST", callback: function(json) {
                result = json.rows;
            }, async: false});
        return result;
    },

    getEnumDataNameByCodeAndKey: function (code, idKey, key, displayNameKey) {
        var json = skyeyeClassEnumUtil.getEnumDataListByClassName(code);
        var displayName = '';
        $.each(json.rows, function (i, item) {
            if (item[idKey] == key) {
                if (!isNull(item.color)) {
                    displayName = '<span style="color: ' + item.color + '">' + item[displayNameKey] + '</span>';
                } else {
                    displayName = item[displayNameKey];
                }
            }
        });
        return displayName;
    }

};


// 学校模块相关工具类
var schoolUtil = {

    /**
     * 获取当前登陆用户所属的学校列表
     *
     * @param callback 回执函数
     */
    queryMyBelongSchoolList: function (callback) {
        AjaxPostUtil.request({url: schoolBasePath + "queryAllSchoolList", params: {}, type: 'json', method: "GET", callback: function(json) {
                if (typeof(callback) == "function") {
                    callback(json);
                }
            }, async: false});
    },

};
