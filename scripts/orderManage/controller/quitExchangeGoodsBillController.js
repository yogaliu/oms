/**
 * Created by jx on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("quitExchangeGoodsBillController", ["$scope", "$rootScope", "APP_MENU", "WAP_CONFIG","toolsService","quitExchangeGoodsBillService",
        function ($scope, $rootScope, APP_MENU, WAP_CONFIG,toolsService,quitExchangeGoodsBillService) {

            //操作检查
            $scope.operateCheck = {
                //审核功能(只有“新建”状态的退换货单才允许审核；)
                auditCheck : function (list) {
                    if(list.status == 0){
                        return true;
                    }
                    return false;
                },
                //复核功能（只有已审核的退换货单才允许复核）
                reAuditCheck : function (list) {
                    if(list.status == 1){
                        return true;
                    }
                    return false;
                },
                //生成通知单（已审核、复核的可以操作）
                createRequisitionCheck : function (list) {
                    if((list.status == 1 || list.status == 2) && !list.iscreatenoticed){
                        return true;
                    }
                    return false;
                },
                //反审（已审核且未生成通知单的可以操作）
                returnAuditCheck : function (list) {
                    if(list.status == 1 && !list.iscreatenoticed){
                        return true;
                    }
                    return false;
                },
                //作废(新建、已审核且未生成通知单的可以操作)
                CancellationCheck : function (list) {
                    if(list.status == 0 || (list.status == 1 && !list.iscreatenoticed)){
                        return true;
                    }
                    return false;
                },
                //修改检查
                //新建状态的退换货单可修改所有信息；
                // 已审核的退换货单不可更改退入商品，可修改“换出仓库，退货类型，退货方式，补差价金额，收货人，手机号码，退款方式，收货地址，备注”；
                modifyCheck : function (list) {
                    if(list.status != 2 && list.status != 3){
                        return true;
                    }
                    return false;
                }
            };

            //页面初始化
            quitExchangeGoodsBillService.qOreGoodsDomOperate.domInit($scope);

            //dom操作
            $scope.domOperate = {

                //订单与取消订单
                orderListChose : function (list) {
                    var obj = $scope.returnOrderBody;
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
                    var obj = $scope.returnOrderBody;
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

                //生成通知单
                createRequisition : function (type,list,event) {
                    var id = [];
                    id[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    quitExchangeGoodsBillService.InterfaceDeal.createRequisition($scope,id);
                },

                //审核
                auditReturnProduct : function (type,list,event){
                    var id = [];
                    id[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    quitExchangeGoodsBillService.InterfaceDeal.auditReturnProductDeal($scope,id);
                },

                //复核
                reAuditReturnProduct : function (type,list,event){
                    var id = [];
                    id[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    quitExchangeGoodsBillService.InterfaceDeal.reAuditReturnProductDeal($scope,id);
                },

                //反审
                returnAudit : function (type,list,event) {
                    var id = [];
                    id[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    quitExchangeGoodsBillService.InterfaceDeal.returnAuditDeal($scope,id);
                },

                //作废
                Cancellation : function (type,list,event) {
                    var id = [];
                    id[0] = list.id;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    quitExchangeGoodsBillService.InterfaceDeal.CancellationDeal($scope,id);
                },
                //标记
                returnProductTag : function (tagName,type,list) {
                    var id = [];
                    id[0] = list.id;
                    quitExchangeGoodsBillService.InterfaceDeal.returnProductTagDeal($scope,id,tagName);
                },
                //内部标签
                addLabel : function (type,list){
                    var id = [];
                    id[0] = list.id;
                    quitExchangeGoodsBillService.InterfaceDeal.addLabelDeal($scope,id);
                },

                //跳到新增页面
                jumpToNew : function (title,url) {
                    $rootScope.params = {
                        type : 'fromRefund'
                    };
                    var index = $('#quitExchangeGoodsBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //跳到详情页面
                jumpToDetails : function (title,url,list) {
                    $rootScope.params = {
                        orderId : list.id,
                        salesorderid : list.salesorderid,
                        code : list.code,
                        InWareHouse : list.warehouseinname
                    };
                    var index = $('#quitExchangeGoodsBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },

                /**
                 * 判断是批量操作还是单条操作，分别返回不同的参数
                 * @param type 判断是否是批量操作的标志
                 * @param list 要操作列的值
                 * @returns {Array}
                 */
                batchOrSingleOperate : function (type,list){
                    var data = [];
                    if(type){
                        return $scope.orderListHasChosed;
                    }else{
                        data.push(list);
                        return data;
                    }
                },
                //右侧列表配置
                listAllocation : function () {
                    $("#"+$scope.allocation.timestamp).show();
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
                //清除已选中的筛选条件
                clearChoseCondition : function (list){
                    delete $scope.formChoseData[list.filed];
                },
                //高级筛选取消事件
                advanceSearchCancle : function(myEvent) {
                    for(var key in $scope.formData){
                        delete $scope.formData[key];
                    }
                    for(var key1 in $scope.formChoseData){
                        delete $scope.formChoseData[key1];
                    }
                    //高级搜索消失
                    toolsService.isShow($scope, false, myEvent);
                },
                //高级筛选确定按钮
                advanceSearchConfirm : function (myEvent) {
                    //重新请求页面数据
                    quitExchangeGoodsBillService.InterfaceDeal.getquitOrExchangeGoodsBill($scope);
                    //高级搜索消失
                    toolsService.isShow($scope, false, myEvent);
                },
                //选择订单的三种状态
                threeSelect : function (myEvent,type) {
                    toolsService.isThreeSel($scope, myEvent, function (selType) {
                        $scope.formData[type] = selType;
                        //重置为第一页
                        $scope.paginationConf.currentPage = 1;
                        quitExchangeGoodsBillService.InterfaceDeal.getquitOrExchangeGoodsBill($scope);
                    });
                },
                //刷新页面
                refresh : function () {
                    quitExchangeGoodsBillService.InterfaceDeal.getquitOrExchangeGoodsBill($scope);
                },
                //根据订单编号搜索退换货单
                searchByCode : function (event) {
                    if(event.keyCode == 13){
                        quitExchangeGoodsBillService.InterfaceDeal.getquitOrExchangeGoodsBill($scope);
                    }
                },
                jumpToModify : function (title,url,list) {
                    $rootScope.params = {
                        orderId : list.id,
                        status : list.status,
                        type : 'modify'
                    };
                    var index = $('#quitExchangeGoodsBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                }
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

            //高级搜索退入仓库配置
            $scope.wareHouseConfigData = {
                //是否显示字母搜索
                letterClassify:true,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : false,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'退入仓库',
                placeHold : '退入仓库',
                //后台中对应的字段名称
                filed:"WarehouseInId",
                list :  $scope.wareHouseList
            };
            //高级搜索退货类型配置
            $scope.returnTypeConfigData = {
                //是否显示字母搜索
                letterClassify:false,
                //显示更多
                selectMore : false,
                //显示多选
                Multiselect : true,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'退货类型',
                placeHold : '退货类型',
                //后台中对应的字段名称
                filed:"ReturnOrderTypeIds",
                list :  $scope.ReturnType
            };

            //退货标记配置数据
            $scope.returnLabelConfigData = {
                title : '退货标记',
                chosed : $scope.formChoseData,
                filed : 'TagName',
                list :APP_MENU['returnMark']
            };

            //退款方式配置数据
            $scope.refundTypeConfigData = {
                title : '退款方式',
                chosed : $scope.formChoseData,
                filed : 'RefundWay',
                list :APP_MENU['refundWay']
            };
            //单据状态配置
            $scope.StatusConfigData = {
                title : '单据状态',
                chosed : $scope.formChoseData,
                filed : 'Status',
                list :APP_MENU['returnOrExchangeStatus']
            };

}]);