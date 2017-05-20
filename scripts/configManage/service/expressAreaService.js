/**
 * Created by xs on 2017/4/22.
 */
angular.module("klwkOmsApp")
    .factory('expressAreaService', ["ApiService","APP_MENU","toolsService","storageAreaService",function(ApiService,APP_MENU,toolsService,storageAreaService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#expressArea";
        /**
         * 获取快递范围
         */
        var query = function(scope) {
            var url = "/BasicInformation/ExpressRegion/Query";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.138",
                    "SeletedCount": 0,
                    "Data": [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ExpressId",
                        "Name": "ExpressId",
                        "Value": scope.formData.ExpressId,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ProvinceId",
                        "Name": "ProvinceId",
                        "Value": scope.formData.ProvinceId,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "CityId",
                        "Name": "CityId",
                        "Value": scope.formData.CityId,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "CountyId",
                        "Name": "CountyId",
                        "Value": scope.formData.CountyId,
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
                    $.each(scope.tableList,function (index, obj) {
                        //默认未选中数据
                        obj.isdatacheck = false;
                    })
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
        var queryCity = function(scope) {
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
                    "Value": scope.formData.ProvinceId,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 市
                    scope.CityList.info = res.data;
                    scope.CityList.init();
                    //下拉选框插件 区
                    scope.CountyList.info = [];
                    scope.CountyList.init();
                }
            });
        };
        /**
         * 获取区选项
         */
        var queryCounty = function(scope) {
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
                    "Value": scope.formData.CityId,
                    "Children": []
                }])
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //下拉选框插件 区
                    scope.CountyList.info = res.data;
                    scope.CountyList.init();
                }
            });
        };
        /**
         * 获取快递 缓存到服务
         */
        var getExpress = function(deffer) {
            var url = "/BasicInformation/Express/Get";
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
                    currentService.allExpress = res.data;
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
        /**
         * 删除快递范围
         */
        var deleteItem = function(scope,type) {
            var url = "/BasicInformation/ExpressRegion/Delete";
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
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    query(scope);
                }
            });
        };
        /**
         * 导出
         */
        var exportFile = function(scope,type) {
            var url = "/BasicInformation/ExpressRegion/ExportExpressRegion";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": 1,
                    "PageSize": 1000,
                    "SeletedCount": 0,
                    "Data": [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ExpressId",
                        "Name": "ExpressId",
                        "Value": "30d4eec1-9b51-420c-8c10-c023c0e8a257",
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

                }
            });
        };
        /**
         * 获取快递的区域设置
         */
        var getExpressRegion = function (scope) {
            var url = "/BasicInformation/ExpressRegion/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ExpressId",
                    "Name": "ExpressId",
                    "Value": scope.setExpressId,
                    "Children": []
                }, {
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
                    //已选的省市区id集合
                    scope.selectRegionidList = [];
                    $.each(res.data,function (index, obj) {
                        scope.selectRegionidList.push(obj.provinceid);
                        scope.selectRegionidList.push(obj.cityid);
                        scope.selectRegionidList.push(obj.countyid);
                    });
                    var promise = ApiService.listenAll(function(deffer){
                        if($.isEmptyObject(storageAreaService.allRegion)){
                            storageAreaService.getAllRegion(deffer);
                        }else{
                            deffer.resolve();
                        }
                    });
                    promise.then(function(){
                        //在已选的省市区id集合中存在时被勾选
                        var list = $.extend(true,[],storageAreaService.allRegion);
                        $.each(list,function (index, obj) {
                            if(scope.selectRegionidList.contains(obj.id) >= 0){
                                obj.isdatacheck = true;
                            }else {
                                obj.isdatacheck = false;
                            }
                        });
                        scope.allRegion = new originArrayToTreeData(list);
                    });
                }
            });
        };
        /**
         * 保存区域设置
         */
        var saveAreaSet = function (scope) {
            var url = "/BasicInformation/ExpressRegion/BatchSave";
            var param = $.extend({
                "body": JSON.stringify(scope.selectList)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #areaSetModal").modal('hide');
                }
            });
        };

        var currentService = {
            //缓存所有快递
            "allExpress" : {}
        };

        currentService["query"] = query;
        currentService["queryProvince"] = queryProvince;
        currentService["queryCity"] = queryCity;
        currentService["queryCounty"] = queryCounty;
        currentService["getExpress"] = getExpress;
        currentService["deleteItem"] = deleteItem;
        currentService["exportFile"] = exportFile;
        currentService["getExpressRegion"] = getExpressRegion;
        currentService["saveAreaSet"] = saveAreaSet;

        return currentService;

    }]);