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
    var className = GetUrlParam("className");
    var appId = GetUrlParam("appId");
    var id = GetUrlParam("id");

    function initPayAppSelect(defaultAppId) {
        AjaxPostUtil.request({
            url: reqBasePath + "queryAllEnabledPayAppList",
            type: 'json',
            method: 'POST',
            callback: function (json) {
                $("#appId").html(getDataUseHandlebars(selOption, json));
                if (!isNull(defaultAppId)) {
                    $("#appId").val(defaultAppId)
                }
                form.render('select');
            }
        });
    }

    if (!isNull(id)) {
        AjaxPostUtil.request({
            url: reqBasePath + "queryPayChannelById",
            params: {id: id},
            type: 'json',
            method: 'POST',
            callback: function (json) {
                $("#appId").val(json.bean.appId);
                skyeyeClassEnumUtil.showEnumDataListByClassName("commonEnable", 'radio',"enabled", json.bean.enabled, form);
                skyeyeClassEnumUtil.showEnumDataListByClassName("payType",'select',  "codeNum", json.bean.codeNum, form);
                loadByCodeNum();
                $("#feeRate").val(json.bean.feeRate);
                $("#remark").val(json.bean.remark);
                initData(json);
                textool.init({eleId: 'remark', maxlength: 200});
                form.render();
                initPayAppSelect(json.bean.appId);
            }
        });
    } else {
        skyeyeClassEnumUtil.showEnumDataListByClassName("commonEnable", 'radio', "enabled", '', form);
        skyeyeClassEnumUtil.showEnumDataListByClassName("payType", 'select', "codeNum", '', form);
        textool.init({eleId: 'remark', maxlength: 200});
        form.render();
        initPayAppSelect();
    }

    function loadByCodeNum() {
        let codeNum = $("#codeNum").val()
        if (['wx_pub', 'wx_lite', 'wx_app', 'wx_native', 'wx_wap', 'wx_bar'].includes(codeNum)) {
            $('.wx-input-fields').show();
            $('.zfb-input-fields').hide();
            $('.mn-input-fields').hide();
        } else if (['alipay_pc','alipay_wap','alipay_app','alipay_qr','alipay_bar'].includes(codeNum)) {
            $('.zfb-input-fields').show();
            $('.wx-input-fields').hide();
        }
        else {
            $('.zfb-input-fields').hide();
            $('.wx-input-fields').hide();
        }
    }

    function initData(json) {
        let codeNum = $("#codeNum").val()
        if (['wx_pub', 'wx_lite', 'wx_app', 'wx_native', 'wx_wap', 'wx_bar'].includes(codeNum)) {
            $("#mchId").val(json.bean.configMation.mchId);
            $("#apiVersion").val(json.bean.configMation.apiVersion);
            $("#mchKey").val(json.bean.configMation.mchKey);
            $("#keyContent").val(json.bean.configMation.keyContent);
            $("#privateKeyContent").val(json.bean.configMation.privateKeyContent);
            $("#apiV3Key").val(json.bean.configMation.apiV3Key);
            $("#certSerialNo").val(json.bean.configMation.certSerialNo);
        }else if (['alipay_pc','alipay_wap','alipay_app','alipay_qr','alipay_bar'].includes(codeNum)) {
            $("#serverUrl").val(json.bean.configMation.serverUrl);
            $("#signType").val(json.bean.configMation.signType);
            $("#mode").val(json.bean.configMation.mode);
            $("#privateKey").val(json.bean.configMation.privateKey);
            $("#alipayPublicKey").val(json.bean.configMation.alipayPublicKey);
            $("#appCertContent").val(json.bean.configMation.appCertContent);
            $("#alipayPublicCertContent").val(json.bean.configMation.alipayPublicCertContent);
            $("#rootCertContent").val(json.bean.configMation.rootCertContent);
        }
    }

    // 添加 codeNum 的监听
    form.on('select(codeNum)', function (data) {
        loadByCodeNum();
    });

    matchingLanguage();
    form.render();
    form.on('submit(formWriteBean)', function (data) {
        if (winui.verifyForm(data.elem)) {
            var params = {
                className: className,
                appId: $("#appId").val(),
                enabled: dataShowType.getData('enabled'),
                codeNum: $("#codeNum").val(),
                feeRate: $("#feeRate").val(),
                id: isNull(id)? '' : id,

            };

                if (['wx_pub', 'wx_lite', 'wx_app', 'wx_native', 'wx_wap', 'wx_bar'].includes(params.codeNum)) {//
                    let config = {
                        appId: $("#appId").val(),
                        mchId: $("#mchId").val(),
                        apiVersion: $("#apiVersion").val(),
                        mchKey: $("#mchKey").val(),
                        keyContent: $("#keyContent").val(),
                        privateKeyContent: $("#privateKeyContent").val(),
                        apiV3Key: $("#apiV3Key").val(),
                        certSerialNo: $("#certSerialNo").val()
                    }
                    params.config = JSON.stringify(config)
                }else if (['alipay_pc','alipay_wap','alipay_app','alipay_qr','alipay_bar'].includes(params.codeNum)){
                    let config = {
                        serverUrl: $("#serverUrl").val(),
                        signType: $("#signType").val(),
                        mode:$("#mode").val(),
                        privateKey: $("#privateKey").val(),
                        alipayPublicKey: $("#alipayPublicKey").val(),
                        appCertContent: $("#appCertContent").val(),
                        alipayPublicCertContent: $("#alipayPublicCertContent").val(),
                        rootCertContent: $("#rootCertContent").val(),
                    }
                    params.appId = config.appId
                    params.config = JSON.stringify(config)
                }else if (['mock'].includes(params.codeNum)){
                    let config = {
                        appId: $("#appId").val(),
                    }
                    params.appId = config.appId
                    params.config = JSON.stringify(config)
                }

            AjaxPostUtil.request({
                url: reqBasePath + "writePayChannel",
                params: params,
                type: 'json',
                method: 'POST',
                callback: function (json) {
                    parent.layer.close(index);
                    parent.refreshCode = '0';
                }
            });
        }
        return false;
    });

    $("body").on("click", "#cancle", function () {
        parent.layer.close(index);
    });

    // 隐藏微信相关输入框初始状态
    $('.wx-input-fields').hide();

    //隐藏支付宝相关输入框初始状态
    $('.zfb-input-fields').hide();

});