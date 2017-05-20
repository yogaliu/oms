/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("returnGoodsNoticeBillService", ["ApiService", "toolsService","APP_MENU", function (ApiService, toolsService,APP_MENU) {

        /**
         * 查询退货通知单列表数据
         * @__scope__
         * @constructor
         */
        var VipReturnOrderNoticeQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/VipOrder/VipReturnOrderNotice/Query";
            var data = [];
            //搜索条件
            if (__scope__.searchForm.vipreturnordercode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "VipReturnOrderCode",
                    "Name": "VipReturnOrderCode",
                    "Value": __scope__.searchForm.vipreturnordercode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.returnordercode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ReturnOrderCode",
                    "Name": "ReturnOrderCode",
                    "Value": __scope__.searchForm.returnordercode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.begindate !== '') {
                var obj = {
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "BeginDate",
                    "Name": "BeginDate",
                    "Value": __scope__.searchForm.begindate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.enddate !== '') {
                var obj = {
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EndDate",
                    "Name": "EndDate",
                    "Value": __scope__.searchForm.enddate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.vipreturnordernoticecode !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "VipReturnOrderNoticeCode",
                    "Name": "VipReturnOrderNoticeCode",
                    "Value": __scope__.searchForm.vipreturnordernoticecode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.inwarehouseid !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "InWarehouseId",
                    "Name": "InWarehouseId",
                    "Value": __scope__.searchForm.inwarehouseid,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.productcode !== '') {
                var obj = {
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProductCode",
                    "Name": "ProductCode",
                    "Value": __scope__.searchForm.productcode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.signusername !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SignUserName",
                    "Name": "SignUserName",
                    "Value": __scope__.searchForm.signusername,
                    "Children": []
                };
                data.push(obj);
            }
            var paramObj = ApiService.getBasicParamobj();
            paramObj['body'] = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
                "Timespan": "00:00:00.221",
                "SeletedCount": SeletedCount,
                "Data": data,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });
            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                //列表数据
                __scope__.tableList = res.data;

                $.each(__scope__.tableList, function (i,obj) {
                    //状态 根据id匹配name
                    if(obj.status !==undefined){
                        obj.statusName=APP_MENU.B2BreturnSalesMemo[obj.status];
                    }
                    //单据类型 根据id匹配name
                    if(obj.returntype !==undefined){
                        obj.returntype=APP_MENU.B2BreturnReturnType[obj.returntype];
                    }
                    //签收类型 根据id匹配name
                    if(obj.returnsigntype !==undefined){
                        obj.returnsigntype=APP_MENU.B2BreturnReturnSignType[obj.returnsigntype];
                    }
                });

                //总条数
                __scope__.paginationConf.totalItems = res.total;
            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 签收仓库
         * @param __scope__
         * @constructor
         */
        var WarehouseGet = function (__scope__) {
            var url = "/BasicInformation/Warehouse/Get";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
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
            }, {
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StorageType",
                "Name": "StorageType",
                "Value": 0,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    //下拉选框插件 签收仓库
                    __scope__.selectInWareHouse.info=res.data;
                    __scope__.selectInWareHouse.objName={id: __scope__.searchForm.inwarehouseid};
                }
            }, function (res) {

            });
        };


        // public api
        return {
            "VipReturnOrderNoticeQuery": VipReturnOrderNoticeQuery,
            "WarehouseGet": WarehouseGet
        };


    }]);