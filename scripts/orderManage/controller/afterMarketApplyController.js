/**
 * Created by jx on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("afterMarketApplyController", ["$scope", "$rootScope", "APP_MENU", "WAP_CONFIG", "toolsService","afterMarketApplyService",
        function ($scope, $rootScope, APP_MENU, WAP_CONFIG, toolsService,afterMarketApplyService) {

            //获取所有售后申请
            afterMarketApplyService.afterMarketApplyDomOperate.domInit($scope);

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

            //高级搜索平台状态
            $scope.platformConfigData = {
                //是否显示搜索和按字母索引数据
                letterClassify : true,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : false,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'平台状态',
                placeHold : '平台状态',
                //后台中对应的字段名称
                filed:'TradeStatus',
                list :  toolsService.setDataShowType($scope,APP_MENU['platformState'],$scope.TradeStatus,5,true)
            };

            //高级搜索退款状态
            $scope.refundConfigData = {
                //是否显示搜索和按字母索引数据
                letterClassify : true,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : false,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'退款状态',
                placeHold : '退款状态',
                //后台中对应的字段名称
                filed:'Status',
                list :  toolsService.setDataShowType($scope,APP_MENU['refundStatus'],$scope.Status,5,true)
            };

            //订单标记配置数据
            $scope.orderMarks = {
                title : '订单标记',
                chosed : $scope.formChoseData,
                filed : 'TagName',
                list :APP_MENU['orderMark']
            };
            //退款类型配置数据
            $scope.refundType = {
                title : '退款类型',
                chosed : $scope.formChoseData,
                filed : 'RefundType',
                list :APP_MENU['refundType']
            };

            //dom操作
            $scope.domOperate = {
                //订单与取消订单
                orderListChose : function (myEvent,list) {
                    var obj = $scope.afterMarketBody;
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
                    var obj = $scope.afterMarketBody;
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

                //标记
                productReturn : function(myEvent,type,list){
                    var tmp = {
                        id : [],
                        list : []
                    };
                    tmp.id.push(list.id);
                    tmp.list.push(list);
                    afterMarketApplyService.afterMarketInterface.afterMarkAddLabel($scope,type,tmp.id,tmp.list);
                },
                //列配置显示
                listAllocation : function () {
                    $("#"+$scope.allocation.timestamp).show();
                },
                //清空已选中的条件
                clearChoseCondition : function (list) {
                    delete $scope.formChoseData[list.filed];
                },
                //高级搜索确定事件
                advanceSearchConfirm : function (myEvent) {
                    afterMarketApplyService.afterMarketInterface.getAllAfterMarketApplications($scope);
                    toolsService.isShow($scope, false, myEvent);
                },
                //高级搜索取消事件
                advanceSearchCancle : function (myEvent) {
                    for(var key in $scope.formData){
                        delete $scope.formData[key];
                    }
                    for(var key1 in $scope.formChoseData){
                        delete $scope.formChoseData[key1];
                    }
                    toolsService.isShow($scope, false, myEvent);
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
                //选择订单的三种状态
                threeSelect : function (myEvent,type) {
                    toolsService.isThreeSel($scope, myEvent, function (selType) {
                        $scope.formData[type] = selType;
                        //重置为第一页
                        $scope.paginationConf.currentPage = 1;
                        afterMarketApplyService.afterMarketInterface.getAllAfterMarketApplications($scope);
                    });
                },
                //刷新页面
                refresh : function () {
                    afterMarketApplyService.afterMarketInterface.getAllAfterMarketApplications($scope);
                },
                //根据退款单号搜索售后申请
                searchByCode : function (event) {
                    if(event.keyCode == 13){
                        afterMarketApplyService.afterMarketInterface.getAllAfterMarketApplications($scope);
                    }
                }
            };
    }]);