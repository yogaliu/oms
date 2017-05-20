/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("activityDetailService", ["ApiService", function (ApiService) {

        /**
         * 查询内部便签
         * @__scope__
         * @constructor
         */
        var ActivityRegisterMessageGet = function (__scope__, isInit) {
            var url = "/ActivityRegister/ActivityRegister/MessageGet";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(__scope__.params.storeId);

            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList1 = res.data;

                //列表配置
                __scope__.theadList1 = [
                    {name: "内容", tag: 'note'},
                    {name: "创建人", tag: 'createuser'},
                    {name: "时间", tag: 'createdate'}
                ];

            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 查询活动商品信息
         * @__scope__
         * @constructor
         */
        var ActivityRegisterDetailGet = function (__scope__, isInit) {
            var url = "/ActivityRegister/ActivityRegister/DetailGet";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(__scope__.params.id);

            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList2 = res.data;

                //列表配置
                __scope__.theadList2 = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "数量", tag: 'quantity'},
                    {name: "调拨数量", tag: 'lockedquantity'},
                    {name: "销售单价", tag: 'price'},
                    {name: "金额", tag: 'amount'},
                    {name: "活动状态", tag: 'isprocessingnane'},
                    {name: "活动数量", tag: 'salesqty'},
                    {name: "信息", tag: 'message'}
                ];

            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 查询操作记录
         * @__scope__
         * @constructor
         */
        var SystemLogGetById = function (__scope__, isInit) {
            var url = "/BasicInformation/SystemLog/GetById";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(__scope__.params.id);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                __scope__.tableList3 = res.data;

                //列表配置
                __scope__.theadList3 = [
                    {name: "操作人", tag: 'username'},
                    {name: "操作日期", tag: 'createdate'},
                    {name: "操作内容", tag: 'note'}
                ];

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 计算销量
         * @param __scope__
         * @constructor
         */
        var ActivityRegisterupdatesalesqty = function (__scope__, id) {
            var url = "/ActivityRegister/ActivityRegister/updatesalesqty";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(id);

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("计算销量成功");
                    ActivityRegisterDetailGet(__scope__);
                    ActivityRegisterMessageGet(__scope__);
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };


        // public api
        return {
            "ActivityRegisterMessageGet": ActivityRegisterMessageGet,
            "ActivityRegisterDetailGet": ActivityRegisterDetailGet,
            "SystemLogGetById": SystemLogGetById,
            "ActivityRegisterupdatesalesqty": ActivityRegisterupdatesalesqty
        };

    }]);