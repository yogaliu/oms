/**
 * Created by zgh on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("expressGetController", ["$scope", "$rootScope", "$state", "WAP_CONFIG","toolsService","expressGetService",
        function ($scope, $rootScope, $state, WAP_CONFIG,toolsService,expressGetService) {

            //数据初始化
            expressGetService.expressGetDomOperate.domInit($scope);

            //dom操作方法
            $scope.domOperate = {
                //复选框勾选与取消勾选
                isLabelSel : function (myEvent) {
                    toolsService.isLabelSel($scope, myEvent);
                },

                //跳转到新增快递信息页面
                jumpToAddExpress : function (title,url) {
                    $rootScope.params = {};
                    var index = $('#expressGet').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },

                //作废订单
                obsoleteExpress : function (list){
                    var tmp = [];
                    tmp.push(list.id);
                    expressGetService.expressGetInterfaceDeal.obsoleteExpress($scope,tmp);
                },

                //备注
                remarkExpress : function (list) {
                    //模态框配置信息
                    $scope.modal = {
                        title : '提示',
                        confirm : function (content) {
                            var ids = new Array(list.id);
                            $('.info-get-modal').modal('hide');
                            expressGetService.expressGetInterfaceDeal.batchAddTagName($scope,content,ids);
                            //清空提示框里面的文字
                            $scope.modal.content = '';
                        }
                    };
                    $('.info-get-modal').modal('show');
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
                    expressGetService.expressGetInterfaceDeal.getExpressInfo($scope);
                    //高级搜索隐藏
                    toolsService.isShow($scope, false, myEvent);
                },
                //选择订单的三种状态
                threeSelect : function (myEvent,type) {
                    toolsService.isThreeSel($scope, myEvent, function (selType) {
                        $scope.formData[type] = selType;
                        //重置为第一页
                        $scope.paginationConf.currentPage = 1;
                        expressGetService.expressGetInterfaceDeal.getExpressInfo($scope);
                    });
                },
                //订单与取消订单
                exoressListChose : function (list) {
                    var obj = $scope.expressBody;
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
                    var obj = $scope.expressBody;
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
                //右侧列表配置
                listAllocation : function () {
                    $("#"+$scope.allocation.timestamp).show();
                },
                //刷新页面
                refresh : function () {
                    expressGetService.expressGetInterfaceDeal.getExpressInfo($scope);
                },
                //模态框消失
                modalDismiss : function () {
                    $('.modal').modal('hide');
                }
            };

            //高级搜索店铺配置
            $scope.expressConfigData = {
                //是否显示字母搜索
                letterClassify:true,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : false,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formChoseData,
                title:'快递公司',
                placeHold : '快递公司',
                //后台中对应的字段名称
                filed:'ExpressId',
                list :  $scope.expressList
            };

        }]
);