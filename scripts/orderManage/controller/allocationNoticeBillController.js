/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("allocationNoticeBillController", ["$scope", "$rootScope", "APP_MENU", "WAP_CONFIG", "toolsService","allocationNoticeBillService","validateService",
        function ($scope, $rootScope, APP_MENU, WAP_CONFIG, toolsService,allocationNoticeBillService,validateService) {

            //页面初始化
            allocationNoticeBillService.noticeBillDomOperate.domInit($scope);

            ////订单状态配置
            //$scope.StatusConfigData = {
            //    //是否显示搜索和按字母索引数据
            //    letterClassify : false,
            //    //显示更多
            //    selectMore : true,
            //    //显示多选
            //    Multiselect : true,
            //    //将选中的条件保存起来到这个对象当中
            //    chosed : $scope.formChoseData,
            //    title:'订单状态',
            //    placeHold : '订单状态',
            //    //后台中对应的字段名称
            //    filed:'Status',
            //    list :  toolsService.setDataShowType($scope,APP_MENU['orderStatus'],$scope.orderStatus,5,true)
            //};
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
            //高级搜索仓库配置
            $scope.wareHouseConfigData = {
                //是否显示字母搜索
                letterClassify:true,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : true,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'仓库',
                placeHold : '仓库',
                //后台中对应的字段名称
                filed:'WarehouseId',
                list :  $scope.wareHouseList
            };

            //配货状态配置数据
            $scope.allocationStatus = {
                title : '状态',
                chosed : $scope.formChoseData,
                filed : 'Status',
                list :APP_MENU['preDistributionState']
            };

            //配货状态明细配置数据
            $scope.allocationDetailsStatus = {
                title : '明细状态',
                chosed : $scope.formChoseData,
                filed : 'DetailStatus',
                list :APP_MENU['preAllocationDetaisStatus']
            };

            //dom操作
            $scope.domOperate = {
                //复选框操作
                orderListChose : function (myEvent,list){
                    var obj = $scope.invoiceListTbody;
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
                    var obj = $scope.invoiceListTbody;
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

                //重新推送
                reUploadOrder : function () {
                    allocationNoticeBillService.InterfaceDeal.updataOrderStatus();
                },

                //导出配货通知单
                orderListExport : function () {
                    alert('等待后台将数据转化为excel文件');return false;
                    allocationNoticeBillService.requisitionListInterface.orderListExport();
                },

                //单个订单取消配货
                batchCancle : function(list,event){
                    var tmp = [];
                    tmp[0] = list;
                    //没有通过验证，不可取消
                    if($(event.target).hasClass('clickDisabled')) return false;
                    $scope.modal = {
                        title : '请输入取消原因',
                        confirm : function (content) {
                            $('.info-get-modal').modal('hide');
                            allocationNoticeBillService.InterfaceDeal.orderBatchCancel($scope,tmp,content);
                            $scope.content = '';
                        }
                    };
                    $('.info-get-modal').modal('show');
                },
                //手工发货
                manualDeliver : function (list,event) {
                    //没有通过验证，不可手工发货
                    if($(event.target).hasClass('clickDisabled')) return false;
                    $('.manual-delal-modal').modal('show');
                    $scope.allocationOrderChose = list;
                },
                //确定手工发货
                manualAllocation : function () {
                    var obj = $scope.allocationOrderChose;
                    //必填项没有填，不可以提交
                    if(!validateService.validateAll('#allocationNoticeBill','.manual-delal-modal'))return false;
                    allocationNoticeBillService.InterfaceDeal.getProductDetails($scope,obj.id,obj.code,obj.warehousecode);
                    //重置状态
                    $scope.expressPull.init();
                    $scope.manual.expressno = '';
                    $scope.manual.weight = '';
                },
                //详情页面跳转
                jumpToDetails : function (title,url,list) {
                    $rootScope.params = {
                        orderId: list.id
                    };
                    var index = $('#allocationNoticeBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //右侧列表配置
                listAllocation : function () {
                    $("#"+$scope.allocation.timestamp).show();
                },
                //高级搜索显示
                searchShow : function (content) {
                    $scope.advancedSearch = content;
                },
                //删除已经选中的高级筛选条件
                clearChoseCondition : function (list){
                    //将已经筛选的条件，点击叉号删掉已经存在的对应状态可以恢复到未选中状态
                    delete $scope.formChoseData[list.filed];
                },
                //高级搜索确定
                advanceSearchConfirm : function (){
                    //重新请求订单数据
                    allocationNoticeBillService.InterfaceDeal.getRequisition($scope);
                    //高级搜索隐藏
                    $scope.advancedSearch = false;
                },
                //高级搜索取消
                advanceSearchCancle : function () {
                    for(var key in $scope.formChoseData){
                        delete $scope.formChoseData[key];
                    }
                    for(var key1 in $scope.formData){
                        delete $scope.formData[key1];
                    }
                    $scope.advancedSearch = false;
                },
                //高级搜索清空
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
                        allocationNoticeBillService.InterfaceDeal.getRequisition($scope);
                    });
                },
                //展开日期选择
                isTimeShow : function () {
                    if($scope.timeShow){
                        $scope.timeText = '收起';
                    }else{
                        $scope.timeText = '展开';
                    }
                    $scope.timeShow = !$scope.timeShow;
                },
                //刷新页面
                refresh : function () {
                    allocationNoticeBillService.InterfaceDeal.getRequisition($scope);
                },
                //根据订单编号搜索配货通知单
                searchByCode : function (event) {
                    if(event.keyCode == 13){
                        allocationNoticeBillService.InterfaceDeal.getRequisition($scope);
                    }
                },
                //取消配货验证
                canCancleAllocation : function (list) {
                    if(list.status == 0 || list.status == 2){
                        return true;
                    }else{
                        return false;
                    }
                },
                //手工发货验证
                canManualAllocation : function (list) {
                    if(list.status == 2){
                        return true;
                    }else{
                        return false;
                    }
                },
                  //关闭模态框
                closeModal : function () {
                    $('.modal').modal('hide');
                }
            };
        }
    ]);