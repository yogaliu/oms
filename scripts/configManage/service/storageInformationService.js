/**
 * Created by xs on 2017/4/21.
 */
angular.module("klwkOmsApp")
    .factory('storageInformationService', ["ApiService","APP_MENU","toolsService",function(ApiService,APP_MENU,toolsService){
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        //页面id
        var pageId = "#storageInformation";
        /**
         * 获取仓库信息列表
         */
        var query = function(scope) {
            var url = "/BasicInformation/Warehouse/Query";
            var condition = [];
            if(scope.formData.code !== ''){
                var obj = {
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "code",
                    "Value": scope.formData.code,
                    "Children": []
                };
                condition.push(obj);
            }
            if(scope.formData.isdisabled !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": scope.formData.isdisabled,
                    "Children": []
                };
                condition.push(obj);
            }
            if(scope.formData.ispush !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsPush",
                    "Name": "IsPush",
                    "Value": scope.formData.ispush,
                    "Children": []
                };
                condition.push(obj);
            }
            if(scope.formData.isintercept !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsIntercept",
                    "Name": "IsIntercept",
                    "Value": scope.formData.isintercept,
                    "Children": []
                };
                condition.push(obj);
            }
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": scope.paginationConf.currentPage,
                    "PageSize": scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.079",
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
                    scope.paginationConf.totalItems = res.total;
                    scope.tableList = res.data;
                    //是否全选
                    scope.isalldatacheck = false;
                    $.each(scope.tableList,function (index, obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                        //仓库类型根据id匹配name
                        if(obj.warehousetype !== undefined){
                            obj.warehousetypename = APP_MENU.warehouseType[obj.warehousetype];
                        }
                        //仓储类型根据id匹配name
                        if(obj.storagetype !== undefined){
                            obj.storagetypename = APP_MENU.storageType[obj.storagetype];
                        }
                        //查父级仓库数据字典 通过id查找name
                        if(obj.parentid){
                            obj.parentname = currentService.allWarehouse[obj.parentid].name;
                        }
                        //查物流接口数据字典 通过id查找name
                        if(obj.applicationid){
                            if(currentService.allLogisticsInterface[obj.applicationid]){
                                obj.applicationname = currentService.allLogisticsInterface[obj.applicationid].name;
                            }else{
                                obj.applicationname = '**未知数据**';
                            }
                        }
                        //截单类型根据id匹配name
                        if(obj.orderPushSetting.intercepttype !== undefined){
                            obj.orderPushSetting.intercepttypename = APP_MENU.truncatedType[obj.orderPushSetting.intercepttype];
                        }
                        //时间类型根据id匹配name
                        if(obj.orderPushSetting.intercepttimetype !== undefined){
                            obj.orderPushSetting.intercepttimetypename = APP_MENU.timeType[obj.orderPushSetting.intercepttimetype];
                        }
                    });
                }
            });
        };
        /**
         * 获取仓库 缓存到当前服务
         */
        var queryWarehouse = function(deffer) {
            var url = "/BasicInformation/Warehouse/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.allWarehouse = klwTool.arrayToJson(res.data,"id");
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
         * 获取物流接口 缓存到当前服务
         */
        var queryLogisticsInterfaceList = function(deffer) {
            var url = "/BasicInformation/LogisticsInterface/Get";
            var promise = ApiService.post(url,paramObj);
            promise.then(function(res){
                if(res.success){
                    currentService.allLogisticsInterface = klwTool.arrayToJson(res.data,"id");
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
         * 新增仓库信息
         * 仓库类型为实体仓时，仓储类型和接口应用可选，实体仓库不可选
         * 仓库类型为虚拟仓（独立仓&共享仓）时，仓储类型和接口应用不可选，实体仓库可选
         */
        var saveWarehouse = function () {
            var url = "/BasicInformation/Warehouse/Save";
            var param = $.extend({
                body: JSON.stringify({
                    "Code": "111", //仓库编码
                    "Id": "00000000-0000-0000-0000-000000000000",
                    "CreateDate": "0001-01-01 00:00:00",
                    "Name": "222", //仓库名称
                    "WarehouseType": 3, //仓库类型
                    "Telephone": "333", //电话
                    "Address": "444", //仓库地址
                    "ParentId": "9c96078f-b480-429d-8583-c4f357c56811", //父级仓库ID
                    "IsDisabled": false,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    alert('新增仓库信息成功');
                    query(scope);
                }
            });
        };
        /**
         * 推单设置
         * 仓库类型为实体仓时，才能进行推单设置
         */
        var setOrderPush = function (scope) {
            var url = "/BasicInformation/OrderPushSetting/Save";
            var param = $.extend({
                body: JSON.stringify({
                    "SettingId": scope.activeItem.orderPushSetting.settingid, //推单设置ID
                    "WarehouseId": scope.activeItem.id, //仓库Id
                    "BeginTime": scope.activeItem.orderPushSetting.begintime, //开始时间
                    "EndTime": scope.activeItem.orderPushSetting.endtime, //结束时间
                    "FixedTime": scope.activeItem.orderPushSetting.fixedtime, //固定时间
                    "IsPush": scope.activeItem.orderPushSetting.ispush, //是否推单
                    "IsIntercept": scope.activeItem.orderPushSetting.isintercept, //是否截单
                    "InterceptTimeType": scope.activeItem.orderPushSetting.intercepttimetype, //时间类型
                    "InterceptType": scope.activeItem.orderPushSetting.intercepttype, //截单类型
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    toolsService.alertMsg({content : '操作成功',time : 1000});
                    $(pageId + " #setOrderPushModal").modal('hide');
                    query(scope);
                }
            });
        };
        /**
         * 启用
         */
        var enabledItem = function (scope,type) {
            var url = "/BasicInformation/Warehouse/Enable";
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
         * 禁用
         */
        var disabledItem = function (scope,type) {
            var url = "/BasicInformation/Warehouse/Disable";
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



        var currentService = {
            //存储所有仓库 用于过滤父级仓库字段
            "allWarehouse" : {},
            //存储所有物流接口 用于过滤物流接口字段
            "allLogisticsInterface" : {}
        };

        currentService["query"] = query;
        currentService["queryWarehouse"] = queryWarehouse;
        currentService["queryLogisticsInterfaceList"] = queryLogisticsInterfaceList;
        currentService["enabledItem"] = enabledItem;
        currentService["disabledItem"] = disabledItem;
        currentService["saveWarehouse"] = saveWarehouse;
        currentService["setOrderPush"] = setOrderPush;

        return currentService;

    }]);