/**
 * Created by jx on 2017/3/31.
 */
angular.module("klwkOmsApp")
    .factory("handworkVerificationService", ["ApiService","APP_MENU", function (ApiService,APP_MENU) {


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


            var promise = ApiService.postLoad(url, paramObj);

            promise.then(function (res) {
                //下拉选框插件 店铺
                __scope__.selectStore.info = res.data;

                __scope__.selectStore2.info = res.data;

            }, function (res) {

            });
        };

        /**
         *搜索系统单据
         * @param __scope__
         * @constructor
         */
        var VerifivationQuerySystemOrder = function (__scope__, isInit) {
            var url = "/Finance/Verifivation/QuerySystemOrder";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['storeId'] = __scope__.searchForm.systemStoreId;
            paramObj['stratdate'] = __scope__.searchForm.systemStart;
            paramObj['enddate'] = __scope__.searchForm.systemEnd;
            paramObj['orderno'] = __scope__.searchForm.orderno;


            var promise = ApiService.postLoad(url, paramObj);
            promise.then(function (res) {
                //列表数据
                __scope__.tableList1 = res.data;


                $.each(__scope__.tableList1,function(i,obj){
                    //单据类型 根据id匹配name
                    if(obj.verifiType !==undefined){
                        obj.verifiTypeName=APP_MENU.verificationManageVerifiType[obj.verifiType];
                    }
                });

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         *搜索平台对账单
         * @param __scope__
         * @constructor
         */
        var VerifivationQueryOtherOrder = function (__scope__, isInit) {
            var url = "/Finance/Verifivation/QueryOtherOrder";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['storeId'] = __scope__.searchForm.otherStoreId;
            paramObj['stratdate'] = __scope__.searchForm.checkStart;
            paramObj['enddate'] = __scope__.searchForm.checkEnd;
            paramObj['orderno'] = __scope__.searchForm.orderno;

            var promise = ApiService.postLoad(url, paramObj);
            promise.then(function (res) {
                //列表数据
                __scope__.tableList2 = res.data

                $.each(__scope__.tableList2,function(i,obj){
                    //单据类型 根据id匹配name
                    if(obj.verifiType !==undefined){
                        obj.verifiTypeName=APP_MENU.verificationManageVerifiType[obj.verifiType];
                    }
                });

            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         *核销
         * @param __scope__
         * @constructor
         */
        var VerifivationManualVerifi = function (__scope__) {
            var url = "/Finance/Verifivation/ManualVerifi"

            var paramObj = ApiService.getBasicParamobj();

            paramObj['systemorder'] = [{
                "OrderId": 13107644771936256,
                "Code": "SA1702240000001",
                "TradeId": "3084498236193512",
                "AlipayNo": "2017022421001001520222053389",
                "Amount": 277.0000,
                "StoreId": "8c349d2a-eff9-4015-8c35-e1fbeec72bb3",
                "StoreName": "AA淘宝专卖店",
                "Quantity": 3,
                "VerifiType": 0,
                "IsSelected": true,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            }];
            paramObj['otherorder'] = [{
                "VerifiType": 2,
                "OrderCode": "11111",
                "Quantity": 0,
                "Amount": -11.0,
                "FillAmount": 0.0,
                "RefunAmount": 0.0,
                "IsSelected": true,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            }];
            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        // public api
        return {
            "StoreGet": StoreGet,
            "VerifivationQuerySystemOrder": VerifivationQuerySystemOrder,
            "VerifivationQueryOtherOrder": VerifivationQueryOtherOrder,
            "VerifivationManualVerifi": VerifivationManualVerifi
        };

    }])
;