/**
 * Created by xs on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("physicalTransferController", ["$scope","$rootScope","WAP_CONFIG" ,"$stateParams",
        function($scope,$rootScope,WAP_CONFIG,$stateParams) {
        /*获取调拨类型 虚拟or实物*/
        $scope.type = $stateParams.type;
        //定义要跳转的页面
        var pageMap={
            "transferDetail" : WAP_CONFIG.module + '.transferDetail'
        };
        //进入页面需要执行的方法
        function init(){
            $scope.formData = {
                "productName":$scope.productName,
                "productNo":$scope.productNo,
                "typeNo":$scope.typeNo
            };
            //默认展示联合搜索，隐藏高级搜索
            $scope.advance = false;
        }
        init();
        //高级搜索模块展示
        $scope.toggleAdvance = function () {
            $scope.advance = true;
        };
        //搜索
        $scope.advanceSearch = function () {
            $scope.advance = false;
        };
        //是否出现顶部清空筛选按钮
        $scope.isTopCondition = function () {
            if($scope.formData["productName"]||$scope.formData["productNo"]||$scope.formData["typeNo"]){
                return true;
            }else {
                return false;
            }
        };
        //是否出现表头筛选项展开更多
        $scope.isMore = function () {
            var len = 2;
            if(len>8){
                return true;
            }else{
                return false;
            }
        };
        //清空筛选 不提交
        $scope.clearOnly = function () {
            for(var name in $scope.formData){
                $scope.formData[name] = "";
            }
        }
        //清空筛选 提交
        $scope.clearFilter = function () {
            for(var name in $scope.formData){
                $scope.formData[name] = "";
            }
        }
        //清空单条筛选 提交
        $scope.clearSingleFilter = function (name) {
            $scope.formData[name] = "";
        }
        //跳转页面
        $scope.goPage = function (name) {
            $state.go(pageMap[name]);
        }

    }]);