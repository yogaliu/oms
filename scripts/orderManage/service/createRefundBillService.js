/**
 * Created by zgh on 2017/4/7.
 */

angular.module('klwkOmsApp')
    .service('createRefundBillService',['ApiService','toolsService','APP_MENU',
        function (ApiService,toolsService,APP_MENU) {
            //dom操作
            var refundDomOperate = {
                domInit : function (scope){
                    //下拉菜单配置
                    scope.pullInfo = {
                        //店铺
                        store : {
                            isshow:false,
                            info:[],
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.StoreName = obj.name;
                                scope.formData.StoreId = obj.id;
                            }
                        },
                        //退款类型
                        refundType: {
                            isshow:false,
                            info:refundDomOperate.changeStyle(APP_MENU.OrderefundType),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.RefundType = obj.name;
                            }
                        },
                        //退货类型
                        returnGoods : {
                            isshow:false,
                            info:[],
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.ReturnType = obj.name;
                            }
                        },
                        //退款方式
                        refundWay :{
                            isshow:false,
                            info:refundDomOperate.changeStyle(APP_MENU.refundWay),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.RefundWay = obj.id;
                            }
                        }
                    };

                    scope.formData = {
                        SalesOrderCode : '',
                        StoreId : '',
                        StoreName : '',
                        CustomerName : '',
                        CustomerCode : '',
                        Mobile : ''
                    };

                    //订单和店铺都获取后可以初始化表单数据
                    ApiService.listenAll(function (deffer) {
                        //获取订单数据
                        InterfaceDeal.getOrderInfoDeal(scope,scope.orderid,deffer);
                    }, function (deffer) {
                        //店铺获取
                        InterfaceDeal.getAllShopsDeal(scope,deffer);
                    }).then(function (result) {
                        refundDomOperate.formAssignment(scope);
                    });

                    //获取退货类型
                    InterfaceDeal.getReturnGoodsDeal(scope);
                },
                //将枚举类型的变量转化为下拉菜单可用的类型
                changeStyle : function (obj){
                    var tmpData = [];
                    var data ={};
                    for(var item in obj){
                        data['id'] = item;
                        data['name'] = obj[item];
                        tmpData.push(data);
                        data = {};
                    }
                    return tmpData;
                },
                //表单赋初始值
                formAssignment : function (scope){
                    scope.formData.SalesOrderCode = scope.order.code;
                    scope.formData.StoreId = scope.order.storeid;
                    scope.formData.StoreName = scope.order.storename;
                    scope.formData.CustomerName = scope.order.customername;
                    scope.formData.CustomerCode = scope.order.customercode;
                    scope.formData.Mobile = scope.order.subOrder.mobile;
                    scope.pullInfo.store.objName = {name : scope.formData.StoreId,id : scope.formData.StoreId};
                }
            };

            //生成退款单接口数据处理
            var InterfaceDeal = {
                //订单信息
                getOrderInfoDeal : function (scope,orderid,deffer) {
                    InterFace.getOrderInfo(scope,orderid, function (res) {
                        if(res.success){
                            deffer.resolve();
                            //订单信息
                            scope.order = res.data;
                            //商品信息
                            scope.product = res.data.details;
                        }else{
                            deffer.reject();
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //店铺数据处理
                getAllShopsDeal : function (scope,deffer){
                    InterFace.getAllShops(scope, function (res) {
                        if(res.success){
                            scope.pullInfo.store.info = res.data;
                            deffer.resolve();
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                            deffer.reject();
                        }
                    });
                },
                //退货类型
                getReturnGoodsDeal : function (scope) {
                    InterFace.getReturnGoods(scope, function (res) {
                        if(res.success){
                            scope.pullInfo.returnGoods.info = res.data;
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                },
                //生成退款单
                createReturnGoodsBillDeal : function (scope,callback) {
                    InterFace.createReturnGoodsBill(scope, function (res) {
                        if(res.success){
                            callback();
                        }else{
                            toolsService.alertMsg(res.errorMessage);
                        }
                    });
                }
            };

            //生成退款单接口
            var InterFace = {

                /**
                 * 获取要生成退货单的订单
                 * @param scope
                 * @param orderid 订单id
                 * @param callback
                 */
                getOrderInfo : function (scope,orderid,callback) {
                    var url = '/SalesOrder/SalesOrder/GetSingle';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderid = orderid;
                    var order = ApiService.postLoad(url,paramObj);
                    order.then(function (res) {
                        callback(res);
                    });
                },
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
                    var shopList = ApiService.postLoad(url,paramObj);
                    shopList.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 退货类型
                 * @param scope
                 * @param callback
                 */
                getReturnGoods : function (scope,callback) {
                    var url = '/BasicInformation/GeneralClassiFication/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":5000,
                        "Timespan":"00:00:00.089",
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"ClassiFicationType",
                            "Name":"ClassiFicationType",
                            "Value":1,
                            "Children":[]
                        }],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var returngoods = ApiService.postCache(url,paramObj);
                    returngoods.then(function (res) {
                        callback(res);
                    });
                },
                //生成退款单数据
                createReturnGoodsBill : function (scope,callback) {
                    var url = '/SalesOrder/Refund/Save';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = {
                        "SalesOrderCode": scope.formData.SalesOrderCode,
                        "Id": 0,
                        "CreateDate": new Date().format('YYYY-MM-DD hh:mm:ss'),
                        "IsLocked": scope.order.islock,
                        "ActualAmount": scope.formData.ActualAmount,
                        "OffsetAmount": 0,
                        "CustomerCode": scope.formData.CustomerCode,
                        "CustomerName": scope.formData.CustomerName,
                        "StoreId": scope.formData.StoreId,
                        "StoreName": scope.formData.StoreName,
                        "Status": scope.order.status,
                        "RefundWay": scope.formData.RefundWay,
                        "SalesOrderId": scope.order.orderid,
                        "TradeId": scope.order.tradeid,
                        "ReturnType": scope.formData.ReturnType,
                        "RefundType": scope.formData.RefundType,
                        "Mobile": scope.formData.Mobile,
                        "Consignee": scope.order.subOrder.consignee,
                        "IsCod": scope.order.iscod,
                        "IsQuickRefund": false,
                        "IsRefund": false,
                        "Note": scope.formData.Note,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    var  details = this.dealProductData(scope.product);
                    if(details.length > 0){
                        paramObj.body.Details = details;
                    }
                    paramObj.body = JSON.stringify(paramObj.body);
                    var shopList = ApiService.postLoad(url, paramObj);
                    shopList.then(function (res) {
                        callback(res);
                    });
                },
                //处理商品数据
                dealProductData : function (obj){
                    var tmpData = [];
                    for(var i = 0,j = obj.length;i < j;i++){
                        tmpData.push({
                            "Id": 0,
                            "RefundOrderId": 0,
                            "ProductId": obj[i]['productid'],
                            "ProductCode": obj[i]['productcode'],
                            "ProductName": obj[i]['productname'],
                            "SkuId": obj[i]['productskuid'],
                            "SkuCode": obj[i]['skucode'],
                            "SkuName": obj[i]['skuname'],
                            "Quantity": obj[i]['quantity'],
                            "ActualAmount": obj[i]['amountactual'],
                            "OffsetAmount": obj[i]['amountactual'],
                            "ShouldAmount": obj[i]['amountactual'],
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        });
                    }
                    return tmpData;
                }

            };
            return {
                refundDomOperate : refundDomOperate,
                InterfaceDeal : InterfaceDeal
            }
        }
    ]);