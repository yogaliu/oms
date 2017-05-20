/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("checkBillService", ["ApiService", "toolsService", function (ApiService, toolsService) {

        /**
         * 查询活动报名列表
         * @__scope__
         * @constructor
         */
        var VVipAccountBillQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/Report/VVipAccountBill/Query";
            var data = [{
                "OperateType": 1,
                "LogicOperateType": 0,
                "AllowEmpty": true,
                "Field": "PoCode",
                "Name": "PoCode",
                "Value": "",
                "Children": []
            }];
            //搜索条件
            if(__scope__.searchForm.schedulebegindate !== ''){
                var obj = {
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ScheduleBeginDate",
                    "Name": "ScheduleBegin",
                    "Value": __scope__.searchForm.schedulebegindate,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.scheduleenddate !== ''){
                var obj = {
                    "OperateType": 4,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ScheduleBeginDate",
                    "Name": "ScheduleEnd",
                    "Value": __scope__.searchForm.scheduleenddate,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.pocode !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "PoCode",
                    "Name": "ReturnOrderCode",
                    "Value": __scope__.searchForm.pocode,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.storeid !== ''){
                var obj = {
                    "OperateType": 6,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StoreId",
                    "Name": "StoreId",
                    "Value": __scope__.searchForm.storeid,
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
            var promise = ApiService.postLoad(url, paramObj);
            promise.then(function (res) {

                //列表数据
                __scope__.tableList = res.data;

                //总条数
                __scope__.paginationConf.totalItems = res.total;

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 查询店铺
         * @param __scope__
         * @constructor
         */
        var StoreGet = function (__scope__) {
            var url = "/BasicInformation/Store/Get";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "IsDisabled",
                "Name": "IsDisabled",
                "Value": false,
                "Children": []
            }]);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                __scope__.storeList = res.data;

            }, function (res) {

            });
        };


        // public api
        return {
            "VVipAccountBillQuery": VVipAccountBillQuery,
            "StoreGet": StoreGet
        };


    }]);