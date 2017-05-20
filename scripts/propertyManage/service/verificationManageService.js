/**
 * Created by jx on 2017/3/31.
 */
angular.module("klwkOmsApp")
    .factory("verificationManageService", ["ApiService","toolsService", function (ApiService,toolsService) {

        /**
         * 查询核销管理数据
         * @__scope__
         * @constructor
         */
        var VerifivationQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/Finance/Verifivation/Query";
            var data=[];

            //搜索条件
            if(__scope__.searchForm.platform !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "TradeId",
                    "Name": "TradeId",
                    "Value": __scope__.searchForm.platform,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.system !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "OrderCode",
                    "Name": "OrderCode",
                    "Value": __scope__.searchForm.system,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.verification !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "RecordCode",
                    "Name": "RecordCode",
                    "Value": __scope__.searchForm.verification,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.startTime !== ''){
                var obj = {
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "CreateDate",
                    "Name": "screate",
                    "Value": __scope__.searchForm.startTime,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.endTime !== ''){
                var obj = {
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "CreateDate",
                    "Name": "ecreate",
                    "Value": __scope__.searchForm.endTime,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.storeId !== ''){
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
            if(__scope__.simpleSelect.isauto !== ''){
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
            if(__scope__.simpleSelect.issuccess !== ''){
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "isseccess",
                    "Name": "isseccess",
                    "Value": __scope__.simpleSelect.issuccess,
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
                    //下拉选框插件 店铺
                    __scope__.selectStore.info=res.data;

                    //下拉选框插件 自动核销店铺
                    __scope__.selectAutoStore.info = res.data;
                }
            }, function (res) {

            });
        };

        /**
         * 自动核销
         * @__scope__
         * @constructor
         */
        var VerifivationAutoVerifi = function (__scope__) {
            var url = "/Finance/Verifivation/AutoVerifi";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['verparam'] ={
                "StoreId": __scope__.autoVerification.storeId,
                "StoreName": __scope__.autoVerification.storeName,
                "StratPayTime": __scope__.autoVerification.StratPayTime,
                "EndPayTime": __scope__.autoVerification.EndPayTime,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            };


            console.log(paramObj);
            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if(res.success){
                    toolsService.alertSuccess("自动核销成功");
                }
                else{
                    toolsService.alertError(res.errorMessage);
                }
            }, function () {

            });
        };


        // public api
        return {
            "VerifivationQuery": VerifivationQuery,
            "StoreGet": StoreGet,
            "VerifivationAutoVerifi": VerifivationAutoVerifi
        };

    }]);