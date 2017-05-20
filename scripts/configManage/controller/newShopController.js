/**
 * Created by xs on 2017/3/23.
 */
angular.module("klwkOmsApp")
    .controller("newShopController", ["$scope","$rootScope","newShopService","APP_MENU","ApiService","validateService",
        function($scope,$rootScope,newShopService,APP_MENU,ApiService,validateService) {
            //页面id
            var pageId = "#newShop";
            //页面service
            var currentService = newShopService;
            //进入页面需要执行的方法
            function init(){
                //获取页面参数
                $scope.params = $.extend({},$rootScope.params);
                validateService.initValidate(pageId);
                //下拉选框插件 公司
                $scope.companyList = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.editItem.companyid = obj.id;
                    }
                };
                //下拉选框插件 平台类型
                $scope.platformtypeList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.editItem.platformtype = obj.id;
                    }
                };
                //下拉选框插件 平台接口
                $scope.interfaceList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.editItem.interfaceid = obj.id;
                    }
                };
                if($scope.params.oprate == 'edit'){
                    //修改的店铺未初始化店铺设置时 保存修改时提交店铺设置默认值
                    if($.isEmptyObject($scope.params.obj.storeSetting)){
                        $scope.params.obj.storeSetting = {
                            "StoreId": "00000000-0000-0000-0000-000000000000",
                            "DefaultPayType": 0,
                            "DispatchMode": 0,
                            "IsPreDeliveryFirit": false,
                            "IsRelSales": false,
                            "IsCheckBuyerMemo": false,
                            "IsCheckCod": false,
                            "IsFilter": false,
                            "IsPush": false,
                            "IsCheckAddress": false,
                            "IsConnectCloudsStack": false,
                            "IsInvoiceAutoAudit": false,
                            "IsAutoDownloadDistribution": false,
                            "IsAutoDownloadAlipayRecord": false,
                            "IsAutoAuditRefundOrder": false,
                            "MergeMaxCount": 0,
                            "Mode": 0,
                            "DistributionRule": 0,
                            "IsUseDistributionAmount": false,
                            "PreSellNHNoSplit": 0,
                            "TotalProduct": 0,
                            "TotalAmount": 0,
                            "IsCheckSellerMemo": false,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        };
                    }else{
                        $scope.params.obj.storeSetting = $.extend({
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        },$scope.params.obj.storeSetting);
                    }
                    $scope.editItem = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },$scope.params.obj);
                    //下拉选框插件 店铺性质
                    $scope.storetypeList = {
                        isshow:false,
                        validate:true,
                        info:klwTool.jsonToArray2(APP_MENU.storeNature,'id','name'),
                        objName:{id:$scope.editItem.storetype},
                        onChange: function(obj,index){	//点击之后的回调
                            $scope.editItem.storetype = obj.id;
                        }
                    };
                }else if($scope.params.oprate == 'creat'){
                    $scope.editItem = {
                        "Id": "00000000-0000-0000-0000-000000000000",
                        "CreateDate": "0001-01-01 00:00:00",
                        "code": "", //编码
                        "name": "", //名称
                        "note": "", //备注
                        "telephone": "", //电话
                        "address": "", //地址
                        "website": "", //官网
                        "OrderId": 0,
                        "IsDisabled": false,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    //下拉选框插件 店铺性质
                    $scope.storetypeList = {
                        isshow:false,
                        validate:true,
                        info:klwTool.jsonToArray2(APP_MENU.storeNature,'id','name'),
                        onChange: function(obj,index){	//点击之后的回调
                            $scope.editItem.storetype = obj.id;
                        }
                    };
                }
                var promise = ApiService.listenAll(function(deffer){
                    if($.isEmptyObject(currentService.allPlatformType)){
                        currentService.getPlatformType(deffer);
                    }else{
                        deffer.resolve();
                    }
                });
                promise.then(function(){
                    var list = currentService.allPlatformType;
                    $.each(list,function (index, obj) {
                        obj.id = obj.value;
                    });
                    //平台类型下拉组件 选项赋值
                    $scope.platformtypeList.info = list;
                    if($scope.params.oprate == 'edit'){
                        $scope.platformtypeList.setValue({id:$scope.editItem.platformtype});
                    }
                });
                //获取公司选项
                currentService.queryCompany($scope);
                //获取平台接口选项
                currentService.queryPlatformInterface($scope);
            }
            init();
            /**
             * 保存
             */
            $scope.save = function () {
                if(validateService.validateAll(pageId,"#formContent")){
                    currentService.saveStore($scope);
                }
            };
            /**
             * 取消 返回店铺信息页面
             */
            $scope.goBack = function () {
                $scope.addTab('店铺信息','../template/configManage/shopInformation.html');
            };

        }]);