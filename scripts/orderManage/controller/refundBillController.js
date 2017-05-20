/**
 * Created by zgh on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("refundBillController", ["$scope", "$rootScope", "$state", "WAP_CONFIG","toolsService","refoundBillService","APP_MENU","ApiService",
        function ($scope, $rootScope, $state, WAP_CONFIG,toolsService,refoundBillService,APP_MENU,ApiService) {
            //页面初始化
            refoundBillService.refoundBillDomOperate.domInit($scope);

            //是否可以操作检查
            $scope.operateCheck = {
                //锁定检查（没有锁定的订单可以操作）
                lockOrderCheck : function (list) {
                    if(list.lockedusername){
                        return false;
                    }
                    return true;
                },
                //解锁检查（只可以解锁自己锁定的订单）
                unlockOrderCheck : function (list) {
                    if(list.lockedusername && (list.lockedusername == ApiService.getBasicParamobj().UserName)){
                        return true;
                    }
                    return false;
                },
                //审核检查（只有新建状态下，自己锁定的订单可以审核）
                auditOrderCheck : function (list) {
                    if((list.status == 0) && (list.lockedusername == ApiService.getBasicParamobj().UserName)){
                        return true;
                    }
                    return false;
                },
                //复核检查(只能复核已审核的订单，而且必须是自己锁定的订单)
                reAuditOrderCheck : function (list) {
                    if((list.status == 1) && (list.lockedusername == ApiService.getBasicParamobj().UserName)){
                        return true;
                    }
                    return false;
                },
                //反审检查（锁定的，而且已经审核的可以反审订单）
                auditReturnCheck : function (list) {
                    if((list.status == 1) && (list.lockedusername == ApiService.getBasicParamobj().UserName)){
                        return true;
                    }
                    return false;
                },
                //作废检查(只有新建状态下自己锁定的订单可以作废)
                obsoluteOrderCheck : function(list) {
                    if((list.status == 0) && (list.lockedusername == ApiService.getBasicParamobj().UserName)){
                        return true;
                    }
                    return false;
                },
                //修改检查（只有新建状态下，自己锁定的订单可以修改）
                modifyOrderCheck : function (list) {
                    if((list.status == 0) && (list.lockedusername == ApiService.getBasicParamobj().UserName)){
                        return true;
                    }
                    return false;
                }
            };
            //dom操作
            $scope.domOperate = {
                //锁定
                lockOrder : function (list,event){
                    var ids = [];
                    ids[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    refoundBillService.refoundBillInterfaceDeal.lockRefoundBillDeall($scope,ids);
                },
                //解锁
                unlockOrder : function (list,event) {
                    var ids = [];
                    ids[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    refoundBillService.refoundBillInterfaceDeal.unlockRefoundBillDeall($scope,ids);
                },
                //审核
                auditOrder : function (list,event) {
                    var ids = [];
                    ids[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    refoundBillService.refoundBillInterfaceDeal.auditOrderDeal($scope,ids);
                },
                //复核
                reAuditOrder : function (list,event) {
                    var ids = [];
                    ids[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    refoundBillService.refoundBillInterfaceDeal.reAuditOrderDeal($scope,ids);
                },
                //作废
                obsoluteOrder : function (list,event) {
                    var ids = [];
                    ids[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    refoundBillService.refoundBillInterfaceDeal.obsoluteOrderDeal($scope,ids);
                },
                //标记
                addTag : function (type,msg,list) {
                    var ids = [];
                    ids[0] = list.id;
                    refoundBillService.refoundBillInterfaceDeal.addTagDeal($scope,ids,msg);
                },
                //添加内部标签
                addLabel : function (type,list) {
                    var ids = [];
                    ids[0] = list.id;
                    refoundBillService.refoundBillInterfaceDeal.addLabelDeal($scope,ids);
                },
                //唤醒旺旺
                awakeWW : function () {
                  alert('旺旺已唤醒');
                },
                //详情页面跳转
                jumpToDetails : function (title,url,list) {
                    $rootScope.params = {
                        orderId: list.id,
                        salesorderid : list.salesorderid,
                        code : list.code
                    };
                    var index = $('#refundBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //选中订单与取消订单
                refundChose : function (list) {
                    var obj = $scope.refondBillBody;
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
                sellectAll : function () {
                    var obj = $scope.refondBillBody;
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
                //右侧列表配置
                listAllocation : function () {
                    $("#"+$scope.allocation.timestamp).show();
                },
                //清空已选中的筛选条件
                clearChoseCondition : function (list){
                    delete $scope.formChoseData[list.filed];
                },
                //高级筛清空事件
                advanceSearchClear : function () {
                    for(var key in $scope.formData){
                        delete $scope.formData[key];
                    }
                    for(var key1 in $scope.formChoseData){
                        delete $scope.formChoseData[key1];
                    }
                },
                //高级筛选取消事件
                advanceSearchCancle : function(myEvent) {
                    for(var key in $scope.formData){
                        delete $scope.formData[key];
                    }
                    for(var key1 in $scope.formChoseData){
                        delete $scope.formChoseData[key1];
                    }
                    toolsService.isShow($scope, false, myEvent);
                },
                //高级筛选确定事件
                advanceSearchConfirm : function (myEvent) {
                    //刷新页面数据
                    refoundBillService.refoundBillInterfaceDeal.getRefoundBillDeal($scope);
                    //高级搜索隐藏
                    toolsService.isShow($scope, false, myEvent);
                },
                //选择订单的三种状态
                threeSelect : function (myEvent,type) {
                    toolsService.isThreeSel($scope, myEvent, function (selType) {
                        $scope.formData[type] = selType;
                        //重置为第一页
                        $scope.paginationConf.currentPage = 1;
                        refoundBillService.refoundBillInterfaceDeal.getRefoundBillDeal($scope);
                    });
                },
                //跳到新增页面
                jumpToNew : function (title,url) {
                    $rootScope.params = {
                        from : {
                            url : 'refundBill.html',
                            title : '退款单'
                        }
                    };
                    var index = $('#refundBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //刷新页面
                refresh : function () {
                    refoundBillService.refoundBillInterfaceDeal.getRefoundBillDeal($scope);
                },
                //修改退款单
                modifyOrder : function (list,event) {
                    if($(event.target).hasClass('clickDisabled')) return false;
                    var index = $('#refundBill').closest('[data-index]').attr('data-index');
                    $rootScope.params = {
                        orderid : list.salesorderid,
                        refundId : list.id,
                        from : {
                            url : 'refundBill.html',
                            title : '退款单'
                        }
                    };
                    $scope.option[index].url = '../template/orderManage/addRefundBill.html';
                    $scope.option[index].name = '退款单：修改退款单';
                },
                //根据订单编号查询退款单
                searchByCode : function (event) {
                    if(event.keyCode == 13){
                        refoundBillService.refoundBillInterfaceDeal.getRefoundBillDeal($scope);
                    }
                },
                //反审订单
                auditReturn : function(list,event){
                    var ids = [];
                    ids[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    refoundBillService.refoundBillInterfaceDeal.cancleApprove($scope,ids);
                }
            };

            //单据状态配置数据
            $scope.receiptsConfigData = {
                title : '单据状态',
                chosed : $scope.formChoseData,
                filed : 'Status',
                list :APP_MENU['refundOrderStatus']
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
                list :  $scope.storeList
            };
            //退款类型
            $scope.refundTypeConfigData = {
                title : '退款类型',
                chosed : $scope.formChoseData,
                filed : 'RefundType',
                list :APP_MENU['afterSellRefundType']
            };
            //退款方式
            $scope.refundWayConfigData = {
                title : '退款方式',
                chosed : $scope.formChoseData,
                filed : 'RefundWay',
                list :APP_MENU['refundWay']
            };

        }]
);