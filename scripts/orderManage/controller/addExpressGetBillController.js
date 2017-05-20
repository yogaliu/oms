/**
 * Created by zgh on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("addExpressGetBillController", ["$scope","addExpressGetBillService","toolsService","$rootScope","validateService",
        function ($scope,addExpressGetBillService,toolsService,$rootScope,validateService) {

            //dom初始化
            addExpressGetBillService.addExpressDomOperate.domInit($scope);

            $scope.domOperate = {

                //按enter添加数据
                expressInfoDeal : function (event){
                    //按下enter添加
                    if(event.keyCode == 13){
                        if(validateService.validateAll('#addExpressGetBill','.noBorderMessage')){
                            //将新增的快递信息添加到展示列表中
                            $scope.formData.push({
                                Weight : $scope.Weight,
                                ExpressId : $scope.ExpressId,
                                ExpressName : $scope.ExpressName,
                                ExpressNo : $scope.ExpressNo
                            });
                            //清空已经填好的快递信息
                            $scope.Weight = '';
                            $scope.ExpressNo = '';
                            $scope.menuInfo.expressList.init();
                            //已经全选后，再次添加数据，去掉全选标志
                            $scope.checkAll = false;
                        }
                    }
                },

                //检查要添加数据的合法性
                checkInfo : function (scope) {
                    if(!scope.verify.weight || !scope.verify.expressNo) return ;
                    if(scope.Weight && scope.Weight.trim() != ''){
                        if(scope.ExpressNo && scope.ExpressNo.trim() != ''){
                            if(scope.ExpressId && scope.ExpressId.trim() != ''){
                                this.getInsertData(scope);
                            }else{
                                alert('快递不可为空');
                            }
                        }else{
                            alert('物流单号不可为空');
                        }
                    }else{
                        alert('包裹重量不可为空');
                    }
                },

                //收集已经添加的数据
                getInsertData : function (scope) {
                    var obj = {};
                    obj['Weight']  = scope.Weight;
                    obj['ExpressNo'] = scope.ExpressNo;
                    obj['ExpressId'] = scope.ExpressId;
                    obj['ExpressName'] = scope.ExpressName;
                    scope.formData.push(obj);
                    scope.Weight = '';
                    scope.ExpressNo = '';
                    scope.ExpressId = '';
                    scope.menuInfo.expressList.init();
                },

                //检测单选框的输入是否正确，并设置相应的状态
                setStatus : function(event,type){
                    //$scope.verify[type] = addExpressGetBillService.addExpressDomOperate.changeStatus($(event.target));
                },

                //复选框的选中与取消
                expressListChose : function (myEvent,list) {
                    var obj = $scope.formData;
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
                    var obj = $scope.formData;
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
                //删除选中的一条快递签收单
                deleteExpress : function (list) {
                    $scope.formData.removeByValue(list);
                },

                //批量删除快递记录
                batchDeleteExpress : function () {
                    var expressChose = [];
                    //将选中的数据删除
                    for(var i = 0,j = $scope.formData.length;i < j;i++){
                        if($scope.formData[i].trShow){
                            expressChose.push($scope.formData[i]);
                        }
                    }
                    for(var x = 0,y = expressChose.length;x < y;x++){
                        $scope.formData.removeByValue(expressChose[x]);
                    }
                },

                //确定添加快递签收单
                addExpressConfirm : function () {
                    if($scope.formData.length < 1){
                        toolsService.alertMsg('请先填写快递信息！');
                    }else{
                        addExpressGetBillService.addExpressInterfaceDeal.addExpressSign($scope,$scope.formData, function () {
                            $scope.domOperate.returnBack();
                        });
                    }
                },
                //跳到快递签收列表页
                returnBack : function () {
                    $rootScope.params = {};
                    var index = $('#addExpressGetBill').closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/orderManage/expressGet.html';
                    $scope.option[index].name = '快递签收';
                }
            };

        }
    ]);