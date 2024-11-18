layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'textool'], function (exports) {
    winui.renderColor();
    var index = parent.layer.getFrameIndex(window.name);
    var $ = layui.$,
        form = layui.form;
    var className = GetUrlParam("className");
    var id = GetUrlParam("id");

    if (!isNull(id)) {
        AjaxPostUtil.request({
            url: reqBasePath + "queryFileConfigById",
            params: {id: id},
            type: 'json',
            method: 'GET',
            callback: function (json) {
                $("#name").val(json.bean.name);
                skyeyeClassEnumUtil.showEnumDataListByClassName("commonIsDefault", 'radio',"isDefault", json.bean.isDefault, form);
                skyeyeClassEnumUtil.showEnumDataListByClassName("fileStorageEnum",'select',  "storage", json.bean.storage, form);
                skyeyeClassEnumUtil.showEnumDataListByClassName("fileFtpMode",'select', "mode", json.bean.mode, form);
                loadByStorage();
                initData(json);
                form.render();
            }
        });
    } else {
        skyeyeClassEnumUtil.showEnumDataListByClassName("commonIsDefault", 'radio', "isDefault", '', form);
        skyeyeClassEnumUtil.showEnumDataListByClassName("fileStorageEnum",'select',  "storage", '', form);
        skyeyeClassEnumUtil.showEnumDataListByClassName("fileFtpMode",'select', "mode", '', form);
        form.render();
    }

    function loadByStorage() {
        let storage = $("#storage").val()
        if (1 == storage) {
            $('.db-input-fields').show();
            $('.local-input-fields').hide();
            $('.ftp-input-fields').hide();
            $('.sftp-input-fields').hide();
            $('.s3-input-fields').hide();
        } else if (10 == storage) {
            $('.db-input-fields').hide();
            $('.local-input-fields').show();
            $('.ftp-input-fields').hide();
            $('.sftp-input-fields').hide();
            $('.s3-input-fields').hide();
        }else  if (11 == storage) {
            $('.db-input-fields').hide();
            $('.local-input-fields').hide();
            $('.ftp-input-fields').show();
            $('.sftp-input-fields').hide();
            $('.s3-input-fields').hide();
        } else if (12 == storage) {
            $('.db-input-fields').hide();
            $('.local-input-fields').hide();
            $('.ftp-input-fields').hide();
            $('.sftp-input-fields').show();
            $('.s3-input-fields').hide();
        }else  if (20 == storage) {
            $('.db-input-fields').hide();
            $('.local-input-fields').hide();
            $('.ftp-input-fields').hide();
            $('.sftp-input-fields').hide();
            $('.s3-input-fields').show();
        } else {
            $('.db-input-fields').hide();
            $('.local-input-fields').hide();
            $('.ftp-input-fields').hide();
            $('.sftp-input-fields').hide();
            $('.s3-input-fields').hide();
        }
    }

    function initData(json) {
        let storage = $("#storage").val()
        if (['1'].includes(storage)) {
            $("#domain_db").val(json.bean.configMation.domain);
        }else if (['10'].includes(storage)) {
            $("#basePath_local").val(json.bean.configMation.basePath);
            $("#domain_local").val(json.bean.configMation.domain);
        }else if (['11'].includes(storage)) {
            $("#basePath_ftp").val(json.bean.configMation.basePath);
            $("#domain_ftp").val(json.bean.configMation.domain);
            $("#host_ftp").val(json.bean.configMation.host);
            $("#port_ftp").val(json.bean.configMation.port);
            $("#username_ftp").val(json.bean.configMation.username);
            $("#password_ftp").val(json.bean.configMation.password);
            $("#mode").val(json.bean.configMation.mode);
        }else if (['12'].includes(storage)) {
            $("#basePath_sftp").val(json.bean.configMation.basePath);
            $("#domain_sftp").val(json.bean.configMation.domain);
            $("#host_sftp").val(json.bean.configMation.host);
            $("#port_sftp").val(json.bean.configMation.port);
            $("#username_sftp").val(json.bean.configMation.username);
            $("#password_sftp").val(json.bean.configMation.password);
        }else if (['20'].includes(storage)) {
            $("#endpoint").val(json.bean.configMation.endpoint);
            $("#domain_s3").val(json.bean.configMation.domain);
            $("#bucket").val(json.bean.configMation.bucket);
            $("#accessKey").val(json.bean.configMation.accessKey);
            $("#accessSecret").val(json.bean.configMation.accessSecret);
        }
    }

    // 添加 storage 的监听
    form.on('select(storage)', function (data) {
        loadByStorage();
    });

    matchingLanguage();
    form.render();
    form.on('submit(formWriteBean)', function (data) {
        if (winui.verifyForm(data.elem)) {
            var params = {
                className: className,
                name: $("#name").val(),
                isDefault: dataShowType.getData('isDefault'),
                storage: $("#storage").val(),
            id: isNull(id)? '' : id,

            };

            if (['1'].includes(params.storage)) {
                let config = {
                    domain: $("#domain_db").val(),
                }
                params.config = JSON.stringify(config)
            }else if (['10'].includes(params.storage)) {
                let config = {
                    basePath: $("#basePath_local").val(),
                    domain: $("#domain_local").val(),
                }
                params.config = JSON.stringify(config)
            }else if (['11'].includes(params.storage)) {
                let config = {
                    basePath: $("#basePath_ftp").val(),
                    domain: $("#domain_ftp").val(),
                    host: $("#host_ftp").val(),
                    port: $("#port_ftp").val(),
                    username: $("#username_ftp").val(),
                    password: $("#password_ftp").val(),
                    mode: $("#mode").val(),
                }
                params.config = JSON.stringify(config)
            }else if (['12'].includes(params.storage)) {
                let config = {
                    basePath: $("#basePath_sftp").val(),
                    domain: $("#domain_sftp").val(),
                    host: $("#host_sftp").val(),
                    port: $("#port_sftp").val(),
                    username: $("#username_sftp").val(),
                    password: $("#password_sftp").val(),
                }
                params.config = JSON.stringify(config)
            }else if (['20'].includes(params.storage)) {
                let config = {
                    endpoint: $("#endpoint").val(),
                    domain: $("#domain_s3").val(),
                    bucket: $("#bucket").val(),
                    accessKey: $("#accessKey").val(),
                    accessSecret: $("#accessSecret").val(),
                }
                params.config = JSON.stringify(config)
            }

            AjaxPostUtil.request({
                url: reqBasePath + "writeFileConfig",
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

    $('.db-input-fields, .local-input-fields, .ftp-input-fields, .sftp-input-fields, .s3-input-fields').hide();

});