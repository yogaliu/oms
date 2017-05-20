/**
 * Created by zgh on 2017/3/28.
 */
angular.module("klwkOmsApp")
    .controller("manualDispatchController", ["$scope", "$rootScope", "WAP_CONFIG", "toolsService","manualDispatchService",
        function ($scope, $rootScope, WAP_CONFIG, toolsService,manualDispatchService) {

            //订单id
            var orderid = $rootScope.params.orderid;
            //页面初始化
            manualDispatchService.DomOperate.domInit($scope,orderid);

            //dom操作
            $scope.domOperate = {
                //查看订单明细
                checkDetails : function (list) {
                    manualDispatchService.InterfaceDeal.getProductDetails($scope,list.productskuid);
                },
                //选择商品添加到发货明细中
                orderListChose : function (myEvent,list,orderindex,listIndex){
                    //这里的orderindex表示是是第几条订单，
                    //listIndex表示是订单里面的第几条商品信息
                    var obj = [];
                    if(!$scope.productHasChose[orderindex]){
                        $scope.productHasChose[orderindex] = {
                            details : []
                        };
                    }
                    obj = $scope.productHasChose[orderindex]['details'];
                    if(obj.contains(list) != -1){
                        obj.removeByValue(list);
                    }else{
                        obj[listIndex] = list;
                    }
                    toolsService.isLabelSel($scope,myEvent);
                },
                //添加配货商品
                addAllocation : function (){
                    var obj = {};
                    //循环将已经选中的商品从原来的数组中去除，并添加到新的数组当中
                    for(var itemx in $scope.productHasChose){
                        //去除非数据属性
                        if($scope.productHasChose.hasOwnProperty(itemx)){
                            for(var itemy in $scope.productHasChose[itemx]['details']){
                                //去除非数据属性
                                if($scope.productHasChose[itemx]['details'].hasOwnProperty(itemy)){
                                    //这里将订单序号和商品序号添加到商品信息中，是为了后面取消明细时好还原
                                    $scope.productHasChose[itemx]['details'][itemy].itemx = itemx;
                                    $scope.productHasChose[itemx]['details'][itemy].itemy = itemy;
                                    //订单id
                                    $scope.productHasChose[itemx]['details'][itemy].tradeid = $scope.relevanceOrder[itemx]['tradeid'];
                                    //明细id
                                    $scope.productHasChose[itemx]['details'][itemy].salesordercode = $scope.relevanceOrder[itemx]['code'];
                                    //买家留言
                                    $scope.productHasChose[itemx]['details'][itemy].buyermemo = $scope.relevanceOrder[itemx]['subOrder']['buyermemo'];
                                    //卖家留言
                                    $scope.productHasChose[itemx]['details'][itemy].sellermemo = $scope.relevanceOrder[itemx]['subOrder']['sellermemo'];
                                    if($scope.allocation.contains($scope.productHasChose[itemx]['details'][itemy]) == -1){
                                        $scope.allocation.push($scope.productHasChose[itemx]['details'][itemy]);
                                    }
                                    delete $scope.relevanceOrder[itemx]['details'][itemy];
                                }
                            }
                        }
                    }
                },
                //添加全部明细
                addMoreAllocation : function () {
                    for(var itemx in $scope.relevanceOrder){
                        //去除非数据属性
                        if($scope.relevanceOrder.hasOwnProperty(itemx)){
                            for(var itemy in $scope.relevanceOrder[itemx]['details']){
                                //去除非数据属性
                                if($scope.relevanceOrder[itemx]['details'].hasOwnProperty(itemy)){
                                    //这里将订单序号和商品序号添加到商品信息中，是为了后面取消明细时好还原
                                    $scope.relevanceOrder[itemx]['details'][itemy].itemx = itemx;
                                    $scope.relevanceOrder[itemx]['details'][itemy].itemy = itemy;
                                    //订单id
                                    $scope.relevanceOrder[itemx]['details'][itemy].tradeid = $scope.relevanceOrder[itemx]['tradeid'];
                                    //明细id
                                    $scope.relevanceOrder[itemx]['details'][itemy].salesordercode = $scope.relevanceOrder[itemx]['code'];
                                    //买家留言
                                    $scope.relevanceOrder[itemx]['details'][itemy].buyermemo = $scope.relevanceOrder[itemx]['subOrder']['buyermemo'];
                                    //卖家留言
                                    $scope.relevanceOrder[itemx]['details'][itemy].sellermemo = $scope.relevanceOrder[itemx]['subOrder']['sellermemo'];
                                    if($scope.allocation.contains($scope.relevanceOrder[itemx]['details'][itemy]) == -1){
                                        $scope.allocation.push($scope.relevanceOrder[itemx]['details'][itemy]);
                                    }
                                    if(!$scope.productHasChose[itemx]){
                                        $scope.productHasChose[itemx] = {
                                            'details' : {
                                                itemy : $scope.relevanceOrder[itemx]['details'][itemy]
                                            }
                                        };
                                    }else{
                                        $scope.productHasChose[itemx]['details'][itemy] = $scope.relevanceOrder[itemx]['details'][itemy];
                                    }
                                    delete $scope.relevanceOrder[itemx]['details'][itemy];
                                }
                            }
                        }
                    }
                },
                //移除明细
                deleteAllocation : function (list){
                    var itemx = list.itemx;
                    var itemy = list.itemy;
                    $scope.allocation.removeByValue(list);
                    $scope.relevanceOrder[itemx]['details'][itemy] = list;
                    delete $scope.productHasChose[itemx]['details'][itemy]
                },
                //根据仓库信息自动匹配快递信息
                matchExpress : function () {
                    manualDispatchService.InterfaceDeal.matchExpress($scope);
                },
                //生成配货单
                createBill : function () {
                    //没有满足生成条件，直接退出
                    if($scope.allocation.length < 1){
                        alert('请选择要配货的信息');
                        return;
                    }else if($.isEmptyObject($scope.wareHouseChosed)){
                        alert('请选择仓库信息');
                        return;
                    }else if($.isEmptyObject($scope.expressChosed)){
                        alert('请选择快递信息');
                        return;
                    }
                    manualDispatchService.InterfaceDeal.createBill($scope, function (res) {
                        if(res.success){
                            alert('生成配货通知单成功');
                        }else{
                            alert('生成失败');
                        }
                        //跳转到列表页
                        $rootScope.params = {};
                        var index = $('#manualDispatch').closest('[data-index]').attr('data-index');
                        $scope.option[index].url = '../template/orderManage/orderList.html';
                        $scope.option[index].name = '订单列表';
                    });
                }
            };

        }
    ]);