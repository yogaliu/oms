/**
 * Created by zgh on 2017/4/7.
 */

angular.module('klwkOmsApp')
    .service('sendOrderAbnormalService',['ApiService','toolsService','orderManagePublicService',
        function (ApiService,toolsService,orderManagePublicService) {

            //配置数据
            var configData = {
                //异常订单列定义
                columns : [
                    {name : '订单编号',tag : 'code'},
                    {name : '平台订单号',tag : 'tradeid'},
                    {name : '店铺名称',tag : 'storename'},
                    {name : '会员昵称',tag : 'customername'},
                    {name : '支付日期', tag : 'paydate'}
                ]
            };

            //dom操作
            var domOperate = {
                //页面初始化
                domInit : function (scope) {
                    //分页设置
                    this.pageSet(scope);
                    //异常订单列名配置信息
                    scope.abnormalOrdersHead = configData.columns;
                    //右侧列表配置
                    scope.allocation = {
                        "theadList" : scope.abnormalOrdersHead,
                        // 指令控制器的ID唯一标识
                        "timestamp" : null
                    };
                    //店铺高级搜索
                    scope.showInfo = {};
                    //查询数据过滤
                    scope.formData = {
                        //支付开始时间
                        paydatebegin : '',
                        //支付结束时间
                        paydateend : '',
                        //会员昵称
                        customername : ''
                    };

                    scope.formData1 = {};

                    //支付时间（最小）
                    this.timepicker('#payTimeMin');
                    //支付时间（最大）
                    this.timepicker('#payTimeMax');

                    //获取发货异常订单
                    InterfaceDeal.getAbnormalOrders(scope);
                    //获取店铺信息
                    InterfaceDeal.getAllShops(scope);
                },
                //分页配置
                pageSet : function (scope) {
                    //公共方法中的分页配置
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope, function () {
                        InterfaceDeal.getAbnormalOrders(scope);
                    });
                },
                //获取上一页数据
                prevPage : function (scope) {
                    orderManagePublicService.orderManagerPublicFunction.prevPage(scope);
                },

                //获取下一页数据
                nextPage : function (scope) {
                    orderManagePublicService.orderManagerPublicFunction.nextPage(scope);
                },
                //时间插件
                timepicker : function (id) {
                    $(id).datetimepicker({
                        format: 'yyyy-mm-dd h:i:s',
                        weekStart: 1,
                        autoclose: true,
                        startView: 2,
                        minView: 2,
                        forceParse: false,
                        todayBtn:1,
                        language: 'zh-CN'
                    });
                }

            };

            //从后台获取到的数据处理
            var InterfaceDeal = {
                //获取发货异常订单
                getAbnormalOrders : function (scope){
                    Interface.getAbnormalOrders(scope, function (res) {
                        if(res.success){
                            //异常订单详细信息
                            scope.abnormalOrdersBody = res.data;
                            //配置总页数
                            scope.paginationConf.totalItems = res.total;
                            //$('#abnormalOrderList').DataTable( {
                            //    scrollY: 400,
                            //    paging: false,
                            //    searching: false,
                            //    info : false,
                            //    destroy: true
                            //} );
                            //全选消失
                            scope.checkAll = false;
                        }else{
                            alert('发货异常订单获取失败');
                        }
                    });
                },
                //平台发货
                platformDispatch : function (scope,ids){
                    Interface.platformDispatch(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('平台发货成功！');
                            //刷新界面
                            InterfaceDeal.getAbnormalOrders(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //系统发货
                systemDispatch : function (scope,ids) {
                    Interface.systemDispatch(scope,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('已手工更改为平台已发货！');
                            //刷新界面
                            InterfaceDeal.getAbnormalOrders(scope);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                },
                //获取店铺信息
                getAllShops : function (scope) {
                    Interface.getAllShops(scope, function (res) {
                        if(res.success){
                            orderManagePublicService.orderManagerPublicFunction.setDataShowType(scope,res.data,scope.showInfo,5);
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                }
            };

            //发货异常通知接口
            var Interface = {
                /**
                 * 获取所有店铺的接口
                 * @param scope $scope对象
                 * @param callback 调用接口成功后的回调函数
                 */
                getAllShops : function (scope,callback) {
                    var url = '/BasicInformation/Store/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "IsDisabled",
                        "Name": "IsDisabled",
                        "Value": false,
                        "Children": []
                    }];
                    ApiService.postCache(url,paramObj)
                        .then(function (res) {
                            callback(res);
                        });
                },
                /**
                 * 获取所有异常的订单
                 * @param scope
                 * @param callback 回调函数
                 */
                getAbnormalOrders : function (scope,callback) {
                    var url = '/SalesOrder/SalesOrder/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "Timespan":"00:00:00.455",
                        "SeletedCount":0,
                        "Data":[
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CustomerName",
                                "Name": "CustomerName",
                                "Value": scope.formData.CustomerName,
                                "Children": []
                            },
                            {
                                "OperateType":0,
                                "LogicOperateType":0,
                                "AllowEmpty":false,
                                "Field":"PlatformStatus",
                                "Name":"PlatformStatus",
                                "Value":3,
                                "Children":[]
                            },{
                                "OperateType":0,
                                "LogicOperateType":0,
                                "AllowEmpty":false,
                                "Field":"IsObsolete",
                                "Name":"IsObsolete",
                                "Value":false,
                                "Children":[]
                            },{
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CustomerName",
                                "Name": "CustomerName",
                                "Value": scope.formData.customername,
                                "Children": []
                            },{
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "PayDate",
                                "Name": "PayDateBegin",
                                "Value": scope.formData.paydatebegin,
                                "Children": []
                            }, {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "PayDate",
                                "Name": "PayDateEnd",
                                "Value": scope.formData.paydateend,
                                "Children": []
                            },{
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "StoreId",
                                "Name": "StoreId",
                                "Value": scope.formData1.StoreId ? scope.formData1.StoreId.value : '',
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "TradeId",
                                "Name": "TradeId",
                                "Value": scope.formData.TradeId,
                                "Children": []
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var abnormalOrders =ApiService.postLoad(url,paramObj);
                    abnormalOrders.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 平台发货
                 * @param scope
                 * @param ids 订单id
                 * @param callback
                 */
                platformDispatch : function (scope,ids,callback) {
                    var url = '/SalesOrder/SalesOrder/PlatformDelivery';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var platform = ApiService.postLoad(url,paramObj);
                    platform.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 系统发货
                 * @param scope
                 * @param ids 订单id
                 * @param callback
                 */
                systemDispatch : function (scope,ids,callback){
                    var url = '/SalesOrder/SalesOrder/ManualDelivery';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var system = ApiService.postLoad(url,paramObj);
                    system.then(function (res) {
                        callback(res);
                    });
                }
            };
            return {
                domOperate : domOperate,
                InterfaceDeal : InterfaceDeal
            }
        }
    ]);