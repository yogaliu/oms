/**
 * Created by dell on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('quitGoodsScanService',['ApiService','toolsService','orderManagePublicService','validateService',
        function (ApiService,toolsService,orderManagePublicService,validateService) {

            //配置数据
            var configData = {
                //订单信息列信息配置
                orderColumn : [
                    {name : '退款状态',tag : 'refundstatus'},
                    {name : '店铺',tag : 'storename'},
                    {name : '订单编号',tag : 'code'},
                    {name : '平台交易号',tag :'tradeid'},
                    {name : '会员昵称',tag : 'customername'},
                    {name : '会员编码',tag : 'customercode'},
                    {name : '发货日期',tag : 'deliverydate'}
                ],
                //订单明细列信息配置
                orderDetailsColumn : [
                    {name : '退款',tag : 'isrefunded'},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'skucode'},
                    {name : '规格名称',tag : 'skuname'},
                    {name : '数量',tag : 'quantity'},
                    {name : '结算金额',tag : 'priceselling'}
                ],
                //退入商品的列信息
                returnGoodsColumn : [
                    {name : '',tag : ''},
                    {name : '操作',tag : ''},
                    {name : '原订单',tag : 'code'},
                    {name : '原商品',tag : 'skucode'},
                    {name : '有配件',tag : 'spareparts'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'skucode'},
                    {name : '规格名称',tag : 'skuname'},
                    {name : '数量',tag : 'quantity'},
                    {name : '应退',tag : 'priceselling'},
                    {name : '实退',tag : 'priceselling'}
                ],
                //换出商品列信息
                changeOutColumn : [
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'skucode'},
                    {name : '规格名称',tag : 'skuname'},
                    {name : '数量',tag : 'quantity'},
                    {name : '金额',tag : 'priceselling'}
                ],
                //规格选择列信息
                skuCodeColumn : [
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'code'},
                    {name : '规格名称',tag : 'description'},
                    {name : '市场价',tag : 'firstprice'},
                    {name : '重量',tag : 'weight'},
                    {name : '备注',tag : 'note'}
                ],
                //商品详细信息
                skuCodeDetailsColumn : [
                    {name : '仓库名称',tag :'warehousename'},
                    {name : '库存数',tag :'quantity'},
                    {name : '可用数',tag :'canUseQuantity'},
                    {name : '可销数',tag :'canSaleQuantity'}
                ]
            };

            //dom操作
            var quitGoodsScanDomOperate = {

                //页面信息初始化
                domInit : function (scope){
                    //表单初始化验证
                    validateService.initValidate('#quitGoodsScan');

                    //退货的类型
                    scope.reFundType = [];
                    //退货的配置信息
                    scope.reFundConfig = [];
                    //订单列表列信息配置
                    scope.orderColumn = configData.orderColumn;
                    //订单信息
                    scope.orderList = [];
                    //订单明细列信息配置
                    scope.orderDetailsColumn = configData.orderDetailsColumn;
                    //订单明细信息
                    scope.orderListDetails = [];
                    //内部便签
                    scope.insideLabel = '';
                    //订单明细的商品信息
                    scope.orderDetailsProduct = [];
                    //退入商品的列配置
                    scope.returnGoodsColumn = configData.returnGoodsColumn;
                    //被加入退入商品的订单明细
                    scope.returnGoods = [];
                    //被选中的订单信息
                    scope.orderChosed = [];
                    //换出的商品信息
                    scope.changeOutProduct = [];
                    //换出商品列配置
                    scope.changeOutColumn = configData.changeOutColumn;
                    //选中的退入商品信息
                    scope.returnGoodsChosed = [];

                    //规格信息列信息
                    scope.skuCodeColumn = configData.skuCodeColumn;
                    //规格信息选择
                    scope.skuCodeInfo = [];
                    //规格对应的商品的详细信息
                    scope.skuProductsDetaisl = [];
                    //规格详细数据列配置
                    scope.skuCodeDetailsColumn = configData.skuCodeDetailsColumn;

                    //判断是新增退入商品还是新增换出商品,true表示新增退入商品，false表示新增换出商品
                    scope.addType = true;
                    //存放新增商品的临时数据
                    scope.tmpSkyData = [];
                    scope.formData = {};

                    //获取退货的数据类型
                    quitGoodsScanDeal.getBasicInfoDeal(scope);
                    //获取退货的系统设置信息
                    quitGoodsScanDeal.getRefuncConfigDeal(scope);
                    //获取仓库信息
                    quitGoodsScanDeal.getAllWareHouse(scope);

                    //设置分页配置
                    this.pageSet(scope);
                },
                //分页配置
                pageSet : function (scope) {
                    //公共方法中的分页配置
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope, function () {
                        quitGoodsScanDeal.getskuCodeDeal(scope,scope.formData);
                    });
                }

            };

            //对从后台获取的数据进行处理
            var quitGoodsScanDeal = {
                //对商品信息数据进行处理
                getOrderInfoDeal : function (scope,type,value){
                    quitGoodsScanInterface.getOrderInfo(scope,type,value, function (res) {
                        if(res.success){
                            scope.orderList = res.data;
                            //默认展示第一条订单的明细
                            if(res.data.length){
                                scope.orderListDetails = res.data[0]['details'];
                                scope.orderChosed = res.data[0];
                                quitGoodsScanDeal.getStoreSettingById(scope,res.data[0].storeid);
                            }
                            //以TradeId为键的订单数据类型
                            scope.orderInfoInTradeId = klwTool.arrayToJson(scope.orderList,'tradeid');
                        }
                    });
                },
                //获取退货数据类型
                getBasicInfoDeal : function (scope) {
                    quitGoodsScanInterface.getBasicInfo(scope, function (res) {
                        if(res.success){
                            scope.reFundType = klwTool.arrayToJson(res.data,'code');
                        }
                    });
                },
                //退换货的配置信息
                getRefuncConfigDeal : function (scope) {
                    quitGoodsScanInterface.getRefuncConfig(scope, function (res) {
                        if(res.success){
                            scope.reFundConfig = res.data;
                        }
                    });
                },
                //获取订单明细的商品信息
                getProductDeal : function (scope,code){
                    quitGoodsScanInterface.getProduct(scope,code, function (res) {
                        if(res.success){
                            scope.orderDetailsProduct = res.data;
                        }
                    });
                },
                //根据规格编码获取商品信息
                getProductByCodeDeal : function (scope,code,type){
                    quitGoodsScanInterface.getProductByCode(scope,code, function (res) {
                        if(res.success){
                            var productData = klwTool.arrayToJson(scope.returnGoods,'productid');
                            //如果是已经存在的商品明细，则直接从订单明细里添加
                            if(productData[res.data.productid]){
                                if(type == 'in'){
                                    scope.returnGoods.push(productData[res.data.productid]);
                                }else if(type == 'out'){
                                    scope.changeOutProduct.push(productData[res.data.productid]);
                                }
                            //如果是不存在与订单明细里面的要先对数据处理，再添加
                            }else{
                                var data = {
                                    "amount": 0,
                                    "amountactual": 0,
                                    "createdate": res.data.createdate,
                                    "deleted": res.data.delted,
                                    "discountamount": 0,
                                    "discountamountDet": 0,
                                    "distributionamount": 0,
                                    "firstcost": res.data.firstcost,
                                    "isabnormal": false,
                                    "iscombproduct": res.data.iscombined,
                                    "isdeleted": false,
                                    "ismanual": true,
                                    "isoutofstock": false,
                                    "isrefunded": false,
                                    "isrefundfinished": false,
                                    "issplit": res.data.issplit,
                                    "priceoriginal": res.data.firstprice,
                                    "priceselling": res.data.retailprice,
                                    "productcode": res.data.productcode,
                                    "productid": res.data.productid,
                                    "productname": res.data.productname,
                                    "productskuid": res.data.skuid,
                                    "quantity": 1,
                                    //"quantityDet": 1,
                                    "refundstatus": 0,
                                    "reissueactual": 0,
                                    //"salesorderid": 157,
                                    "skucode": res.data.code,
                                    "skuname": res.data.description,
                                    "status": res.data.status,
                                    "weight": res.data.weight
                                };
                                if(type == 'in'){
                                    scope.returnGoods.push(data);
                                }else if(type == 'out'){
                                    scope.changeOutProduct.push(data);
                                }
                            }
                        }
                    });
                },
                //获取商品信息
                getskuCodeDeal : function (scope,data) {
                    quitGoodsScanInterface.getskuCode(scope,data, function (res) {
                        if(res.success){
                            //清除全选标志
                            scope.skuCheckAll = false;
                            scope.paginationConf.totalItems = res.total;
                            scope.skuCodeInfo = res.data;
                        }
                    });
                },
                //获取规格信息对应的商品信息
                getProductDetailsDeal : function (scope,value) {
                    quitGoodsScanInterface.getProductDetails(scope,value, function (res) {
                        if(res.success){
                            scope.skuProductsDetaisl = res.data;
                            for(var i = 0,j = scope.skuProductsDetaisl.length;i < j;i++){
                                scope.skuProductsDetaisl[i].warehousename = scope.wareHouseInfo[scope.skuProductsDetaisl[i].warehouseid]
                                    ? scope.wareHouseInfo[scope.skuProductsDetaisl[i].warehouseid].name
                                    : '';
                            }
                        }
                    });
                },
                //根据店铺id获取店铺设置信息
                getStoreSettingById : function (scope,value) {
                    quitGoodsScanInterface.getStoreSettingById(scope,value, function (res) {
                        if(res.success){
                            //店铺设置信息
                            scope.storeSetting  = res.data;
                            //退入仓库id
                            var inHouseid = scope.storeSetting.storeSetting.defaultinwarehouseid;
                            //退入仓库id
                            var outHouseid = scope.storeSetting.storeSetting.defaultoutwareshouseid;
                            if(inHouseid){
                                //退入仓库编码
                                scope.wareHouseInCode  = scope.wareHouseInfo[inHouseid].code;
                                //退入仓库id
                                scope.wareHouseInId = scope.wareHouseInfo[inHouseid].id;
                                //退入仓库名字
                                scope.wareHouseName = scope.wareHouseInfo[inHouseid].name;
                            }
                            if(outHouseid){
                                //换出仓库编码
                                scope.WarehouseOutCode = scope.wareHouseInfo[outHouseid].code;
                                //换出仓库id
                                scope.WarehouseOutId = scope.wareHouseInfo[outHouseid].id;
                                //换出仓库name
                                scope.WarehouseOutName = scope.wareHouseInfo[outHouseid].name;
                            }
                        }else{
                            toolsService.alertError('获取店铺设置失败！');
                        }
                    });
                },
                //获取仓库信息
                getAllWareHouse : function (scope) {
                    quitGoodsScanInterface.getAllWareHouse(scope, function (res) {
                        if(res.success){
                            //仓库信息
                            scope.wareHouseInfo = klwTool.arrayToJson(res.data,'id');
                        }else{
                            toolsService.alertError('获取店铺设置失败！');
                        }
                    });
                },
                //保存信息
                saveReturnGoodsBillDeal : function (scope,data){
                    quitGoodsScanInterface.saveReturnGoodsBill(scope,data, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('保存成功！');
                        }else{
                            toolsService.alertError('保存失败！');
                        }
                    });
                }
            };

            //获取后台数据的接口
            var quitGoodsScanInterface = {

                /**
                 * 获取扫描商品的信息
                 * @param scope
                 * @param type 获取扫描信息的条件
                 * @param value 获取扫描信息的条件的值
                 * @param callback
                 */
                getOrderInfo : function (scope,type,value,callback) {
                    var url = '/SalesOrder/SalesOrder/GetWithDetail';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "IsObsolete",
                            "Name": "IsObsolete",
                            "Value": false,
                            "Children": []
                        },
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": type,
                            "Name": type,
                            "Value": value,
                            "Children": []
                        }
                    ]);
                    var quitGoods = ApiService.postLoad(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取订单明细的商品信息
                 * @param scope
                 * @param code 商品id
                 * @param callback
                 */
                getProduct : function (scope,code,callback) {
                    var url = '/Product/Product/GetProduct';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.code = code;
                    var quitGoods = ApiService.postLoad(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },
                //获取退货类型数据
                getBasicInfo : function (scope,callback) {
                    var url = '/BasicInformation/GeneralClassiFication/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"IsDisabled",
                        "Name":"IsDisabled",
                        "Value":false,
                        "Children":[]
                    },{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"ClassiFicationType",
                        "Name":"ClassiFicationType",
                        "Value":1,
                        "Children":[]
                    }]);
                    var quitGoods = ApiService.postCache(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },
                //查询退换货单配置
                getRefuncConfig : function (scope,callback) {
                    var url = '/BasicInformation/SystemConfig/GetReturnOrderConfig';
                    var paramObj = ApiService.getBasicParamobj();
                    var quitGoods = ApiService.postLoad(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },
                //获取系统配置信息
                getSystemConfig : function (scope,callback){
                    var url = '/BasicInformation/SystemConfig/GetSystemConfig';
                    var paramObj = ApiService.getBasicParamobj();
                    var quitGoods = ApiService.postLoad(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 根据规格编码获取商品信息
                 * @param scope
                 * @param code 规格编码
                 * @param callback
                 */
                getProductByCode : function (scope,code,callback) {
                    var url = '/Product/ProductSku/GetSingle';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = code;
                    var quitGoods = ApiService.postLoad(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取商品信息
                 * @param scope
                 * @param data 搜索条件
                 * @param callback
                 */
                getskuCode : function (scope,data,callback) {
                    var url = '/Product/ProductSku/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex": scope.paginationConf.currentPage,
                        "PageSize": scope.paginationConf.itemsPerPage,
                        "SeletedCount": 0,
                        "Data": [
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "pro.Description",
                                "Name": "prodes",
                                "Value": data['prodes'],
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "pro.Code",
                                "Name": "procode",
                                "Value": data['procode'],
                                "Children": []
                            },
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sku.Description",
                                "Name": "skudes",
                                "Value": data['skudes'],
                                "Children": []
                            },
                            {
                                "OperateType": 6,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sku.Code",
                                "Name": "skucode",
                                "Value": data['skucode'],
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sku.Status",
                                "Name": "skustatus",
                                "Value": 1,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "sku.IsCombined",
                                "Name": "IsCombined",
                                "Value": "0",
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "pro.Status",
                                "Name": "prostatus",
                                "Value": 1,
                                "Children": []
                            }
                        ],
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    });
                    var quitGoods = ApiService.postLoad(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取商品详情信息
                 * @param scope
                 * @param value 规格的id（code）
                 * @param callback
                 */
                getProductDetails : function (scope,value,callback) {
                    var url = '/Inventory/InventoryVirtual/GetOccupation';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Code",
                        "Name":"Code",
                        "Value":value,
                        "Children":[]
                    }]);
                    var quitGoods = ApiService.postLoad(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 保存退货扫描单
                 * @param scope
                 * @param data 商品数据
                 * @param callback
                 */
                saveReturnGoodsBill : function (scope,data,callback){
                    var url = '/SalesOrder/Return/ReturnOrder/ScanInsert';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(data);
                    var quitGoods = ApiService.postLoad(url,paramObj);
                    quitGoods.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 根据店铺id获取对应店铺设置
                 * @param scope
                 * @param value 店铺id
                 * @param callback
                 */
                getStoreSettingById : function (scope,value,callback) {
                    var url = '/BasicInformation/Store/GetById';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(value);
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function(res){
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
                    var wareHose = ApiService.postCache(url,paramObj);
                    wareHose.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                quitGoodsScanDomOperate : quitGoodsScanDomOperate,
                quitGoodsScanDeal : quitGoodsScanDeal
            }

        }
    ]);