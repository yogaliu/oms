/**
 * 创建了一个indexController
 * */
angular.module("klwkOmsApp")
    .controller("addOrderController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService","addOrderService","validateService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService,addOrderService,validateService) {

            var orderDetails = {};
            //接收从别的页面传过来的参数
            if($rootScope.params.type == 'copy'){
                orderDetails = $rootScope.params;
            }

            //初始化页面
            addOrderService.addOrderDomOperate.domInit($scope,orderDetails);

            //dom操作处理
            $scope.domOperate = {

                /*
                 * 本地数据搜索
                 * @param data 要进行搜索的全部数据
                 * @param keyword 搜索的关键字
                 * @param name 要搜索的关键字对应的字段
                 */
                searchCondition : function (data,keyword,name) {
                    addOrderService.addOrderDomOperate.searchCondition($scope,data,keyword,name);
                },

                //特殊标记选择
                isLabelSel : function (myEvent,type){
                    if(type in $scope.specialLable){
                        $scope.specialLable[type] = !$scope.specialLable[type];
                        $scope.formData[type] = !$scope.formData[type];
                    }else{
                        $scope.specialLable[type] = true;
                        $scope.formData[type] = true;
                    }
                },

                //点击商品信息获取器库存的详细信息
                getProductDetails : function (list) {
                    addOrderService.InterfaceDeal.GetOccupation($scope,list);
                },

                //商品信息模块函数
                isGoodsShow : function (content){
                    if (content == false) {
                        $scope.goodsContent = false;
                    } else {
                        $scope.goodsContent = content;
                    }
                },

                //增加商品明細和套裝明細
                addProductsDetails : function(list){
                    var obj = $scope.productsInfo;
                    list.trShow = !list.trShow;
                    $scope.checkAll = true;
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(!obj[i].trShow){
                            $scope.checkAll = false;
                            break;
                        }
                    }
                },
                //选择套装信息
                addSuitDetails : function (list) {
                    var obj = $scope.combinedProduct;
                    //获取该套装的商品明细
                    addOrderService.InterfaceDeal.getCombinedProductDetails($scope,list.skuid,list);
                    list.trShow = !list.trShow;
                    $scope.suitAll = true;
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(!obj[i].trShow){
                            $scope.suitAll = false;
                            break;
                        }
                    }
                },
                //商品信息全选
                selectAll : function () {
                    var obj = $scope.productsInfo;
                    if($scope.checkAll){
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = false;
                        }
                    }else{
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = true;
                        }
                    }
                    $scope.checkAll = !$scope.checkAll;
                },
                //套装信息全选
                suitSelectAll : function () {
                    var obj = $scope.combinedProduct;
                    if($scope.suitAll){
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = false;
                        }
                    }else{
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = true;
                            //获取该套装的商品明细
                            addOrderService.InterfaceDeal.getCombinedProductDetails($scope,obj[i].skuid,obj[i]);
                        }
                    }
                    $scope.suitAll = !$scope.suitAll;
                },

                //确认添加商品
                addProductsConfirm : function (){
                    var obj = $scope.productsInfo;
                    var products = [];
                    //获取选中的商品信息
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            products.push(obj[i]);
                        }
                    }
                    if(products.length<1){
                        toolsService.alertMsg('请选择相应的商品');
                    }else{
                        for(var i = 0,j = products.length;i < j;i++){
                            $scope.formData.Details.push(products[i]);
                        }
                        $scope.goodsContent = false;
                        this.countAmount();
                    }
                },
                //确认添加套装商品
                addSuitConfirm : function () {
                    var obj = $scope.combinedProduct;
                    var suits = [];
                    //获取选中的商品信息
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            suits.push(obj[i]);
                        }
                    }
                    if(suits.length<1){
                        toolsService.alertMsg('请选择相应的套装');
                    }else{
                        for(var i = 0,j = suits.length;i < j;i++){
                            for(var x = 0,y = suits[i].details.length;x < y;x++){
                                //$scope.formData.Details.push(suits[i].details[x]);
                                $scope.formData.Details.push({
                                    "categoryid": "00000000-0000-0000-0000-000000000000",
                                    "code": suits[i].details[x].skucode,
                                    "color": suits[i].color,
                                    "costprice": suits[i].details[x].costprice,
                                    "createdate": suits[i].details[x].createdate,
                                    "deleted": suits[i].details[x].deleted,
                                    "description": suits[i].details[x].skuname,
                                    "firstprice": suits[i].details[x].costprice,
                                    "height": suits[i].height,
                                    "isNew": suits[i].details[x].isNew,
                                    "isUpdate": suits[i].details[x].isUpdate,
                                    "iscombined": suits[i].iscombined,
                                    "isdisabled": false,
                                    "isgift": suits[i].isgift,
                                    "issplit": suits[i].issplit,
                                    "length": suits[i].length,
                                    "platformprice": suits[i].platformprice,
                                    "productType": suits[i].productType,
                                    "productcode": suits[i].details[x].productcode,
                                    "productid": suits[i].details[x].productid,
                                    "productname": suits[i].details[x].productname,
                                    "purchaseprice": suits[i].purchaseprice,
                                    "retailprice": suits[i].retailprice,
                                    "size": suits[i].size,
                                    "skuid": suits[i].details[x].skuid,
                                    "status": suits[i].status,
                                    "volume": suits[i].volume,
                                    "weight": suits[i].details[x].weight,
                                    "wholesaleprice": suits[i].details[x].saleprice,
                                    "width": suits[i].width
                                });
                            }
                        }
                        $scope.goodsContent = false;
                        this.countAmount();
                    }
                },
                //取消添加商品
                addProductsCancle : function () {
                    $scope.goodsContent = false;
                },

                //刪除一個商品信息
                deleteProduct : function (data){
                    $scope.formData.Details.removeByValue(data);
                    this.countAmount();
                },

                //计算应支付的所有金额
                payCount : function () {
                    var sum = 0;
                    for(var i = 0,j = $scope.formData.Details.length;i < j;i++){
                        //这里数量需要修改，暂时规定每条商品只有一件
                        sum += $scope.formData.Details[i]['firstprice'] * 1;
                    }
                    sum += Number($scope.formData.ExpressFee);
                    return sum;
                },

                //确认添加一个支付明细
                addPayDtailsConfirm : function (){
                    if(!validateService.validateAll('#addOrder','.addPayPage')) return false;
                    $scope.tmpData.payMents.PaymentId = 0;
                    $scope.tmpData.payMents.SalesOrderId = 0;
                    $scope.tmpData.payMents.PayableAmount = $scope.tmpData.payMents.Amount;
                    $scope.tmpData.payMents.Deleted = false;
                    $scope.tmpData.payMents.IsNew = false;
                    $scope.tmpData.payMents.IsUpdate = false;
                    //新增的支付信息添加进去
                    $scope.formData.payMents.push($scope.tmpData.payMents);
                    $scope.payContent = !$scope.payContent;
                    $scope.tmpData.payMents = {};
                },

                //确定添加一个收货信息
                addGoodsReceptionConfirm : function (){
                    //表单验证是否通过
                    if(!validateService.validateAll('#addOrder','.receive-message')) return false;
                    $scope.tmpData.subOrder.CodPayment = $scope.formData.codservicefee ? $scope.formData.codservicefee : 0;
                    //判断是修改还是新增
                    if(!$scope.formData.subOrder.SubId){
                        $scope.tmpData.subOrder.SubId = 0;
                        $scope.tmpData.subOrder.IsPrime = false;
                        $scope.tmpData.subOrder.IsBlacklist = false;
                        $scope.tmpData.subOrder.IsMerge = false;
                        $scope.tmpData.subOrder.Deleted = false;
                        $scope.tmpData.subOrder.IsNew = false;
                        $scope.tmpData.subOrder.IsUpdate = false;
                        $scope.formData.CustomerName = $scope.tmpData.CustomerName;
                    }
                    $scope.formData.subOrder = $scope.tmpData.subOrder;
                    //修改已选中的会员信息
                    $('.accountInfo .text').text($scope.tmpData.CustomerName);
                    $scope.receiveContent = !$scope.receiveContent;
                },

                //确定添加一个发票明细
                addInvoiceDetailsConfirm : function (){
                    if(!validateService.validateAll('#addOrder','.addInvoicePage')) return false;
                    $scope.tmpData.Invoices.InvoiceId = 0;
                    $scope.tmpData.Invoices.SalesOrderId = 0;
                    $scope.tmpData.Invoices.Deleted = false;
                    $scope.tmpData.Invoices.IsNew = false;
                    $scope.tmpData.Invoices.IsUpdate = false;
                    $scope.formData.Invoices.push($scope.tmpData.Invoices);
                    $scope.invoiceContent = !$scope.invoiceContent;
                    $scope.tmpData.Invoices = {};
                },
                //通过商品代码查询商品信息
                searchByProCode : function (event) {
                    if(event.keyCode == 13){
                        addOrderService.InterfaceDeal.getAllProducts($scope);
                    }
                },
                //通过套装代码查找套装
                searchSuitByCode : function (event) {
                    if(event.keyCode == 13){
                        addOrderService.InterfaceDeal.getCombinedProduct($scope);
                    }
                },
                //计算支付明细总金额
                payDetailsAll : function () {
                    var num = 0;
                    for(var i =0,j = $scope.formData.payMents.length;i < j;i++){
                        num += Number($scope.formData.payMents[i].Amount);
                    }
                    return num;
                },
                //保存新增订单信息
                saveOptions : function(){
                    if(!validateService.validateAll('#addOrder','.order-message')){
                        return false;
                    }
                    this.getOrderInfo();
                    this.getProductInfo();
                    //验证支付明细和总支付金额是否匹配
                    var payCount = this.payDetailsAll();
                    var countPay = this.countPay();
                    if(payCount == countPay){
                        var data = $.extend(false,{},$scope.formData);
                        //提交保存
                        addOrderService.InterfaceDeal.saveOrder($scope,data, function () {
                            toolsService.alertMsg('保存成功！');
                            $rootScope.params = {};
                            var index = $('#addOrder').closest('[data-index]').attr('data-index');
                            $scope.option[index].url = '../template/orderManage/orderList.html';
                            $scope.option[index].name = '订单列表';
                        });
                    }else{
                        toolsService.alertMsg('商品明细结算金额加运费不等于支付明细总金额！');
                    }
                },
                //新增三个属性
                addProperty : function (obj) {
                    for(var i = 0,j = obj.length;i < j;i++){
                        obj[i].Deleted = false;
                        obj[i].IsNew = false;
                        obj[i].IsUpdate = false;
                    }
                },
                //清空已填写的信息
                clearOptions : function () {
                    var num = 0;
                    for(var item in $scope.formData){
                        if(typeof $scope.formData[item] == 'object'){
                            num = $scope.formData[item].length;
                            $scope.formData[item].splice(0,num);
                        }else {
                            //平台订单号不可以清空
                            if(item != 'TradeId'){
                                $scope.formData[item] = '';
                            }
                        }
                    }
                    for(var item1 in $scope.tmpData){
                        if(typeof $scope.tmpData[item1] == 'object'){
                            for(var list in $scope.tmpData[item1]){
                                delete $scope.tmpData[item1][list];
                            }
                        }else {
                            $scope.tmpData[item1] = '';
                        }
                    }
                    //清空下拉框选项
                     $scope.selectConfig.storeList.init();
                     $scope.selectConfig.accountInfo.init();
                     $scope.selectConfig.transtype.init();
                     $scope.selectConfig.coinType.init();
                     $scope.selectConfig.expressInfo.init();
                     $scope.selectConfig.wareHouseInfo.init();
                },

                //删除已填写的订单信息
                orderInfoDel : function (details,list) {
                    details.removeByValue(list);
                },

                //修改收货地址
                changeGoodsReceptions : function (){
                    //地址信息
                    $scope.tmpData.subOrder = $scope.formData.subOrder;
                    //昵称
                    $scope.tmpData.CustomerName = $scope.formData.CustomerName;
                    $('#city-picker3').val($scope.formData.subOrder.ProvinceName+'/'+$scope.formData.subOrder.CityName+'/'+$scope.formData.subOrder.CountyName);
                     //城市选择初始化
                    $('[data-toggle="city-picker"]').citypicker();
                    $scope.receiveContent = !$scope.receiveContent;
                },
                //获取填写的订单基本信息
                getOrderInfo : function () {
                    $scope.formData.OrderId = 0;
                    $scope.formData.PlatFromDate = new Date().format('yyyy-MM-dd H:m:s');
                    $scope.formData.PayDate = $scope.formData.payMents.paytime
                                            ? $scope.formData.payMents.paytime
                                            : new Date().format('yyyy-MM-dd H:m:s');
                    //计算总价为要重新计算
                    $scope.formData.PayAmount = this.countPay();
                    $scope.formData.Status = 0;
                    $scope.formData.PlatformStatus = 0;
                    //平台单据状态 1: 待审核　2:待付预付款 3:待发货 4:拒单 5:部分出库　6:全部出库
                    $scope.formData.PreSaleType = 0;
                    //补差价
                    $scope.formData.AddPrice = 0;
                    //订单来源
                    $scope.formData.SourceType = 0;
                    //发货状态发货状态：0 未发货 1 部分发货 2 全部发货
                    $scope.formData.DeliveryTypeStatus = 0;
                    //配货状态配货状态：0未配货 1 部分配货 2 全部配货
                    $scope.formData.DispatchTypeStatus = 0;

                    //不知道是什么
                    $scope.formData.EditContent = '这个不知道是什么';
                    //计算优惠金额
                    $scope.formData.DiscountAmount = 0;
                    //计算数量
                    $scope.formData.Quantity = 1;
                    //货物重量需要计算
                    $scope.formData.Weight = 1;
                    $scope.formData.RefundStatus = 0;
                    $scope.formData.IsManual = false;
                    $scope.formData.IsObsolete = false;
                    $scope.formData.ExpressFeeIsCod = false;
                    $scope.formData.IsHold = false;
                    $scope.formData.IsOutOfStock = false;
                    $scope.formData.IsAutoDownload = false;
                    $scope.formData.IsAbnormal = false;
                    $scope.formData.IsLock = false;
                    $scope.formData.IsNewVip = false;
                    $scope.formData.FinanceType = false;
                    $scope.formData.IsElectronicInvoiceCreated = false;
                    $scope.formData.IsSplitForce = false;
                    $scope.formData.IsPrepay = false;
                    $scope.formData.PayStatus = false;
                    $scope.formData.IsReturnOrderReCheck = false;
                    $scope.formData.FreightRisk = 0;
                    $scope.formData.Deleted = false;
                    $scope.formData.IsNew = false;
                    $scope.formData.IsUpdate = false;
                },
                //计算总付款数据
                countPay : function () {
                    //选中商品信息
                    var obj = $scope.formData.Details;
                    var num = 0;
                    //快递费用
                    num += Number($scope.formData.ExpressFee);
                    //所有商品费用
                    for(var i = 0,j = obj.length;i <j;i++){
                        num += obj[i].retailprice;
                    }
                    return num;
                },
                //获取选中的商品信息
                getProductInfo : function () {
                    var data = [];
                    var product = $scope.formData.Details;
                    for(var i = 0,j = product.length;i < j;i++){
                        data.push({
                            //商品明细id，默认为0，后台修改
                            "DetailId": 0,
                            "CreateDate": "2017-05-01 15:15:58",
                            //	订单ID
                            "SalesOrderId": 0,
                            //	财务成本
                            "FirstCost": product[i]['retailprice'],
                            //	原始单价
                            "PriceOriginal": product[i]['retailprice'],
                            //明细优惠后单价
                            "PriceSelling": product[i]['retailprice'],
                            //应付金额
                            "retailprice": product[i]['retailprice'],
                            //数量
                            "Quantity": 1,//这里先使用1，后面再改
                            //可销数
                            "CanSaleQuantity": 0,
                            //优惠金额
                            "DiscountAmount": 0,
                            //应付金额，未分摊优惠
                            "Amount": product[i]['retailprice'],
                            //实际应付金额，已分摊优惠
                            "AmountActual": product[i]['retailprice'],
                            "IsAbnormal": false,
                            "IsDeleted": false,
                            "IsRefunded": false,
                            "IsRefundFinished": false,
                            "Status": 0,
                            "IsOutOfStock": false,
                            //	分销价格
                            "DistributionAmount": 0,
                            //重量
                            "Weight": product[i]['weight'],
                            "IsManual": true,
                            //补发金额
                            "ReissueActual": 0,
                            //商品id
                            "ProductId": product[i]['productid'],
                            //商品编码
                            "ProductCode": product[i]['productcode'],
                            //商品名称
                            "ProductName": product[i]['productname'],
                            //规格Id
                            "ProductSkuId": product[i]['skuid'],
                            //规格编码
                            "SkuCode": product[i]['code'],
                            //规格名称
                            "SkuName": product[i]['description'],
                            //是否虚拟商品0 正常商品 1 虚拟商品
                            "DetailType": 0,
                            //是否组合商品
                            "IsCombproduct": product[i]['iscombined'],
                            //退款状态
                            "RefundStatus": 0,
                            //	是否可拆分
                            "IsSplit": product[i]['issplit'],
                            "IsSelected": false,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        });
                    }
                    $scope.formData.Details = data;
                },
                //点击修改数量
                changeNum : function (type,event,list) {
                    $(event.target).attr('contenteditable',true);
                },
                //保存修改值
                saveChage : function (event,list) {
                    $(event.target).removeAttr('contenteditable');
                    list.quality = $(event.target).text();
                },
                //新增商品信息
                addProduct : function (content){
                    if($scope.formData.StoreName){
                        $scope.goodsContent = content;
                        //获取所有商品信息
                        addOrderService.InterfaceDeal.getAllProducts($scope);
                    }else{
                        toolsService.alertMsg('请先选择店铺');
                    }
                },
                //新增套装商品
                addSuit : function (content) {
                    if($scope.formData.StoreName){
                        $scope.goodsContent = content;
                        //获取所有商品信息
                        addOrderService.InterfaceDeal.getCombinedProduct($scope);
                    }else{
                        toolsService.alertMsg('请先选择店铺');
                    }
                },
                //计算应付金额和结算金额的和
                countAmount : function () {
                    $scope.amount = 0;
                    $scope.actualamount = 0;
                    for(var i= 0,j = $scope.formData.Details.length;i<j;i++){
                        $scope.amount += $scope.formData.Details[i]['retailprice'];
                        $scope.actualamount += $scope.formData.Details[i]['retailprice']
                    }
                }
            };

            //商品信息模块
            $scope.isGoodsShow = function (content) {
                $scope.goodsContent = content;
            };

            //支付信息模块函数
            $scope.isPayShow = function () {
                $scope.tmpData.payMents.Amount  = $scope.domOperate.countPay();
                $scope.payContent = !$scope.payContent;
            };

            //收货信息模块函数
            $scope.isReceiveShow = function () {
                $('[data-toggle="city-picker"]').citypicker();
                $scope.receiveContent = !$scope.receiveContent;
                //$scope.subOrderChanging = false;
            };

            //发票信息模块函数
            $scope.isInvoiceShow = function () {
                $scope.tmpData.Invoices.Amount  = $scope.domOperate.countPay();
                $scope.invoiceContent = !$scope.invoiceContent;
            };

            //复选框勾选与取消勾选
            $scope.isLabelSel = function (myEvent,type,data) {
                var products = $scope.formData.Details;
                if(type == 'product' || type == 'combinedProduct'){
                    if($scope.formData.details.contains(data) != -1){
                        $scope.formData.details.removeByValue(data);
                    }else{
                        $scope.formData.details.push(data);
                    }
                }
                toolsService.isLabelSel($scope,myEvent);
            };

        }]);
