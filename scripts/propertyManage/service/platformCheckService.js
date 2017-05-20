/**
 * Created by jx on 2017/3/31.
 */

angular.module("klwkOmsApp")
    .factory("platformCheckService", ["ApiService", function (ApiService) {

        /**
         * 查询平台对账单
         * @constructor
         */
        var AlipayRecordReportQuery = function (__scope__, isInit) {
            var url = "/Finance/AlipayRecord/ReportQuery";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "PageIndex": 1,
                "PageSize": 50,
                "SeletedCount": 0,
                "Data": [],
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList = res.data;
                //总条数
                __scope__.paginationConf.totalItems = res.total;
            }, function (res) {

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

                __scope__.storeObj = res.data;

            }, function (res) {


            });
        };


        // public api
        return {
            "AlipayRecordReportQuery": AlipayRecordReportQuery,
            "StoreGet": StoreGet
        };

    }]);