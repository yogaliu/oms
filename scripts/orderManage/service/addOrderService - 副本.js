/**
 * Created by zgh on 2017/4/6.
 */

angular.module('klwkOmsApp')
    .service('addOrderService',['ApiService','orderManagePublicService','APP_MENU','validateService','toolsService',
        function (ApiService,orderManagePublicService,APP_MENU,validateService,toolsService) {

            //配置数据
            var configData = {
                //已选中的商品的列配置
                productsChosedColumn : [
                    {name : '作废',tag : 'isobsolete'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '规格编码',tag : 'code'},
                    {name : '规格名称',tag : 'description'},
                    {name : '数量',tag : 'quality'},
                    {name : '销售价',tag : 'priceoriginal'},
                    {name : '实际售价',tag : 'retailprice'},
                    {name : '应付金额',tag : 'retailprice'},
                    {name : '优惠金额',tag : 'discountamount'},
                    {name : '结算金额',tag : 'retailprice'}
                ],

                //商品列表的列名
                productColumn : [
                    {name : '',tag : ''},
                    {name : '商品名称',tag : 'productname'},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '规格编码',tag : 'code'},
                    {name : '规格名称',tag : 'description'},
                    {name : '市场价',tag : 'firstprice'},
                    {name : '重量',tag : 'weight'},
                    {name : '备注',tag : 'note'}
                ],
                //库存详细列信息
                occupationColumn :  [
                    {name : '仓库名称',tag : 'warsehousename'},
                    {name : '库存数',tag : 'quantity'},
                    {name : '可用数',tag : 'canUseQuantity'},
                    {name : '可销数',tag : 'canSaleQuantity'}
                ],
                //套装列表配置
                combinedProductColumn : [
                    {name : '不可拆分',tag : 'issplit'},
                    {name : '套装代码',tag : 'code'},
                    {name : '套装名称',tag : 'description'},
                    {name : '套装分类',tag : 'productcategory'},
                    {name : '套装规格',tag : 'productsize'},
                    {name : '重量',tag : 'weight'},
                    {name : '销售价',tag : 'wholesaleprice'},
                    {name : '备注',tag :'note'}
                ]
            };

            //接口调用处理
            var InterfaceDeal = {
                //查询区域
                regionCheck : function (scope,level,value,callback) {
                    Interface.regionCheck(scope,level,value, function (res) {
                        if(res.success){
                            callback(res.data);
                        }else{
                            toolsService.alertError('查询区域信息失败');
                        }
                    });
                },
                //获取所有店铺信息
                getAllShops : function (scope,deffer) {
                    Interface.getAllShops(scope, function (res) {
                        if(res.success){
                            deffer.resolve();
                            scope.storeListInfo = res.data;
                            scope.selectConfig.storeList.info = scope.storeListInfo;
                        }else{
                            deffer.reject();
                            toolsService.alertError('获取店铺信息失败');
                        }
                    });
                },

                //获取所有推荐快递信息
                getAllExpressInfo : function (scope,deffer) {
                    orderManagePublicService.orderManagerPublicInterface.getAllExpressInfo(scope, function (responseData) {
                        deffer.resolve();
                        scope.commendExpress = responseData;
                        //配置快递下拉列表
                        scope.selectConfig.expressInfo.info = responseData;
                    });
                },

                //获取所有建议仓库信息
                getAllWareHouse : function (scope,deffer) {
                    orderManagePublicService.orderManagerPublicInterface.getAllWareHouse(scope, function (responseData) {
                        deffer.resolve();
                        scope.commendWareHouse = klwTool.arrayToJson(responseData,'id');
                        //配置仓库下拉列表
                        scope.selectConfig.wareHouseInfo.info = responseData;
                    });
                },

                //获取所有会员信息
                getVipCustomer : function (scope,deffer) {
                    orderManagePublicService.orderManagerPublicInterface.getVipCustomer(scope, function (responseData) {
                        deffer.resolve();
                        scope.vipCustomer = responseData;
                        for(var i = 0,j = responseData.length;i < j;i++){
                            responseData[i]['id'] = responseData[i]['customerid'];
                        }
                        scope.selectConfig.accountInfo.info = responseData;
                    });
                },

                //获取商品信息
                getAllProducts  : function (scope){
                    Interface.getAllProducts(scope, function (res) {
                        if(res.success){
                            //清除全选标志
                            scope.checkAll = false;
                            scope.productsInfo = res.data;
                            if(res.data.length > 0){
                                InterfaceDeal.GetOccupation(scope,res.data[0]);
                            }
                            scope.productPage.paginationConf.totalItems = res.total;
                        }
                    });
                },

                //获取单个商品的库存信息
                GetOccupation : function (scope,list) {
                    orderManagePublicService.orderManagerPublicInterface.GetOccupation(scope, list.code, function (responseData) {
                        scope.Occupation = responseData;
                        for(var i = 0,j = scope.Occupation.length;i < j;i++){
                            scope.Occupation[i]['warsehousename'] = scope.commendWareHouse[scope.Occupation[i]['warehouseid']] ?
                                scope.commendWareHouse[scope.Occupation[i]['warehouseid']].name : '';
                        }
                    });
                },
                //获取套装信息
                getCombinedProduct : function (scope){
                    Interface.getSuitProduct(scope, function (res) {
                        if(res.success){
                            //清楚套装全选标志
                            scope.suitAll= false;
                            scope.combinedProduct = res.data;
                        }else{
                            toolsService.alertError('获取套装商品失败');
                        }
                    });
                },
                //获取套装商品的明细
                getCombinedProductDetails : function (scope,value,list) {
                    Interface.getCombinedProductDetails(scope,value, function (res) {
                        if(res.success){
                            list.details = res.data;
                        }else{
                            toolsService.alertError('获取套装商品明细失败');
                        }
                    });
                },
                //保存新增订单
                saveOrder : function (scope,data,callback) {
                    Interface.saveOrder(scope,data, function (res) {
                        if(res.success){
                           callback();
                        }else{
                            toolsService.alertError('保存失败');
                        }
                    });
                },
                //获取订单信息
                getOrderInfoById : function (scope,obj,deffer){
                    Interface.getOrderInfoById(scope,obj.orderid, function (res) {
                        if(res.success){
                            //数据转变
                            scope.formData.currencycode = res.data.currencycode;
                            scope.formData.AddPrice = res.data.addprice;
                            scope.formData.Code = res.data.code;
                            scope.formData.CreateDate = res.data.createdate;
                            scope.formData.CreateUserId = res.data.createuserid;
                            scope.formData.CreateUserName = res.data.createusername;
                            scope.formData.CurrencyCode = res.data.currencycode;
                            scope.formData.CustomerCode = res.data.customercode;
                            scope.formData.CustomerId = res.data.customerid;
                            scope.formData.CustomerName = res.data.customername;
                            scope.formData.DeliveryTypeStatus = res.data.deliverytypestatus;
                            scope.formData.DiscountAmount = res.data.discountamount;
                            scope.formData.dispatchtypestatus = res.data.dispatchtypestatus;
                            scope.formData.ExpressFee = res.data.expressfee;
                            scope.formData.ExpressFeeIsCod = res.data.expressfeeiscod;
                            scope.formData.FinanceType = res.data.financetype;
                            scope.formData.FreightRisk = res.data.freightrisk;
                            scope.formData.HasInvoice = res.data.hasinvoice;
                            scope.formData.IsAbnormal = res.data.isabnormal;
                            scope.formData.IsAutoDownload = res.data.isautodownload;
                            scope.formData.IsCod = res.data.iscod;
                            scope.formData.IsElectronicInvoiceCreated = res.data.iselectronicinvoicecreated;
                            scope.formData.IsHold = res.data.ishold;
                            scope.formData.IsLock = res.data.islock;
                            scope.formData.IsManual = res.data.ismanual;
                            scope.formData.IsNewVip = res.data.isnewvip;
                            scope.formData.IsObsolete = res.data.isobsolete;
                            scope.formData.IsOutOfStock = res.data.isoutofstock;
                            scope.formData.IsPrePay = res.data.isprepay;
                            scope.formData.IsSplitForce = res.data.issplitforce;
                            scope.formData.OrderId = res.data.orderid;
                            scope.formData.PayAmount = res.data.payamount;
                            scope.formData.PayDate = res.data.paydate;
                            scope.formData.PayStatus = res.data.paystatus;
                            scope.formData.PlatformStatus = res.data.platformstatus;
                            scope.formData.PlatformType = res.data.platformtype;
                            scope.formData.PlatFromDate = res.data.platfromdate;
                            scope.formData.PreSaleType = res.data.presaletype;
                            scope.formData.Quantity = res.data.quantity;
                            scope.formData.RefundStatus = res.data.refundstatus;
                            scope.formData.returnOrderReCheck = res.data.returnOrderReCheck;
                            scope.formData.SourceType = res.data.sourcetype;
                            scope.formData.SpeedDelivery = res.data.speeddelivery;
                            scope.formData.Status = res.data.status;
                            scope.formData.StoreId = res.data.storeid;
                            scope.formData.StoreName = res.data.storename;
                            scope.formData.SuggestExpressId = res.data.suggestexpressid;
                            scope.formData.SuggestExpressName = res.data.suggestexpressname;
                            scope.formData.SuggestWarehouseId = res.data.suggestwarehouseid;
                            scope.formData.SuggestWarehouseName = res.data.suggestwarehousename;
                            scope.formData.TradeId = res.data.tradeid;
                            scope.formData.ExpressFeeIsCod = false;
                            scope.formData.IsAbnormal = false;
                            scope.formData.Deleted = false;
                            scope.formData.IsNew = false;
                            scope.formData.IsUpdate = false;
                            //地址信息
                            scope.formData.subOrder = res.data.subOrder;
                            //scope.formData.subOrder.Address = res.data.subOrder.address;
                            //scope.formData.subOrder.BuyerMemo = res.data.subOrder.buyermemo;
                            //scope.formData.subOrder.CityId = res.data.subOrder.cityid;
                            //scope.formData.subOrder.CityName = res.data.subOrder.cityname;
                            //scope.formData.subOrder.CodPayment = res.data.subOrder.codpayment;
                            //scope.formData.subOrder.CountyId = res.data.subOrder.countyid;
                            //scope.formData.subOrder.CountyName = res.data.subOrder.countyname;
                            //scope.formData.subOrder.Deleted = res.data.subOrder.deleted;
                            //scope.formData.subOrder.IsNew = res.data.subOrder.isNew;
                            //scope.formData.subOrder.IsUpdate = res.data.subOrder.isUpdate;
                            //scope.formData.subOrder.IsBlacklist = res.data.subOrder.isblacklist;
                            //scope.formData.subOrder.IsMerge = res.data.subOrder.ismerge;
                            //scope.formData.subOrder.IsPrime = res.data.subOrder.isprime;
                            //scope.formData.subOrder.MergeMd5 = res.data.subOrder.mergemd5;
                            //scope.formData.subOrder.Mobile = res.data.subOrder.mobile;
                            //scope.formData.subOrder.NationalId = res.data.subOrder.nationalid;
                            //scope.formData.subOrder.NationalName = res.data.subOrder.nationalname;
                            //scope.formData.subOrder.ProvinceId = res.data.subOrder.provinceid;
                            //scope.formData.subOrder.ProvinceName = res.data.subOrder.provincename;
                            //scope.formData.subOrder.SellerMemo = res.data.subOrder.sellermemo;
                            //scope.formData.subOrder.SubId = res.data.subOrder.subid;
                            //scope.formData.subOrder.Telephone = res.data.subOrder.telephone;
                            //商品信息
                            scope.formData.Details = res.data.details;
                            for(var i = 0,j = res.data.details.length;i < j;i++){
                                scope.formData.Details[i]['retailprice'] = res.data.details[i]['amountactual'];
                                scope.formData.Details[i]['code'] = res.data.details[i]['skucode'];
                                scope.formData.Details[i]['description'] = res.data.details[i]['skuname'];
                                //如果有productid传过来，则只需要选中一条商品
                                if(res.data.details[i]['productid'] == obj.productid){
                                    var tmpData = res.data.details[i];
                                    scope.formData.Details = [];
                                    scope.formData.Details.push(tmpData);
                                    break;
                                }
                            }
                            //支付信息
                            scope.formData.payMents = res.data.payMents;
                            //发票明细
                            scope.formData.Invoices = res.data.invoices;
                            deffer.resolve();
                        }else{
                            deffer.reject();
                            toolsService.alertError('订单信息获取失败');
                        }
                    });

                }
            };

            //添加订单公共方法
            var addOrderFunction = {
                //生成平台订单号
                GenerateOrderNumber : function (){
                    var initTime = new Date(2000, 1, 1).getTime();
                    var time  = new Date().valueOf();
                    var randomNum = Math.ceil(Math.random() * 10000).toString().split('');
                    var timeLock = (time - initTime).toString().split('');
                    var result;
                    for(var i= 0,j=timeLock.length;i<j;i++){
                        for(var x = 0;x < randomNum.length;x++){
                            timeLock[randomNum[x]] = randomNum[x];
                        }
                    }
                    timeLock[0] = Math.ceil(Math.random() * 9 +1);
                    timeLock[j] = Math.ceil(Math.random() * 9 +1);
                    result = 'MO' + timeLock.join('').valueOf();
                    return result;
                }
            };


            //dom操作
            var addOrderDomOperate = {
                //dom初始化
                domInit  : function (scope,orderDetails){
                    //表单初始化验证
                    validateService.initValidate('#addOrder');

                    //重量和单价的初始值
                    scope.weight = 0;
                    scope.price = 0;
                    //获取所有信息，并向后台提交的数据
                    scope.formData = {
                        //支付明细
                        payMents : [],
                        //收货信息
                        subOrder : {},
                        //发票明细
                        Invoices : [],
                        //平台订单号初始化
                        TradeId : addOrderFunction.GenerateOrderNumber(),
                        //商品信息
                        Details : [],
                        //是否货到付款默认值
                        isCod  : false,
                        //是否加急送货值
                        SpeedDelivery : false,
                        //需要开发票默认值
                        HasInvoice : false
                    };
                    //当前选中或填写的信息，暂时保存
                    scope.tmpData = {
                        //支付明细
                        payMents : {},
                        //收货信息
                        subOrder : {},
                        //发票明细
                        Invoices : {}
                    };
                    //店铺信息
                    scope.storeListInfo = [];
                    //推荐快递信息
                    scope.commendExpress = [];
                    //推荐仓库信息
                    scope.commendWareHouse = [];
                    //会员信息
                    scope.vipCustomer = [];
                    //商品信息
                    scope.productsInfo = [];
                    //库存信息
                    scope.Occupation = [];
                    //套装信息
                    scope.combinedProduct = [];
                    //商品信息变量
                    scope.goodsContent = false;
                    //支付信息变量
                    scope.payContent = false;
                    //收货信息变量
                    scope.receiveContent = false;
                    //发票信息变量
                    scope.invoiceContent = false;
                    //特殊标识
                    scope.specialLable = [];

                    //支付方式
                    scope.payment = APP_MENU['payment'];

                    //商品列表的列名
                    scope.productColumn  = configData.productColumn;
                    //选中商品列表的列名
                    scope.productsChosedColumn = configData.productsChosedColumn;
                    //库存详细列信息
                    scope.occupationColumn = configData.occupationColumn;

                    //套装列表配置
                    scope.combinedProductColumn = configData.combinedProductColumn;

                    //下拉框配置
                    this.selectconfig(scope);
                    //商品信息分页设置
                    this.productPageSet(scope);

                    ApiService.listenAll(function (deffer) {
                        //获取所有店铺信息
                        InterfaceDeal.getAllShops(scope,deffer);
                    }, function (deffer) {
                        //获取所有推荐快递信息
                        InterfaceDeal.getAllExpressInfo(scope,deffer);
                    }, function (deffer) {
                        addOrderDomOperate.setInitialValue(scope,orderDetails,deffer);
                    }, function (deffer) {
                        //获取会员信息
                        InterfaceDeal.getVipCustomer(scope,deffer);
                    }, function (deffer) {
                        //获取所有建议仓库信息
                        InterfaceDeal.getAllWareHouse(scope,deffer);
                    }).then(function (result) {
                        scope.selectConfig.storeList.setValue({name : scope.formData.StoreName,id : scope.formData.StoreId});
                        scope.selectConfig.accountInfo.setValue({name : scope.formData.CustomerName,id : scope.formData.CustomerId});
                        scope.selectConfig.coinType.setValue({name : scope.formData.currencycode});
                        scope.selectConfig.expressInfo.setValue({name  : scope.formData.SuggestExpressName,id : scope.formData.SuggestExpressId});
                        scope.selectConfig.wareHouseInfo.setValue({name  : scope.formData.SuggestWarehouseName,id : scope.formData.SuggestWarehouseId});
                    });
                    //查询所有国家信息
                    InterfaceDeal.regionCheck(scope,1,'00000000-0000-0000-0000-000000000000', function (data) {
                        //设置选择国家的下拉框
                        scope.selectConfig.country.info = data;
                    });

                    //给填写支付时间设置时间插件
                    this.setDate('#payTime');
                    //预计发货日期
                    this.setDate('#deliverDate');
                    //复制订单，设定初始值
                    //this.setInitialValue(scope,orderDetails);
                },
                selectconfig : function (scope) {
                    //下拉列表配置信息
                    scope.selectConfig = {
                        //店铺下拉信息的配置
                        storeList : {
                            isshow:false,
                            validate:true,
                            info:scope.storeListInfo,
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.StoreName = obj.name;
                                scope.formData.StoreId = obj.id;
                                scope.formData.PlatformType = obj.platformtype;
                            }
                        },
                        //订单类型下拉信息配置
                        orderType : {
                            isshow:false,
                            validate:true,
                            info:this.changeDataStyle(APP_MENU['preOrderType']),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.TransType = obj.name;
                            }
                        },
                        //币种选择
                        coinType : {
                            isshow:false,
                            validate:true,
                            info:this.changeDataStyle(APP_MENU['currencycode']),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.CurrencyCode = obj.name;
                            }
                        },
                        //支付方式
                        payType : {
                            isshow:false,
                            validate:true,
                            info:this.changeDataStyle(APP_MENU.payment),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.tmpData.payMents.paytype = obj.id;
                                scope.tmpData.payMents.PayName = obj.name;
                            }
                        },
                        //发票明细
                        invoiceType : {
                            isshow:false,
                            validate:true,
                            info:this.changeDataStyle(APP_MENU.invoiceType),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.tmpData.Invoices.invoicetype = obj.id;
                            }
                        },
                        //订单类型
                        transtype : {
                            isshow:false,
                            validate:true,
                            info:this.changeDataStyle(APP_MENU.preOrderType),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.TransType = obj.id;
                            }
                        },
                        //会员信息
                        accountInfo :{
                            isshow:false,
                            validate:true,
                            onChange: function(obj,index){	//点击之后的回调
                                addOrderDomOperate.setAddressByMember(scope,obj,index);
                            }
                        },
                        //快递信息
                        expressInfo : {
                            isshow:false,
                            validate:true,
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.SuggestExpressName = obj.name;
                                scope.formData.SuggestExpressId = obj.id;
                            }
                        },
                        //仓库信息
                        wareHouseInfo :{
                            isshow:false,
                            validate:true,
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.SuggestWarehouseName = obj.name;
                                scope.formData.SuggestWarehouseId = obj.id;
                            }
                        },
                        //选择国家信息
                        country : {
                            isshow:false,
                            validate:true,
                            info :[],
                            onChange: function(obj,index){	//点击之后的回调
                                //获取省份信息
                                InterfaceDeal.regionCheck(scope,2,obj.id, function (data) {
                                    scope.selectConfig.province.init();
                                    scope.selectConfig.city.init();
                                    scope.selectConfig.district.init();
                                    scope.selectConfig.province.info = data;
                                    //设置省市区信息
                                    scope.tmpData.subOrder.nationalname = obj.name;
                                    scope.tmpData.subOrder.nationalid = obj.id;
                                    scope.tmpData.subOrder.provincename = '';
                                    scope.tmpData.subOrder.provinceid = '';
                                    scope.tmpData.subOrder.cityname = '';
                                    scope.tmpData.subOrder.cityid = '';
                                    scope.tmpData.subOrder.countyname = '';
                                    scope.tmpData.subOrder.countyid = '';
                                });
                            }
                        },
                        //选择省份
                        province : {
                            isshow:false,
                            validate:true,
                            info :[],
                            onChange: function(obj,index){	//点击之后的回调
                                //获取市级信息
                                InterfaceDeal.regionCheck(scope,3,obj.id, function (data) {
                                    scope.selectConfig.city.init();
                                    scope.selectConfig.district.init();
                                    scope.selectConfig.city.info = data;
                                    //设置省市区信息
                                    scope.tmpData.subOrder.provincename = obj.name;
                                    scope.tmpData.subOrder.ProvinceId = obj.id;
                                    scope.tmpData.subOrder.CityName = '';
                                    scope.tmpData.subOrder.CityId = '';
                                    scope.tmpData.subOrder.CountyName = '';
                                    scope.tmpData.subOrder.CountyId = '';
                                });
                            }
                        },
                        //选择市
                        city : {
                            isshow:false,
                            validate:true,
                            info :[],
                            onChange: function(obj,index){	//点击之后的回调
                                //获取区级信息
                                InterfaceDeal.regionCheck(scope,4,obj.id, function (data) {
                                    scope.selectConfig.district.init();
                                    scope.selectConfig.district.info = data;
                                    //设置省市区信息
                                    scope.tmpData.subOrder.CityName = obj.name;
                                    scope.tmpData.subOrder.CityId = obj.id;
                                    scope.tmpData.subOrder.CountyName = '';
                                    scope.tmpData.subOrder.CountyId = '';
                                });
                            }
                        },
                        //选择区
                        district :{
                            isshow:false,
                            validate:true,
                            info :[],
                            onChange: function(obj,index){	//点击之后的回调
                                //设置省市区信息
                                scope.tmpData.subOrder.CountyName = obj.name;
                                scope.tmpData.subOrder.CountyId = obj.id;
                            }
                        }
                    };
                },
                //根据会员信息设置地址信
                setAddressByMember : function (scope,obj,index) {
                    //scope.formData.CustomerName = obj.name;
                    //scope.formData.CustomerId = obj.customerid;
                    scope.formData.CustomerCode = obj.code;
                    scope.formData.subOrder.SubId = 0;
                    scope.formData.subOrder.CodPayment = 0;
                    scope.formData.subOrder.ProvinceId = obj.provinceid;
                    scope.formData.subOrder.CityId = obj.cityid;
                    scope.formData.subOrder.CountyId = obj.countyid;
                    scope.formData.subOrder.ProvinceName = obj.provincename;
                    scope.formData.subOrder.ProvinceCode = obj.provincecode;
                    scope.formData.subOrder.CityCode = obj.citycode;
                    scope.formData.subOrder.CountyCode = obj.countycode;
                    scope.formData.subOrder.CityName = obj.cityname;
                    scope.formData.subOrder.CountyName = obj.countyname;
                    scope.formData.subOrder.NationalId = obj.nationalid;
                    scope.formData.subOrder.NationalName = obj.nationalname;
                    scope.formData.subOrder.NationalName = obj.nationalname;
                    scope.formData.subOrder.Consignee = obj.consignee;
                    scope.formData.subOrder.Mobile = obj.mobile;
                    scope.formData.subOrder.CustomerName = obj.name;
                    scope.formData.subOrder.Address = obj.address;
                    scope.formData.subOrder.ZipCode = obj.zipcode;
                    scope.formData.subOrder.Telephone = obj.telephone;
                    scope.formData.subOrder.Fax = obj.Fax;
                    scope.formData.subOrder.BuyerEmail = obj.buyeremail;
                    scope.formData.subOrder.Contacter = obj.contacter;
                    scope.formData.subOrder.IsPrime = false;
                    scope.formData.subOrder.IsBlacklist = false;
                    scope.formData.subOrder.IsMerge = false;
                    scope.formData.subOrder.Deleted = false;
                    scope.formData.subOrder.IsNew = false;
                    scope.formData.subOrder.IsUpdate = false;
                    //将选中的会员信息添加到存储可编辑地址的对象中
                    scope.tmpData.CustomerName = scope.formData.CustomerName;
                    scope.tmpData.subOrder = scope.formData.subOrder;
                },
                //设置初始值
                setInitialValue : function (scope,obj,deffer) {
                    if(obj.type != undefined && obj.type =='copy') {
                        InterfaceDeal.getOrderInfoById(scope,obj,deffer);
                    }else{
                        deffer.reject();
                    }
                },
                //如果有值则返回该值否则返回默认值
                returnDefaultValue : function (obj,key,defaultvalue) {
                    if(key in obj){
                       return obj[key];
                    }else{
                        return defaultvalue;
                    }
                },
                //将枚举值转变Wie可以让下拉框使用的值的类型
                changeDataStyle : function(obj){
                    var tmpData = [];
                    for(var item in obj){
                        tmpData.push({
                            id : item,
                            name : obj[item]
                        });
                    }
                    return tmpData;
                },
                //搜索数据
                searchCondition : function (scope,data,keyword,name) {
                    var conditions = data;
                    for(var i = 0,j = data.length;i < j;i++){
                        if(data[i][name].indexOf(keyword) !== -1){
                            console.log(data[i][name]);
                            data[i]['is_show'] = true;
                        }else{
                            data[i]['is_show'] = false;
                        }
                    }
                },
                //商品信息分页设置
                productPageSet : function (scope) {
                    scope.productPage = {};
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope.productPage, function () {
                        InterfaceDeal.getAllProducts(scope);
                    });
                },
                //日期控件
                setDate : function (tag){
                    $(tag).datetimepicker({
                        format: 'yyyy-mm-dd H:i:s',
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

            var Interface = {
                //获取所有商品信息
                getAllProducts : function (scope,callback) {
                    var url = '/Product/ProductSku/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":scope.productPage.paginationConf.currentPage,
                        "PageSize":scope.productPage.paginationConf.itemsPerPage,
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType": 6,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "pro.Code",
                            "Name": "procode",
                            "Value": scope.proCodeSearch,
                            "Children": []
                        },{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"sku.Status",
                            "Name":"skustatus",
                            "Value":1,
                            "Children":[]
                        },{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"sku.IsCombined",
                            "Name":"IsCombined",
                            "Value":"0","Children":[]
                        },{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"pro.Status",
                            "Name":"prostatus",
                            "Value":1,
                            "Children":[]
                        }],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var product = ApiService.postLoad(url,paramObj);
                    product.then(function (res) {
                       callback(res);
                    });
                },

                /**
                 * 新增订单
                 * @param scope
                 * @param data 订单数据
                 * @param callback
                 */
                saveOrder : function (scope,data,callback) {
                    var url = '/SalesOrder/SalesOrder/Save';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(data);
                    var product = ApiService.postLoad(url,paramObj);
                    product.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 通过订单id获取订单信息
                 * @param scope
                 * @param id 订单id
                 * @param callback
                 */
                getOrderInfoById : function (scope,id,callback) {
                    var url = '/SalesOrder/SalesOrder/GetSingle';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.orderid = id;
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
                    paramObj.body = JSON.stringify([{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "IsDisabled",
                        "Name": "IsDisabled",
                        "Value": false,
                        "Children": []
                    }]);
                    var shopList = ApiService.postCache(url,paramObj);
                    shopList.then(function (res) {
                        callback(res);
                    });
                },
                //获取套装商品
                getSuitProduct : function (scope,callback) {
                    var url = '/Product/CombinedProduct/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex": 1,
                        "PageSize": 50,
                        "SeletedCount": 0,
                        "Data": [
                            {
                                "OperateType": 8,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": scope.suitCode,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Status",
                                "Name": "Status",
                                "Value": 1,
                                "Children": []
                            }
                        ],
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    });
                    var suit = ApiService.postLoad(url,paramObj);
                    suit.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 地区查询
                 * @param scope
                 * @param level 层级id
                 * @param value 区域id
                 * @param callback
                 */
                regionCheck : function (scope,level,value,callback) {
                    var url = '/BasicInformation/Region/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"RegionLevel",
                        "Value":level,
                        "Children":[]
                    },{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"ParentId",
                        "Value":value,
                        "Children":[]
                    }]);
                    var region = ApiService.postLoad(url,paramObj);
                    region.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 获取套装商品详细信息
                 * @param scope
                 * @param value 商品的id
                 * @param callback
                 */
                getCombinedProductDetails : function (scope,value,callback) {
                    var url = '/Product/CombinedProductDetail/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "CombinedProductId",
                            "Name": "CombinedProductId",
                            "Value": value,
                            "Children": []
                        }
                    ]);
                    var suit = ApiService.postLoad(url,paramObj);
                    suit.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                InterfaceDeal : InterfaceDeal,
                addOrderDomOperate : addOrderDomOperate,
                addOrderFunction : addOrderFunction
            }
    }
    ]);