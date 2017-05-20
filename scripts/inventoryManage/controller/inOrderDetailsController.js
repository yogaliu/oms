/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("inOrderDetailsController", ["$scope", "$rootScope", "inOrderService","inOrderDetailsService",
        function ($scope, $rootScope, inOrderService,inOrderDetailsService) {
            // 定义当前页面控件的ID
            var pageId = "#inOrderDetails";

            function init(){
                $scope.theadListGoodsTitle = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'skucode'},
                    {name: "规格名称", tag: 'skuname'},
                    {name: "计划数量", tag: 'planqty'},
                    {name: "入库数量", tag: 'inqty'},
                    {name: "仓库入库时间", tag: 'createdate '}
                ];

                $scope.theadListLogTitle = [
                    {name: "操作人", tag: 'createuser'},
                    {name: "操作日期", tag: 'createdate'},
                    {name: "备注", tag: 'note'}
                ];

                // 表示查看当前对象的详情
                if(inOrderService.inOrderDetailObj != null){
                    $scope.inOrderDetailObj = inOrderService.inOrderDetailObj;
                    //商品明细
                    inOrderDetailsService.getStorageOrderDetail($scope);
                    //操作日志
                    inOrderDetailsService.getStorageOrderLog($scope);
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
                $scope.option[index].url = '../template/inventoryManage/inOrder.html';
                $scope.option[index].name = '入库订单详情';
            };

        }]);