/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("groupDetailController", ["$scope","$rootScope","groupDetailService"  ,
        function($scope,$rootScope,groupDetailService) {
        var pageId = '#groupDetail';  //页面Id
        //进入页面需要执行的方法
        function init(){
            var params = $rootScope.groupParams;   // 接收参数
            // 页面显示数据
            $scope.formData = params.data;
            //tab,默认套装详情
            $scope.tab = 'first';
            //套装详情列表配置
            $scope.theadListInfo = [
                {name: "商品编码", tag: 'productcode'},
                {name: "商品名称", tag: 'productname'},
                {name: "规格编码", tag: 'skucode'},
                {name: "规格名称", tag: 'skuname'},
                {name: "销售价", tag: 'wholesaleprice'},
                {name: "数量", tag: 'quantity'},
                {name: "上传比例", tag: 'uploadratio'},
                {name: "有效开始日期", tag: 'effectivetimebegin'},
                {name: "有效结束日期", tag: 'effectivetimeend'}
            ];
            groupDetailService.groupDetail($scope);
            // 操作日志列表配置
            $scope.theadListLog = [
                {name: "操作人", tag: 'operateuser'},
                {name: "操作时间", tag: 'createdate'},
                {name: "操作内容", tag: 'remark'}
            ];
            groupDetailService.operateLog($scope);
        }
        init();

        //tab栏切换
        $scope.toggleTab = function (content) {
            $scope.tab = content;
        };

        //返回套装详情
        $scope.goBack = function () {
            var index = $(pageId).closest('[data-index]').attr('data-index');
            $scope.option[index].url = '../template/productManage/productGroup.html';
            $scope.option[index].name = '组合套装';
        }
    }]);