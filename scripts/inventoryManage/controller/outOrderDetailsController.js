/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("outOrderDetailsController", ["$scope", "$rootScope", "outOrderService","outOrderDetailsService",
        function ($scope, $rootScope, outOrderService,outOrderDetailsService) {
            //// 定义当前页面控件的ID
            var pageId = "#outOrderDetails";

            function init(){
                $scope.theadListGoodsTitle = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "计划数量", tag: 'planqty'},
                    {name: "锁定数量", tag: 'lockedqty'},
                    {name: "出库数量", tag: 'outqty'},
                    // 临时先写在这里，后面再改
                    {name: "出库仓可调", tag: 'canAllocationQuantity'},
                    {name: "仓库出库时间", tag: 'createdate '}
                ];

                $scope.theadListLogTitle = [
                    {name: "操作人", tag: 'createuser'},
                    {name: "操作日期", tag: 'createdate'},
                    {name: "备注", tag: 'note'}
                ];

                // 表示查看当前对象的详情
                if(outOrderService.outOrderDetailObj != null){
                    $scope.outOrderDetailObj = outOrderService.outOrderDetailObj;

                    console.dir($scope.outOrderDetailObj);

                    //商品明细
                    outOrderDetailsService.getOutboundOrderDetail($scope);
                    //操作日志
                    outOrderDetailsService.getOutboundOrderLog($scope);
                }else{
                    alert("该对象不存在，不能查看详情！");
                }

                // 默认显示商品列表
                $scope.tab = "goodsList";
            }
            init();

            // 切换tab
            $scope.toggleTab = function(tabName){
                $scope.tab = tabName;
            };

            // 回退到 inOrder.html页面
            $scope.backInOrderList = function(){
                // 查看该对象的详情
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/inventoryManage/outOrder.html';
                $scope.option[index].name = '出库订单';
            };

        }]);