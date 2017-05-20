/**
 * Created by xs on 2017/4/26.
 */
angular.module("klwkOmsApp")
    .controller("newExpressInformationController", ["$scope","$rootScope","newExpressInformationService","APP_MENU","validateService" ,
        function($scope,$rootScope,newExpressInformationService,APP_MENU,validateService) {
            //页面service
            var currentService = newExpressInformationService;
            //页面id
            var pageId = "#newExpressInformation";
            //进入页面需要执行的方法
            function init(){
                $scope.params = $rootScope.params;
                validateService.initValidate(pageId);
                if($scope.params.oprate == 'edit'){
                    $scope.currentItem = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },$scope.params.obj);
                    //快递类型下拉选框
                    $scope.expresstypeList = {
                        isshow:false,
                        info:klwTool.jsonToArray2(APP_MENU.expressType,'id','name'),
                        objName:{id:$scope.currentItem.expresstype},
                        onChange: function(obj,index){	//点击之后的回调
                            $scope.currentItem.expresstype = obj.id;
                        }
                    };
                }else if($scope.params.oprate == 'creat'){
                    $scope.currentItem = {
                        "code": "",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "createdate": "0001-01-01 00:00:00",
                        "name": "",
                        "email": "",
                        "address": "",
                        "note": "",
                        "telephone": "",
                        "mobile": "",
                        "iscancod": false,
                        "isonlycancod": false,
                        "isusecloudsstack": false,
                        "seq": 0,
                        "isdisabled": false,
                        "warehouseexpresscode": "",
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    //快递类型下拉选框
                    $scope.expresstypeList = {
                        isshow:false,
                        info:klwTool.jsonToArray2(APP_MENU.expressType,'id','name'),
                        onChange: function(obj,index){	//点击之后的回调
                            $scope.currentItem.expresstype = obj.id;
                        }
                    };
                }
            }
            init();
            /**
             * 复选框
             */
            $scope.checkItem = function (name) {
                $scope.currentItem[name] = !$scope.currentItem[name];
                //仅支持货到付款勾选时必须勾选支持货到付款
                if(name == "isonlycancod" && $scope.currentItem.isonlycancod){
                    $scope.currentItem.iscancod = true;
                }
                //支持货到付款取消勾选时必须取消勾选仅支持货到付款
                if(name == "iscancod" && !$scope.currentItem.iscancod){
                    $scope.currentItem.isonlycancod = false;
                }
            };
            /**
             * 保存
             */
            $scope.save = function () {
                if(validateService.validateAll(pageId,"#content")){
                    currentService.save($scope);
                }
            };
            /**
             * 返回
             */
            $scope.goBack = function () {
                $scope.addTab('快递信息','../template/configManage/expressInformation.html');
            };

        }]);