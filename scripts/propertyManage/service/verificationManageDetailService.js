/**
 * Created by jx on 2017/3/31.
 */
angular.module("klwkOmsApp")
    .factory("verificationManageDetailService", ["ApiService", "APP_MENU", function (ApiService, APP_MENU) {

        /**
         * 查询核销管理详情
         * @__scope__
         * @constructor
         */
        var VerifivationDetailQuery = function (__scope__) {
            var url = "/Finance/Verifivation/DetailQuery";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = __scope__.verificationDetailRoot.id;


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                //列表数据
                __scope__.tableList = res.data;

                $.each(__scope__.tableList, function (i, obj) {
                    //单据类型 根据id匹配name
                    if (obj.ordertype !== undefined) {
                        obj.ordertypeName = APP_MENU.verificationManageDetailOrdertype[obj.ordertype];
                    }
                });

                //列表配置
                __scope__.theadList = [
                    {name: "核销状态", tag: 'isverified'},
                    {name: "单据类型", tag: 'ordertypeName'},//销售订单，退款单
                    {name: "单据编号", tag: 'ordercode'},
                    {name: "单据金额", tag: 'orderamount'},
                    {name: "数量", tag: 'orderquantity'},
                    {name: "对方单据编号", tag: 'otherordercode'},
                    {name: "对方单据金额", tag: 'otherorderamount'},
                    {name: "对方数量", tag: 'otherorderquantity'}
                ];


            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        // public api
        return {
            "VerifivationDetailQuery": VerifivationDetailQuery
        };

    }]);