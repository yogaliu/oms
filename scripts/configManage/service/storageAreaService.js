/**
 * Created by xs on 2017/4/26.
 */
angular.module("klwkOmsApp")
    .factory('storageAreaService', ["ApiService","APP_MENU","toolsService",function(ApiService,APP_MENU,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#storageArea";
        /**
         * 获取仓库范围列表
         */
        var query = function(scope) {
            var url = "/BasicInformation/WarehouseRegion/Query";
            var condition = [];
            //搜索条件 仓库id
            if(scope.formData.WarehouseId !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseId",
                    "Name": "WarehouseId",
                    "Value": scope.formData.WarehouseId,
                    "Children": []
                };
                condition.push(obj);
            }
            //搜索条件 省id
            if(scope.formData.ProvinceId !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProvinceId",
                    "Name": "ProvinceId",
                    "Value": scope.formData.ProvinceId,
                    "Children": []
                };
                condition.push(obj);
            }
            //搜索条件 市id
            if(scope.formData.CityId !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "CityId",
                    "Name": "CityId",
                    "Value": scope.formData.CityId,
                    "Children": []
                };
                condition.push(obj);
            }
            //搜索条件 区id
            if(scope.formData.CountyId !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "CountyId",
                    "Name": "CountyId",
                    "Value": scope.formData.CountyId,
                    "Children": []
                };
                condition.push(obj);
            }
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.112",
                    "SeletedCount": 0,
                    "Data": condition,
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
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableList,function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                    });
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
                    scope.editProvinceList.info = res.data;
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
         * 获取市选项 修改
         */
        var queryEditCity = function(scope,type) {
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
                    scope.editCityList.info = res.data;
                    if(type == 'init'){
                        scope.editCityList.setValue({id:scope.activeItem.cityid});
                    }else{
                        scope.editCityList.init();
                    }
                    //下拉选框插件 区
                    scope.editCountyList.info = [];
                    scope.editCountyList.init();
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
         * 获取区选项 修改
         */
        var queryEditCounty = function(scope,type) {
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
                    scope.editCountyList.info = res.data;
                    if(type == 'init'){
                        scope.editCountyList.setValue({id:scope.activeItem.countyid});
                    }else{
                        scope.editCountyList.init();
                    }
                }
            });
        };
        /**
         * 获取仓库选项
         */
        var getWarehouse = function(deffer) {
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
                    currentService.allWarehouse = res.data;
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
         * 新增&修改
         */
        var editItem = function(scope) {
            var url = "/BasicInformation/WarehouseRegion/Save";
            var param = $.extend({
                body: JSON.stringify(scope.activeItem)
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #editAreaModal").modal('hide');
                    query(scope);
                }
            });
        };
        /**
         * 删除
         */
        var deleteItem = function(scope,type) {
            var url = "/BasicInformation/WarehouseRegion/Delete";
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
         * 获取仓库的区域设置
         */
        var getWarehouseRegion = function (scope) {
            var url = "/BasicInformation/WarehouseRegion/Get";
            var param = $.extend({
                body: JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "WarehouseId",
                    "Name": "WarehouseId",
                    "Value": scope.setWarehouseId,
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
                        if($.isEmptyObject(currentService.allRegion)){
                            getAllRegion(deffer);
                        }else{
                            deffer.resolve();
                        }
                    });
                    promise.then(function(){
                        //在已选的省市区id集合中存在时被勾选
                        var list = $.extend(true,[],currentService.allRegion);
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
         * 获取中国的所有区域
         */
        var getAllRegion = function (deffer) {
            var url = "/BasicInformation/Region/GetNew";
            var promise = ApiService.postLoad(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.allRegion = res.data;
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
         * 保存区域设置
         */
        var saveAreaSet = function (scope) {
            var url = "/BasicInformation/WarehouseRegion/BatchSave";
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
            //存储所有仓库 用于配置仓库选项
            "allWarehouse" : {},
            //存储中国的所有地区 用于区域设置
            "allRegion" : {}
        };

        currentService["query"] = query;
        currentService["queryProvince"] = queryProvince;
        currentService["queryCity"] = queryCity;
        currentService["queryCounty"] = queryCounty;
        currentService["getWarehouse"] = getWarehouse;
        currentService["queryEditCity"] = queryEditCity;
        currentService["queryEditCounty"] = queryEditCounty;
        currentService["editItem"] = editItem;
        currentService["deleteItem"] = deleteItem;
        currentService["getWarehouseRegion"] = getWarehouseRegion;
        currentService["getAllRegion"] = getAllRegion;
        currentService["saveAreaSet"] = saveAreaSet;

        return currentService;

    }]);