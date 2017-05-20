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
                    {name : '规格编码',tag : 'skudcode'},
                    {name : '规格名称',tag : 'skuname'},
                    {name : '数量',tag : 'quality'},
                    {name : '销售价',tag : 'priceselling'},
                    {name : '实际售价',tag : 'retailprice'},
                    {name : '应付金额',tag : 'amount'},
                    {name : '优惠金额',tag : 'discountamount'},
                    {name : '结算金额',tag : 'amountactual'}
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
                    {name : '礼盒',tag : 'isgift'},
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
                            toolsService.alertMsg('查询区域信息失败');
                        }
                    });
                },
                //设置地区信息下拉框
                setRegionInfo : function (scope) {
                    //设置地区选中的默认值值
                    InterfaceDeal.regionCheck(scope,1,'00000000-0000-0000-0000-000000000000', function (data) {
                        //设置选择国家的下拉框
                        scope.selectConfig.country.info = data;
                        //设置默认选项
                        scope.selectConfig.country.setValue({id : scope.formData.subOrder.nationalid});
                        InterfaceDeal.regionCheck(scope,2,scope.formData.subOrder.nationalid, function (data) {
                            //设置选择省的下拉框
                            scope.selectConfig.province.info = data;
                            //设置默认选项
                            scope.selectConfig.province.setValue({id : scope.formData.subOrder.provinceid});
                            InterfaceDeal.regionCheck(scope,3,scope.formData.subOrder.provinceid, function (data) {
                                //设置选择市的下拉框
                                scope.selectConfig.city.info = data;
                                //设置默认选项
                                scope.selectConfig.city.setValue({id : scope.formData.subOrder.cityid});
                                InterfaceDeal.regionCheck(scope,4,scope.formData.subOrder.cityid, function (data) {
                                    //设置选择地区的下拉框
                                    scope.selectConfig.district.info = data;
                                    //设置默认选项
                                    scope.selectConfig.district.setValue({id : scope.formData.subOrder.countyid});
                                });
                            });
                        });
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
                            toolsService.alertMsg('获取店铺信息失败');
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
                            //清除套装全选标志
                            scope.suitAll= false;
                            scope.combinedProduct = res.data;
                            //设置总页数
                            scope.suitPage.paginationConf.totalItems = res.total;
                        }else{
                            toolsService.alertMsg('获取套装商品失败');
                        }
                    });
                },
                //获取套装商品的明细
                getCombinedProductDetails : function (scope,value,list) {
                    if(!value){
                        toolsService.alertError('系统异常!');
                    }else{
                        Interface.getCombinedProductDetails(scope,value, function (res) {
                            if(res.success){
                                list.details = res.data;
                            }else{
                                toolsService.alertMsg('获取套装商品明细失败');
                            }
                        });
                    }
                },
                //保存新增订单
                saveOrder : function (scope,data,callback) {
                    Interface.saveOrder(scope,data, function (res) {
                        if(res.success){
                           callback();
                        }else{
                            toolsService.alertMsg('保存失败');
                        }
                    });
                },
                //获取订单信息
                getOrderInfoById : function (scope,obj,deffer,orderDetails){
                    Interface.getOrderInfoById(scope,obj.orderid, function (res) {
                        if(res.success){
                            var productToCopy = [];
                            scope.formData = res.data;
                            //设置商品信息合计信息
                            scope.amount = 0;
                            scope.actualamount = 0;
                            scope.quantity = 0;
                            for(var i= 0,j = scope.formData.details.length;i<j;i++){
                                //如果product为空则全部复制，如果不为空，则只复制对应的那一条商品信息
                                if((orderDetails.productid == '') || (scope.formData.details[i].productid == orderDetails.productid)){
                                    productToCopy.push(scope.formData.details[i]);
                                    scope.amount += scope.formData.details[i]['amount'];
                                    scope.actualamount += scope.formData.details[i]['amountactual'];
                                    scope.quantity += scope.formData.details[i]['quantity'];
                                }
                            }
                            scope.formData.details = productToCopy;
                            deffer.resolve();
                        }else{
                            deffer.reject();
                            toolsService.alertMsg('订单信息获取失败');
                        }
                    });

                },
                //删除支付明细
                deletePayment : function (scope,id) {
                    Interface.deletePayment(scope,id, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('删除成功！');
                        }else{
                            toolsService.alertError('删除失败！');
                        }
                    })
                },
                //删除发票明细
                deleteInvoice : function (scope,id) {
                    Interface.deleteInvoice(scope,id, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('删除成功！');
                        }else{
                            toolsService.alertError('删除失败！');
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
                        invoices : [],
                        //平台订单号初始化
                        tradeid : addOrderFunction.GenerateOrderNumber(),
                        //商品信息
                        details : [],
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
                        invoices : {}
                    };
                    //删除的商品信息
                    scope.DeletedDetails = [];
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
                    //套装信息分页设置
                    this.suitPageSet(scope);

                    ApiService.listenAll(function (deffer) {
                        //获取所有店铺信息
                        InterfaceDeal.getAllShops(scope,deffer);
                    }, function (deffer) {
                        //获取所有推荐快递信息
                        InterfaceDeal.getAllExpressInfo(scope,deffer);
                    }, function (deffer) {
                        //添加默认值
                        addOrderDomOperate.setInitialValue(scope,orderDetails,deffer,orderDetails);
                    }, function (deffer) {
                        //获取会员信息
                        InterfaceDeal.getVipCustomer(scope,deffer);
                    }, function (deffer) {
                        //获取所有建议仓库信息
                        InterfaceDeal.getAllWareHouse(scope,deffer);
                    }).then(function (result) {
                        //店铺下拉框信息默认值
                        scope.selectConfig.storeList.setValue({name : scope.formData.storename,id : scope.formData.storeid});
                        //会员信息下拉框默认值
                        scope.selectConfig.accountInfo.setValue({name : scope.formData.customername,id : scope.formData.customerid});
                        //订单类型下拉框
                        scope.selectConfig.transtype.setValue({id : scope.formData.transtype});
                        //币种下拉框默认值
                        scope.selectConfig.coinType.setValue({id : klwTool.arrayToJson(klwTool.jsonToArray2(APP_MENU['currencycode'],'id','name'),'name')[scope.formData.currencycode].id});
                        //快递信息下拉框默认值
                        scope.selectConfig.expressInfo.setValue({name  : scope.formData.suggestexpressname,id : scope.formData.suggestexpressid});
                        //仓库下拉框默认值
                        scope.selectConfig.wareHouseInfo.setValue({name  : scope.formData.suggestwarehousename,id : scope.formData.suggestwarehouseid});
                        InterfaceDeal.setRegionInfo(scope);
                    });
                    //获取id和仓库对应的关系
                    //InterfaceDeal.getWareHouseById(scope);
                    ////查询所有国家信息
                    //InterfaceDeal.regionCheck(scope,1,'00000000-0000-0000-0000-000000000000', function (data) {
                    //    //设置选择国家的下拉框
                    //    scope.selectConfig.country.info = data;
                    //});

                    //给填写支付时间设置时间插件
                    this.setDate('#payTime');
                    //预计发货日期
                    this.setDate('#deliverDate');
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
                                scope.formData.storename = obj.name;
                                scope.formData.storeid = obj.id;
                                scope.formData.platformtype = obj.platformtype;
                            }
                        },
                        //订单类型下拉信息配置
                        orderType : {
                            isshow:false,
                            validate:true,
                            info:this.changeDataStyle(APP_MENU['preOrderType']),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.transtype = obj.name;
                            }
                        },
                        //币种选择
                        coinType : {
                            isshow:false,
                            validate:true,
                            info:this.changeDataStyle(APP_MENU['currencycode']),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.currencycode = obj.name;
                            }
                        },
                        //支付方式
                        payType : {
                            isshow:false,
                            validate:true,
                            info:this.changeDataStyle(APP_MENU.payment),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.tmpData.payMents.paytype = obj.id;
                                scope.tmpData.payMents.payname = obj.name;
                            }
                        },
                        //发票明细
                        invoiceType : {
                            isshow:false,
                            validate:true,
                            info:this.changeDataStyle(APP_MENU.invoiceType),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.tmpData.invoices.invoicetype = obj.id;
                            }
                        },
                        //订单类型
                        transtype : {
                            isshow:false,
                            validate:true,
                            info:this.changeDataStyle(APP_MENU.preOrderType),
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.transtype = obj.id;
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
                                scope.formData.suggestexpressname = obj.name;
                                scope.formData.suggestexpressid = obj.id;
                            }
                        },
                        //仓库信息
                        wareHouseInfo :{
                            isshow:false,
                            validate:true,
                            onChange: function(obj,index){	//点击之后的回调
                                scope.formData.suggestwarehousename = obj.name;
                                scope.formData.suggestwarehouseid = obj.id;
                            }
                        },
                        //选择国家信息
                        country : {
                            isshow:false,
                            validate:true,
                            objName : {},
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
                                    scope.tmpData.subOrder.provinceid = obj.id;
                                    scope.tmpData.subOrder.cityname = '';
                                    scope.tmpData.subOrder.cityid = '';
                                    scope.tmpData.subOrder.countyname = '';
                                    scope.tmpData.subOrder.countyid = '';
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
                                    scope.tmpData.subOrder.cityname = obj.name;
                                    scope.tmpData.subOrder.cityid = obj.id;
                                    scope.tmpData.subOrder.countyname = '';
                                    scope.tmpData.subOrder.countyid = '';
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
                                scope.tmpData.subOrder.countyname = obj.name;
                                scope.tmpData.subOrder.countyid = obj.id;
                            }
                        }
                    };
                },
                //根据会员信息设置地址信
                setAddressByMember : function (scope,obj,index) {
                    scope.formData.customername = obj.name;
                    scope.formData.customerid = obj.customerid;
                    scope.formData.customercode = obj.code;
                    scope.formData.subOrder.codpayment = 0;
                    scope.formData.subOrder.provinceid = obj.provinceid;
                    scope.formData.subOrder.cityid = obj.cityid;
                    scope.formData.subOrder.countyid = obj.countyid;
                    scope.formData.subOrder.ProvinceName = obj.provincename;
                    scope.formData.subOrder.provincecode = obj.provincecode;
                    scope.formData.subOrder.citycode = obj.citycode;
                    scope.formData.subOrder.countycode = obj.countycode;
                    scope.formData.subOrder.cityname = obj.cityname;
                    scope.formData.subOrder.countyname = obj.countyname;
                    scope.formData.subOrder.nationalid = obj.nationalid;
                    scope.formData.subOrder.nationalname = obj.nationalname;
                    scope.formData.subOrder.nationalname = obj.nationalname;
                    scope.formData.subOrder.consignee = obj.consignee;
                    scope.formData.subOrder.mobile = obj.mobile;
                    scope.formData.subOrder.customername = obj.name;
                    scope.formData.subOrder.address = obj.address;
                    scope.formData.subOrder.zipcode = obj.zipcode;
                    scope.formData.subOrder.telephone = obj.telephone;
                    scope.formData.subOrder.fax = obj.Fax;
                    scope.formData.subOrder.buyeremail = obj.buyeremail;
                    scope.formData.subOrder.contacter = obj.contacter;
                    scope.formData.subOrder.isprime = false;
                    scope.formData.subOrder.isblacklist = false;
                    scope.formData.subOrder.ismerge = false;
                    scope.formData.subOrder.Deleted = false;
                    scope.formData.subOrder.IsNew = false;
                    scope.formData.subOrder.IsUpdate = false;
                    //将选中的会员信息添加到存储可编辑地址的对象中
                    scope.tmpData.customername = scope.formData.customername;
                    scope.tmpData.subOrder = scope.formData.subOrder;
                    //设置地区信息下拉框
                    InterfaceDeal.setRegionInfo(scope);
                },
                //设置初始值
                setInitialValue : function (scope,obj,deffer,orderDetails) {
                    if(obj.type != undefined && obj.type =='copy') {
                        InterfaceDeal.getOrderInfoById(scope,obj,deffer,orderDetails);
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
                //套装信息分页设置
                suitPageSet : function (scope) {
                    scope.suitPage = {};
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope.suitPage, function () {
                        InterfaceDeal.getCombinedProduct(scope);
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
                        "PageIndex": scope.suitPage.paginationConf.currentPage,
                        "PageSize": scope.suitPage.paginationConf.itemsPerPage,
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
                 * 删除支付明细
                 * @param scope
                 * @param id 支付id
                 * @param callback
                 */
                deletePayment : function (scope,id,callback) {
                    var url = '/SalesOrder/SalesOrder/PayMentDelete';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = id;
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 删除发票明细
                 * @param scope
                 * @param id 发票id
                 * @param callback
                 */
                deleteInvoice : function (scope,id,callback) {
                    var url = '/SalesOrder/SalesOrder/InvoiceDelete';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = id;
                    var promise = ApiService.postLoad(url,paramObj);
                    promise.then(function (res) {
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