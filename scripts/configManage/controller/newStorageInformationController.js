/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("newStorageInformationController", ["$scope","$rootScope","newStorageInformationService","APP_MENU","validateService" ,
        function($scope,$rootScope,newStorageInformationService,APP_MENU,validateService) {
            //页面service
            var currentService = newStorageInformationService;
            //页面id
            var pageId = "#newStorageInformation";
            //进入页面需要执行的方法
            function init(){
                validateService.initValidate(pageId);
                //获取页面参数
                $scope.params = $.extend({},$rootScope.params);
                if($scope.params.oprate == 'edit'){
                    //修改仓库时获取修改项
                    $scope.currentItem = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },$scope.params.obj);
                    //下拉选框插件 仓库类型
                    $scope.warehousetypeList = {
                        isshow:false,
                        validate:true,
                        isDisable:false, //修改仓库时，仓库类型不可更改
                        objName:{id:$scope.currentItem.warehousetype},
                        info:klwTool.jsonToArray2(APP_MENU.warehouseType,'id','name')
                    };
                    if($scope.currentItem.warehousetype == 1){
                        //仓库类型为实体仓时，实体仓库不可选，仓储类型和接口应用可选且必填
                        //下拉选框插件 父级仓库
                        $scope.WarehouseList = {
                            isshow:false,
                            info:[],
                            validate:false,
                            isDisable:false
                        };
                        //下拉选框插件 物流接口
                        $scope.interfaceList = {
                            isshow:false,
                            info:[],
                            validate:true,
                            isDisable:true,
                            onChange: function(obj,index){	//点击之后的回调
                                $scope.currentItem.applicationid = obj.id;
                            }
                        };
                        //下拉选框插件 仓储类型
                        $scope.storageTypeList = {
                            isshow:false,
                            validate:true,
                            isDisable:true,
                            objName:{id:$scope.currentItem.storagetype},
                            info:klwTool.jsonToArray2(APP_MENU.storageType,'id','name'),
                            onChange: function(obj,index){	//点击之后的回调
                                $scope.currentItem.storagetype = obj.id;
                            }
                        };
                    }else {
                        //仓库类型为虚拟仓（独立仓&共享仓）时，仓储类型和接口应用不可选，实体仓库可选且必填
                        //下拉选框插件 父级仓库
                        $scope.WarehouseList = {
                            isshow:false,
                            info:[],
                            validate:true,
                            isDisable:true,
                            onChange: function(obj,index){	//点击之后的回调
                                $scope.currentItem.parentid = obj.id;
                            }
                        };
                        //下拉选框插件 物流接口
                        $scope.interfaceList = {
                            isshow:false,
                            info:[],
                            validate:false,
                            isDisable:false
                        };
                        //下拉选框插件 仓储类型
                        $scope.storageTypeList = {
                            isshow:false,
                            validate:false,
                            isDisable:false,
                            info:[]
                        };
                    }
                }else if($scope.params.oprate == 'creat'){
                    //新增店铺时设置新增项
                    $scope.currentItem = {
                        "code": "", //仓库编码
                        "id": "00000000-0000-0000-0000-000000000000",
                        "createdate": "0001-01-01 00:00:00",
                        "name": "", //仓库名称
                        "telephone": "", //电话
                        "address": "", //仓库地址
                        "isdisabled": false,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    //下拉选框插件 父级仓库
                    $scope.WarehouseList = {
                        isshow:false,
                        info:[],
                        onChange: function(obj,index){	//点击之后的回调
                            $scope.currentItem.parentid = obj.id;
                        }
                    };
                    //下拉选框插件 物流接口
                    $scope.interfaceList = {
                        isshow:false,
                        info:[],
                        onChange: function(obj,index){	//点击之后的回调
                            $scope.currentItem.applicationid = obj.id;
                        }
                    };
                    //下拉选框插件 仓库类型
                    $scope.warehousetypeList = {
                        isshow:false,
                        validate:true,
                        info:klwTool.jsonToArray2(APP_MENU.warehouseType,'id','name'),
                        onChange: function(obj,index){	//点击之后的回调
                            $scope.currentItem.warehousetype = obj.id;
                            if(obj.id == 1){
                                //仓库类型为实体仓时，实体仓库不可选，仓储类型和接口应用可选且必填
                                $scope.currentItem.parentid = "";
                                $scope.WarehouseList.init();
                                $scope.WarehouseList.disable(true);
                                $scope.WarehouseList.validate = false;
                                $scope.storageTypeList.disable(false);
                                $scope.storageTypeList.validate = true;
                                $scope.interfaceList.disable(false);
                                $scope.interfaceList.validate = true;
                            }else {
                                //仓库类型为虚拟仓（独立仓&共享仓）时，仓储类型和接口应用不可选，实体仓库可选且必填
                                $scope.currentItem.storagetype = "";
                                $scope.currentItem.applicationid = "";
                                $scope.storageTypeList.init();
                                $scope.storageTypeList.disable(true);
                                $scope.storageTypeList.validate = false;
                                $scope.interfaceList.init();
                                $scope.interfaceList.disable(true);
                                $scope.interfaceList.validate = false;
                                $scope.WarehouseList.disable(false);
                                $scope.WarehouseList.validate = true;
                            }
                        }
                    };
                    //下拉选框插件 仓储类型
                    $scope.storageTypeList = {
                        isshow:false,
                        info:klwTool.jsonToArray2(APP_MENU.storageType,'id','name'),
                        onChange: function(obj,index){	//点击之后的回调
                            $scope.currentItem.storagetype = obj.id;
                        }
                    };
                }
                //获取父级仓库选项
                currentService.getWarehouse($scope);
                //获取物流接口选项
                currentService.getLogisticsInterface($scope);
            }
            init();
            /**
             * 保存
             */
            $scope.saveStorage = function () {
                if(validateService.validateAll(pageId,"#content")){
                    currentService.saveStorage($scope);
                }
            };
            /**
             * 取消 返回仓库信息页面
             */
            $scope.goBack = function () {
                $scope.addTab('仓库信息','../template/configManage/storageInformation.html');
            };

    }]);