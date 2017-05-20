/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("runScheduleDetailController", ["$scope", "$rootScope", "runScheduleDetailService", "toolsService", function ($scope, $rootScope, runScheduleDetailService, toolsService) {

        var indexID = '#runScheduleDetail';

        function init() {
            //接收列表页的参数
            $scope.params = $.extend(true, {}, $rootScope.params);

            //查询活动商品信息
            runScheduleDetailService.VipScheduleDetailGet($scope, true);
            //查询操作记录
            runScheduleDetailService.VipScheduleLogGet($scope, true);

            //加载下拉框
            $('#runScheduleDetail').selectPlug();

            //tab栏切换，默认为first页面
            $scope.tab = 'first';

            //tab栏切换函数
            $scope.isShow = function (content) {
                $scope.tab = content;
            };

            $scope.isZhengque = false;
            //表格操作
            $scope.operate = {
                //单选
                selSingle: function (myEvent,index) {
                    $scope.tableList1[index].isZhengque=!$scope.tableList1[index].isZhengque;

                    //开始活动/结束活动按钮是否高亮
                    if ($(myEvent.target).closest('tbody').find('i.icon-sel-zhengque').length > 0) {
                        $scope.isZhengque = true;
                    } else {
                        $scope.isZhengque = false;
                    }

                    if ($(myEvent.target).closest('tbody').find('i.icon-sel-zhengque').length == $scope.tableList1.length) {
                        $(indexID+ ' thead').find('.icon-sel').addClass('icon-sel-zhengque');
                    }else{
                        $(indexID+ ' thead').find('.icon-sel').removeClass('icon-sel-zhengque');
                    }
                },
                //全选
                selAll: function (myEvent) {

                    if($(myEvent.target).closest('label').find('i.icon-sel').hasClass('icon-sel-zhengque')){
                        $(indexID+ ' tbody').find('.icon-sel').addClass('icon-sel-zhengque');
                        $.each($scope.tableList1, function (i, obj) {
                            obj.isZhengque=true;
                        });
                        $scope.isZhengque = true;
                    }else{
                        $(indexID+ ' tbody').find('.icon-sel').removeClass('icon-sel-zhengque');
                        $.each($scope.tableList1, function (i, obj) {
                            obj.isZhengque=false;
                        });
                        $scope.isZhengque = false;
                    }
                },
                //开始活动
                startAct: function (obj) {
                    var detail = [];
                    if (obj) {
                        detail = [obj];
                    } else {
                        //批量操作
                        $.each($scope.tableList1, function (i, obj) {
                            if (obj.isZhengque) {
                                detail.push(obj);
                            }
                        });
                    }
                    if (detail.length > 0) {
                        runScheduleDetailService.VipScheduleDetailStart($scope, detail);
                    }
                },
                //结束活动
                endAct: function (obj) {
                    var detail = [];
                    if (obj) {
                        detail = [obj];
                    } else {
                        //批量操作
                        $.each($scope.tableList1, function (i, obj) {
                            if (obj.isZhengque) {
                                detail.push(obj);
                            }
                        });
                    }
                    if (detail.length > 0) {
                        runScheduleDetailService.VipScheduleDetailEnd($scope, detail);
                    }
                }
            };

            //返回
            $scope.returnFun = function () {
                var index = $('#runScheduleDetail').closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/b2bVIP/runSchedule.html';
                $scope.option[index].name = '唯品档期';
            };

            //复选框默认不勾选
            $scope.labelSel = false;

            //复选框勾选与取消勾选
            $scope.isLabelSel = function (myEvent) {
                toolsService.isLabelSel($scope, myEvent);
            };

        }

        init();


    }]);