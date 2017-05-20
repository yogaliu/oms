/**
 * Created by xs on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('smsAccountService', ["ApiService","toolsService",function(ApiService,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#smsAccount";
        /**
         * 查询短信账号
         */
        var getSmsAccount = function (scope){
            var url = "/BasicInformation/SMS/Account/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    scope.tableList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableList,function (index, obj) {
                        obj.isdatacheck = false;
                        obj.SMSBalance = false;
                    })
                }
            });
        };
        /**
         * 删除短信账号
         */
        var deleteSmsAccount = function (scope,type) {
            var url = "/BasicInformation/SMS/Account/Delete";
            var ids = [];
            if(type == 'single'){
                ids.push(scope.activeItem.id);
            }else if(type == 'batch'){
                //获取所有的勾选项
                $.each(scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        ids.push(obj.id);
                    }
                });
            }
            var param = $.extend({
                body: JSON.stringify(ids)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertSuccess({content : '操作成功',time : 1000});
                    getSmsAccount(scope);
                }
            });
        };
        /**
         * 发短信
         */
        var sendSMS = function (scope) {
            var url = "/BasicInformation/SMS/SendSMS";
            var param = $.extend({
                AccountId: scope.activeItem.id,
                Content: scope.formData.content,
                Mobiles: scope.formData.mobiles
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #sendSmsModal").modal('hide');
                }
            });
        };
        /**
         * 查余额
         */
        var getBalance = function (scope,i) {
            var url = "/BasicInformation/SMS/Balance/" + scope.activeItem.id;
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    scope.tableList[i].SMSBalance = "当前可用余额：" + res.data;
                }else {
                    scope.tableList[i].SMSBalance = "未查询到余额信息，请与短信服务商联系核对账号信息";
                }
            });
        };
        return {
            "getSmsAccount" : getSmsAccount,
            "deleteSmsAccount" : deleteSmsAccount,
            "sendSMS" : sendSMS,
            "getBalance" : getBalance
        };

    }]);
