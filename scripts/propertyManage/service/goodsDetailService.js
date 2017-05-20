/**
 * Created by jx on 2017/3/31.
 */
angular.module("klwkOmsApp")
    .factory("goodsDetailService", ["ApiService","APP_MENU", function (ApiService,APP_MENU) {

        /**
         * 查询账单记录
         * @__scope__
         * @constructor
         */
        var VerifivationProductDetailQuery = function (__scope__, PageIndex, PageSize, SeletedCount,isInit) {
            var url = "/Finance/Verifivation/ProductDetailQuery";
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
                    "Field": "VerifiCode",
                    "Name": "VerifiCode",
                    "Value": __scope__.searchForm.verification,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.merchandise !== ''){
                var obj = {
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProductCode",
                    "Name": "ProductCode",
                    "Value": __scope__.searchForm.merchandise,
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

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] =JSON.stringify({
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

                $.each(__scope__.tableList,function(i,obj){
                    //状态 根据id匹配name
                    if(obj.veritype !==undefined){
                        obj.veritypeName=APP_MENU.verificationManageVerifiType[obj.veritype];
                    }
                });
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

            paramObj['body'] =JSON.stringify([{
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
                    __scope__.selectStore.info =res.data;
                }

            }, function (res) {


            });
        };


        // public api
        return {
            "VerifivationProductDetailQuery": VerifivationProductDetailQuery,
            "StoreGet": StoreGet
        };

    }]);