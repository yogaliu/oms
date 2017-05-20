/**
 * Created by xs on 2017/4/27.
 */
angular.module("klwkOmsApp")
    .factory('newExpressAreaService', ["ApiService","APP_MENU","toolsService",function(ApiService,APP_MENU,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#newExpressArea";
        /**
         * 保存
         */
        var save = function(scope) {
            var url = "/BasicInformation/ExpressRegion/Save";
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
         * 获取国家选项
         */
        var queryCountry = function(scope) {
            var url = "/BasicInformation/Region/Query";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "RegionLevel",
                    "Value": 1,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ParentId",
                    "Value": "00000000-0000-0000-0000-000000000000",
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 国家
                    scope.CountryList.info = res.data;
                    if(scope.params.oprate == 'edit'){
                        scope.CountryList.setValue({id:scope.currentItem.countryid});
                    }
                }
            });
        };
        /**
         * 获取省选项
         */
        var queryProvince = function(scope,init) {
            var url = "/BasicInformation/Region/Query";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "RegionLevel",
                    "Value": 2,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ParentId",
                    "Value": scope.currentItem.countryid,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 省
                    scope.ProvinceList.info = res.data;
                    if(init){
                        if(scope.params.oprate == 'edit'){
                            scope.ProvinceList.setValue({id:scope.currentItem.provinceid});
                        }
                    }else{
                        scope.ProvinceList.init();
                        //下拉选框插件 市
                        scope.CityList.info = [];
                        scope.CityList.init();
                        //下拉选框插件 区
                        scope.CountyList.info = [];
                        scope.CountyList.init();
                    }
                }
            });
        };
        /**
         * 获取市选项
         */
        var queryCity = function(scope,init) {
            var url = "/BasicInformation/Region/Query";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "RegionLevel",
                    "Value": 3,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ParentId",
                    "Value": scope.currentItem.provinceid,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 市
                    scope.CityList.info = res.data;
                    if(init){
                        if(scope.params.oprate == 'edit'){
                            scope.CityList.setValue({id:scope.currentItem.cityid});
                        }
                    }else{
                        scope.CityList.init();
                        //下拉选框插件 区
                        scope.CountyList.info = [];
                        scope.CountyList.init();
                    }
                }
            });
        };
        /**
         * 获取区选项
         */
        var queryCounty = function(scope,init) {
            var url = "/BasicInformation/Region/Query";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "RegionLevel",
                    "Value": 4,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ParentId",
                    "Value": scope.currentItem.cityid,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 区
                    scope.CountyList.info = res.data;
                    if(init){
                        if(scope.params.oprate == 'edit'){
                            scope.CountyList.setValue({id:scope.currentItem.countyid});
                        }
                    }else{
                        scope.CountyList.init();
                    }
                }
            });
        };




        var currentService = {
            //存储所有快递公司
            "allExpress" : {}
        };

        currentService["save"] = save;
        currentService["queryCountry"] = queryCountry;
        currentService["queryProvince"] = queryProvince;
        currentService["queryCity"] = queryCity;
        currentService["queryCounty"] = queryCounty;

        return currentService;

    }]);