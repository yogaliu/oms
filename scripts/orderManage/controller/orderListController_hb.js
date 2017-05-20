/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("orderListController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService",'orderListService',"ApiService","APP_MENU",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService ,orderListService,ApiService,APP_MENU) {

            //页面初始化
            orderListService.orderListDomOperate.domInit($scope);

            //列表配置Hover函数
            $rootScope.isHover = function () {
                $rootScope.listAllocationHover = !$rootScope.listAllocationHover;
            };
            //dom操作
            $scope.domOperate = {
                //右侧列表配置
                listAllocation : function () {
                    $("#"+$scope.allocation.timestamp).show();
                },
                /**
                 * 高级条件筛选
                 * @param orderstatus 筛选条件的各个值
                 */
                conditionSetting : function(orderstatus){
                    orderListService.orderListDomOperate.conditionSetting($scope,orderstatus.type,orderstatus.tag,orderstatus.re,orderstatus.name);
                },
                /**
                 * 根据首字母筛选所需信息
                 * @param letter
                 * @param type
                 */
                selectStoresByFirstLetter : function (letter,type){
                    orderListService.orderListDomOperate.selectStoresByFirstLetter($scope,letter,type);
                },
                //获取上一页数据
                prevPage : function(){
                    orderListService.orderListDomOperate.prevPage($scope);
                },
                //获取下一页数据
                nextPage : function (){
                    orderListService.orderListDomOperate.nextPage($scope);
                },
                //高级筛选确定事件
                advanceSearchConfirm : function (myEvent) {
                    $scope.formData1 = $.extend(false,$scope.formData1,$scope.formChoseData);
                    //重新请求订单数据
                    orderListService.OrderListInterface.getOrderList($scope);
                    //高级搜索隐藏
                    $scope.advancedSearch = false;
                },
                //高级筛选取消事件
                advanceSearchCancle : function(myEvent) {
                    for(var key in $scope.formChoseData){
                        delete $scope.formChoseData[key];
                    }
                    for(var key1 in $scope.formData1){
                        delete $scope.formData1[key1];
                    }
                    //重新请求订单数据
                    orderListService.OrderListInterface.getOrderList($scope);
                    //高级搜索隐藏
                    $scope.advancedSearch = false;
                },
                //高级筛清空事件
                advanceSearchClear : function () {
                    for(var key in $scope.formChoseData){
                        delete $scope.formChoseData[key];
                    }
                    for(var key1 in $scope.formData1){
                        delete $scope.formData1[key1];
                    }
                },
                //清空已选中的筛选条件
                clearChoseCondition : function (type,list){
                    //将已经筛选的条件，点击叉号删掉已经存在的对应状态可以恢复到未选中状态
                    delete $scope.orderListCollect.searchConditions[type];
                    delete $scope.orderListCollect.searchHformData[type];
                    delete $scope.formChoseData[list.filed];
                },
                //选中订单列表
                orderListChose : function (myEvent,list){
                    var obj = $scope.orderListTbody;
                    list.trShow = !list.trShow;
                    //全选标志
                    $scope.checkAll = true;
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(!obj[i].trShow){
                            $scope.checkAll = false;
                            break;
                        }
                    }
                },
                //全选
                selectAll : function () {
                    var obj = $scope.orderListTbody;
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
                //跳到新增页面
                jumpToNew : function (title,url) {
                    $rootScope.params = {};
                    var index = $('#orderList').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //跳到订单详情界面
                jumpToDetails : function (title,url,list) {
                    $rootScope.params = {
                        orderid : list.orderid
                    };
                    var index = $('#orderList').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //获取商品详细信息
                getProductDetails : function (list){
                    orderListService.OrderListInterface.getProductDetails($scope,list.code);
                },
                //根据筛选条件获取商品信息
                searchConfirm : function (){
                    orderListService.OrderListInterface.getskuCode($scope);
                },
                //取消筛选条件
                searchCancle : function () {
                    $scope.productSearch = {};
                    orderListService.OrderListInterface.getskuCode($scope);
                },
                //选中那些规格的商品新增
                skuChose : function(myEvent,list){
                    if($scope.productChosed.contains(list) != -1){
                        $scope.productChosed.removeByValue(list);
                    }else{
                        $scope.productChosed.push(list);
                    }
                    toolsService.isLabelSel($scope,myEvent);
                },
                //保存已经选中的商品信息
                saveProduct : function(){
                    var tes = $scope.orderAddGift;
                    for(var x = 0,y = tes.length;x < y;x++){
                        tes[x]['issplitforce'] = true;
                        tes[x]['deliveryinfo'] = {
                            "deliveryid": 0,
                            "deleted": false,
                            "isnew": false,
                            "isupdate": false
                        };
                    }
                    var obj = $scope.productChosed;
                   for(var i = 0,j = obj.length;i < j;i++){
                       obj[i]['detailid'] = 0;
                       obj[i]['createdate'] = new Date().format('YYYY-MM-DD hh:mm:ss');
                       obj[i]['salesorderid'] = 0;
                       obj[i]['firstcost'] = obj[i]['costprice'];
                       obj[i]['priceoriginal'] = obj[i]['wholesaleprice'];
                       //客户端可以多次双击添加数量，网页只能选中一条，这里需要修改
                       obj[i]['quantity'] = 1;
                       obj[i]['cansalequantity'] = 0;
                       obj[i]['discountamount'] = 0;
                       obj[i]['priceselling'] = 0;
                       obj[i]['amount'] = 0;
                       obj[i]['amountactual'] = 0;
                       obj[i]['isabnormal'] = false;
                       obj[i]['skucode'] = obj[i]['code'];
                       obj[i]['isrefunded'] = false;
                       obj[i]['isrefundfinished'] = false;
                       obj[i]['isabnormal'] = false;
                       obj[i]['isdeleted'] = false;
                       obj[i]['isrefunded'] = false;
                       obj[i]['isrefundfinished'] = false;
                       obj[i]['isoutofstock'] = false;
                       obj[i]['distributionamount'] = 0;
                       obj[i]['weight'] = obj[i]['weight'];
                       obj[i]['ismanual'] = true;
                       obj[i]['reissueactual'] = 0;
                       obj[i]['productskuid'] = obj[i]['skuid'];
                       obj[i]['skucode'] = obj[i]['code'];
                       obj[i]['skuname'] = obj[i]['description'];
                       obj[i]['detailtype'] = 2;
                       obj[i]['iscombproduct'] = obj[i]['iscombined'];
                       obj[i]['refundstatus'] = 0;
                       obj[i]['issplit'] = obj[i]['issplit'];
                       obj[i]['isselected'] = false;
                       obj[i]['isdeleted'] = obj[i]['deleted'];
                       obj[i]['isnew'] = false;
                       obj[i]['isupdate'] = false;
                   }
                    //添加赠品
                    if($scope.giftConfig == 'giftAdd'){
                        orderListService.OrderListInterface.addGift($scope,tes,$scope.productChosed);
                    //删除赠品
                    }else if($scope.giftConfig == 'giftDel'){
                        orderListService.OrderListInterface.deleteGift($scope,tes,$scope.productChosed);
                    }
                },
                //选择订单的三种状态
                threeSelect : function (myEvent,type) {
                    toolsService.isThreeSel($scope, myEvent, function (selType) {
                        $scope.formData[type] = selType;
                        //重置为第一页
                        $scope.paginationConf.currentPage = 1;
                        orderListService.OrderListInterface.getOrderList($scope);
                    });
                },
                //根据筛选条件获取套装信息
                suitSearchConfirm : function () {
                    orderListService.OrderListInterface.getSuit($scope);
                },
                //取消筛选条件获取套装信息
                suitSearchCancle : function () {
                    $scope.suit = {};
                    orderListService.OrderListInterface.getSuit($scope);
                },
                //选中与取消套装商品
                suitChose : function (myEvent,list) {
                    if($scope.suitChose.contains(list) != -1){
                        $scope.suitChose.removeByValue(list);
                        delete $scope.suitDetails[list.productid];
                    }else{
                        $scope.suitChose.push(list);
                        //获取套装明细
                        orderListService.OrderListInterface.getSuitDetails($scope,list.skuid,list.skuid);
                    }
                    toolsService.isLabelSel($scope,myEvent);
                },
                //保存添加套装
                saveSuit : function () {
                    var tes = $scope.orderAddGift;
                    for(var x = 0,y = tes.length;x < y;x++){
                        tes[x]['issplitforce'] = true;
                        tes[x]['deliveryinfo'] = {
                            "deliveryid": 0,
                            "deleted": false,
                            "isnew": false,
                            "isupdate": false
                        };
                    }
                    var obj = $scope.productChosed;
                    for(var i = 0,j = obj.length;i < j;i++){
                        obj[i]['detailid'] = 0;
                        obj[i]['createdate'] = new Date().format('YYYY-MM-DD hh:mm:ss');
                        obj[i]['salesorderid'] = 0;
                        obj[i]['firstcost'] = obj[i]['costprice'];
                        obj[i]['priceoriginal'] = obj[i]['wholesaleprice'];
                        //客户端可以多次双击添加数量，网页只能选中一条，这里需要修改
                        obj[i]['quantity'] = 1;
                        obj[i]['cansalequantity'] = 0;
                        obj[i]['discountamount'] = 0;
                        obj[i]['priceselling'] = 0;
                        obj[i]['amount'] = 0;
                        obj[i]['amountactual'] = 0;
                        obj[i]['isabnormal'] = false;
                        obj[i]['skucode'] = obj[i]['code'];
                        obj[i]['isrefunded'] = false;
                        obj[i]['isrefundfinished'] = false;
                        obj[i]['isabnormal'] = false;
                        obj[i]['isdeleted'] = false;
                        obj[i]['isrefunded'] = false;
                        obj[i]['isrefundfinished'] = false;
                        obj[i]['isoutofstock'] = false;
                        obj[i]['distributionamount'] = 0;
                        obj[i]['weight'] = obj[i]['weight'];
                        obj[i]['ismanual'] = true;
                        obj[i]['reissueactual'] = 0;
                        obj[i]['productskuid'] = obj[i]['skuid'];
                        obj[i]['skucode'] = obj[i]['code'];
                        obj[i]['skuname'] = obj[i]['description'];
                        obj[i]['detailtype'] = 2;
                        obj[i]['iscombproduct'] = obj[i]['iscombined'];
                        obj[i]['refundstatus'] = 0;
                        obj[i]['issplit'] = obj[i]['issplit'];
                        obj[i]['isselected'] = false;
                        obj[i]['isdeleted'] = obj[i]['deleted'];
                        obj[i]['isnew'] = false;
                        obj[i]['isupdate'] = false;
                    }
                    orderListService.OrderListInterface.addGift($scope,tes,$scope.suitDetails);
                    $('.suit-modal').modal('hide');
                },
                //锁定订单
                orderLock : function (list,event) {
                    if($(event.target).hasClass('clickDisabled')) return false;
                    orderListService.OrderListInterface.lockOrder($scope,list);
                },
                //解锁订单
                orderUnLock : function (list,event){
                    if($(event.target).hasClass('clickDisabled')) return false;
                    orderListService.OrderListInterface.unLockOrder($scope,list);
                },
                //超级解锁
                orderSuperUnlock : function (list,event) {
                    if($(event.target).hasClass('clickDisabled')) return false;
                    orderListService.OrderListInterface.unLockOrder($scope,list);
                },
                //修改订单标记
                changeMark : function (obj,list) {
                    orderListService.OrderListInterface.addOrderLabel($scope,list,obj);
                },
                //修改推荐快递
                changeExpress : function (express,list) {
                    orderListService.OrderListInterface.addCommendExpress($scope,list,express);
                },
                //修改推荐仓库
                changeWareHouse : function (house,list) {
                    orderListService.OrderListInterface.addCommendWareHouse($scope,list,house);
                },
                //留单
                orderLeave : function (list) {
                    orderListService.OrderListInterface.orderLeave($scope,list,'');
                },
                //强制拆单
                forceSplitOrder : function (list) {
                    orderListService.OrderListInterface.forceSplitOrder($scope,list,'');
                },
                //重置状态
                resetStatus : function (list,event) {
                    if($(event.target).hasClass('clickDisabled')) return false;
                    orderListService.OrderListInterface.resetOrderStatus($scope,list,'');
                },
                //作废订单
                obsoleteOrder : function (list,event) {
                    if($(event.target).hasClass('clickDisabled')) return false;
                    orderListService.OrderListInterface.obsoluteOrder($scope,list,'');
                },
                //添加内部标签
                addInsideLabel : function (list) {
                    orderListService.OrderListInterface.addInsideLabel($scope,list,'');
                },
                //审核订单
                auditOrder : function (list,event) {
                    if($(event.target).hasClass('clickDisabled')) return false;
                    orderListService.OrderListInterface.auditOrder($scope,list,'');
                },
                //自动配货
                autoDispatch : function (list,event) {
                    if($(event.target).hasClass('clickDisabled')) return false;
                    orderListService.OrderListInterface.autoDispatch($scope,list,'');
                },
                //手工处理
                manualOrder : function (list){
                    orderListService.OrderListInterface.manualOrder($scope,list,'');
                },
                //个性化包裹
                bagContent : function (list){
                    orderListService.OrderListInterface.bagContent($scope,list,'');
                },
                //加急发货
                speedDelivery : function (list) {
                    orderListService.OrderListInterface.speedDelivery($scope,list,'');
                },
                //物流到付
                expressFee : function (list,type) {
                    var obj = {type : type};
                    orderListService.OrderListInterface.expressFee($scope,list,obj);
                },
                //添加赠品
                getskuCodeInit : function (list,type,event){
                    var obj = {type : type};
                    if($(event.target).hasClass('clickDisabled')) return false;
                    orderListService.OrderListInterface.getskuCodeInit($scope,list,obj);
                },
                //添加套装
                getSuit : function (list,type,event){
                    var obj = {type : type};
                    if($(event.target).hasClass('clickDisabled')) return false;
                    orderListService.OrderListInterface.getSuit($scope,list,obj);
                },
                //生成退换货单
                createQuitOrExchangeBill : function(title,url,list){
                    $rootScope.params = {
                        orderid : list.orderid,
                        type : 'add'
                    };
                    var index = $('#orderList').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //生成退款单
                createRefundBill : function (title,url,list) {
                    $rootScope.params = {
                        orderid : list.orderid,
                        from : {
                            url : 'orderList.html',
                            title : '订单列表'
                        }
                    };
                    var index = $('#orderList').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //复制订单和修改订单
                changeOrder : function (list) {
                    $rootScope.params = {
                        type : 'copy',
                        orderid : list.orderid
                    };
                    var index = $('#orderList').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/addOrder.html';
                    $scope.option[index].name = '订单列表：复制订单';
                },
                //删除赠品
                deleteGift : function (list){
                    orderListService.OrderListInterface.getSkuCodeForDel($scope,list,'');
                },
                //手工配货
                manualDispatch : function (name,url,list,event){
                    if($(event.target).hasClass('clickDisabled')) return false;
                    orderListService.OrderListInterface.getOrderInfoById($scope,list.orderid, function (res) {
                        if(res.success){
                            if(res.data.status > 11){
                                alert('订单已配货');
                            }else{
                                $rootScope.params = {
                                    orderid : list.orderid
                                };
                                var index = $('#orderList').closest('[data-index]').attr('data-index');
                                $scope.option[index].url = url;
                                $scope.option[index].name = name;
                            }
                        }
                    });
                },
                //高级搜索显示
                searchShow : function (content) {
                    $scope.advancedSearch = content;
                },
                //刷新页面
                refresh : function () {
                    orderListService.OrderListInterface.getOrderList($scope);
                },
                //根据商品编码搜索订单
                productSearch : function (event,SkuCode) {
                    //按下enter搜索
                    if(event.keyCode == 13){
                        $scope.formData.SkuCode = SkuCode;
                        orderListService.OrderListInterface.getOrderList($scope);
                    }
                },
                //待人工处理的订单
                manualDealOrder : function () {
                    this.clearAllCondition();
                    $scope.formData1.Status = {
                        filed : 'Status',
                        value : '0,10,21'
                    };
                    //订单状态不可再选择
                    $scope.StatusConfigData.disabled = true;
                    //锁定状态
                    $scope.formData.IsLock = true;
                    //异常订单
                    $scope.formData.IsAbnormal = true;
                    //手工处理
                    $scope.formData.IsManual = true;
                    $scope.orderSetting = 'manualDeal';
                    orderListService.OrderListInterface.getOrderList($scope);
                },
                //已全部完结订单
                completeOrder : function () {
                    this.clearAllCondition();
                    $scope.formData1.Status = {
                        filed : 'Status',
                        value : 32
                    };
                    //订单状态不可再选择
                    $scope.StatusConfigData.disabled = true;
                    $scope.orderSetting = 'completeOrder';
                    orderListService.OrderListInterface.getOrderList($scope);
                },
                //全部订单
                allOrders : function () {
                    this.clearAllCondition();
                    //订单状态可再选择
                    $scope.StatusConfigData.disabled = false;
                    $scope.orderSetting = '';
                    orderListService.OrderListInterface.getOrderList($scope);
                },
                //未完结订单
                notCompleteOrder : function () {
                    this.clearAllCondition();
                    $scope.formData1.Status = {
                        filed : 'Status',
                        value : '11,22,31'
                    };
                    //订单状态不可再选择
                    $scope.StatusConfigData.disabled = true;
                    $scope.orderSetting = 'notComplete';
                    orderListService.OrderListInterface.getOrderList($scope);
                },
                //清空所有搜索条件
                clearAllCondition : function () {
                    for(var key in $scope.formChoseData){
                        delete $scope.formChoseData[key];
                    }
                    for(var key in $scope.formData1){
                        delete $scope.formData1[key];
                    }
                    for(var key in $scope.formData){
                        delete $scope.formData[key];
                    }
                },
                //锁定订单条件判断
                lockCondition : function (list) {
                    if(list.lockedusername){
                        return false;
                    }
                    return true;
                },
                //解锁订单条件判断
                unLocakCondition : function (list){
                    if(list.lockedusername == ApiService.getBasicParamobj().UserName){
                        return true;
                    }
                    return false;
                },
                //是自己锁定的订单，就可以进行操作的订单
                isSelfLock : function (list) {
                    if(list.lockedusername == ApiService.getBasicParamobj().UserName){
                        return true;
                    }
                    return false;
                },
                //修改的条件判断
                changeCondition : function (list) {
                    //“新建”状态且被“锁定”、“未作废”的订单可以操作“修改”
                    if(list.lockedusername == ApiService.getBasicParamobj().UserName && !list.isobsolete){
                        return true;
                    }
                    return false;
                },
                //作废的条件判断
                obsoleteCondition : function (list) {
                    //“新建”、“审核通过”、“审核异常”可以直接操作作废（且为操作本人锁定的“锁定”状态订单
                    // ，未锁定订单需要给出文案提示“请确定是否锁定订单，且为本人锁定”，非本人锁定订单，
                    // 需要提示“订单已被其他用户锁定”），“配货异常”、“已配货”的订单给出文案提示“请先取消配货”
                    if(list.lockedusername == ApiService.getBasicParamobj().UserName && !list.isobsolete){
                        if(list.status == 0 || list.status == 10 || list.status == 11){
                            return true;
                        }
                        return false;
                    }
                    return false;
                },
                //重置状态条件判断
                resetCondition : function (list) {
                    //“审核通过”、“自动配货异常”、“审核异常”的订单（且为操作本人锁定的“锁定”状态订单)
                    if(list.lockedusername == ApiService.getBasicParamobj().UserName && !list.isobsolete){
                        if(list.status == 11 || list.status == 21 || list.status == 10){
                            return true;
                        }
                        return false;
                    }
                    return false;
                },
                //超级解锁条件判断
                superLockCondition  : function (list) {
                    if(list.lockedusername){
                        return true;
                    }
                    return false;
                },
                //赠品添加条件判断
                giftCondition : function (list){
                    //需要判断订单为“新建”状态才能操作
                    if(list.status == 0){
                        return true;
                    }
                    return false;
                },
                //审核条件判断
                auditCondition : function (list){
                    //“新建”状态（排除“作废”的订单）订单且必须先锁定，即为锁定的“新建”状态订单
                    if(list.status == 0 && list.lockedusername == ApiService.getBasicParamobj().UserName && !list.isobsolete){
                        return true;
                    }
                    return false;
                }
            };

            //退款状态配置
            $scope.refundConfigData = {
                //是否显示搜索和按字母索引数据
                letterClassify : false,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : true,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'订单状态',
                placeHold : '订单状态',
                //后台中对应的字段名称
                filed:'Status',
                list :  toolsService.setDataShowType($scope,APP_MENU['orderStatus'],$scope.orderListCollect.orderStatus,5,true)
            };

            //订单状态配置
            $scope.StatusConfigData = {
                //是否显示搜索和按字母索引数据
                letterClassify : false,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : true,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'订单状态',
                placeHold : '订单状态',
                //后台中对应的字段名称
                filed:'Status',
                list :  toolsService.setDataShowType($scope,APP_MENU['orderStatus'],$scope.orderListCollect.orderStatus,5,true)
            };

            //高级搜索店铺配置
            $scope.storeListConfigData = {
                //是否显示字母搜索
                letterClassify:true,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : true,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'店铺',
                placeHold : '店铺',
                //后台中对应的字段名称
                filed:'StoreId',
                list :  $scope.orderListCollect.storeList
            };

            //高级搜索平台数据配置
            $scope.plantformListConfigData = {
                //是否显示字母搜索
                letterClassify:true,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : true,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'平台类型',
                placeHold : '平台类型',
                //后台中对应的字段名称
                filed:'PlatformType',
                list :  $scope.orderListCollect.platformList
            };

            //高级搜索订单标记数据配置
            $scope.orderSignConfigData = {
                //是否显示字母搜索
                letterClassify:true,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : true,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'订单标记',
                placeHold : '订单标记',
                //后台中对应的字段名称
                filed:'TagName',
                list :  $scope.orderListCollect.orderSign
            };

            //推荐仓库数据配置
            $scope.commendWareHouseConfigData = {
                //是否显示字母搜索
                letterClassify:true,
                //显示更多
                selectMore : true,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'推荐仓库',
                placeHold : '推荐仓库',
                //后台中对应的字段名称
                filed:'SuggestWarehouseId',
                list :  $scope.orderListCollect.commendWareHouse
            };

            //推荐快递数据配置
            $scope.commendExpressConfigData = {
                //是否显示字母搜索
                letterClassify:true,
                //显示更多
                selectMore : true,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'推荐快递',
                placeHold : '推荐快递',
                //后台中对应的字段名称
                filed:'SuggestExpressId',
                list :  $scope.orderListCollect.commendExpress
            };


            //订单类型配置数据
            $scope.TransTypeConfigData = {
                title : '订单类型',
                chosed : $scope.formChoseData,
                filed : 'TransType',
                list :APP_MENU['preOrderType']
            };
            //订单来源配置数据
            $scope.SourceTypeConfigData = {
                title : '订单来源',
                chosed : $scope.formChoseData,
                filed : 'SourceType',
                list :APP_MENU['preOrderSource']
            };
            //预售类型
            $scope.PreSaleTypeConfigData = {
                title : '预售类型',
                chosed : $scope.formChoseData,
                filed : 'PreSaleType',
                list :APP_MENU['preSellType']
            };
            //退款状态
            $scope.RefundStatusConfigData = {
                title : '退款状态',
                chosed : $scope.formChoseData,
                filed : 'RefundStatus',
                list :APP_MENU['preRefundType']
            };
            //配货状态
            $scope.DispatchTypeStatusConfigData = {
                title : '配货状态',
                chosed : $scope.formChoseData,
                filed : 'DispatchTypeStatus',
                list :APP_MENU['preDistributionStatus']
            };
            //发货状态
            $scope.DeliveryTypeStatusConfigData = {
                title : '发货状态',
                chosed : $scope.formChoseData,
                filed : 'DeliveryTypeStatus',
                list :APP_MENU['preDelivery']
            };


            $scope.huangbiaoAction = function(myevent){
                // 获取菜单的HTML代码
                var aaa = $(myevent.target).closest(".operate").children("div.multilevel-menu").children("div.content")[0];
                // 将菜单的HTML代码  移植到 外部，与table 标签同一等级
                $("#huangbiao_content").append(aaa);
                // 将内容显示出来
                $("#huangbiao_content").children("div").css({
                        display: "block"
                });

                $("#huangbiao_content").children("div").children("ul").css({
                    height:"200px",
                    overflow:"auto"
                });

                $("#huangbiao").css({
                    display: "block",
                    position:"absolute",
                    top : $(myevent.target).closest("tr")[0].offsetTop + "px"
                });
            };

            // 显示二级菜单
            $scope.showSecondMenu = function(myevent){
                var currentObj = $(myevent.target);
                var className = currentObj.attr("submenu");
                $(".two_level ul.menu-two").css("display","none");
                $(".two_level").css("display","none");
                if(className != null && className !="" && className != undefined){
                    $(".two_level ul.menu-two"+"."+className).css("display","block");
                    $(".two_level").css("display","block");
                }
            };
}]);
