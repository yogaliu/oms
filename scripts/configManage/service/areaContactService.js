/**
 * Created by xs on 2017/4/22.
 */
angular.module("klwkOmsApp")
    .factory('areaContactService', ["ApiService","APP_MENU","toolsService",function(ApiService,APP_MENU,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#areaContact";
        /**
         * 查询页面数据
         */
        var query = function(scope) {
            var url = "/BasicInformation/RegionMapper/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.111",
                    "SeletedCount": 0,
                    "Data": [{
                        "OperateType": 8,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "PlatformRegionNameAuxiliary",
                        "Name": "PlatformRegionNameAuxiliary",
                        "Value": scope.formData.platform,
                        "Children": []
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //配置分页插件 数据总条数
                    scope.paginationConf.totalItems = res.total;
                    scope.tableList = res.data;
                }
            });
        };
        /**
         * 修改
         */
        var editMapper = function (scope) {
            var url = "/BasicInformation/RegionMapper/Save";
            var param = $.extend({
                body: JSON.stringify({
                    "PlatformRegionNameAuxiliary": scope.activeItem.platformregionnameauxiliary,
                    "Id": scope.activeItem.id,
                    "CreateDate": scope.activeItem.createdate,
                    "NationId": scope.activeItem.nationid?scope.activeItem.nationid:"00000000-0000-0000-0000-000000000000",
                    "ProvinceId": scope.activeItem.provinceid,
                    "ProvinceName": scope.activeItem.provincename,
                    "CityId": scope.activeItem.cityid,
                    "CityName": scope.activeItem.cityname,
                    "CountyId": scope.activeItem.countyid,
                    "CountyName": scope.activeItem.countyname,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #editModal").modal('hide');
                    query(scope);
                }
            });
        };
        /**
         * 获取省选项
         */
        var queryProvince = function(scope) {
            var url = "/BasicInformation/Region/Query";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "RegionLevel",
                    "Value": 2,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 省
                    scope.ProvinceList.info = res.data;
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
                    "Value": scope.activeItem.provinceid,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 市
                    scope.CityList.info = res.data;
                    if(init){
                        scope.CityList.setValue({id:scope.activeItem.cityid});
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
                    "Value": scope.activeItem.cityid,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 区
                    scope.CountyList.info = res.data;
                    if(init){
                        scope.CountyList.setValue({id:scope.activeItem.countyid});
                    }else{
                        scope.CountyList.init();
                    }
                }
            });
        };

        var currentService = {};

        currentService["query"] = query;
        currentService["editMapper"] = editMapper;
        currentService["queryProvince"] = queryProvince;
        currentService["queryCity"] = queryCity;
        currentService["queryCounty"] = queryCounty;

        return currentService;

    }]);
