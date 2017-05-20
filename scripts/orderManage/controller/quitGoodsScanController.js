/**
 * Created by jx on 2017/3/28.
 */
angular.module("klwkOmsApp")
    .controller("quitGoodsScanController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService","quitGoodsScanService","ApiService","validateService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService,quitGoodsScanService,ApiService,validateService) {

            //页面初始化
            quitGoodsScanService.quitGoodsScanDomOperate.domInit($scope);

            //dom操作
            $scope.domOperate = {
                //回车通过手机号获取订单信息
                getOrderDetails : function (event,type,value) {
                    if(event.keyCode == 13){
                        $scope.orderList ={};
                        $scope.orderChosed = [];
                        this.clearArray($scope.orderListDetails);
                        this.clearArray($scope.returnGoods);
                        this.clearArray($scope.changeOutProduct);
                        this.clearArray($scope.returnGoodsChosed);
                        quitGoodsScanService.quitGoodsScanDeal.getOrderInfoDeal($scope,type,value);
                    }
                },
                //获取订单的明细信息
                getOrderListDetails : function (list){
                    $scope.orderListDetails = list['details'];
                    $scope.orderListDetailsMoney = this.getTotalMoney(list);
                    $scope.insideLabel = list.messagestring;
                    $scope.orderChosed = list;
                },
                //获取订单明细的合计结算金额
                getTotalMoney : function(list){
                    var sum = 0;
                    for(var i = 0,j = list['details'].length;i < j;i++){
                        sum += list['details'][i]['priceselling'];
                    }
                    return sum;
                },
                //将订单明细加入到退入商品当中
                addToReturnGoods : function (list){
                    if($scope.returnGoods.contains(list) != -1){
                        alert("已经存在该商品");
                    }else{
                        list['code'] = $scope.orderChosed.code;
                        $scope.returnGoods.push(list);
                        quitGoodsScanService.quitGoodsScanDeal.getProductDeal($scope,list.productcode);
                    }
                },
                //转入换货单
                turnToChangeGoods : function (){
                    var obj = $scope.returnGoods;
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            //不存在则添加
                            if($scope.changeOutProduct.contains(obj[i]) == -1){
                                $scope.changeOutProduct.push(obj[i]);
                            }
                            obj[i].trShow = false;
                        }
                    }
                    //全选标志
                    $scope.returnGoodsCheckAll = false;
                },
                //选中退入商品信息
                orderListChose : function (myEvent,list) {
                    if($scope.returnGoodsChosed.contains(list) != -1){
                        $scope.returnGoodsChosed.removeByValue(list);
                    }else{
                        $scope.returnGoodsChosed.push(list);
                    }
                    toolsService.isLabelSel($scope,myEvent);
                },
                //添加退入商品
                addReturnGoods : function (event,code,type) {
                    if(event.keyCode == 13){
                        quitGoodsScanService.quitGoodsScanDeal.getProductByCodeDeal($scope,code,type);
                    }
                },
                //删除退入商品
                delReturnGood : function (list) {
                    var obj = $scope.returnGoods;
                    list.trShow = false;
                    //全选标志
                    $scope.returnGoodsCheckAll = true;
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(!obj[i].trShow){
                            $scope.returnGoodsCheckAll = false;
                            break;
                        }
                    }
                    $scope.returnGoods.removeByValue(list);
                },
                //删除换出商品
                delSkuProtuct : function (list) {
                    $scope.changeOutProduct.removeByValue(list);
                },
                //添加退入商品
                addReturnProduct : function () {
                    //设定当前是添加退入商品
                    $scope.addType = true;
                    //将以前选中的数据清空
                    $scope.tmpSkyData = [];
                    quitGoodsScanService.quitGoodsScanDeal.getskuCodeDeal($scope,$scope.formData);
                    $('.order-list-chose').modal('show');
                },
                //添加换出商品
                addSkuProduct : function () {
                    //设定当前是添加换出商品
                    $scope.addType = false;
                    quitGoodsScanService.quitGoodsScanDeal.getskuCodeDeal($scope,$scope.formData);
                    $('.order-list-chose').modal('show');
                },
                //获取规格信息对应的商品信息
                getProductDetails : function (list) {
                    quitGoodsScanService.quitGoodsScanDeal.getProductDetailsDeal($scope,list.code);
                },
                //选中那些规格的商品新增
                skuChose : function(myEvent,list){
                    var obj = $scope.skuCodeInfo;
                    list.trShow = !list.trShow;
                    //全选标志
                    $scope.checkAll = true;
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(!obj[i].trShow){
                            $scope.skuCheckAll = false;
                            break;
                        }
                    }
                },
                //全选商品信息
                skuSelectAll : function () {
                    var obj = $scope.skuCodeInfo;
                    if($scope.skuCheckAll){
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = false;
                        }
                    }else{
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = true;
                        }
                    }
                    $scope.skuCheckAll = !$scope.skuCheckAll;
                },
                //退入商品全选
                productinChoseAll : function () {
                    var obj = $scope.returnGoods;
                    if($scope.returnGoodsCheckAll){
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = false;
                        }
                    }else{
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = true;
                        }
                    }
                    $scope.returnGoodsCheckAll = !$scope.returnGoodsCheckAll;
                },
                //退入商品选中
                productInChose : function (list) {
                    var obj = $scope.returnGoods;
                    list.trShow = !list.trShow;
                    //全选标志
                    $scope.returnGoodsCheckAll = true;
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(!obj[i].trShow){
                            $scope.returnGoodsCheckAll = false;
                            break;
                        }
                    }
                } ,
                //保存添加的商品信息
                save : function () {
                    //添加到退入商品中
                    var obj = $scope.skuCodeInfo;
                    var data = [];
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            data = {
                                "amount": 0,
                                "amountactual": 0,
                                "createdate": obj[i].createdate,
                                "deleted": obj[i].delted,
                                //"detailid": 360,
                                //"detailtype": 0,
                                "discountamount": 0,
                                "discountamountDet": 0,
                                "distributionamount": 0,
                                "firstcost": obj[i].firstcost,
                                //"isNew": false,
                                //"isUpdate": false,
                                "isabnormal": false,
                                "iscombproduct": obj[i].iscombined,
                                "isdeleted": false,
                                "ismanual": true,
                                "isoutofstock": false,
                                "isrefunded": false,
                                "isrefundfinished": false,
                                "issplit": obj[i].issplit,
                                "priceoriginal": obj[i].firstprice,
                                "priceselling": obj[i].retailprice,
                                "productcode": obj[i].productcode,
                                "productid": obj[i].productid,
                                "productname": obj[i].productname,
                                "productskuid": obj[i].skuid,
                                "quantity": 1,
                                //"quantityDet": 1,
                                "refundstatus": 0,
                                "reissueactual": 0,
                                "salesorderid": 0,
                                "salesorderdetailid": 0,
                                "skucode": obj[i].code,
                                "skuname": obj[i].description,
                                "status": obj[i].status,
                                "weight": obj[i].weight
                            };
                            if($scope.addType){
                                $scope.returnGoods.push(data);
                            }else{
                                $scope.changeOutProduct.push(data);
                            }
                        }
                    }
                    $('.order-list-chose').modal('hide');
                },
                //提交并保存退货扫描信息
                saveCommitInfo : function () {
                    var inData = this.forMatReturnData();
                    var outData = this.forMatSwapOutData();
                    var data =[];
                    //验证表单
                    if(!validateService.validateAll('#quitGoodsScan','.content')) return false;
                    //判断退货类型是否存在于从后台请求到的数据当中
                    if($scope.returnStyle in $scope.reFundType){
                        //退货类型id
                        $scope.ReturnOrderTypeId = $scope.reFundType[$scope.returnStyle].id;
                        //退货类型编码
                        $scope.ReturnOrderTypeCode = $scope.reFundType[$scope.returnStyle].code;
                        //退货类型名称
                        $scope.ReturnOrderTypeName = $scope.reFundType[$scope.returnStyle].name;
                        data = this.getAllOrderInfo(inData,outData);
                        quitGoodsScanService.quitGoodsScanDeal.saveReturnGoodsBillDeal($scope,data);
                        //清空数据
                        this.reset();
                    }else{
                        toolsService.alertMsg('退货类型异常！');
                    }
                },
                //获取所有退或换商品的订单信息
                getAllOrderInfo : function (indata,outdata) {
                    var obj = $scope.orderList.clone();
                    //插入一个新的订单信息
                    obj.push({
                        orderid : "0"
                    });
                    var tmpData = [];
                    var data = {};
                    for(var i = 0,j = obj.length;i  < j;i++){
                        data = {
                            "Id": 0,
                            "CreateDate": new Date().format('yyyy-MM-dd H:m:s'),
                            "ApproveUser": ApiService.getBasicParamobj().UserName,
                            "ApproveDate": new Date().format('yyyy-MM-dd H:m:s'),
                            "ExpressNo": $scope.ExpressNo,
                            "ExpressName": $scope.ExpressName,
                            "MemberId": obj[i].customerid ? obj[i].customerid : '00000000-0000-0000-0000-000000000000',
                            "MemberName": obj[i].customername ? obj[i].customername : undefined,
                            "MemberCode": obj[i].customercode ? obj[i].customercode : undefined,
                            "StoreId": obj[i].storeid ? obj[i].storeid : undefined,
                            "RefundWay": obj[i].refundstatus ? obj[i].refundstatus : 0,
                            "StoreName": obj[i].storename ? obj[i].storename : 0,
                            "WarehouseInId": $scope.wareHouseInId,
                            "WarehouseInCode": $scope.wareHouseInCode,
                            "WarehouseInName": $scope.wareHouseName,
                            "WarehouseOutId": $scope.WarehouseOutId,
                            "WarehouseOutCode": $scope.WarehouseOutCode,
                            "WarehouseOutName": $scope.WarehouseOutName,
                            "Status": 1,
                            "TradeId": obj[i].tradeid ? obj[i].tradeid : undefined,
                            "SalesOrderId": obj[i].salesorderid ? obj[i].salesorderid : undefined,
                            "IsElectronicInvoiceCreated": obj[i].iselectronicinvoicecreated ?  obj[i].iselectronicinvoicecreated : false,
                            "SalesOrderCode": obj[i].code,
                            "ReturnOrderTypeId": $scope.ReturnOrderTypeId,
                            "ReturnOrderTypeCode": $scope.ReturnOrderTypeCode,
                            "ReturnOrderTypeName": $scope.ReturnOrderTypeName,
                            "Mobile": obj[i].subOrder ? obj[i].subOrder.mobile : undefined,
                            "ConsigneeName": obj[i].subOrder ? obj[i].subOrder.consignee : undefined,
                            "ConsigneeAddress": obj[i].subOrder ? obj[i].subOrder.address : undefined,
                            "IsObsolete": obj[i].isobsolete ? obj[i].isobsolete : false,
                            "AmountActual": 0,
                            "OffsetAmount": 0,
                            "IsCod": obj[i].iscod ? obj[i].iscod : false,
                            "IsAbnormal": obj[i].isabnormal ? obj[i].isabnormal : false,
                            "IsCreateNoticed": false,
                            "IsQuickRefund": false,
                            "IsRefund": false,
                            "IsReplace": false,
                            "IsPrime": false,
                            "Quantity": 0,
                            "IsPush": false,
                            "IsScan": false,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false,
                            "Details" : [],
                            "OutDetails" : []
                        };
                        //退入商品
                        for(var item in indata){
                            if(item == obj[i].orderid){
                                data.Details = indata[item];
                            }
                        }
                        //换出商品
                        for(var item1 in outdata){
                            if(item1 == obj[i].orderid && item1 != "0"){
                                data.OutDetails = outdata[item1];
                                for(var i = 0,j = outdata["0"].length;i < j;i++){
                                    data.OutDetails.push(outdata["0"][i]);
                                }
                            }
                        }
                        if(data.Details.length > 0){
                            tmpData.push(data);
                        }
                    }
                    return tmpData;
                },
                //格式化退入商品的数据格式
                forMatReturnData : function(){
                    var tmpData = {};
                    var data ={};
                    for(var i = 0,j = $scope.returnGoods.length;i < j;i++){
                        data = {
                            "Id": 0,
                            "CreateDate": new Date().format('yyyy-MM-dd H:m:s'),
                            "ReturnOrderId": 0,
                            "ProductId": $scope.returnGoods[i]['productid'],
                            "ProductCode": $scope.returnGoods[i]['productcode'],
                            "ProductName": $scope.returnGoods[i]['productname'],
                            "SkuId": $scope.returnGoods[i]['productskuid'],
                            "SkuName": $scope.returnGoods[i]['skuname'],
                            "SkuCode": $scope.returnGoods[i]['skucode'],
                            "Quantity": $scope.returnGoods[i]['quantity'],
                            "ActualAmount": 149,
                            "PriceOriginal": $scope.returnGoods[i]['priceoriginal'],
                            "OffsetAmount": 0,
                            "RefundAmount": 149,
                            "SalesOrderCode": $scope.returnGoods[i]['code'] ? $scope.returnGoods[i]['code'] : 0,
                            "TradeId": $scope.returnGoods[i]['tradeid'] ? $scope.returnGoods[i]['tradeid'] : 0,
                            "SalesOrderDetailId": $scope.returnGoods[i]['detailid'] ? $scope.returnGoods[i]['detailid'] : 0,
                            "SalesOrderId": $scope.returnGoods[i]['salesorderid'],
                            "IsCombproduct": $scope.returnGoods[i]['iscombproduct'],
                            "IsSplit": $scope.returnGoods[i]['issplit'],
                            "SourceSkuCode": $scope.returnGoods[i]['skucode'],
                            "SpareParts": false,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        };
                        //判断是否是订单里面的商品
                        if($scope.returnGoods[i].salesorderid){
                            //是否已经存在包含此商品的顶单数据
                            if(!tmpData[$scope.returnGoods[i].salesorderid]){
                                tmpData[$scope.returnGoods[i].salesorderid] = [];
                            }
                            tmpData[$scope.returnGoods[i].salesorderid].push(data);
                        }else{
                            //新增的退入商品数据
                            if(!tmpData['0']){
                                tmpData['0'] = [];
                            }
                            tmpData['0'].push(data);
                        }
                    }
                    return tmpData;
                },
                //格式化换出商品信息
                forMatSwapOutData : function (){
                    var tmpData = {};
                    var data ={};
                    for(var i = 0,j = $scope.changeOutProduct.length; i < j;i++){
                        data = {
                            "Id": 0,
                            "CreateDate": new Date().format('yyyy-MM-dd H:m:s'),
                            "ReturnOrderId": 0,
                            "ProductId": $scope.changeOutProduct[i]['productid'],
                            "ProductCode": $scope.changeOutProduct[i]['productcode'],
                            "ProductName": $scope.changeOutProduct[i]['productname'],
                            "SkuId": $scope.changeOutProduct[i]['productskuid'],
                            "SkuName": $scope.changeOutProduct[i]['skuname'],
                            "SkuCode": $scope.changeOutProduct[i]['skucode'],
                            "Quantity": $scope.changeOutProduct[i]['quantity'],
                            "ActualAmount": 0,
                            "IsCombproduct": $scope.changeOutProduct[i]['iscombproduct'],
                            "IsSplit": $scope.changeOutProduct[i]['issplit'],
                            "CanSales": 9975,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        };
                        //判断是否是订单里面的商品
                        if($scope.changeOutProduct[i].salesorderid){
                            //是否已经存在包含此商品的顶单数据
                            if(!tmpData[$scope.changeOutProduct[i].salesorderid]){
                                tmpData[$scope.changeOutProduct[i].salesorderid] = [];
                            }
                            tmpData[$scope.changeOutProduct[i].salesorderid].push(data);
                        }else{
                            //新增的换出商品数据
                            if(!tmpData['0']){
                                tmpData['0'] = [];
                            }
                            tmpData['0'].push(data);
                        }
                    }
                    return tmpData;
                },
                //重置数据
                reset : function () {
                    $scope.orderList ={};
                    $scope.orderChosed = [];
                    $scope.orderDetailsProduct = {};
                    this.clearArray($scope.orderListDetails);
                    this.clearArray($scope.returnGoods);
                    this.clearArray($scope.changeOutProduct);
                    this.clearArray($scope.returnGoodsChosed);
                    $scope.ExpressNo = '';
                    $scope.ExpressName = '';
                    $scope.note = '';
                    $scope.code = '';
                    $scope.wareHouseIn = '';
                    $scope.allocation = '';
                    $scope.returnStyle ='';
                },
                //清空数组元素
                clearArray : function (obj) {
                    var len = obj.length;
                    obj.splice(0,len);
                },
                //确认搜索
                searchConfirm : function (){
                    quitGoodsScanService.quitGoodsScanDeal.getskuCodeDeal($scope,$scope.formData);
                },
                //取消搜索
                searchCancle : function (){
                    $scope.formData = {};
                    quitGoodsScanService.quitGoodsScanDeal.getskuCodeDeal($scope,$scope.formData);
                },
                //关闭模态框
                closeModal : function () {
                    $('.modal').modal('hide');
                }
            };

        }
    ]);