/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('addProductRulesService', ["ApiService", "toolsService",
        function (ApiService,toolsService) {
            //获取身份验证
            var paramObj = ApiService.getBasicParamobj();

            /**
             * 商品属性值
             * @constructor
             */
            var getRuleValue = function (scope) {
                var url = "/Product/ProductEncodeRuleDetail/Get";
                var param = $.extend({
                    body:JSON.stringify([{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "EncodeRuleId",
                        "Name": "EncodeRuleId",
                        "Value": scope.parentItem.id,
                        "Children": []
                    }])
                },paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function (res) {
                    if (res.success) {
                        scope.parentItem.details = [];
                        $.each(res.data, function (index, obj) {
                            scope.parentItem.details.push(
                                $.extend({
                                    "deleted": false,
                                    "isnew": false,
                                    "isupdate": false
                                }, obj)
                            );
                        });
                        // 根据规则属性值判断按钮位置
                        if (res.data.length == 0) {
                            scope.ruleValue = 'start';
                        } else {
                            scope.ruleValue = '';
                        }
                    }
                });
            };

            /**
             * 新增商品规则
             * @constructor
             */
            var save = function (scope, data) {
                var url = "/Product/ProductEncodeRule/Save";
                var param = $.extend({
                    body:JSON.stringify({
                        "Id": data.id?data.id:"00000000-0000-0000-0000-000000000000",
                        "CreateDate": data.createDate?data.createDate:"0001-01-01 00:00:00",
                        "Code": data.code,
                        "Name": data.name,
                        "IsDisabled": false,
                        "Seq": data.seq,
                        "IsShow": data.isShow,
                        "IsProduct": data.isNumber,
                        "Detail": data.details,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    })
                },paramObj);
                var promise = ApiService.post(url,param);
                promise.then(function (res) {
                    if (res.success) {
                        scope.goBack();
                        toolsService.alertSuccess({"msg": "保存成功！", time: 2000});
                    } else {
                        toolsService.alertMsg({content: res.errorMessage, time: 1000});
                    }
                });
            };

            return {
                "getRuleValue": getRuleValue,
                "save": save
            };

        }]);