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
                $scope.type = 'copy';
            }else if($rootScope.params.type == 'change'){
                orderDetails = $rootScope.params;
                $scope.type = 'change';
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

                //特殊标记选择(货到付款，需开发票，加急订单)
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
                            obj[i].skudcode = obj[i].code;
                            obj[i].skuname = obj[i].description;
                            obj[i].retailprice = obj[i].wholesaleprice;
                            obj[i].amountactual = obj[i].wholesaleprice;
                            obj[i].amount = obj[i].retailprice;
                            obj[i].quantity = 1;
                            //优惠价格
                            obj[i].discountamount = 0;
                            //分销价格
                            obj[i].distributionamount = 0;
                            obj[i].firstcost = obj[i].costprice;
                            obj[i].isabnormal = false;
                            obj[i].icombproduct = obj[i].iscombined;
                            obj[i].isdeleted = false;
                            obj[i].ismanual = true;
                            //是否缺货
                            obj[i].isoutofstock = false;
                            //是否退款完成
                            obj[i].isrefundfinished = false;
                            //是否已退款
                            obj[i].isrefunded = false;
                            obj[i].priceoriginal = obj[i].retailprice;
                            obj[i].priceselling = obj[i].retailprice;
                            obj[i].productskuid = obj[i].skuid;
                            obj[i].reissueactual = 0;
                            obj[i].skucode = obj[i].code;
                            products.push(obj[i]);
                        }
                    }
                    if(products.length<1){
                        toolsService.alertMsg('请选择相应的商品');
                    }else{
                        for(var i = 0,j = products.length;i < j;i++){
                            $scope.formData.details.push(products[i]);
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
                                $scope.formData.details.push({
                                    "categoryid": "00000000-0000-0000-0000-000000000000",
                                    "color": suits[i].color,
                                    "costprice": suits[i].details[x].costprice,
                                    "createdate": suits[i].details[x].createdate,
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

                //刪除一个商品信息
                deleteProduct : function (data){
                    $scope.formData.details.removeByValue(data);
                    //删除已经存在的商品
                    if(data.detailid){
                        $scope.DeletedDetails.push(data);
                    }
                    //重新计算合计信息
                    this.countAmount();
                },

                //计算应支付的所有金额
                payCount : function () {
                    var sum = 0;
                    for(var i = 0,j = $scope.formData.details.length;i < j;i++){
                        //这里数量需要修改，暂时规定每条商品只有一件
                        sum += $scope.formData.details[i]['firstprice'] * 1;
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
                    $scope.tmpData.subOrder.codpayment = $scope.formData.codservicefee ? $scope.formData.codservicefee : 0;
                    //判断是修改还是新增
                    if(!$scope.formData.subOrder.SubId){
                        $scope.tmpData.subOrder.SubId = 0;
                        $scope.tmpData.subOrder.IsPrime = false;
                        $scope.tmpData.subOrder.IsBlacklist = false;
                        $scope.tmpData.subOrder.IsMerge = false;
                        $scope.tmpData.subOrder.Deleted = false;
                        $scope.tmpData.subOrder.IsNew = false;
                        $scope.tmpData.subOrder.IsUpdate = false;
                        $scope.formData.customername = $scope.tmpData.customername;
                    }
                    $scope.formData.subOrder = $scope.tmpData.subOrder;
                    //修改已选中的会员信息
                    $scope.selectConfig.accountInfo.setText($scope.tmpData.customername);
                    $scope.receiveContent = !$scope.receiveContent;
                },

                //确定添加一个发票明细
                addInvoiceDetailsConfirm : function (){
                    if(!validateService.validateAll('#addOrder','.addInvoicePage')) return false;
                    $scope.formData.invoices.push({
                        amount : $scope.tmpData.invoices.amount,
                        invoicetype : Number($scope.tmpData.invoices.invoicetype),
                        title : $scope.tmpData.invoices.title,
                        content : $scope.tmpData.invoices.content,
                        CreateDate : new Date().format('yyyy-MM-dd H:m:s')
                    });
                    $scope.invoiceContent = !$scope.invoiceContent;
                    $scope.tmpData.invoices = {};
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
                        num += Number($scope.formData.payMents[i].amount);
                    }
                    return num;
                },
                //保存新增订单信息
                saveOptions : function(){
                    if(!validateService.validateAll('#addOrder','.order-message'))return false;
                    //转换订单信息字段大小写
                    var data = this.getOrderInfo();
                    data.Details = this.getProductInfo($scope.formData.details);
                    data.subOrder = this.getSuborder();
                    data.Invoices = this.getInvoice($scope.formData.invoices);
                    data.PayMents = $scope.formData.payMents;
                    data.DeletedDetails = this.getProductInfo($scope.DeletedDetails);
                    //验证支付明细和总支付金额是否匹配
                    var payCount = this.payDetailsAll();
                    var countPay = this.countPay();
                    if(payCount == countPay){
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
                cancleAddOrder : function () {
                    $rootScope.params = {};
                    var index = $('#addOrder').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/orderList.html';
                    $scope.option[index].name = '订单列表';
                },

                //删除已填写的支付信息
                orderInfoDel : function (list) {
                    $scope.formData.payMents.removeByValue(list);
                    if(list.paymentid){
                        addOrderService.InterfaceDeal.deletePayment($scope,list.paymentid);
                    }
                },
                //删除发票信息
                invoiceDel : function (list) {
                    $scope.formData.invoices.removeByValue(list);
                    if(list.invoiceid){
                        addOrderService.InterfaceDeal.deleteInvoice($scope,list.invoiceid);
                    }
                },

                //修改收货地址
                changeGoodsReceptions : function (){
                    //地址信息
                    $scope.tmpData.subOrder = $scope.formData.subOrder;
                    //昵称
                    $scope.tmpData.customername = $scope.formData.customername;
                    $scope.receiveContent = !$scope.receiveContent;
                },
                //获取填写的订单基本信息
                getOrderInfo : function () {
                    var orderid = 0;
                    //type为copy表示复制，orderid为0
                    if($scope.formData.orderid && $scope.type != 'copy'){
                        orderid = $scope.formData.orderid;
                    }
                    return {
                        "OrderId": orderid,
                        "CreateDate": $scope.formData.createdate,
                        "Code": $scope.formData.code,
                        "TradeId": $scope.formData.tradeid ? $scope.formData.tradeid : 0,
                        "PlatformType": $scope.formData.platformtype,
                        "TransType": $scope.formData.transtype,
                        "SuggestExpressId": $scope.formData.suggestexpressId,
                        "ExpressFee": $scope.formData.expressfee,
                        "PlatFromDate": $scope.formData.platfromdate ? $scope.formData.platfromdate : new Date().format('yyyy-MM-dd H:m:s'),
                        "CreateUserId": $scope.formData.createuserid,
                        "PayDate": $scope.formData.paydate,
                        "IsCod": $scope.formData.iscod ? $scope.formData.iscod : false,
                        "CodServiceFee": $scope.formData.codservicefee,
                        "Weight": $scope.formData.weight ? $scope.formData.weight : 0,
                        "HasInvoice": $scope.formData.hasinvoice ? $scope.formData.hasinvoice : false,
                        "PayAmount": $scope.formData.payamount ? $scope.formData.payamount : 0, //需要计算
                        "Status": $scope.formData.status,
                        "PlatformStatus": $scope.formData.platformstatus ? $scope.formData.platformstatus : 0,
                        "IsManual": $scope.formData.ismanual ? $scope.formData.ismanual : false,
                        "IsObsolete": $scope.formData.isobsolete ? $scope.formData.isobsolete : false,
                        "RefundStatus": $scope.formData.refundstatus ? $scope.formData.refundstatus : 0,
                        "ExpressFeeIsCod": $scope.formData.expressfeeiscod ? $scope.formData.expressfeeiscod : false,
                        "IsHold": $scope.formData.ishold ? $scope.formData.ishold : false,
                        "IsOutOfStock": $scope.formData.isoutofstock ? $scope.formData.isoutofstock : false,
                        "PreSaleType": $scope.formData.presaletype ? $scope.formData.presaletype : '',
                        "IsNewVip": $scope.formData.isnewvip ? $scope.formData.isnewvip : false,
                        "FinanceType": $scope.formData.financetype ? $scope.formData.financetype : 0,
                        "AddPrice": $scope.formData.addprice ? $scope.formData.addprice : 0,
                        "DiscountAmount": $scope.formData.discountamount ? $scope.formData.discountamount : 0,//需要计算
                        "Quantity": $scope.formData.quantity ? $scope.formData.quantity : 0,//需计算
                        "SourceType": $scope.formData.sourcetype ? $scope.formData.sourcetype : 0,
                        "StoreName": $scope.formData.storename ? $scope.formData.storename : '',
                        "SuggestWarehouseId": $scope.formData.suggestwarehouseid ? $scope.formData.suggestwarehouseid : '',
                        "IsLock":  $scope.formData.islock ?$scope.formData.islock : false,
                        "LockedUserName": $scope.formData.lockedusername ? $scope.formData.lockedusername : '',
                        "CreateUserName": $scope.formData.createusername ? $scope.formData.createusername : '',
                        "StoreId": $scope.formData.storeid ? $scope.formData.storeid : '',
                        "CustomerId": $scope.formData.customerid,
                        "CustomerName": $scope.formData.customername,
                        "CustomerCode": $scope.formData.customercode,
                        "SuggestWarehouseName": $scope.formData.suggestwarehousename,
                        "SuggestExpressName": $scope.formData.suggestexpressname ? $scope.formData.suggestexpressname : '',
                        "DeliveryTypeStatus": $scope.formData.deliverytypestatus ? $scope.formData.deliverytypestatus : 0,
                        "DispatchTypeStatus": $scope.formData.dispatchtypestatus ? $scope.formData.dispatchtypestatus : 0,
                        "CurrencyCode": $scope.formData.currencycode ? $scope.formData.currencycode : 0,
                        "SpeedDelivery": $scope.formData.speeddelivery ? $scope.formData.speeddelivery : false,
                        "IsAbnormal": $scope.formData.isabnormal ? $scope.formData.isabnormal : false,
                        "IsElectronicInvoiceCreated": $scope.formData.iselectronicinvoicecreated ? $scope.formData.iselectronicinvoicecreated :false,
                        "EditContent": "",//这里需要自己添加几率信息
                        "IsSplitForce": $scope.formData.issplitforce ? $scope.formData.issplitforce :false,
                        "IsPrepay": $scope.formData.isprepay ? scope.formData.isprepay :false,
                        "PayStatus": $scope.formData.paystatus ? $scope.formData.paystatus : 0,
                        "IsReturnOrderReCheck":  false,//退换货单复核时生成换货订单时间做判断用的
                        "FreightRisk": $scope.formData.freightrisk ? $scope.formData.freightrisk : 0,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                },
                //发票信息
                getInvoice : function (obj) {
                    var data = [];
                    for(var i = 0,j = obj.length;i < j;i++){
                        data.push({
                            Amount :obj[i].amount,
                            InvoiceType : Number(obj[i].invoicetype),
                            Title : obj[i].title,
                            Content : obj[i].content,
                            InvoiceId : obj[i].invoicetype ? obj[i].invoicetype :0,
                            SalesOrderId : obj[i].salesorderid ? obj[i].salesorderid : 0,
                            Deleted : false,
                            IsNew : false,
                            IsUpdate : false,
                            CreateDate : obj[i].createdate ? obj[i].createdate : new Date().format('yyyy-MM-dd H:m:s')
                        });
                    }
                    return data;
                },
                //地址信息
                getSuborder : function () {
                    return {
                        "SubId": $scope.formData.subOrder.subid,
                        "ProvinceId": $scope.formData.subOrder.provinceid,
                        "CityId": $scope.formData.subOrder.cityid,
                        "CountyId": $scope.formData.subOrder.countyid,
                        "Address": $scope.formData.subOrder.address,
                        "ZipCode": $scope.formData.subOrder.zipcode,
                        "Contacter": $scope.formData.subOrder.contacter,
                        "Fax": $scope.formData.subOrder.fax,
                        "BuyerEmail": $scope.formData.subOrder.buyeremail,
                        "BuyerMemo": $scope.formData.subOrder.buyermemo,
                        "SellerMemo": $scope.formData.subOrder.sellermemo,
                        "ProvinceName": $scope.formData.subOrder.provincename,
                        "CityName": $scope.formData.subOrder.cityname,
                        "CountyName": $scope.formData.subOrder.countyname,
                        "NationalId": $scope.formData.subOrder.nationalid,
                        "NationalName": $scope.formData.subOrder.nationalname,
                        "CodPayment": $scope.formData.subOrder.CodPayment ? $scope.formData.subOrder.CodPayment : 0,
                        "IsPrime": $scope.formData.subOrder.isprime,
                        "IsBlacklist": $scope.formData.subOrder.isblacklist,
                        "IsMerge": $scope.formData.subOrder.ismerge,
                        "MergeMd5": $scope.formData.subOrder.mergemd5,
                        "Consignee": $scope.formData.subOrder.consignee,
                        "Mobile": $scope.formData.subOrder.mobile,
                        "Telephone": $scope.formData.subOrder.telephone,
                        "ProvinceCode": $scope.formData.subOrder.provincecode,
                        "CityCode": $scope.formData.subOrder.citycode,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    }
                },
                //计算总付款数据
                countPay : function () {
                    //选中商品信息
                    var obj = $scope.formData.details;
                    var num = 0;
                    //快递费用
                    num += Number($scope.formData.expressfee);
                    //所有商品费用
                    for(var i = 0,j = obj.length;i <j;i++){
                        num += obj[i].amountactual;
                    }
                    return num;
                },
                //获取选中的商品信息
                getProductInfo : function (product) {
                    var data = [];
                    var details = {};
                    for(var i = 0,j = product.length;i < j;i++){
                        details = {
                            "DetailId": product[i].detailid ? product[i].detailid : 0,
                            "CreateDate": product[i].createdate,
                            "SalesOrderId":  product[i].salesorderid ? product[i].salesorderid : 0,
                            "FirstCost": product[i].firstcost,
                            "PriceOriginal":  product[i].priceoriginal,
                            "PriceSelling": product[i].priceselling,
                            "Quantity": product[i].quantity,
                            "CanSaleQuantity": 0,//这个要重新计算
                            "DiscountAmount": product[i].discountamount,
                            "Amount": product[i].amount,
                            "AmountActual": product[i].amountactual,
                            "IsAbnormal": product[i].isabnormal,
                            "IsDeleted": product[i].isdeleted,
                            "IsRefunded": product[i].isrefunded,
                            "IsRefundFinished": product[i].isrefundfinished,
                            "Status":product[i].status,
                            "IsOutOfStock":product[i].isoutofstock,
                            "DistributionAmount":product[i].distributionamount,
                            "Weight":product[i].weight,
                            "IsManual": product[i].ismanual,
                            "ReissueActual": product[i].reissueactual,
                            "ProductId":product[i].productid,
                            "ProductCode": product[i].productcode,
                            "ProductName": product[i].productname,
                            "ProductSkuId": product[i].productskuid,
                            "SkuCode": product[i].skucode,
                            "SkuName": product[i].skuname,
                            "DetailType": product[i].detailtype ? product[i].detailtype : 0,
                            "IsCombproduct": product[i].iscombproduct,
                            "RefundStatus": product[i].refundstatus ? product[i].refundstatus : 0,
                            "IsSplit": product[i].issplit,
                            "IsSelected": false,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        };
                        //非新增的商品处理
                        if(product[i].platformProduct){
                            details.PlatformProduct = {
                                "Id": product[i].platformProduct.id,
                                "CreateDate": product[i].platformProduct.createdate,
                                "refund_status": product[i].platformProduct.refund_status,
                                "Deleted": false,
                                "IsNew": false,
                                "IsUpdate": false
                            };
                        }
                        data.push(details);
                    }
                    return data;
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
                    if($scope.formData.storename){
                        $scope.goodsContent = content;
                        //获取所有商品信息
                        addOrderService.InterfaceDeal.getAllProducts($scope);
                    }else{
                        toolsService.alertMsg('请先选择店铺');
                    }
                },
                //新增套装商品
                addSuit : function (content) {
                    if($scope.formData.storename){
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
                    $scope.quantity = 0;
                    for(var i= 0,j = $scope.formData.details.length;i<j;i++){
                        $scope.amount += $scope.formData.details[i]['amount'];
                        $scope.actualamount += $scope.formData.details[i]['amountactual'];
                        $scope.quantity += $scope.formData.details[i]['quantity'];
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
                $scope.tmpData.invoices.amount  = $scope.domOperate.countPay();
                $scope.invoiceContent = !$scope.invoiceContent;
            };

            //复选框勾选与取消勾选
            $scope.isLabelSel = function (myEvent,type,data) {
                var products = $scope.formData.details;
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
