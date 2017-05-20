/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("presentTacticsService", ["ApiService", "APP_MENU","toolsService", function (ApiService, APP_MENU,toolsService) {


        /**
         * 查询赠品策略列表
         * @__scope__
         * @constructor
         */
        var ActivityStrategyGet = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/ActivityStrategy/ActivityStrategy/Get";
            var data = [];

            //搜索条件
            if (__scope__.searchForm.activity !== '') {
                var obj = {
                    //活动编码
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": __scope__.searchForm.activity,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.merchandise !== '') {
                var obj = {
                    //商品编码
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProductCode",
                    "Name": "ProductCode",
                    "Value": __scope__.searchForm.merchandise,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.create1 !== '') {
                var obj = {
                    //制单时间开始
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "BeginDate",
                    "Name": "CreateDate",
                    "Value": __scope__.searchForm.create1,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.create2 !== '') {
                var obj = {
                    //制单时间结束
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EndDate",
                    "Name": "CreateDate",
                    "Value": __scope__.searchForm.create2,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.send !== '') {
                var obj = {
                    //赠送商品
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SkuCode",
                    "Name": "SkuCode",
                    "Value": __scope__.searchForm.send,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.storeId !== '') {
                var obj = {
                    //店铺id
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
            if (__scope__.searchForm.end1 !== '') {
                var obj = {
                    //结束时间开始
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EndDate",
                    "Name": "ActivityEndBeginDate",
                    "Value": __scope__.searchForm.end1,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.end2 !== '') {
                var obj = {
                    //结束时间结束
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EndDate",
                    "Name": "ActivityEndEndDate",
                    "Value": __scope__.searchForm.end2,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.status !== '') {
                var obj = {
                    //状态
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Status",
                    "Name": "Status",
                    "Value": __scope__.searchForm.status,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.simpleSelect.isSuperposition !== '') {
                var obj = {
                    //是否叠加
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "issuperposition",
                    "Name": "issuperposition",
                    "Value": __scope__.simpleSelect.isSuperposition,
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

                $.each(__scope__.tableList, function (i, obj) {
                    //状态 根据id匹配name
                    if (obj.status !== undefined) {
                        obj.statusName = APP_MENU.marketingGiveawayStatus[obj.status];
                    }
                    //策略类型 根据id匹配name
                    if (obj.activitystrategytype !== undefined) {
                        obj.activitystrategytypeName = APP_MENU.marketingActivitystrategytype[obj.activitystrategytype];
                    }

                    obj.isZhengque = false;
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
                //下拉选框插件 店铺
                __scope__.selectStore.info = res.data;

            }, function (res) {

            });
        };


        /**
         * 暂停
         */
        var ActivityStrategyStop = function (__scope__, i) {
            var url = "/ActivityStrategy/ActivityStrategy/Stop";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Id",
                "Name": "Id",
                "Value": __scope__.tableList[i].id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('暂停成功');
                    ActivityStrategyGet(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                }else{
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 启用
         */
        var ActivityStrategyStart = function (__scope__, i) {
            var url = "/ActivityStrategy/ActivityStrategy/Start";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Id",
                "Name": "Id",
                "Value": __scope__.tableList[i].id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('启用成功');
                    ActivityStrategyGet(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                }else{
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 禁用
         */
        var ActivityStrategyDisable = function (__scope__, i) {
            var url = "/ActivityStrategy/ActivityStrategy/Disable";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "Id",
                "Name": "Id",
                "Value": __scope__.tableList[i].id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('禁用成功');
                    ActivityStrategyGet(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                }else{
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 修改排序保存
         */
        var ActivityStrategySave = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategy/Save";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "BeginDate": __scope__.modify.tableList.beginDate,
                "Id": __scope__.modify.tableList.id,
                //记录日期
                "CreateDate": __scope__.modify.tableList.createDate,
                "Name": __scope__.modify.tableList.name,
                //策略类型　1: 买就送 2: 满就送 3: 福袋
                "ActivityStrategyType": __scope__.modify.tableList.activitystrategytype,
                "EndDate": __scope__.modify.tableList.enddate,
                //是否叠加 0:不叠加 1:叠加
                "IsSuperposition": __scope__.modify.tableList.issuperposition,

                "CreateUser": __scope__.modify.tableList.createuser,

                //排序
                "Seq": __scope__.modify.tableList.seq,
                "AlertMobile": __scope__.modify.tableList.alertmobile,
                "Stores": __scope__.modify.storeId,
                "Products": __scope__.modify.products,
                "SendProducts": __scope__.modify.sendProducts,
                "Condition": {
                    "Id": __scope__.modify.condition.id,
                    "CreateDate": __scope__.modify.condition.createdate,
                    "StrategyId": __scope__.modify.condition.strategyid,
                    "BuyQtyBegin": __scope__.modify.condition.buyqtybegin,
                    "BuyQtyEnd": __scope__.modify.condition.buyqtyend,
                    "BuyAmtBegin": __scope__.modify.condition.buyamtbegin,
                    "BuyAmtEnd": __scope__.modify.condition.buyamtend,
                    //是否翻倍赠送
                    "IsDoubleSend": __scope__.modify.condition.doubleSend,
                    //翻倍类型 1: 按赠送款数, 2：按赠品赠送数量
                    "DoubleType": __scope__.modify.condition.doubletype,
                    //件数递增条件
                    "BuyMoreQtyDouble": __scope__.modify.condition.buymoreqtydouble,
                    //最多送多少倍
                    "MaxSend": __scope__.modify.condition.maxsend,
                    //来源类型, 0:所有 1: PC, 2: 移动
                    "OrderFrom": __scope__.modify.condition.orderfrom,
                    //匹配地区　匹配订单省ID
                    "OrderProvince": __scope__.modify.condition.orderprovince,
                    //预售订单送 0: 非预售订单送, 1: 预售订单送
                    "IsPreSellSend": __scope__.modify.condition.ispresellsend,
                    //货到付款送 0: 非货到付款订单送, 1: 货到付款订单送
                    "IsCodOrderSend": __scope__.modify.condition.iscodordersend,
                    //匹配尺码
                    "IsMatchSize": __scope__.modify.condition.ismatchsize,
                    //是否预付款订单送
                    "IsPrePaySend": __scope__.modify.condition.isprepaysend,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                },
                //活动范围 0: 所有款, 1: 包含活动商品 2: 排除活动商品
                "ActivityProductRange": __scope__.modify.tableList.activityproductrange,
                //赠送类型 0: 仅送赠品, 1: 仅指定快递, 2: 指定赠品+快递
                "ActivitySendType": __scope__.modify.tableList.activitysendtype,
                //策略类型 0: 买款送, 1:买款满金额送, 2: 满件送, 3: 满金额送, 4: 满件满金额送
                "StrategyType": __scope__.modify.tableList.strategytype,
                //赠送款数
                "SendProductQty": __scope__.modify.tableList.sendproductqty,
                //发货快递
                "ExpressId": __scope__.modify.tableList.expressid,
                //匹配时间类型 1: 付款时间, 2: 平台制单时间
                "DateType": __scope__.modify.tableList.datetype,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if(res.success){
                    ActivityStrategyGet(__scope__,1, __scope__.paginationConf.itemsPerPage, 0, false)
                }
                else{
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 修改时获取新增时填写的内容
         * @param __scope__
         * @constructor
         */
        var ActivityStrategyConditionGet = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategyCondition/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StrategyId",
                "Name": "StrategyId",
                "Value": __scope__.modify.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    __scope__.modify.condition = $.extend(true, {}, res.data)[0];
                }
            }, function (res) {

            });
        };

        /**
         * 获取活动店铺
         * @param __scope__
         * @constructor
         */
        var ActivityStrategyStoreGet = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategyStore/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StrategyId",
                "Name": "StrategyId",
                "Value": __scope__.modify.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                if (res.data) {
                    __scope__.modify.storeId = res.data;
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 查询是否有活动商品
         * @__scope__
         * @constructor
         */
        var ActivityStrategyProductGet = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategyProduct/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StrategyId",
                "Name": "StrategyId",
                "Value": __scope__.modify.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                if (res.success) {
                    var data = res.data;
                    __scope__.modify.products = data;
                    __scope__.tableList1 = data;
                }


            }, function (res) {
                console.log("我是错误的方法");
            });
        };

        /**
         * 查询是否有赠送商品
         * @__scope__
         * @constructor
         */
        var ActivityStrategySendProductGet = function (__scope__) {
            var url = "/ActivityStrategy/ActivityStrategySendProduct/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "StrategyId",
                "Name": "StrategyId",
                "Value": __scope__.modify.tableList.id,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if (res.success) {
                    var data = res.data;
                    __scope__.modify.sendProducts = data;
                }

            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        // public api
        return {
            "ActivityStrategyGet": ActivityStrategyGet,
            "StoreGet": StoreGet,
            "ActivityStrategyStop": ActivityStrategyStop,
            "ActivityStrategyStart": ActivityStrategyStart,
            "ActivityStrategyDisable": ActivityStrategyDisable,
            "ActivityStrategySave": ActivityStrategySave,
            "ActivityStrategyConditionGet": ActivityStrategyConditionGet,
            "ActivityStrategyStoreGet": ActivityStrategyStoreGet,
            "ActivityStrategyProductGet": ActivityStrategyProductGet,
            "ActivityStrategySendProductGet": ActivityStrategySendProductGet,
        };

    }]);