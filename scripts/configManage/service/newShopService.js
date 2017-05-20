/**
 * Created by xs on 2017/4/20.
 */
angular.module("klwkOmsApp")
    .factory('newShopService', ["ApiService","toolsService",function(ApiService,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#newShop";
        /**
         * 获取公司选项
         */
        var queryCompany = function(scope) {
            var url = "/BasicInformation/Company/Get";
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
                    //下拉选框插件 公司
                    scope.companyList.info = res.data;
                    if(scope.params.oprate == 'edit'){
                        scope.companyList.setValue({id:scope.editItem.companyid});
                    }
                }
            });
        };
        /**
         * 获取平台接口选项
         */
        var queryPlatformInterface = function(scope) {
            var url = "/BasicInformation/PlatformInterface/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 平台接口
                    scope.interfaceList.info = res.data;
                    if(scope.params.oprate == 'edit'){
                        scope.interfaceList.setValue({id:scope.editItem.interfaceid});
                    }
                }
            });
        };
        /**
         * 保存
         */
        var saveStore = function (scope) {
            var url = "/BasicInformation/Store/Save";
            var param = $.extend({
                body: JSON.stringify(scope.editItem)
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
         * 获取所有平台类型 缓存到服务
         */
        var getPlatformType = function (deffer) {
            var url = "/BasicInformation/PlatformType/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.allPlatformType = res.data;
                    if(deffer !== undefined){
                        deffer.resolve();
                    }
                }else{
                    if(deffer !== undefined){
                        deffer.reject();
                    }
                }
            });
        };


        var currentService = {
            //存储所有平台类型 用于过滤字段
            "allPlatformType" : {}
        };

        currentService["queryCompany"] = queryCompany;
        currentService["queryPlatformInterface"] = queryPlatformInterface;
        currentService["saveStore"] = saveStore;
        currentService["getPlatformType"] = getPlatformType;

        return currentService;

    }]);