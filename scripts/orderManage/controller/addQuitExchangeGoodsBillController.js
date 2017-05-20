/**
 * Created by zgh on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("addQuitExchangeGoodsBillController", ["$scope" ,'addQuitExchangeGoodsBillService','toolsService','$rootScope','validateService',
        function($scope,addQuitExchangeGoodsBillService,toolsService,$rootScope,validateService) {
            //如果有该字段则是从订单详情进入的
            if($rootScope.params.type == 'formOrder'){
                //订单来源信息
                $scope.type = $rootScope.params.type;
                //获取订单详细信息
                addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getOrderByOrderidDeal($scope,$rootScope.params.orderid);
            }else if($rootScope.params.type == 'modify'){//修改退换货单
                //订单来源信息
                $scope.type = $rootScope.params.type;
                //可修改的权限，为0，全部可以修改，为1，可以修改部分字段（新建状态的退换货单可修改所有信息；
                // 已审核的退换货单不可更改退入商品，可修改“换出仓库，退货类型，退货方式，补差价金额，收货人，
                // 手机号码，退款方式，收货地址，备注”；）
                $scope.operatePower = $rootScope.params.status;
                //退款单id
                $scope.refundOrderid = $rootScope.params.orderId;
            }else if($rootScope.params.type == 'fromRefund'){//新增退换货单
                //订单来源信息
                $scope.type = $rootScope.params.type;
            }

            //页面初始化
            addQuitExchangeGoodsBillService.addQorEGoodsDomOperate.domInit($scope);

            //dom操作
            $scope.domOperate = {
                //获取订单详情
                getOrderDetails : function (list){
                    $scope.orderChosed = list;
                    addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getOrderDetailsDeal($scope,list.orderid);
                },
                //订单明细选中与取消
                //orderListChose : function (myEvent,list) {
                //    if($scope.orderListHasChosed.contains(list) != -1){
                //        $scope.orderListHasChosed.removeByValue(list);
                //    }else{
                //        $scope.orderListHasChosed.push(list);
                //    }
                //    toolsService.isLabelSel($scope,myEvent);
                //},
                //根据条件搜索订单
                searchConfirm : function(){
                    //重置分页到第一页
                    $scope.paginationConf.currentPage = 1;
                    addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getOrderByConditionDeal($scope,$scope.formData);
                },
                //订单列表搜索条件取消
                searchCancle : function (){
                    $scope.formData = [];
                    addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getOrderByConditionDeal($scope,$scope.formData);
                },

                //保存选中的订单明细里面的商品信息
                save : function () {
                    addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.orderIsExist($scope,$scope.orderChosed.tradeid, function () {
                        //点击选中订单
                        $scope.order = $scope.orderChosed;
                        //如果刚开始是从修改进来，这里要把原始要修改的退换货单信息清空
                        if($scope.refundInfo){
                            delete $scope.refundInfo;
                        }
                        //默认退入仓库信息（设置下拉框默认值以及字段信息）
                        if($scope.storeInfo[$scope.orderInfo.storeid].storeSetting.defaultinwarehouseid){
                            var Inid = $scope.storeInfo[$scope.orderInfo.storeid].storeSetting.defaultinwarehouseid;
                            var InName = $scope.wareHouseInfo[$scope.storeInfo[$scope.orderInfo.storeid].storeSetting.defaultinwarehouseid].name;
                            var InCode = $scope.wareHouseInfo[$scope.storeInfo[$scope.orderInfo.storeid].storeSetting.defaultinwarehouseid].code;
                            $scope.pullSelect.inWarehouse.setValue({
                                id :  Inid,
                                name : InName
                            });
                            $scope.WarehouseInId = Inid;
                            $scope.WarehouseInCode = InCode;
                            $scope.WarehouseInName = InName;
                        }
                        //默认退出仓库（设置下拉框默认值以及字段信息）
                        if($scope.storeInfo[$scope.orderInfo.storeid].storeSetting.defaultoutwareshouseid){
                            var outId = $scope.storeInfo[$scope.orderInfo.storeid].storeSetting.defaultoutwareshouseid;
                            var outName = $scope.wareHouseInfo[$scope.storeInfo[$scope.orderInfo.storeid].storeSetting.defaultoutwareshouseid].name;
                            var outCode = $scope.wareHouseInfo[$scope.storeInfo[$scope.orderInfo.storeid].storeSetting.defaultoutwareshouseid].code;
                            $scope.pullSelect.outWarehouse.setValue({
                                id :  outId,
                                name : outName
                            });
                            $scope.WarehouseOutId = outId;
                            $scope.WarehouseOutCode =  outName;
                            $scope.WarehouseOutName = outCode;
                        }
                        //店铺信息（设置下拉框默认值以及字段信息）
                        $scope.pullSelect.store.setValue({id : $scope.orderInfo.storeid,name : $scope.orderInfo.storename});
                        $scope.StoreId = $scope.orderInfo.storeid;
                        $scope.StoreName = $scope.orderInfo.storename;
                        //选中的商品明细
                        $scope.formDataChosed.swapInProduct = $scope.domOperate.getChosedData($scope.orderDetails);
                    }, function () {

                    });
                    $('.order-list-chose').modal('hide');
                },
                //点击订单号，显示订单列表信息
                orderDetailsShow : function () {
                    addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.QueryOrderLists($scope, function () {
                        $('.order-list-chose').modal('show');
                    });
                },
                //新增换出商品信息
                addProduct : function (content) {
                    $scope.exchangeContent = content;
                    addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getProductOutDeal($scope);
                },
                //新增退入商品信息
                addInProduct : function (content) {
                    if($scope.refundInfo && $scope.refundInfo.status == 1){
                        toolsService.alertMsg('已审核的退换单不可修改退入商品！');
                    }else{
                        $scope.activeContent = content;
                        addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getProductInDeal($scope);
                    }
                },
                //获取商品明细(退入商品)
                getInDetails : function (list){
                    $scope.inProductSkud = list.skuid;
                    addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getProductInDetails($scope,list.code);
                },
                //获取商品明细(换出商品)
                getOutDetails : function (list){
                    $scope.outProductSkud = list.skuid;
                    addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getProductOutDetails($scope,list.code);
                },
                //退入商品选中
                productInChose : function (list) {
                    this.selectOneLine('productInCheckAll',$scope.tmpData.swapOut1Product,list);
                },
                //退入商品全选
                productInChoseAll : function () {
                    this.selectAll($scope.tmpData.swapOut1Product,'productInCheckAll');
                },

                //换出商品选中
                productOutChose : function (list) {
                    this.selectOneLine('productOutCheckAll',$scope.tmpData.swapOutProduct,list);
                },

                //换出商品全选
                productOutChoseAll : function () {
                    this.selectAll($scope.tmpData.swapOutProduct,'productOutCheckAll');
                },

                //选择添加到退入商品的套装信息
                suitInChose : function (list) {
                    //如果没有请求到明细信息，则可以获取明细信息
                    if(!list.details){
                        addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getInSuitDetails($scope,list.skuid,list);
                    }
                    this.selectOneLine('suitInChoseAll',$scope.tmpData.suitInData,list);
                },
                //选择添加到退入商品的套装信息（全选）
                suitInChoseAll : function () {
                    var obj = $scope.tmpData.suitInData;
                    if($scope.suitInChoseAll){
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = false;
                        }
                    }else{
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = true;
                            //如果没有请求到明细信息，则可以获取明细信息
                            if(!obj[i].details){
                                addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getInSuitDetails($scope,obj[i].skuid,obj[i]);
                            }
                        }
                    }
                    $scope.suitInChoseAll = !$scope.suitInChoseAll;
                },
                //选择添加到换出商品的套装信息
                suitOutChose : function (list) {
                    //如果没有请求到明细信息，则可以获取明细信息
                    if(!list.details){
                        addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getOutSuitDetails($scope,list.skuid,list);
                    }
                    this.selectOneLine('suitOutChoseAll',$scope.tmpData.suitOutData,list);
                },
                //选择添加到退入商品的套装信息（全选）
                suitOutChoseAll : function () {
                    var obj = $scope.tmpData.suitOutData;
                    if($scope.suitOutChoseAll){
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = false;
                        }
                    }else{
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = true;
                            //如果没有请求到明细信息，则可以获取明细信息
                            if(!obj[i].details){
                                addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getOutSuitDetails($scope,obj[i].skuid,obj[i]);
                            }
                        }
                    }
                    $scope.suitOutChoseAll = !$scope.suitOutChoseAll;
                },

                //确定选中退入商品信息
                addInProductConfirm : function (type) {
                    //退入商品信息
                    var obj = $scope.tmpData.swapOut1Product;
                    !$scope.formDataChosed.swapInProduct ? ($scope.formDataChosed.swapInProduct = []) : '';
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            //默认退入商品的数量为1
                            obj[i].quantity = 1;
                            //实退金额
                            obj[i].refundamount = obj[i].retailprice;
                            //应退金额
                            obj[i].actualamount = obj[i].retailprice;
                            $scope.formDataChosed.swapInProduct.push(obj[i]);
                            obj[i].trShow = false;
                        }
                    }
                    //选择商品的界面消失
                    $scope.activeContent = false;
                },
                //确定选中换出商品信息
                addOutProductConfirm : function () {
                    //退入商品信息
                    var obj = $scope.tmpData.swapOutProduct;
                    !$scope.formDataChosed.swapOutProduct ? ($scope.formDataChosed.swapOutProduct = []) : '';
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            //默认退入商品的数量为1
                            obj[i].quantity = 1;
                            //实退金额
                            obj[i].refundamount = obj[i].retailprice;
                            //应退金额
                            obj[i].actualamount = obj[i].retailprice;
                            $scope.formDataChosed.swapOutProduct.push(obj[i]);
                            obj[i].trShow = false;
                        }
                    }
                    //选择商品的界面消失
                    $scope.exchangeContent = false;
                },
                //确定添加套装明细(退入商品)
                addInSuitConfirm : function () {
                    var obj = $scope.tmpData.suitInData;
                    //获取选中的套装信息
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            //将选中的套装里面的明细添加到退入商品明细当中
                            for(var x = 0,y = obj[i].details.length;x < y;x++){
                                obj[i].details[x].actualamount = obj[i].details[x].saleprice;
                                obj[i].details[x].refundamount = obj[i].details[x].saleprice;
                                $scope.formDataChosed.swapInProduct.push(obj[i].details[x]);
                            }
                        }
                    }
                    //新增套装界面消失
                    $scope.activeContent = false;
                },
                //确定添加套装明细(换出商品)
                addOutSuitConfirm : function () {
                    var obj = $scope.tmpData.suitOutData;
                    //获取选中的套装信息
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            //将选中的套装里面的明细添加到退入商品明细当中
                            for(var x = 0,y = obj[i].details.length;x < y;x++){
                                obj[i].details[x].actualamount = obj[i].details[x].saleprice;
                                obj[i].details[x].refundamount = obj[i].details[x].saleprice;
                                $scope.formDataChosed.swapOutProduct.push(obj[i].details[x]);
                            }
                        }
                    }
                    //新增套装界面消失
                    $scope.exchangeContent = false;
                },
                //删除商品(退入商品)
                deleteInDetails : function (list) {
                    if($scope.refundInfo && $scope.refundInfo.status == 1){
                        toolsService.alertMsg('已审核的退换单不可修改退入商品！');
                    }else{
                        $scope.formDataChosed.swapInProduct.removeByValue(list);
                        //存入删除的信息当中（只存放从后台获取的商品信息）
                        if(!list.categoryid){
                            var details = this.changeLetter(list);
                            $scope.deleteDetails.push(details);
                        }
                    }
                },
                //改变删除商品字段的大小写
                changeLetter : function (list) {
                    return {
                        "Id": list.id,
                        "CreateDate": list.createdate,
                        "ReturnOrderId": list.returnorderid,
                        "ProductId": list.productid,
                        "ProductCode": list.productcode,
                        "ProductName": list.productname,
                        "SkuId": list.skuid,
                        "SkuName": list.skuname,
                        "SkuCode": list.skucode,
                        "Quantity": list.quantity,
                        "ActualAmount": list.actualamount,
                        "PriceOriginal": list.priceoriginal,
                        "OffsetAmount": list.offsetamount,
                        "RefundAmount": list.refundamount,
                        "SalesOrderDetailId": list.salesorderdetailId,
                        "SalesOrderId": list.salesorderid,
                        "IsCombproduct": list.iscombproduct,
                        "IsSplit": list.issplit,
                        "SpareParts": list.spareparts,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    }
                },
                //删除商品(换出商品)
                deleteOutDetails : function (list) {
                    $scope.formDataChosed.swapOutProduct.removeByValue(list);
                    //存入删除的信息当中（从后台获取的商品信息）
                    if(!list.categoryid){
                        var details = this.changeLetter(list);
                        $scope.deleteOutDetails.push(details);
                    }
                },
                //退入商品新增套装明细
                addInSuit : function (content) {
                    if($scope.refundInfo && $scope.refundInfo.status == 1){
                        toolsService.alertMsg('已审核的退换货单不可以修改退入商品！');
                    }else{
                        $scope.activeContent = content;
                        addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getInSuitDeal($scope);
                    }
                },
                //新增套装明细
                addOutSuit : function(content){
                    $scope.exchangeContent = content;
                    addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getOutSuitDeal($scope);
                },
                //选中一条记录
                selectOneLine : function (checkALl,obj,list) {
                    list.trShow = !list.trShow;
                    //全选标志
                    $scope[checkALl] = true;
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(!obj[i].trShow){
                            $scope[checkALl] = false;
                            break;
                        }
                    }
                },
                //退入商品信息全部选中
                choseProductInAll : function () {
                    this.selectAll($scope.formDataChosed.swapInProduct,'choseProductInChoseAll');
                },
                //选中退入商品信息
                choseProductIn : function(list){
                    this.selectOneLine('choseProductInChoseAll',$scope.formDataChosed.swapInProduct,list);
                },
                //全选
                selectAll : function (obj,checkAll) {
                    if($scope[checkAll]){
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = false;
                        }
                    }else{
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = true;
                        }
                    }
                    $scope[checkAll] = !$scope[checkAll];
                },
                //订单商品信息选择
                orderDetailsChose : function (list) {
                    this.selectOneLine('orderDetailscheckAll',$scope.orderDetails,list);
                },
                //订单商品信息全选
                orderDetailsChoseAll : function () {
                    this.selectAll($scope.orderDetails,'orderDetailscheckAll');
                },
                //将添加的商品中选中要转入换货单的商品添加到换出商品当中
                productBackLine : function () {
                    //选中的商品信息
                    var productChosed = [];
                    var productIn = $scope.formDataChosed.swapInProduct ? $scope.formDataChosed.swapInProduct : [];
                    //获取选中的退入商品信息
                    for(var i = 0,j = productIn.length;i < j;i++){
                        if(productIn[i].trShow){
                            productChosed.push($.extend(false,{},productIn[i]));
                            productIn[i].trShow = false;
                        }
                    }
                    //去掉全选标志
                    $scope.choseProductInChoseAll = false;
                    //判断是否有选中的商品信息
                    if(productChosed.length < 1){
                        toolsService.alertMsg('请先选择退入的商品信息！');
                    }else{
                        //有选中的商品信息的话加入到换出商品当中
                        for(var x = 0,y = productChosed.length;x < y;x++){
                            if($scope.formDataChosed.swapOutProduct.contains(productChosed[x]) != -1){
                                toolsService.alertMsg('已存在该商品！');
                            }else{
                                $scope.formDataChosed.swapOutProduct.push(productChosed[x]);
                            }
                        }
                    }
                },
                //根据商品代码查找商品信息(退入商品)
                searchByProductInCode : function (event) {
                    if(event.keyCode == 13){
                        addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getProductInDeal($scope);
                    }
                },
                //根据套装代码查找套装信息（退入商品）
                searchBySuitInCode : function (event) {
                    if(event.keyCode == 13){
                        addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getInSuitDeal($scope);
                    }
                },
                //根据商品代码查找商品信息（换出商品）
                searchByProductOutCode : function (event) {
                    if(event.keyCode == 13){
                        addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getProductOutDeal($scope);
                    }
                },
                //根据套装代码查找套装信息（换出商品）
                searchBySuitOutCode : function (event) {
                    if(event.keyCode == 13){
                        addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.getOutSuitDeal($scope);
                    }
                },
                //保存新增退换货单信息
                saveData : function (){
                    //表单是否通过验证
                    if(!validateService.validateAll('#addQuitExchangeGoodsBill','.jxOutDivContent'))return false;
                    //实退金额计算
                    var actualAmount = 0;
                    var data = {
                        "Id": $scope.refundInfo ? $scope.refundInfo.id : 0,
                        "CreateDate": new Date().format('yyyy-MM-dd H:m:s'),//
                        "ExpressNo": $scope.ExpressNo,
                        "ExpressName": $scope.ExpressName,
                        "MemberId": $scope.order.customerid,
                        "MemberName": $scope.order.customername,
                        "MemberCode": $scope.order.customercode,
                        "StoreId": $scope.order.storeid,
                        "RefundWay": $scope.RefundWay,
                        "StoreName": $scope.order.storename,
                        "WarehouseInId": $scope.WarehouseInId,
                        "WarehouseInCode": $scope.WarehouseInCode,
                        "ReturnStyle": $scope.RefundWay,
                        "WarehouseInName": $scope.WarehouseInName,
                        "WarehouseOutId": $scope.WarehouseOutId,
                        "WarehouseOutCode": $scope.WarehouseOutCode,
                        "WarehouseOutName": $scope.WarehouseOutName,
                        //退款单状态
                        "Status": $scope.refundInfo ? $scope.refundInfo.status : 0,
                        "TradeId": $scope.order.tradeid,
                        "SalesOrderId": $scope.order.orderid,
                        "IsElectronicInvoiceCreated": $scope.order.iselectronicinvoicecreated,
                        "SalesOrderCode": $scope.order.code,
                        "ReturnOrderTypeId": $scope.returnGoodsType,
                        "ReturnOrderTypeName": $scope.returnGoodsName,
                        "Mobile": $scope.order.subOrder.mobile,
                        "ConsigneeName": $scope.order.subOrder.consignee,
                        "ConsigneeAddress": $scope.order.subOrder.address,
                        "OffsetAmount": $scope.OffsetAmount ? $scope.OffsetAmount : 0,
                        "IsCod": $scope.refundInfo ? $scope.refundInfo.iscod : false,
                        "IsAbnormal": $scope.refundInfo ? $scope.refundInfo.isabnormal : false,
                        "IsPrime": $scope.refundInfo ? $scope.refundInfo.isprime : false,
                        "Note": $scope.order.note,
                        "AliPayNo": $scope.order.alipayno,
                        "Quantity": $scope.order.quantity,
                        "Message": $scope.order.messagestring,
                        "IsPush": $scope.refundInfo ? $scope.refundInfo.ispush : false,
                        "Details": [],
                        "OutDetails" :[],
                        "IsObsolete": $scope.refundInfo ? $scope.refundInfo.isobsolete : false,
                        "IsCreateNoticed": $scope.refundInfo ? $scope.refundInfo.iscreatenoticed : false,
                        "IsQuickRefund": $scope.refundInfo ? $scope.refundInfo.isquickrefund : false,
                        "IsRefund": $scope.refundInfo ? $scope.refundInfo.isrefund : false,
                        "IsReplace": $scope.refundInfo ? $scope.refundInfo.isreplace : false,
                        "IsScan": false,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    //退入商品
                    var obj = $scope.formDataChosed.swapInProduct;
                    if(obj){
                        for(var i = 0,j = obj.length;i < j;i++){
                            data.Details.push({
                                "Id":obj[i].returnorderid ?  obj[i].id : 0,
                                "CreateDate": new Date().format('yyyy-MM-dd H:m:s'),
                                "ReturnOrderId": obj[i].returnorderid ? obj[i].returnorderid : 0,
                                "ProductId": obj[i]['productid'],
                                "ProductCode": obj[i]['productcode'],
                                "ProductName": obj[i]['productname'],
                                "SkuId": obj[i]['skuid'],
                                "SkuName": obj[i]['description'],
                                "SkuCode": obj[i]['code'],
                                "Quantity": obj[i]['quantity'],
                                "ActualAmount": obj[i]['actualamount'],
                                "PriceOriginal": obj[i]['priceoriginal'],
                                "OffsetAmount": obj[i]['offsetamount'] ? obj[i]['offsetamount'] : 0,
                                "RefundAmount": obj[i]['refundamount'],
                                "SalesOrderDetailId": $scope.order.orderid,
                                "SalesOrderId": obj[i]['salesorderid'],
                                "IsCombproduct": obj[i]['iscombproduct'],
                                "IsSplit": obj[i]['issplit'],
                                "SpareParts": obj[i]['spareparts'],
                                "Deleted": false,
                                "IsNew": false,
                                "IsUpdate": false
                            });
                            actualAmount += obj[i]['amountactual'] ? obj[i]['amountactual'] : 0;
                        }
                    }
                    //换出商品
                    var obj1 = $scope.formDataChosed.swapOutProduct;
                    if(obj1){
                        for(var x = 0,y = obj1.length;x < y;x++){
                            data.OutDetails.push({
                                "Id": obj1[x].returnorderid ? obj1[x].id : 0,
                                "CreateDate": new Date().format('yyyy-MM-dd H:m:s'),
                                "ReturnOrderId": obj1[x].returnorderid ? obj1[x].returnorderid : 0,
                                "ProductId": obj1[x]['productid'],
                                "ProductCode": obj1[x]['productcode'],
                                "ProductName": obj1[x]['productname'],
                                "SkuId": obj1[x]['skuid'],
                                "SkuName": obj1[x]['description'],
                                "SkuCode": obj1[x]['code'],
                                "Quantity": obj1[x]['quantity'],
                                "ActualAmount": obj1[x]['actualamount'],
                                "IsCombproduct": obj1[x]['iscombined'],
                                "IsSplit": false,
                                "CanSales": 0,
                                "Deleted": false,
                                "IsNew": false,
                                "IsUpdate": false
                            });
                        }
                    }
                    //计算实退金额
                    data.AmountActual = actualAmount;
                    //如果是修改退换货单需要传被删除的退入商品和换出商品还有日志信息
                    if($scope.refundInfo){
                        data.DeleteDetails = $scope.deleteDetails;
                        data.DeleteOutDetails = $scope.deleteOutDetails;
                        data.Logs = [];
                        //操作日志信息
                        for(var i1 = 0,j1 = $scope.returnGoodsLog.length;i1 < j1;i1++){
                            data.Logs.push({
                                Id : $scope.returnGoodsLog[i1].id,
                                ReturnOrderId : $scope.returnGoodsLog[i1].returnorderid,
                                CreateUserName : $scope.returnGoodsLog[i1].createusername,
                                CreateDate : $scope.returnGoodsLog[i1].createdate,
                                Note :  $scope.returnGoodsLog[i1].note,
                                Deleted : false,
                                IsNew : false,
                                IsUpdate :false
                            });
                        }
                    }
                    //发送新增退换货单请求
                    addQuitExchangeGoodsBillService.addQorEGoodsInterfaceDeal.addReturnOrderDeal($scope,data, function () {
                        $scope.domOperate.backToList();
                    });
                },
                //获取已选中的信息
                getChosedData : function (obj) {
                    var chosed = [];
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            //将订单里面获取到的详细转换成从商品拿来的数据
                            obj[i].code = obj[i].skucode;
                            obj[i].description = obj[i].skuname;
                            obj[i].trShow = false;
                            chosed.push(obj[i]);
                        }
                    }
                    return  chosed;
                },
                //返回到来源页面
                backToList : function () {
                    var url = '';
                    var title = '';
                    if($scope.type == 'fromRefund' || $scope.type == 'modify'){
                        $rootScope.params = {};
                        url = '../template/orderManage/quitExchangeGoodsBill.html';
                        title = '退换货单';
                    }else if($scope.type == 'formOrder'){
                        $rootScope.params = {
                            orderid : $scope.order.orderid,
                            from : {
                                url : 'orderList.html',
                                title : '订单列表'
                            }
                        };
                        url = '../template/orderManage/orderDetail.html';
                        title = '订单列表：订单详情';
                    }
                    var index = $('#addQuitExchangeGoodsBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //关闭模态框
                closeModal : function () {
                    $('.modal').modal('hide');
                },
                //点击修改内容
                changeValue : function (list,type,event) {
                    var text = $(event.target).text();
                    if(type == 'quantity'){
                        text = Number(text) ? Number(text) : 1;
                        list[type] = text;
                        list['actualamount'] = text * list['retailprice'];
                        list['refundamount'] = text * list['retailprice'];
                        $(event.target).text(text);
                    }else if(type == 'refundamount'){
                        text = Number(text) ? Number(text) : list['refundamount'];
                        list['refundamount'] = text;
                        $(event.target).text(text);
                    }
                }
            };

            //退入商品信息模块函数
            $scope.isActiveShow = function (content) {
                if (content == false) {
                    $scope.activeContent = false;
                } else {
                    $scope.activeContent = content;
                }
            };

            //换出商品信息模块函数
            $scope.isExchangeShow = function (content) {
                if (content == false) {
                    $scope.exchangeContent = false;
                } else {
                    $scope.exchangeContent = content;
                }
            };

        }
    ]);