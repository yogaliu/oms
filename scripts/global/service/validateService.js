/**
 * Created by liaocan on 2017/4/12.
 * 定义validateService服务
 * 功能：表单验证
 * */
angular.module("klwkOmsApp")
    .factory('validateService', ["$rootScope",function($rootScope) {
        var currentService = {};
        /*校验方法 返回布尔值*/
        currentService.validate = function (_this) {
            var type = _this[0].tagName.toLowerCase();
            if(type == 'input' || type == 'textarea'){
                var validateType = $(_this).attr('name');
                var val = $(_this).val();
                switch (validateType){
                    case "name" :   //姓名校验
                        var pattern = /^[\u4E00-\u9FA5]{1,6}$/;  //中文正则
                        if(! pattern.test(val)){
                            return false
                        }
                        break;
                    case "password" :    //密码校验
                        if(_this.val().length < 6 && _this.val().length < 13){   //长度大于6小于13
                            return false
                        }
                        break;
                    case "phone" :    //手机号码校验
                        var pattern = /^1[34578]\d{9}$/;   //手机号找正则
                        if(! pattern.test(val)){
                            return false
                        }
                        break;
                    case "email" :    //邮箱校验
                        var pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;   //邮箱正则
                        if(! pattern.test(val)){
                            return false
                        }
                        break;
                    case "empty" :    //非空校验
                        if(val === "" || val === undefined || val === null){
                            return false
                        }
                        break;
                    case "number" : //数字校验
                        var pattern = /\d+(\.\d+)?/;
                        if(!pattern.test(val)){
                            return false;
                        }
                }
                return true;
            }else {
                var val = $(_this).find('.text').text();
                if(val === "请选择"){
                    return false;
                }else{
                    return true;
                }
            }
        };



        // 当页面加载完成后绑定监听事件
        currentService.initValidate =function (pageId) {
            // 绑定当前页面下from中所有需要校验的input
            $(pageId +' .form .validate').on('blur',function () {
                if(currentService.validate($(this))){
                    $(this).removeClass('klw-input-error');
                    $(this).addClass('klw-input-success');
                }else{
                    $(this).removeClass('klw-input-success');
                    $(this).addClass('klw-input-error');
                }
            });
            // 绑定当前页面下from中所有需要校验的时间控件
            $(pageId +' .form .datetimepicker').on('changeDate',function () {
                $(this).removeClass('klw-input-error');
                $(this).addClass('klw-input-success');
            });
        };
        //表单提交之前先校验 pageId为页面id formId为表单id
        currentService.validateAll = function (pageId,formId) {
            var validateList = $(pageId + " " + formId).find('.validate');
            for(var i=0;i<validateList.length;i++){
                var type = validateList[i].tagName.toLowerCase();
                if(type == 'input' || type == 'textarea'){
                    if(!currentService.validate($(validateList[i]))){
                        validateList.eq(i).focus().addClass('klw-input-error');
                        return false;
                    }
                }else{
                    if(!currentService.validate($(validateList[i]))){
                        validateList.eq(i).find('.select-content').addClass('klw-input-error');
                        return false;
                    }
                }
            }
            return true;
        };
        //初始化时清除类名
        currentService.clearValidateClass = function (pageId,formId) {
            var validateList = $(pageId + " " + formId).find('.validate');
            for(var i=0;i<validateList.length;i++){
                var type = validateList[i].tagName.toLowerCase();
                if(type == 'input' || type == 'textarea'){
                    validateList.eq(i).removeClass('klw-input-error');
                    validateList.eq(i).removeClass('klw-input-success');
                }else{
                    validateList.eq(i).find('.select-content').removeClass('klw-input-error');
                    validateList.eq(i).find('.select-content').removeClass('klw-input-success');
                }
            }
        };

        return currentService;

    }]);
