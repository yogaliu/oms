/**
 * Created by jx on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("quitGoodsNoticeBillController", ["$scope", "$rootScope", "$state", "WAP_CONFIG","toolsService","quitGoodsNoticeBillService","APP_MENU",
        function ($scope, $rootScope, $state, WAP_CONFIG,toolsService,quitGoodsNoticeBillService,APP_MENU) {
            quitGoodsNoticeBillService.noticeBillDomOperate.domInit($scope);

            //操作功能状态检查
            $scope.operateCheck = {
                //取消检查（新建或已通知状态的退货通知单可以直接取消，【已通知】状态的退货通知单需要通过API请求WMS系统同意才能取消成功）
                cancleCheck : function (list) {
                    if(list.status == 1 || list.status == 0){
                        return true;
                    }
                    return false;
                }
            };

            //dom操作
            $scope.domOperate = {
                //右侧列表配置
                listAllocation : function () {
                    $("#"+$scope.allocation.timestamp).show();
                },
                //详情页面跳转
                jumpToDetails : function (title,url,list) {
                    $rootScope.params = {
                        orderId: list.id
                    };
                    var index = $('#quitGoodsNoticeBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //取消退货通知单
                cancleRequisition : function (list,event) {
                    var tmp = new Array();
                    tmp[0] = list;
                    if($(event.target).hasClass('clickDisabled')) return false;
                    quitGoodsNoticeBillService.quitGoodsListInterfaceDeal.cancleQuitGoodsDeal($scope,tmp);
                },
                //批量取消退货通知单
                batchCancle : function () {
                    var tmp = [];
                    for(var i = 0,j = $scope.quitGoodsBody.length;i < j;i++){
                        if($scope.quitGoodsBody[i].trShow){
                            tmp.push($scope.quitGoodsBody[i]);
                        }
                    }
                    if(tmp.length > 1){
                        //如果所选订单都可以取消，则可以批量取消
                        if(!$scope.batchCancleEnabled){
                            quitGoodsNoticeBillService.quitGoodsListInterfaceDeal.cancleQuitGoodsDeal($scope,tmp);
                        }else{
                            toolsService.alertMsg('订单状态不正确，不可批量取消！');
                        }
                    }else{
                        toolsService.alertMsg('请选择订单！');
                    }
                },
                //异常订单选择
                goodsNoticeChosed : function (list){
                    var obj = $scope.quitGoodsBody;
                    list.trShow = !list.trShow;
                    //全选标志
                    $scope.checkAll = true;
                    //是否可批量取消标志
                    $scope.batchCancleEnabled = false;
                    //获取该订单的商品信息
                    quitGoodsNoticeBillService.quitGoodsListInterfaceDeal.getQuitGoodsDetails($scope,list);
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(!obj[i].trShow){
                            $scope.checkAll = false;
                            break;
                        }else{
                            //检查当前选中的订单是否可取消
                            if(!$scope.operateCheck.cancleCheck(obj[i])){
                                $scope.batchCancleEnabled = true;
                            }
                        }
                    }
                },
                //全选
                selectAll : function () {
                    var obj = $scope.quitGoodsBody;
                    //是否可批量取消标志
                    $scope.batchCancleEnabled = false;
                    if($scope.checkAll){
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = false;
                            $scope.batchCancleEnabled = true;
                        }
                    }else{
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i].trShow = true;
                            //检查当前选中的订单是否可取消
                            if(!$scope.operateCheck.cancleCheck(obj[i])){
                                $scope.batchCancleEnabled = true;
                            }
                        }
                    }
                    $scope.checkAll = !$scope.checkAll;
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
                    //重新已签收快递数据
                    quitGoodsNoticeBillService.quitGoodsListInterfaceDeal.getQuitGoodsListDeal($scope);
                    //高级搜索隐藏
                    toolsService.isShow($scope, false, myEvent);
                },
                //刷新页面
                refresh : function () {
                    quitGoodsNoticeBillService.quitGoodsListInterfaceDeal.getQuitGoodsListDeal($scope);
                },
                //根据通知单号查找退货通知单
                searchByCode : function (event) {
                    if(event.keyCode == 13){
                        quitGoodsNoticeBillService.quitGoodsListInterfaceDeal.getQuitGoodsListDeal($scope);
                    }
                }
            };

            //退入仓库数据配置
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
                filed:'WarehouseName',
                list :  $scope.wareHouse
            };

            //订单类型配置数据
            $scope.receiptsConfigData = {
                title : '单据状态',
                chosed : $scope.formChoseData,
                filed : 'Status',
                list :APP_MENU['returnRequisitionStauts']
            };

        }
    ]);