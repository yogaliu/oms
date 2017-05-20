/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("newPlatformInterfaceController", ["$scope","$rootScope","newPlatformInterfaceService","APP_MENU","validateService" ,
        function($scope,$rootScope,newPlatformInterfaceService,APP_MENU,validateService) {
            var pageId = "#newPlatformInterface";
            var currentService = newPlatformInterfaceService;
            function init(){
                $scope.params = $.extend({},$rootScope.params);
                //平台类型下拉组件
                $scope.platformtypeList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.platformObj.platformtype = obj.id;
                    }
                };
                //服务商下拉组件 物流接口
                $scope.logisticsfacilitator = {
                    isshow:false,
                    info:klwTool.jsonToArray2(APP_MENU.facilitator,"id","name"),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.logisticsObj.code = obj.id;
                    }
                };
                //服务商下拉组件 服务接口
                $scope.servicefacilitator = {
                    isshow:false,
                    info:klwTool.jsonToArray2(APP_MENU.facilitator,"id","name"),
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.serviceObj.code = obj.id;
                    }
                };
                if($scope.params.type == 'platform'){
                    if($scope.params.oprate == 'creat'){
                        $scope.platformObj = {
                            "id":"00000000-0000-0000-0000-000000000000",
                            "name": "", //名称
                            "platformtype": "", //平台类型
                            "appkey": "", //AppKey
                            "appsecret": "", //AppSecret
                            "url": "", //服务地址
                            "redirecturl": "http://www.greatonce.com", //回调地址 给默认值，不允许修改
                            "accesstoken": "", //AccessToken
                            "refreshtoken": "", //RefreshToken
                            "extend1": "", //拓展信息1
                            "extend2": "", //拓展信息2
                            "createdate": "0001-01-01 00:00:00",
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        };
                    }else if ($scope.params.oprate == 'edit'){
                        $scope.platformObj = $.extend({
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        },$scope.params.obj);
                    }
                    currentService.getPlatformType($scope);
                }else if($scope.params.type == 'logistics'){
                    if($scope.params.oprate == 'creat'){
                        $scope.logisticsObj = {
                            "id": "00000000-0000-0000-0000-000000000000",
                            "name": "", //名称
                            "code": "", //服务商
                            "appkey": "", //AppKey
                            "appsecret": "", //AppSecret
                            "accesstoken": "", //客户编码
                            "url": "", //服务地址
                            "createdate": "0001-01-01 00:00:00",
                            "isdisabled": false,
                            "iscainiao": false, //是否菜鸟
                            "ispushstockchange": false, //推送库存异动
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        };
                    }else if ($scope.params.oprate == 'edit'){
                        $scope.logisticsObj = $.extend({
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        },$scope.params.obj);
                        $scope.logisticsfacilitator.objName = {id:$scope.logisticsObj.code};
                    }
                }else if($scope.params.type == 'service'){
                    if($scope.params.oprate == 'creat'){
                        $scope.serviceObj = {
                            "id": "00000000-0000-0000-0000-000000000000",
                            "name": "", //名称
                            "code": "", //服务商
                            "appkey": "", //AppKey
                            "appsecret": "", //AppSecret
                            "createdate": "0001-01-01 00:00:00",
                            "isdisabled": false,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        };
                    }else if ($scope.params.oprate == 'edit'){
                        $scope.serviceObj = $.extend({
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        },$scope.params.obj);
                        $scope.servicefacilitator.objName = {id:$scope.serviceObj.code};
                    }
                }
                validateService.initValidate(pageId);

            }
            init();
            /**
             * 保存
             */
            $scope.save = function () {
                if ($scope.params.type == 'platform') {
                    if(validateService.validateAll(pageId,"#platform")){
                        currentService.savePlatformInterface($scope);
                    }
                } else if ($scope.params.type == 'logistics') {
                    if(validateService.validateAll(pageId,"#logistics")){
                        currentService.saveLogisticsInterface($scope);
                    }
                } else if ($scope.params.type == 'service') {
                    if(validateService.validateAll(pageId,"#service")){
                        currentService.saveServiceInterface($scope);
                    }
                }
            };
            /**
             * 取消
             */
            $scope.back = function () {
                if($scope.params.type == 'platform'){
                    $scope.addTab('平台接口','../template/configManage/platformInterface.html');
                }else if($scope.params.type == 'logistics'){
                    $scope.addTab('物流接口','../template/configManage/logisticsInterface.html');
                }else if($scope.params.type == 'service'){
                    $scope.addTab('服务接口','../template/configManage/serviceInterface.html');
                }
            };
            /**
             * 复选项公用方法
             */
            $scope.checkItem = function (obj,name) {
                obj[name] = !obj[name];
            };
            

    }]);