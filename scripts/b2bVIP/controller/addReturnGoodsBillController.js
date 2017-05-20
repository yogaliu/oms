/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("addReturnGoodsBillController", ["$scope", "$rootScope", "addReturnGoodsBillService","validateService", function ($scope, $rootScope, addReturnGoodsBillService,validateService) {

        var indexID = '#addReturnGoodsBill';

        //进入页面需要执行的方法
        function init() {
            //接收参数
            $scope.params = $.extend(true, {}, $rootScope.params);

            //初始化表单验证
            validateService.initValidate(indexID);

            //表单字段
            $scope.modify1 = {
                "tableList": {
                    "boxno": '',
                    "productcode": '',
                    "remark": ''
                },
                "details": []
            };
            $scope.modify = $.extend(true, {}, $scope.modify1);


            //保存
            $scope.submit = function () {
                if(validateService.validateAll(indexID,'.basic-message')){
                    $scope.returnFun();
                }
            };
            //返回//取消
            $scope.returnFun = function () {
                var index = $('#addReturnGoodsBill').closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/b2bVIP/returnGoodsBill.html';
                $scope.option[index].name = '唯品退货单';
            }
        }

        init();


    }]);