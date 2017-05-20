/**
 * 创建了一个indexController
 * */
angular.module("klwkOmsApp")
    .controller("orderDetailController", ["$scope","$rootScope","toolsService","orderDetailService","orderListService","ApiService","validateService",
        function ($scope,$rootScope,toolsService,orderDetailService,orderListService,ApiService,validateService) {
            //获取传递过来的订单参数
            $scope.orderid= $rootScope.params.orderid;

            //操作权限检查
            $scope.operateCheck = {

                //订单操作权限
                orderStatusCheck : function (list) {
                    //订单锁定检查
                    this.orderLockCheck(list);

                    //作废检查
                    this.orderObsoleteCheck(list);

                    //重置状态检查
                    this.orderResetStatusCheck(list);

                    //退换货单检查
                    this.orderCreateRetrunBillCheck(list);

                    //修改地址检查
                    this.orderChangeSAddressCheck(list);
                },
                //商品操作权限判断
                productCheck : function (list) {
                    this.productObsoleteCheck(list);
                },
                //取消退款检查(作废或未退款的明细不能取消退款)
                cancelDetailCheck : function (list) {
                    if(!list.isdeleted && list.isrefunded){
                        return true;
                    }
                    return false;
                },
                //取消配货单明细验证(只有代发货的可以取消)
                cancleBillDetailsCheck : function (list) {
                    if(list.status == 0){
                        return true;
                    }
                    return false;
                },
                //取消配货单验证（只有已生成或已通知的才可以取消）
                cancleDispatchCheck : function (list) {
                      if(list.status == 0 || list.status == 2){
                          return true;
                      }
                    return false;
                },
                //作废商品明细检查（已作废不可再作废，已配货和已发货的不可再作废）
                productObsoleteCheck : function (list) {
                    if(list.status == 0 && !list.isdeleted){
                        return true;
                    }else{
                        return false;
                    }
                },
                //修改收货地址权限(已锁定，且状态不是已部分发货或全部发货)
                orderChangeSAddressCheck : function (list) {
                    if(list.lockedusername == ApiService.getBasicParamobj().UserName && list.status != 31 && list.status != 32){
                        $scope.canChagneAddress = true;
                    }else{
                        $scope.canChagneAddress = false;
                    }
                },
                //锁定检查
                orderLockCheck : function (list) {
                    //检查是否可以锁定(没有人锁定的订单，就可以作废)
                    if(!list.islock){
                        $scope.orderCanLocked = true;
                    }else{
                        $scope.orderCanLocked = false;
                    }
                },
                //作废检查
                orderObsoleteCheck : function (list) {
                    //“新建”、“审核通过”、“审核异常”可以直接操作作废（且为操作本人锁定的“锁定”状态订单,并且没有作废)
                    if(list.lockedusername == ApiService.getBasicParamobj().UserName && !list.isobsolete){
                        if(list.status == 0 || list.status == 10 || list.status == 11){
                            $scope.orderCanObsolete = true;
                        }else{
                            $scope.orderCanObsolete = false;
                        }
                    }else{
                        $scope.orderCanObsolete = false;
                    }
                },
                //重置状态检查
                orderResetStatusCheck : function (list) {
                    //重置状态检查（“审核通过”、“自动配货异常”、“审核异常”的订单（且为操作本人锁定的“锁定”状态订单，并且不为作废订单)）
                    if(list.lockedusername == ApiService.getBasicParamobj().UserName && !list.isobsolete){
                        if(list.status == 11 || list.status == 21 || list.status == 10){
                            $scope.orderCanResetStatus = true;
                        }else{
                            $scope.orderCanResetStatus = false;
                        }
                    }else{
                        $scope.orderCanResetStatus = false;
                    }
                },
                //是否可以生成退换货单检查
                orderCreateRetrunBillCheck : function (list) {
                    //是否可以生成退换货单检查（没有作废的部分发货和已全部发货的可以生成退换货单）
                    if((list.status == 31 || list.status == 32) && !list.isobsolete){
                        $scope.canCreateQuitBill = true;
                    }else{
                        $scope.canCreateQuitBill = false;
                    }
                }

            };

            //界面初始化
            orderDetailService.orderDetailDomOperate.domInit($scope,$scope.orderid);
            $scope.domOperate = {
                //修改收货地址
                changeAddress : function () {
                    $scope.addressInputShow = true;
                    $scope.goodsReception.CustomerName = $scope.order.customername;
                    $scope.goodsReception.BuyerEmail = $scope.order.buyeremail;
                    $scope.goodsReception.Consignee = $scope.order.subOrder.consignee;
                    $scope.goodsReception.ZipCode = $scope.order.subOrder.zipcode;
                    $scope.goodsReception.Contacter = $scope.order.subOrder.contacter;
                    $scope.goodsReception.Telephone = $scope.order.subOrder.telephone;
                    $scope.goodsReception.Mobile = $scope.order.subOrder.mobile;
                    $scope.goodsReception.Fax = $scope.order.subOrder.fax;
                    $scope.goodsReception.customershipdate = $scope.order.subOrder.customershipdate;
                    $scope.goodsReception.Address = $scope.order.subOrder.address;
                    $scope.goodsReception.NationalName = $scope.order.subOrder.nationalname;
                    $scope.goodsReception.NationalId = $scope.order.subOrder.nationalid;
                    $scope.goodsReception.NationalCode = $scope.order.subOrder.nationalcode;
                    $scope.goodsReception.ProvinceName = $scope.order.subOrder.provincename;
                    $scope.goodsReception.ProvinceId = $scope.order.subOrder.provinceid;
                    $scope.goodsReception.ProvinceCode = $scope.order.subOrder.provincecode;
                    $scope.goodsReception.CityName = $scope.order.subOrder.cityname;
                    $scope.goodsReception.CityId = $scope.order.subOrder.cityid;
                    $scope.goodsReception.CityCode = $scope.order.subOrder.citycode;
                    $scope.goodsReception.CountyName = $scope.order.subOrder.countyname;
                    $scope.goodsReception.CountyId = $scope.order.subOrder.countyid;
                    $scope.goodsReception.CountyCode = $scope.order.subOrder.countycode;
                    $scope.pullInfo.country.setValue({id:$scope.order.subOrder.nationalid ,name : $scope.order.subOrder.nationalname});
                    $scope.pullInfo.province.setText($scope.order.subOrder.provincename);
                    $scope.pullInfo.city.setText($scope.order.subOrder.cityname);
                    $scope.pullInfo.district.setText($scope.order.subOrder.countyname);
                },
                //取消修改收货地址
                addGoodsReceptionCancle : function () {
                    $scope.addressInputShow = false;
                },
                //确定修改收货地址
                addGoodsReceptionConfirm : function () {
                    //检查输入的合法性
                    if(!validateService.validateAll('#orderDetail','.addReceivePage'))return false;
                    orderDetailService.orderDetailInterfaceDeal.changeAddressDeal($scope);
                },
                //添加订单标记
                addTag : function (tag,type,list){
                    if(type){
                        orderDetailService.orderDetailInterfaceDeal.addTagDeal($scope,$scope.productChosed,$scope.order.orderid,tag.name);
                    }else{
                        var tmp = [];
                        tmp.push(list.detailid);
                        orderDetailService.orderDetailInterfaceDeal.addTagDeal($scope,tmp,$scope.order.orderid,tag.name);
                    }
                },
                //选中多条商品明细
                productChose : function (list) {
                    var obj = $scope.productDetails;
                    //判断是否有选中的商品明细
                    var hasChosed = false;
                    //选中状态改变
                    list.trShow = !list.trShow;
                    //取消退款是否可以操作
                    $scope.productCancleRefund = true;
                    //作废是否可以操作
                    $scope.productCanObsolete = true;
                    //全选标志
                    $scope.productCheckAll = true;
                    for(var i = 0,j = obj.length;i < j;i++){
                        //有一条没有选中，全选都不会点亮
                        if(!obj[i].trShow){
                            $scope.productCheckAll = false;
                        }else{
                            hasChosed = true;
                            //检查是否可以作废
                            if(!$scope.operateCheck.productObsoleteCheck(obj[i])){
                                $scope.productCanObsolete = false;
                            }
                            //检查是否可以取消退款
                            if(!$scope.operateCheck.cancelDetailCheck(obj[i])){
                                $scope.productCancleRefund = false;
                            }
                        }
                    }
                    //没有选中的商品明细，不可以作废或退款
                    if(!hasChosed){
                        $scope.productCanObsolete = false;
                        $scope.productCancleRefund = false;
                    }
                },
                //全选
                detailsSelectAll : function () {
                    var obj = $scope.productDetails;
                    if($scope.productCheckAll){
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = false;
                        }
                        //作废和取消退款不可操作
                        $scope.productCanObsolete = false;
                        $scope.productCancleRefund = false;
                    }else{
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = true;
                            //检查是否可以作废
                            if(!$scope.operateCheck.productObsoleteCheck(obj[i])){
                                $scope.productCanObsolete = false;
                            }
                            //检查是否可以取消退款
                            if(!$scope.operateCheck.cancelDetailCheck(obj[i])){
                                $scope.productCancleRefund = false;
                            }
                        }
                    }
                    $scope.productCheckAll = !$scope.productCheckAll;
                },
                //作废商品
                obsoluteProduct : function (type,list,event) {
                    var ids = [];
                    if(type){
                        ids = this.getDetailsId();
                        orderDetailService.orderDetailInterfaceDeal.obsoleteProductDeal($scope,ids,$scope.order.orderid);
                    }else{
                        if($(event.target).hasClass('clickDisabled')) return false;
                        ids.push(list.detailid);
                        orderDetailService.orderDetailInterfaceDeal.obsoleteProductDeal($scope,ids,$scope.order.orderid);
                    }
                },

                /**
                 * 列表复选框选择
                 * @param myEvent
                 * @param list 一条数据
                 * @param obj 所有数据
                 */
                listChose : function (myEvent,list,obj) {
                    //全选标志
                    var choseAll = true;
                    list.trShow = !list.trShow;
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(!obj[i].trShow){
                            choseAll = false;
                            break;
                        }
                    }
                    return choseAll;
                },
                //全选
                selectAll : function (obj,choseAll) {
                    if(choseAll){
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = false;
                        }
                    }else{
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = true;
                        }
                    }
                    choseAll = !choseAll;
                    return choseAll;
                },
                //配货信息选择
                allocationChose : function (myEvent,list) {
                    var obj = $scope.allocation;
                    $scope.allocationChoseAll = this.listChose(myEvent,list,obj);
                },
                //配货信息全选
                allocationChoseAll : function () {
                    var obj = $scope.allocation;
                    $scope.allocationChoseAll = this.selectAll(obj,$scope.allocationChoseAll);
                },
                //配货单明细选择
                allocationDetailsChose : function (myEvent,list) {
                    var obj = $scope.AllocationsDetails;
                    $scope.allocationDetailsChoseAll = this.listChose(myEvent,list,obj);
                },
                //配货单明细全选
                allocationDetailsChoseAll : function (myEvent,list) {
                    var obj = $scope.AllocationsDetails;
                    $scope.allocationDetailsChoseAll = this.selectAll(obj,$scope.allocationDetailsChoseAll);
                },
                //批量取消配货
                allocationBatchCancle : function () {
                    //等待后台添加接口
                    alert('等待后台添加接口');
                },
                //批量取消明细
                batchCancleAllocationDetails : function () {
                    alert('等待后台添加接口');
                },
                //取消配货
                allocationCancle : function (list,event) {
                    event.stopPropagation();
                    if(!$scope.operateCheck.cancleDispatchCheck(list)){
                        toolsService.alertMsg('只有已生成或已通知状态的配货通知单才能取消！');
                    }else{
                        $scope.modal.confirm = function (reason) {
                            orderDetailService.orderDetailInterfaceDeal.allocationCancleDeal($scope,list.id,reason,$scope.order.orderid);
                            $('.info-get-modal').modal('hide');
                        };
                        $('.info-get-modal').modal('show');
                    }
                },
                //获取配货订单的配货明细
                getAllocationsDetails  : function (list) {
                    $scope.productClickChose = list;
                    orderDetailService.orderDetailInterfaceDeal.getAllocationsDetailsDeal($scope,list.id);
                    orderDetailService.orderDetailInterfaceDeal.getExpressDeal($scope,list.id);
                },
                //取消配货单明细
                cancleAllocationDetails  : function (list) {
                    if(!$scope.operateCheck.cancleBillDetailsCheck(list)){
                        toolsService.alertMsg('只有待发货的可以取消明细！');
                    }else{
                        $scope.modal = {
                            title : '请输入取消原因',
                            confirm : function (reason){
                                $('.info-get-modal').modal('hide');
                                orderDetailService.orderDetailInterfaceDeal.cancleAllocationsDetailsDeal($scope,list.dispatchorderid,list.id,reason);
                            }
                        };
                        $('.info-get-modal').modal('show');
                    }
                },
                //获取仓库状态
                getWareHouseStatus : function (){
                    if(!$scope.productClickChose){
                        toolsService.alertMsg('请选择一条记录！');
                    }else{
                        orderDetailService.orderDetailInterfaceDeal.getwmsDeal($scope,$scope.productClickChose.id);
                    }
                },
                //新增发票
                addInvoice : function () {
                    $scope.invoiceDetailsShow = true;
                },
                //确认新增发票
                addInvoiceDetailsConfirm  : function (){
                    //检查输入是否合法
                    if(!validateService.validateAll('#orderDetail','.addInvoicePage')) return false;
                    orderDetailService.orderDetailInterfaceDeal.addInvoiceDeal($scope,$scope.order.orderid);
                },
                //删除发票明细
                delteInvoice : function (list){
                    orderDetailService.orderDetailInterfaceDeal.deleteInvoiceDeal($scope,list.invoiceid);
                },
                //取消退款
                cancleRefund : function (type,list){
                    if(type){
                        var ids = this.getDetailsId();
                        orderDetailService.orderDetailInterfaceDeal.cancleRefundDeal($scope,ids);
                    }else{
                        var tmp = [];
                        tmp.push(list.detailid);
                        orderDetailService.orderDetailInterfaceDeal.cancleRefundDeal($scope,tmp);
                    }
                },
                //锁定订单
                lockOrder : function (){
                    var tmp = [];
                    tmp.push($scope.order);
                    orderDetailService.orderDetailInterfaceDeal.lockOrderDeal($scope,tmp);
                },
                //作废订单
                obsoleteOrder : function (){
                    var tmp = [];
                    tmp.push($scope.order);
                    orderDetailService.orderDetailInterfaceDeal.obsoleteOrderDeal($scope,tmp);
                },
                //重置状态
                resetStatus : function (){
                    var tmp = [];
                    tmp.push($scope.order);
                    orderDetailService.orderDetailInterfaceDeal.resetOrderStatusDeal($scope,tmp);
                },
                //添加内部标签
                insideLabel : function () {
                    $scope.modal = {
                        title : '请输入内容',
                        confirm : function (reason){
                            $('.info-get-modal').modal('hide');
                            orderDetailService.orderDetailInterfaceDeal.addInsideTagDeal($scope,$scope.order,reason);
                        }
                    };
                    $('.info-get-modal').modal('show');
                },
                //生成退款单
                createRefundBill : function (title,url) {
                    var index = $('#orderDetail').closest('[data-index]').attr('data-index');
                    $rootScope.params = {
                        orderid : $scope.order.orderid,
                        refundId : 0,
                        from : {
                            url : 'orderDetail.html',
                            title : '订单详情'
                        }
                    };
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //生成退换货单
                createQuitOrExchangeBill : function(){
                    function toCreateBill () {
                        $rootScope.params = {
                            orderid : $scope.order.orderid,
                            type : 'formOrder'
                        };
                        var index = $('#orderDetail').closest('[data-index]').attr('data-index');
                        $scope.option[index].url = '../template/orderManage/addQuitExchangeGoodsBill.html';
                        $scope.option[index].name = '订单详情：生成退换货单';
                    }
                    //判断该订单是否已经存在于退货单或换货单中
                    orderDetailService.orderDetailInterfaceDeal.orderCanCreateBill($scope,$scope.order.code,$scope.order.tradeid,function (result) {
                        var text = '';
                        if(result.promise0){
                            text = '订单存在于退换货单中，是否继续？';
                        }else if(result.promise1){
                            text = '订单存在于换货单中，是否继续？';
                        }
                        if(text == ''){
                            toCreateBill();
                        }else{
                            toolsService.alertConfirm({
                                "msg":text,
                                okBtn : function(){
                                    toCreateBill();
                                },
                                cancelBtn :  function(){
                                }
                            });
                        }
                    });

                },
                //复制订单
                copyOrder : function (list){
                    $rootScope.params = {
                        type : 'copy',
                        orderid : $scope.order.orderid,
                        productid : list.productid
                    };
                    var index = $('#orderDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/addOrder.html';
                    $scope.option[index].name = '订单详情：复制订单';
                },
                //切换tab栏
                switchTab : function (content) {
                    if(content == 'third'){
                        //操作日志信息
                        orderDetailService.orderDetailInterfaceDeal.getLogDeal($scope,$scope.order.orderid);
                    }else if(content == 'second'){
                        //配货信息
                        orderDetailService.orderDetailInterfaceDeal.getAllocationsDeal($scope,$scope.order.orderid);
                    }
                    $scope.tab = content;
                },
                //返回到订单列表
                backTolist : function () {
                    $rootScope.params = {};
                    var index = $('#orderDetail').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/orderList.html';
                    $scope.option[index].name = '订单列表';
                },
                //查看库存
                viewInventory : function (list) {
                    $scope.productInventoryChose = list;
                    orderDetailService.orderDetailInterfaceDeal.repertoryConfig($scope,list.skucode);
                },
                //查看订单占用明细
                showOrderOccupy : function (list){
                    orderDetailService.orderDetailInterfaceDeal.getOrderOccupy($scope,list.warehouseid,list.skuid);
                },
                //获取选中商品的id
                getDetailsId : function () {
                    var DetailsObj = $scope.productDetails;
                    var ids = [];
                    //判断是否有商品被选中
                    for(var i =0,j = DetailsObj.length;i < j;i++){
                        if(DetailsObj[i].trShow){
                            ids.push(DetailsObj[i].detailid);
                        }
                    }
                    return ids;
                }
            };

        //进入页面需要执行的方法
        function init() {
            //加载下拉框
            //$('#orderDetail').selectPlug();

            // 订单详情
            var orderDetailId = "#orderDetail";

            //更多
            $(orderDetailId + ' .detail-top-operation-more').off('click').on('click', function (e) {
                e.stopPropagation();
                $(this).parent().siblings('.operation-more-btn').toggleClass('hide');
                if (!$(this).parent().siblings('.operation-more-btn').hasClass('hide')) {
                    $(document).on('click', function (event) {
                        if (!$('.operation-more-btn').is(event.target) && $('.operation-more-btn').has(event.target).length === 0) {
                            $('.operation-more-btn').addClass('hide');
                        }
                    });
                }
            });
            $(orderDetailId + ' .operation-more-btn').off('click').on('click', 'span', function () {
                if ($(this).hasClass('current')) {
                    $(this).removeClass('current').siblings().removeClass('current');
                } else {
                    $(this).addClass('current').siblings().removeClass('current');
                }
                /*$('.operation-more-btn').addClass('hide');*/
            });
        }
        init();
        //tab栏切换函数
        $scope.isShow= function (content) {
            $scope.tab = content;
        };

    }]);
