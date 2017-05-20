/**
 * Created by xs on 2017/4/22.
 */
angular.module("klwkOmsApp")
    .factory('newStorageInformationService', ["ApiService","toolsService",function(ApiService,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#newStorageInformation";
        /**
         * 新增仓库信息
         */
        var saveStorage = function (scope) {
            var url = "/BasicInformation/Warehouse/Save";
            var param = $.extend({
                body: JSON.stringify(scope.currentItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    scope.goBack();
                }
            });
        };
        /**
         * 获取物流接口选项 每次初始化页面获取
         */
        var getLogisticsInterface = function(scope) {
            var url = "/BasicInformation/LogisticsInterface/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 物流接口
                    scope.interfaceList.info = res.data;
                    if(scope.params.oprate == 'edit'){
                        if(scope.currentItem.applicationid){
                            scope.interfaceList.setValue({id:scope.currentItem.applicationid});
                        }
                    }else if(scope.params.oprate == 'creat'){
                        scope.interfaceList.init();
                    }
                }
            });
        };
        /**
         * 获取仓库选项 每次初始化页面获取
         */
        var getWarehouse = function(scope) {
            var url = "/BasicInformation/Warehouse/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseType",
                    "Name": "WarehouseType",
                    "Value": 1,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.WarehouseList.info = res.data;
                    if(scope.params.oprate == 'edit'){
                        if(scope.currentItem.parentid){
                            scope.WarehouseList.setValue({id:scope.currentItem.parentid});
                        }
                    }else if(scope.params.oprate == 'creat'){
                        scope.WarehouseList.init();
                    }
                }
            });
        };





        var currentService = {
            //存储所有仓库 用于过滤父级仓库字段
            "allWarehouse" : {}
        };


        currentService["saveStorage"] = saveStorage;
        currentService["getLogisticsInterface"] = getLogisticsInterface;
        currentService["getWarehouse"] = getWarehouse;

        return currentService;

    }]);