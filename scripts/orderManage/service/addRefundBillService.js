/**
 * Created by zgh on 2017/5/9.
 */
angular.module('klwkOmsApp')
    .service('addRefundBillService',['ApiService','toolsService','APP_MENU','orderManagePublicService','validateService',
        function (ApiService,toolsService,APP_MENU,orderManagePublicService,validateService) {
            //配置数据
            var configData = {
                /**
                 * 获取默认参数
                 * @returns {{TimeStamp: string, Sign: string, Version: string, SessionId: string, UserId: string, UserName: string, Token: string, CompanyId: string, LoginKey: string}}
                 */
                getParamObj : function () {
                    return {
                        'TimeStamp': '2017-04-06 10:37:00',
                        'Sign': '35F31A6B00A30A50407F2F5D0251DDB8',
                        'Version': '2.5.1.9',
                        'UserId': '8d4082c4-b85c-4696-b238-f0239bd20dbf',
                        'UserName': 'zgh',
                        'LoginKey': 'eda9ff0b-8c57-45c2-be04-92e2a57465d8'
                    };
                },
                //订单列表列配置
                orderListColumns : [
                    {name: "订单特殊标识", tag: 'tips'},
                    {name: "锁定人", tag: 'lockedusername'},
                    {name: "订单编号", tag: 'code'},
                    {name: "平台订单号", tag: 'tradeid'},
                    {name: "状态", tag: 'status','otherInfo':APP_MENU.orderStatus},
                    {name: "平台状态", tag: 'platformstatus','otherInfo':APP_MENU.orderPlantformStatus},
                    {name: "付款状态", tag: 'paystatus','otherInfo':APP_MENU.orderPaymentStatus},
                    {name: "预售类型", tag: 'presaletype',otherInfo:APP_MENU.preSellType},
                    {name: "预售日期", tag: 'preshipmentdate'},
                    {name: "留单日期", tag: 'customershipdate'},
                    {name: "配货状态", tag: 'dispatchtypestatus', 'otherInfo' : APP_MENU.preDistributionStatus},
                    {name: "发货状态", tag: 'deliverytypestatus','otherInfo':APP_MENU.preDelivery},
                    {name: "退款状态", tag: 'refundstatus','otherInfo':APP_MENU.preRefundType},
                    {name: "内部标签", tag: 'messagestring'},
                    {name: "收货人", tag: 'consignee'},
                    {name: "省", tag: 'provincename'},
                    {name: "市", tag: 'cityname'},
                    {name: "区", tag: 'countyname'},
                    {name: "收货地址", tag: 'address'},
                    {name: "电话", tag: 'telphone'},
                    {name: "手机号码", tag: 'mobile'},
                    {name: "买家备注", tag: 'buyermemo'},
                    {name: "卖家备注", tag: 'sellermemo'},
                    {name: "订单标记", tag: 'tagname'},
                    {name: "分销订单号", tag: 'distributiontradedd'},
                    {name: "支付日期", tag: 'paydate'},
                    {name: "制单日期", tag: 'createdate'},
                    {name: "交易日期", tag: 'platfromdate'},
                    {name: "发货时间", tag: 'deliverydate'},
                    {name: "订单类型", tag: 'transtype',otherInfo:APP_MENU.preOrderType},
                    {name: "订单来源", tag: 'sourcetype',otherInfo:APP_MENU.preOrderSource},
                    {name: "会员昵称", tag: 'customername'},
                    {name: "店铺名称", tag: 'storename'},
                    {name: "制单人", tag: 'createusername'},
                    {name: "推荐快递", tag: 'suggestexpressname'},
                    {name: "推荐仓库", tag: 'suggestwarehousename'},
                    {name: "发货快递", tag: 'expressname'},
                    {name: "发货仓库", tag: 'warehousename'},
                    {name: "快递单号", tag: 'expressnumber'},
                    {name: "商品总数量", tag: 'quantity'},
                    {name: "支付金额", tag: 'payamount'},
                    {name: "补差价金额", tag: 'addprice'},
                    {name: "补发原因", tag: 'addpricename'},
                    {name: "邮费", tag: 'expressfee'},
                    {name: "货到付款编号", tag: 'codno'},
                    {name: "个性化包裹说明", tag: 'bagdescriprion'},
                    {name: "已开电子发票", tag: 'hasinvoice'}
                ],
                //订单明细列配置
                orderDetailsColumn : [
                    {name : '操作',tag : ''},
                    {name: "状态", tag: "status",otherInfo:APP_MENU.preDistributionInfoState},
                    {name: "是否缺货", tag: 'isoutofstock'},
                    {name: "商品编码", tag: 'productcode'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "退款", tag: 'isrefunded'},
                    {name: "标记名称", tag: 'tagname'},
                    {name: "作废", tag: 'isobsolete'},
                    {name: "商品类型", tag: 'producttype'},
                    {name: "预售日期", tag: 'preshipmentdate'},
                    //{name: "订购数量", tag: 'num'},
                    {name: "原始单价", tag: 'priceoriginal'},
                    {name: "销售单价", tag: 'priceselling'},
                    {name: "促销单价", tag: 'pricepromotional'},
                    {name: "销售金额", tag: 'amount'},
                    {name: "结算金额", tag: 'amountactual'}
                ]
            };

            //dom操作
            var refundDomOperate = {
                //页面初始化
                domInit : function (scope) {
                    //表单初始化验证
                    validateService.initValidate('#addRefundBill');
                    //分页配置
                    this.pageSet(scope);

                    //订单列表列配置
                    scope.orderListColumn = configData.orderListColumns;
                    //订单明细列表配置
                    scope.orderDetailsColumn = configData.orderDetailsColumn;

                    //新增退款单数据
                    scope.orderChosed = {};

                    //下拉框数据配置
                    this.selectConfig(scope);
                    //如果orderid不为空，表示是修改退款单，而不是新增退款单
                    if(scope.orderid !== undefined){
                        InterfaceDeal.getOrderDetails(scope,scope.orderid);
                    }
                    //获取店铺数据
                    InterfaceDeal.getAllShops(scope);
                    //退货类型
                    InterfaceDeal.getReturnGoods(scope);
                },
                //分页配置
                pageSet : function (scope) {
                    //公共方法中的分页配置
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope, function () {
                        InterfaceDeal.getOrderList(scope);
                    });
                },
                //下拉框数据配置
                selectConfig : function (scope) {
                    scope.pullSelect = {
                        //店铺信息
                        storeList : {
                            isshow:false,
                            info:[],
                            validata : true,
                            onChange: function(obj,index){	//点击之后的回调
                                scope.orderChosed.storename = obj.name;
                                scope.orderChosed.storeid = obj.id;
                            }
                        },
                        //退款类型
                        refundType : {
                            isshow:false,
                            validate :true,
                            info:refundDomOperate.changeData(APP_MENU['afterSellRefundType']),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.orderChosed.refundtype = obj.name;
                            }
                        },
                        //退货类型
                        returnGoodsType : {
                            isshow:false,
                            info:[],
                            validate : true,
                            onChange: function(obj,index){	//点击之后的回调
                                scope.orderChosed.returntype = obj.name;
                            }
                        },
                        //退款方式
                        refundWay : {
                            isshow:false,
                            validate : true,
                            info:refundDomOperate.changeData(APP_MENU['refundWay']),
                            objName:{id:'0'},
                            onChange: function(obj,index){	//点击之后的回调
                                scope.orderChosed.refundway = obj.id;
                            }
                        }
                    };
                },
                //将枚举类型的数据转化为下拉框可用数据
                changeData : function (data){
                    var tmp = [];
                    for(var item in data){
                        tmp.push({
                            id : item,
                            name : data[item]
                        });
                    }
                    return tmp;
                }
            };
            
            //接口数据处理
            var InterfaceDeal = {
                //店铺数据
                getAllShops : function (scope) {
                    Interface.getAllShops(scope, function (res) {
                        if(res.success){
                            //店铺数据下拉框
                            scope.pullSelect.storeList.info = res.data;
                            scope.storeList = res.data;
                        }else{
                            toolsService.alertError('获取店铺数据失败！');
                        }
                    });
                },
                //退货类型
                getReturnGoods : function (scope) {
                    Interface.getReturnGoods(scope, function (res) {
                        if(res.success){
                            //店铺数据下拉框
                            scope.pullSelect.returnGoodsType.info = res.data;
                        }else{
                            toolsService.alertError('获取退货类型失败！');
                        }
                    });
                },
                //获取订单信息
                getOrderList : function (scope,callback) {
                    Interface.getOrderList(scope, function (res) {
                        if(res.success){
                            //订单数据
                            scope.orderListData = res.data;
                            //$('#dataListTable').DataTable( {
                            //    scrollY: 400,
                            //    scrollX:true,
                            //    paging: false,
                            //    searching: false,
                            //    info : false,
                            //    bDestroy: true
                            //} );
                            scope.paginationConf.totalItems = res.total;
                            callback();
                        }else{
                            toolsService.alertError('获取订单数据失败！');
                        }
                    });
                },
                //添加退货货单
                addRefundBill : function (scope,data,callback) {
                    Interface.addRefundBill(scope,data, function (res) {
                        if(res.success){
                            callback();
                            toolsService.alertSuccess('添加成功！');
                        }else{
                            toolsService.alertError('添加失败！');
                        }
                    });
                },
                //获取订单明细
                getOrderDetails : function (scope,orderid) {
                    Interface.getOrderDetails(scope,orderid, function (res) {
                        if(res.success){
                            scope.orderChosed = res.data;
                            //设置店铺
                            scope.pullSelect.storeList.setValue({id:res.data.storeid,name : res.data.storename});
                            //订单明细数据
                            scope.orderDetails = res.data;
                        }else{
                            toolsService.alertError('获取订单明细失败！');
                        }
                    });
                }
            };

            //接口数据请求
            var Interface = {
                /**
                 * 获取所有店铺的接口
                 * @param scope $scope对象
                 * @param callback 调用接口成功后的回调函数
                 */
                getAllShops : function (scope,callback) {
                    var url = '/BasicInformation/Store/Get';
                    var paramObj = ApiService.postLoad();
                    paramObj.body = [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "IsDisabled",
                        "Name": "IsDisabled",
                        "Value": false,
                        "Children": []
                    }];
                    var shopList = ApiService.postCache(url,paramObj);
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
                /**
                 * 获取订单列表
                 * @param scope
                 * @param callback
                 */
                getOrderList : function (scope,callback) {
                    var url = '/SalesOrder/SalesOrder/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj['body'] = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "Timespan":"00:00:41.452",
                        "SeletedCount":0,
                        "Data":[
                            {
                                "OperateType":0,
                                "LogicOperateType":0,
                                "AllowEmpty":false,
                                "Field":"IsObsolete",
                                "Name":"IsObsolete",
                                "Value":false,
                                "Children":[]
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": scope.formData ? scope.formData.Code : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "TradeId",
                                "Name": "TradeId",
                                "Value": scope.formData ? scope.formData.TradeId : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CustomerName",
                                "Name": "CustomerName",
                                "Value": scope.formData ? scope.formData.CustomerName : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "DispatchCode",
                                "Name": "DispatchCode",
                                "Value": scope.formData ?  scope.formData.DispatchCode : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "SkuCode",
                                "Name": "SkuCode",
                                "Value": scope.formData ?  scope.formData.SkuCode : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 1,
                                "AllowEmpty": false,
                                "Children": [
                                    {
                                        "OperateType": 0,
                                        "LogicOperateType": 0,
                                        "AllowEmpty": false,
                                        "Field": "sub.Mobile",
                                        "Name": "Mobile",
                                        "Value": scope.formData ? scope.formData.Mobile : undefined,
                                        "Children": []
                                    },
                                    {
                                        "OperateType": 0,
                                        "LogicOperateType": 0,
                                        "AllowEmpty": false,
                                        "Field": "sub.Telephone",
                                        "Name": "Telephone",
                                        "Value": scope.formData ? scope.formData.Mobile : undefined,
                                        "Children": []
                                    }
                                ]
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var orderlist = ApiService.postLoad(url,paramObj);
                    orderlist.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 新增退款单
                 * @param scope
                 * @param data 退款单数据
                 * @param callback
                 */
                addRefundBill : function (scope,data,callback) {
                    var url = '/SalesOrder/Refund/Save';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(data);
                    var refundBill = ApiService.postLoad(url,paramObj);
                    refundBill.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 获取订单明细
                 * @param scope
                 * @param orderId 订单id
                 * @param callback
                 */
                getOrderDetails : function (scope,orderId,callback){
                    var url = '/SalesOrder/SalesOrder/GetSingle';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderid = orderId;
                    var orderDetails = ApiService.postLoad(url,paramObj);
                    orderDetails.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                refundDomOperate : refundDomOperate,
                InterfaceDeal : InterfaceDeal
            };

        }
    ]);