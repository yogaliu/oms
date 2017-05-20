/**
 * Created by zgh on 2017/5/4.
 */
angular.module('klwkOmsApp')
    .service('manualDispatchService',['ApiService','toolsService','orderManagePublicService',
        function (ApiService,toolsService,orderManagePublicService) {

            //配置数据
            var configData = {
                //订单信息列信息配置
                orderColumn : [
                    {name : '',tag : ''},
                    {name : '会员昵称',tag : 'customername'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格名称',tag : 'skuname'},
                    {name : '数量',tag :'quantity'},
                    {name : '货到付款',tag : 'iscod'},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '标记',tag : 'tagname'},
                    {name : '店铺',tag : 'storename'},
                    {name : '结算金额',tag : 'amountactual'},
                    {name : '买家留言',tag : 'buyermemo'},
                    {name : '卖家留言',tag : 'sellermemo'}
                ],
                //订单明细列信息配置
                orderDetailsColumn : [
                    {name : '仓库',tag : 'warehousename'},
                    {name : '库存数',tag : 'quantity'},
                    {name : '可用数',tag : 'canUseQuantity'},
                    {name : '可销数',tag : 'canSaleQuantity'}
                ],
                //发货商品的列信息
                returnGoodsColumn : [
                    {name : '操作',tag : ''},
                    {name : '订单号',tag : 'cod'},
                    {name : '会员昵称',tag : 'customername'},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'skucode'},
                    {name : '规格名称',tag : 'skuname'},
                    {name : '配货仓库',tag : 'warehouse'},
                    {name : '数量',tag : 'quantity'}
                ],
                //收货信息列信息
                changeOutColumn : [
                    {name : '收货人',tag : ''},
                    {name : '手机',tag : 'productname'},
                    {name : '电话',tag : 'skucode'},
                    {name : '邮编',tag : 'skuname'},
                    {name : '地址',tag : 'quantity'}
                ]
            };

            //dom操作
            var DomOperate = {

                //页面信息初始化
                domInit : function (scope,orderid){
                    //订单列信息配置
                    scope.orderColumn = configData.orderColumn;
                    //订单明细列信息配置
                    scope.orderDetailsColumn = configData.orderDetailsColumn;
                    //发货商品信息列配置
                    scope.returnGoodsColumn =  configData.returnGoodsColumn;
                    //收货信息列配置
                    scope.changeOutColumn = configData.changeOutColumn;
                    //下拉列表中选中的仓库信息
                    scope.wareHouseChosed = {};

                    //订单信息
                    scope.orderInfo = {};
                    //关联订单信息
                    scope.relevanceOrder = [];
                    //商品信息
                    scope.productDetails = [];
                    //仓库信息
                    scope.wareHouse =[];
                    //已选中的商品信息
                    scope.productHasChose = [];
                    //要配货的商品信息
                    scope.allocation = [];
                    //下拉列表配置
                    scope.selectConfig = {
                        //仓库下拉配置
                        warsehouse : {
                            isshow:false,
                            info:[],
                            name : '请选择仓库',
                            onChange: function(obj,index){	//点击之后的回调
                                scope.wareHouseChosed = obj;
                                //快递二级联动，选择仓库后，快递信息自动回到初始化状态
                                scope.selectConfig.express.info = obj.express;
                                scope.selectConfig.express.init();
                            }
                        },
                        //快递下拉配置
                        express : {
                            isshow:false,
                            info:[],
                            onChange: function(obj,index){	//点击之后的回调
                                scope.expressChosed = obj;
                            }
                        }
                    };

                    ApiService.listenAll(function (deffer) {
                        //获取订单信息（为了获取最新订单信息）
                        InterfaceDeal.getOrderById(scope,orderid,deffer);
                    },function (deffer) {
                        //获取仓库信息
                        InterfaceDeal.getAllWareHouse(scope,deffer);
                    }, function (deffer) {
                        //获取快递信息
                        InterfaceDeal.getAllExpressInfo(scope,deffer);
                    }).then(function (result) {
                        //匹配快递信息和仓库信息，wareHouseSelectConfig包含三个参数，id表示仓库id，name表示仓库名称，express表示仓库对应的快递信息
                        scope.wareHouseSelectConfig = [];
                        var tmp = {
                            id : '',
                            name : '',
                            express : []
                        };
                        var tmpData = [];
                        for(var item in scope.wareHouse){
                            tmp['id'] = scope.wareHouse[item]['warehouseid'];
                            tmp['templatewarehouseid'] = scope.wareHouse[item]['templatewarehouseid'];
                            tmp['code'] = scope.wareHouseConfigData[scope.wareHouse[item]['warehouseid']]['code'];
                            tmp['name'] = scope.wareHouseConfigData[scope.wareHouse[item]['warehouseid']]['name'];
                            tmp['express'] = [];
                            for(var x = 0,y = scope.wareHouse[item]['expresses'].length;x < y;x++){
                                tmp['express'].push({
                                    id : scope.wareHouse[item]['expresses'][x]['expressid'],
                                    name : scope.expressConfigData[scope.wareHouse[item]['expresses'][x]['expressid']]['name'],
                                    code : scope.expressConfigData[scope.wareHouse[item]['expresses'][x]['expressid']]['code']
                                });
                            }
                            tmpData = $.extend({},tmp);
                            scope.wareHouseSelectConfig.push(tmpData);
                        }
                        scope.selectConfig.warsehouse.info = scope.wareHouseSelectConfig;
                    });
                }
            };

            //对从后台获取的数据进行处理
            var InterfaceDeal = {
                //获取订单信息
                getOrderById : function (scope,orderid,def) {
                    Interface.getOrderById(scope,orderid, function (res) {
                        if(res.success){
                            scope.orderInfo = res.data;
                            //这里需要对订单信息进行判断，判断当前是否适合手动配货，

                            //必须 获取到订单信息和仓库信息后才可以查找商品明细
                            ApiService.listenAll(function (deffer) {
                                //获取到订单信息号，根据mergemd5来匹配相关订单信息
                                InterfaceDeal.getUnDispatch(scope,scope.orderInfo.subOrder.mergemd5,deffer);
                            }, function (deffer) {
                                //获取商品所在店铺从哪个仓库出货
                                InterfaceDeal.getWarehouseInfo(scope,scope.orderInfo.storeid,deffer);
                            }).then(function(result){
                                def.resolve();
                                //获取商品明细信息
                                InterfaceDeal.getProductDetails(scope,scope.relevanceOrder[0]['details'][0]['productskuid']);
                            });
                        }else{
                            deffer.reject();
                            alert('获取商品信息失败');
                        }
                    });
                },
                //获取未配货信息订单
                getUnDispatch : function (scope,id,deffer) {
                    Interface.getUnDispatch(scope,id, function (res) {
                        if(res.success){
                            //别人是否锁定订单的标志
                            var otherLock = false;
                            //未被自己锁定的的订单id
                            var unLockIds = [];
                            scope.relevanceOrder = res.data;

                            //判断所有订单中是否都是操作人锁定的，如果不是就给提示
                            for(var i = 0,j = scope.relevanceOrder.length;i < j;i++){
                                if(scope.relevanceOrder[i].lockedusername != ApiService.getBasicParamobj.UserName){
                                    otherLock = true;
                                    unLockIds = scope.relevanceOrder[i]['orderid'];
                                }
                            }

                            //有别人锁定的订单，自己重新锁定这些订单
                            if(otherLock){
                                toolsService.alertConfirm({
                                    "msg":"有其他人锁定的订单，是否再次锁定？",
                                    okBtn : function(index, layero){
                                        InterfaceDeal.lockOrder(scope,unLockIds);
                                    },
                                    cancelBtn :  function(index, layero){
                                    }
                                });
                            }

                            //判断是否有商品信息
                            if(res.data[0]['details'].length > 0 ){
                                deffer.resolve();
                            }else{
                                deffer.reject();
                            }
                        }else{
                            deffer.reject();
                            alert('获取未配货商品信息失败');
                        }
                    });
                },
                //获取仓库信息
                getWarehouseInfo : function (scope,storeid,deffer) {
                    Interface.getWarehouseInfo(scope,storeid, function (res) {
                        if(res.success){
                            scope.wareHouse =klwTool.arrayToJson(res.data.warehouses,'warehouseid');
                            scope.wareHouseIds = InterfaceDeal.getWarseHouseId(res.data.warehouses);
                            deffer.resolve();
                        }else{
                            deffer.reject();
                            alert('获取未配货商品信息失败');
                        }
                    });
                },
                //获取所有的仓库信息
                getAllWareHouse : function (scope,deffer) {
                    Interface.getAllWareHouse(scope, function (res) {
                        if(res.success){
                            deffer.resolve();
                            //仓库信息
                            scope.wareHouseConfigData = klwTool.arrayToJson(res.data,'id');
                        }else{
                            deffer.reject();
                            alert('获取商品明细失败');
                        }
                    });
                },
                //获取所有快递信息
                getAllExpressInfo : function (scope,deffer){
                    Interface.getAllExpressInfo(scope,function (res) {
                        if(res.success){
                            deffer.resolve();
                            scope.expressConfigData = klwTool.arrayToJson(res.data,'id');
                            console.log(scope.expressConfigData)
                        }else{
                            deffer.reject();
                            alert('获取商品明细失败');
                        }
                    });
                },
                //匹配快递
                matchExpress : function (scope) {
                    var id = scope.wareHouseChosed.templatewarehouseid;
                    var province = scope.orderInfo.subOrder['provincename'];
                    var city = scope.orderInfo.subOrder['cityname'];
                    var country = scope.orderInfo.subOrder['countyname'];
                    Interface.matchExpress(scope,id,province,city,country,function (res) {
                        if(res.success){
                            scope.matchExpressInfo = res.data;
                            if(res.data.length > 0){
                                scope.selectConfig.express.objName = {
                                    id : res.data[0]['expressId']
                                };
                                //匹配到快递信息后，将选中的快递信息添加到已选中的对象中
                                scope.expressChosed = {
                                    id : res.data[0]['expressId'],
                                    name : scope.expressConfigData[res.data[0]['expressId']]['name'],
                                    code : scope.expressConfigData[res.data[0]['expressId']]['code']
                                }
                            }else{
                                alert('没有匹配到快递，请手动选择快递');
                            }
                        }else{
                            deffer.reject();
                            alert('匹配快递失败');
                        }
                    });
                },
                //将多个订单的信息整合(买家备注和卖家备注)
                merageOrderInfo : function (obj,type) {
                    var tmpData = [];
                    if(obj.length > 0){
                        for(var i = 0,j = obj.length;i < j;i++){
                            tmpData.push(obj[i][type]);
                        }
                    }else{
                        return '';
                    }
                    return tmpData.join(',');
                },
                //计算所有商品的总重量
                countWeight : function (obj,type) {
                    var weight = 0;
                    if(obj.length > 0){
                        for(var i = 0,j = obj.length;i < j;i++){
                            weight += (Number)((obj[i][type] == undefined) ? 0 : obj[i][type]);
                        }
                    }
                    return weight;
                },
                //获取支付时间
                getPayTime : function (obj,type) {
                    var time = '';
                    if(obj.length > 0){
                        time = obj[i][type];
                    }
                    return time;
                },
                //生成商品明细信息
                createProductDetails : function (scope,obj) {
                    var details = [];
                    for(var i = 0,j = obj.length;i < j;i++){
                        var data = {
                            "Id": 0,
                            "DispatchOrderId": 0,
                            "ProductId": obj[i]['productid'],
                            "ProductCode": obj[i]['productcode'],
                            "ProductName": obj[i]['productname'],
                            "ProductSkuId": obj[i]['productskuid'],
                            "ProductSkuCode": obj[i]['skucode'],
                            "ProductSkuName": obj[i]['skuname'],
                            "Quantity": obj[i]['quantity'],
                            "PriceOriginal": obj[i]['priceoriginal'],
                            "PriceSelling": obj[i]['priceselling'],
                            "Amount": obj[i]['amount'],
                            "WarehouseId": scope.wareHouseChosed.id,
                            "WarehouseName": scope.wareHouseChosed.name,
                            "WarehouseCode": scope.wareHouseChosed.code,
                            "DiscountAmount": obj[i]['discountamount'],
                            "AmountActual": obj[i]['amountactual'],
                            "DistributionAmount": obj[i]['distributionamount'],
                            "SalesOrderId": obj[i]['salesorderid'],
                            "SalesOrderDetailId": obj[i]['detailid'],
                            "SalesOrderCode": obj[i]['salesordercode'],
                            "TradeId": obj[i]['tradeid'],
                            "Status": obj[i]['status'],
                            "OutQuantity": 0,//不用管
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        };
                        details.push(data);
                    }
                    return details;
                },
                //生成配货单
                createBill : function (scope,callback) {
                    //配货通知单数据整理
                    var data = {
                        "Id": 0,
                        "MemberCode": scope.orderInfo.customercode,
                        "MemberName": scope.orderInfo.customername,
                        "WarehouseId": scope.wareHouseChosed.id,
                        "WarehouseName": scope.wareHouseChosed.name,
                        "WarehouseCode": scope.wareHouseChosed.code,
                        "Consignee": scope.orderInfo.subOrder.consignee,
                        "Address": scope.orderInfo.subOrder.address,
                        "Mobile": scope.orderInfo.subOrder.mobile,
                        "Province": scope.orderInfo.subOrder.provincename,
                        "City": scope.orderInfo.subOrder.cityname,
                        "County": scope.orderInfo.subOrder.countyname,
                        "SuggestExpressId": scope.expressChosed.id,
                        "SuggestExpressName": scope.expressChosed.name,
                        "SuggestExpressCode": scope.expressChosed.code,
                        "SuggestExpressFee": 0,//这里要修改一下，不知道怎么获取快递费用
                        "ActualExpressId": "00000000-0000-0000-0000-000000000000",
                        "ActualExpressFee": 0,
                        "PayTime": scope.orderInfo.paydate,
                        "ActualPay": InterfaceDeal.countWeight(scope.allocation,'amount'),
                        "ReceivableAmounts": InterfaceDeal.countWeight(scope.allocation,'amountactual'),
                        "BuyerMemo": InterfaceDeal.merageOrderInfo(scope.allocation,'buyermemo'),
                        "SellerMemo": InterfaceDeal.merageOrderInfo(scope.allocation,'sellermemo'),
                        "IsUrgent": false,
                        "Status": 0,
                        "IsNeedInvoice": false,
                        "IsExpressFeeCod": false,
                        "IsWMSCannel": false,
                        "IsMerger": false,
                        "BagDescriprion": InterfaceDeal.merageOrderInfo(scope.allocation,'bagdescriprion'),
                        "IsBag": true,
                        "IsCod": false,
                        "StoreId": scope.orderInfo.storeid,
                        "StoreName": scope.orderInfo.storename,
                        "Weight": InterfaceDeal.countWeight(scope.allocation,'weight'),
                        "CountryName": scope.orderInfo.subOrder.nationalname,
                        "Volume": InterfaceDeal.countWeight(scope.allocation,'volume'),
                        "CreateDate": new Date().format('yyyy-MM-dd h:m:s'),
                        "ProvinceCode": scope.orderInfo.subOrder.provincecode,
                        "CityCode": scope.orderInfo.subOrder.citycode,
                        "CountyCode": scope.orderInfo.subOrder.countycode,
                        "Details": InterfaceDeal.createProductDetails(scope,scope.allocation),
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    Interface.createBill(scope,data,callback);
                },
                //锁定订单
                lockOrder : function (scope,orderid) {
                    Interface.lockOrder(scope,orderid, function (res) {
                        if(res.success){
                        }else{
                            alert('锁定订单失败');
                        }
                    });
                },
                //获取商品明细
                getProductDetails : function (scope,skuid) {
                    Interface.getProductDetails(scope,skuid,scope.wareHouseIds, function (res) {
                        if(res.success){
                            scope.productDetails = res.data;
                            //将订单明细里面的仓库id变仓库名
                            for(var i = 0,j = scope.productDetails.length;i < j;i++){
                                scope.productDetails[i]['warehousename'] = scope.wareHouseConfigData[scope.productDetails[i]['warehouseid']]['name'];
                            }
                        }else{
                            alert('获取商品明细失败');
                        }
                    });
                },
                //获取所有仓库的id
                getWarseHouseId : function (obj) {
                    var ids = [];
                    for(var i = 0,j = obj.length;i < j;i++){
                        ids.push(obj[i]['warehouseid']);
                    }
                    return ids.join(',');
                }
            };

            //获取后台数据的接口
            var Interface = {

                /**
                 * 锁定订单
                 * @param orderIds 要锁定的订单的id数组
                 * @param scope
                 * @param callback
                 */
                lockOrder : function (scope,orderIds,callback){
                    var url = '/SalesOrder/SalesOrder/Lock';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(orderIds);
                    var lockOrder = ApiService.postLoad(url,paramObj);
                    lockOrder.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 生成配货单
                 * @param scope
                 * @param data 配货单数据
                 * @param callback
                 */
                createBill : function (scope,data,callback) {
                    var url = '/SalesOrder/Dispatch/ManualDispatch';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(data);
                    ApiService.postLoad(url,paramObj)
                        .then(function (res) {
                            callback(res);
                        });
                },

                /**
                 * 匹配快递
                 * @param scope
                 * @param id 仓库id
                 * @param province 省份（中文）
                 * @param city 城市（中文）
                 * @param country 地区（中文）
                 */
                matchExpress : function (scope,id,province,city,country,callback) {
                    var url = '/SalesOrder/Dispatch/MatchExpress';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.warehouseTemplateId = id;
                    paramObj.province = province;
                    paramObj.city = city;
                    paramObj.county = country;
                    ApiService.postLoad(url,paramObj)
                    .then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 获取所有快递信息
                 * @param scope $scope对象
                 * @param callback 获取后台信息后的回调函数
                 */
                getAllExpressInfo : function (scope,callback) {
                    var url = '/BasicInformation/Express/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = [];
                    var express = ApiService.postLoad(url,paramObj);
                    express.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取所有仓库信息
                 * @param scope $scope对象
                 * @param callback 获取仓库后的回调函数
                 */
                getAllWareHouse : function (scope,callback) {
                    var url = '/BasicInformation/Warehouse/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":5000,
                        "SeletedCount":0,
                        "Data":[],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var wareHose = ApiService.postLoad(url,paramObj);
                    wareHose.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取订单信息
                 * @param scope
                 * @param orderid 订单id
                 * @param callback
                 */
                getOrderById : function (scope,orderid,callback){
                    var url = '/SalesOrder/SalesOrder/GetSingle';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderid = orderid;
                    ApiService.postLoad(url,paramObj)
                        .then(function (res) {
                            callback(res);
                        });
                },

                /**
                 * 获取订单中未配货的商品信息
                 * @param scope
                 * @param id
                 * @param callback
                 */
                getUnDispatch : function (scope,id,callback) {
                    var url = '/SalesOrder/Dispatch/QueryUnDispatch';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = id;
                    ApiService.postLoad(url,paramObj)
                        .then(function (res) {
                            callback(res);
                        });
                },

                /**
                 * 获取商品明细
                 * @param scope
                 * @param skuid  规格id
                 * @param warehouseid 仓库id
                 * @param callback
                 */
                getProductDetails : function (scope,skuid,warehouseid,callback) {
                    var url = '/Inventory/InventoryVirtual/GetOccupation';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "SkuId",
                            "Name": "SkuId",
                            "Value": skuid,
                            "Children": []
                        },
                        {
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "WarehouseId",
                            "Name": "WarehouseId",
                            "Value": warehouseid,
                            "Children": []
                        },
                        {
                            "OperateType": 2,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "Quantity",
                            "Name": "Quantity",
                            "Value": 0,
                            "Children": []
                        }
                    ]);
                    ApiService.postLoad(url,paramObj)
                        .then(function (res) {
                            callback(res);
                        });
                },

                /**
                 * 获取仓库信息
                 * @param scope
                 * @param storeid 店铺id
                 * @param callback
                 */
                getWarehouseInfo : function (scope,storeid,callback){
                    var url = '/BasicInformation/DispatchTemplate/GetTemplateByStoreId';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(storeid);
                    ApiService.postLoad(url,paramObj)
                        .then(function (res) {
                            callback(res);
                        });
                }
            };

            return {
                DomOperate : DomOperate,
                InterfaceDeal : InterfaceDeal
            }

        }
    ]);