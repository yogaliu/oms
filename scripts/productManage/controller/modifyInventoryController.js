/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("modifyInventoryController", ["$scope","$rootScope","modifyInventoryService","APP_MENU",
        function($scope,$rootScope,modifyInventoryService,APP_MENU) {
        var pageId = '#modifyInventory';  // 页面Id

        //进入页面需要执行的方法
        function init(){

            var param = $rootScope.productInventoryParam; // 接收参数
            //页面呈现数据
            $scope.param ={
                "store":param.data,
                "obj":param.obj
            };

            // 修改库存扣减方式
            $scope.selectReduce ={
                isshow:false,
                info:klwTool.jsonToArray2(APP_MENU.marketingInventoryDeduction,'id','name'),
                onChange: function(obj,index){	//点击之后的回调
                    $scope.reduceStyle = (index+1);
                }
            };

        }
        init();

        // 清空商品
        $scope.empty = function () {
            $scope.param.obj.length = 0;
        };

        //删除单条商品
        $scope.delete = function (i) {
            $scope.param.obj.splice(i,1);
        };
        
        //返回铺货关系
        $scope.goBack = function () {
            var index = $(pageId).closest('[data-index]').attr('data-index');
            $scope.option[index].url = '../template/productManage/goodsRelationship.html';
            $scope.option[index].name = '铺货关系';
        };

        // 保存扣减方式
        $scope.ensure = function () {
            modifyInventoryService.modifyInventory($scope);
        }
        
    }]);