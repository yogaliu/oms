/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("modifyRepertoryService", ["ApiService","toolsService", function (ApiService,toolsService) {


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
                //下拉选框插件 店铺
                __scope__.selectStore.info=res.data;
                __scope__.selectStore.setValue({id:__scope__.inventoryObj.storeId});


            }, function (res) {

            });
        };

        /**
         * 查询活动商品信息
         * @__scope__
         * @constructor
         */
        var ActivityRegisterDetailGet = function (__scope__) {
            var url = "/ActivityRegister/ActivityRegister/DetailGet";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] =JSON.stringify(__scope__.params.id);

            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList1 = res.data;

                //列表配置
                __scope__.theadList1 = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "信息", tag: 'message'}
                ];
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 修改库存
         * @param __scope__
         * @constructor
         */
        var DistributionUpdateDeductions = function (__scope__) {
            var url = "/Product/Distribution/UpdateDeductions";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['storeid'] = __scope__.inventoryObj.storeId;
            paramObj['isdis'] =  false;
            paramObj['type'] = __scope__.inventoryObj.inventoryType;
            paramObj['details'] =JSON.stringify(__scope__.tableList1);

            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertMsg("正在修改中，请等待……");
                }else{
                    toolsService.alertMsg('仅能修改淘宝/天猫的店铺');
                }
            }, function (res) {

            });
        };

        // public api
        return {
            StoreGet: StoreGet,
            ActivityRegisterDetailGet: ActivityRegisterDetailGet,
            DistributionUpdateDeductions: DistributionUpdateDeductions
        };

    }]);