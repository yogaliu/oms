/**
 * Created by xs on 2017/3/22.
 */
angular.module("klwkOmsApp")
    .controller("newExpressAreaController", ["$scope","$rootScope","newExpressAreaService","ApiService","expressAreaService","validateService" ,
        function($scope,$rootScope,newExpressAreaService,ApiService,expressAreaService,validateService) {
            //页面service
            var currentService = newExpressAreaService;
            //页面id
            var pageId = "#newExpressArea";
            //进入页面需要执行的方法
            function init(){
                $scope.params = $.extend({},$rootScope.params);
                //下拉选框插件 国家
                $scope.CountryList = {
                    isshow:false,
                    info:[],
                    validate:true,
                    onChange: function(obj,index){	//点击之后的回调
                        if($scope.currentItem.countryid !== obj.id){
                            $scope.currentItem.countryid = obj.id;
                            $scope.currentItem.countryname = obj.name;
                            $scope.currentItem.provinceid = "";
                            $scope.currentItem.provincename = "";
                            $scope.currentItem.cityid = "";
                            $scope.currentItem.cityname = "";
                            $scope.currentItem.countyid = "";
                            $scope.currentItem.countyname = "";
                            currentService.queryProvince($scope);
                        }
                    }
                };
                //下拉选框插件 省
                $scope.ProvinceList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        if($scope.currentItem.provinceid !== obj.id){
                            $scope.currentItem.provinceid = obj.id;
                            $scope.currentItem.provincename = obj.name;
                            $scope.currentItem.cityid = "";
                            $scope.currentItem.cityname = "";
                            $scope.currentItem.countyid = "";
                            $scope.currentItem.countyname = "";
                            currentService.queryCity($scope);
                        }
                    }
                };
                //下拉选框插件 市
                $scope.CityList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        if($scope.currentItem.cityid !== obj.id){
                            $scope.currentItem.cityid = obj.id;
                            $scope.currentItem.cityname = obj.name;
                            $scope.currentItem.countyid = "";
                            $scope.currentItem.countyname = "";
                            currentService.queryCounty($scope);
                        }
                    }
                };
                //下拉选框插件 区
                $scope.CountyList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        if($scope.currentItem.countyid !== obj.id){
                            $scope.currentItem.countyid = obj.id;
                            $scope.currentItem.countyname = obj.name;
                        }
                    }
                };
                if($scope.params.oprate == 'edit'){
                    $scope.currentItem = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },$scope.params.obj);
                    //下拉选框 快递名称
                    $scope.Express ={
                        isshow:false,
                        validate:true,
                        info:expressAreaService.allExpress,
                        objName : {id:$scope.currentItem.expressid},
                        onChange : function(obj,index){
                            $scope.currentItem.expressid = obj.id;
                            $scope.currentItem.expressname = obj.name;
                        }
                    };
                    //配置国家 省 市 区
                    currentService.queryCountry($scope);
                    currentService.queryProvince($scope,true);
                    currentService.queryCity($scope,true);
                    currentService.queryCounty($scope,true);
                }else if($scope.params.oprate == 'creat'){
                    $scope.currentItem = {
                        "id": "00000000-0000-0000-0000-000000000000",
                        "createdate": "0001-01-01 00:00:00",
                        "provinceallarrive": false,
                        "cityallarrive": false,
                        "keyword": "",
                        "iskeywordarrive": false,
                        "isinternational": false,
                        "packagecentercode": "",
                        "packagecentername": "",
                        "isdisabled": false,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    //下拉选框 快递名称
                    $scope.Express ={
                        isshow:false,
                        validate:true,
                        info:expressAreaService.allExpress,
                        onChange : function(obj,index){
                            $scope.currentItem.expressid = obj.id;
                            $scope.currentItem.expressname = obj.name;
                        }
                    };
                    //配置国家
                    currentService.queryCountry($scope);
                }

            }
            init();
            /**
             * 返回
             */
            $scope.goBack = function () {
                $scope.addTab('快递范围','../template/configManage/expressArea.html');
            };
            /**
             * 复选框
             */
            $scope.checkItem = function (name) {
                $scope.currentItem[name] = !$scope.currentItem[name];
            };
            /**
             * 保存
             */
            $scope.save = function () {
                if(validateService.validateAll(pageId,"#content")){
                    currentService.save($scope);
                }
            };

    }]);