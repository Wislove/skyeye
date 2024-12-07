
// 以下两个参数开启团队权限时有值
// var objectId = '', objectKey = '';
// var nodeType=1;
// // 根据以下两个参数判断：工作流的判断是否要根据serviceClassName的判断
// var serviceClassName;

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'textool'], function (exports) {
    winui.renderColor();
    var index = parent.layer.getFrameIndex(window.name);
    var $ = layui.$,
        textool = layui.textool,
        form = layui.form;
    var selOption = getFileContent('tpl/template/select-option.tpl');

    var id = GetUrlParam("id");
    var schoolId = GetUrlParam("schoolId");
    var getSchoolId =  '';
    console.log(id)
    console.log(schoolId)
    function initplaceSelect(defaultStartId,defaultEndId,schoolId) {
        AjaxPostUtil.request({
            url: schoolBasePath + "queryTeachBuildingBySchoolId",
            params: {
                schoolId:schoolId
            },
            type: 'json',
            method: 'Get',
            callback: function (json) {
                console.log(json)
                $("#startId").html(getDataUseHandlebars(selOption, json));
                $("#endId").html(getDataUseHandlebars(selOption, json));
                if (!isNull(defaultStartId)) {
                    $("#startId").val(defaultStartId)
                }
                if(!isNull(defaultEndId)){
                    $("#endId").val(defaultEndId)
                }
                form.render('select');
            }
        });
    }


    if (!isNull(id)) {
        AjaxPostUtil.request({
            url: schoolBasePath + "queryRouteById",
            params: {id: id},
            type: 'json',
            method: 'Get',
            callback: function (json) {
                console.log(json)
                $("#startId").val(json.bean.startId);
                $("#endId").val(json.bean.endId);
                skyeyeClassEnumUtil.showEnumDataListByClassName("commonEnable", 'radio',"enabled", json.bean.enabled, form);
                getSchoolId=json.bean.schoolId;
                initplaceSelect(json.bean.startId,json.bean.endId,json.bean.schoolId);
                textool.init({eleId: 'remark', maxlength: 200});
                form.render();
            }
        });
    } else {
        skyeyeClassEnumUtil.showEnumDataListByClassName("commonEnable", 'radio', "enabled", '', form);
        textool.init({eleId: 'remark', maxlength: 200});
        initplaceSelect('', '', schoolId)
        form.render();
    }

    form.on('submit(formWriteBean)', function (data) {
        if (winui.verifyForm(data.elem)) {
            var params = {
                id: isNull(id)? '' : id,
                // className: className,
                startId: $("#startId").val(),
                endId: $("#endId").val(),
                // routeLength:'',
                schoolId: isNull(schoolId)? getSchoolId : schoolId,
                enabled: dataShowType.getData('enabled'),
            };

            AjaxPostUtil.request({
                url: schoolBasePath + "writeRoute",
                params: params,
                type: 'json',
                method: 'POST',
                callback: function (json) {
                    parent.layer.close(index);
                    parent.reloadTable = '0';
                }
            });
            console.log(params);
        }
        return false;
    })

    $("body").on("click", "#cancle", function () {
        parent.layer.close(index);
    });

});