/**
 * Created by jx on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("sendOrderAbnormalController", ["$scope", "$rootScope", "orderManagePublicService", "WAP_CONFIG", "toolsService","sendOrderAbnormalService",
        function ($scope, $rootScope, orderManagePublicService, WAP_CONFIG, toolsService,sendOrderAbnormalService) {

            //页面初始化
            sendOrderAbnormalService.domOperate.domInit($scope);

            //dom操作
            $scope.domOperate = {
                //跳到异常订单详情界面
                jumpToDetails : function (title,url,list) {
                    $rootScope.params = {
                        orderid : list.orderid
                    };
                    var index = $('#sendOrderAbnormal').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = url;
                    $scope.option[index].name = title;
                },
                //异常订单选择
                orderListChose : function (list){
                    var obj = $scope.abnormalOrdersBody;
                    list.trShow = !list.trShow;
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
                    var obj = $scope.abnormalOrdersBody;
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
                //平台发货
                platformDeliver : function (){
                    var ids = this.getOrderid('tradeid');
                    if(ids.length < 1){
                        toolsService.alertMsg('请先选择订单！');
                    }else{
                        sendOrderAbnormalService.InterfaceDeal.platformDispatch($scope,ids);
                    }
                },
                //系统发货
                systemDelliver : function () {
                    var ids = this.getOrderid('orderid');
                    if(ids.length < 1){
                        toolsService.alertMsg('请先选择订单！');
                    }else{
                        toolsService.alertConfirm({
                            "msg":"确认平台上已经发货？",
                            okBtn : function(index, layero){
                                sendOrderAbnormalService.InterfaceDeal.systemDispatch($scope,ids);
                            },
                            cancelBtn :  function(index, layero){
                            }
                        });
                    }
                },
                //调整列配置
                adjustColumn : function () {
                    $("#"+$scope.allocation.timestamp).show();
                },
                //上一页
                prevPage : function () {
                    sendOrderAbnormalService.domOperate.prevPage($scope);
                },
                //下一页
                nextPage : function () {
                    sendOrderAbnormalService.domOperate.nextPage($scope);
                },
                //高级搜索确定
                searchConfirm : function (myEvent) {
                    sendOrderAbnormalService.InterfaceDeal.getAbnormalOrders($scope);
                    toolsService.isShow($scope, false, myEvent);
                },
                //高级搜索取消
                searchCancle : function (myEvent){
                    $scope.formData = {};
                    sendOrderAbnormalService.InterfaceDeal.getAbnormalOrders($scope);
                    toolsService.isShow($scope, false, myEvent);
                },
                //清空高级搜索条件
                clearCondition : function () {
                    $scope.formData = {};
                    for(var item in $scope.formData1){
                        delete $scope.formData1[item];
                    }
                },
                //清除已经选中的筛选条件
                cancleChose : function (list) {
                    delete $scope.formData1[list.filed];
                },
                //刷新页面
                refresh : function () {
                    sendOrderAbnormalService.InterfaceDeal.getAbnormalOrders($scope);
                },
                //根据平台订单号搜索发货异常订单
                searchByCode : function (event) {
                    if(event.keyCode == 13){
                        sendOrderAbnormalService.InterfaceDeal.getAbnormalOrders($scope);
                    }
                },
                //获取选中的订单的id
                getOrderid : function (type) {
                    var ids = [];
                    var obj = $scope.abnormalOrdersBody;
                    //获取选中的订单id
                    for(var i = 0,j = obj.length;i < j;i++){
                        if(obj[i].trShow){
                            ids.push(obj[i][type]);
                        }
                    }
                    return ids;
                },
                //关闭模态框
                closeModal : function () {
                    $('.modal').modal('hide');
                }
            };
            //高级搜索店铺配置
            $scope.storeConfig = {
                //是否显示字母搜索
                letterClassify:true,
                //显示更多
                selectMore : true,
                //显示多选
                Multiselect : true,
                //将选中的条件保存起来到这个对象当中
                chosed : $scope.formData1,
                title:'店铺',
                placeHold : '店铺',
                //后台中对应的字段名称
                filed:'StoreId',
                list :  $scope.showInfo
            };
            function init() {

                //高级搜索
                $scope.advancedSearchObj1 = {
                    //是否展开高级搜索，默认不展开
                    advancedSearch: false,

                    //是否展开制单时间，默认不展开
                    timeShow: false,

                    //制单时间的展开/收起
                    timeText: '展开',

                    //高级搜索更多展开
                    moreShow: false,

                    //高级搜索多选复选框
                    moreSel: false,

                    //高级搜索show函数
                    isShow: function (content, myEvent) {
                        toolsService.isShow($scope, content, myEvent);
                    },

                    //制单时间show函数
                    isTimeShow: function () {
                        toolsService.isTimeShow($scope);
                    },

                    //高级搜索更多显示
                    isMoreShow: function (moreContent, myEvent) {
                        toolsService.isMoreShow($scope, moreContent, myEvent);
                    },

                    //高级搜索多选显示复选框
                    isMoreSelShow: function (moreSelContent) {
                        toolsService.isMoreSelShow($scope, moreSelContent);
                    }
                };

                $scope.advancedSearchObj = $.extend(true, {}, $scope.advancedSearchObj1);

                //复选框默认不勾选
                $scope.labelSel = false;

                //复选框勾选与取消勾选
                $scope.isLabelSel = function (myEvent) {
                    toolsService.isLabelSel($scope, myEvent);
                };
            }

            init();
        }
    ]);