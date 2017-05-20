/**
 * Created by jx on 2017/3/31.
 */
angular.module("klwkOmsApp")
    .factory("verificationRecordService", ["ApiService", function (ApiService) {

        /**
         * 查询记录
         * @__scope__
         * @constructor
         */
        var VerifivationRecordQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/Finance/Verifivation/RecordQuery";

            var data = [];

            //搜索条件
            if (__scope__.searchForm.StartDate !== '') {
                var obj = {
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StratDate",
                    "Name": "screate",
                    "Value":  __scope__.searchForm.StartDate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.EndDate !== '') {
                var obj = {
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EndDate",
                    "Name": "ecreate",
                    "Value":  __scope__.searchForm.EndDate,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.storeId !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StoreId",
                    "Name": "StoreId",
                    "Value": __scope__.searchForm.storeId,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.simpleSelect.isauto !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "isauto",
                    "Name": "isauto",
                    "Value": __scope__.simpleSelect.isauto,
                    "Children": []
                };
                data.push(obj);
            }
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
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
                if(res.success){
                    //下拉框插件 店铺
                    __scope__.selectStore.info = res.data;
                }
            }, function (res) {


            });
        };

        // public api
        return {
            "VerifivationRecordQuery": VerifivationRecordQuery,
            "StoreGet": StoreGet
        };

    }]);