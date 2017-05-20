/**
 * Created by jx on 2017/3/17.
 */
angular.module("klwkOmsApp")
    .controller("addVipMessageController", ["$scope", "$rootScope", "$state", "WAP_CONFIG", "toolsService", "addVipMessageService", "APP_MENU","validateService",
        function ($scope, $rootScope, $state, WAP_CONFIG, toolsService, addVipMessageService, APP_MENU,validateService) {

            //当前页面id
            var indexID = '#addVipMessage';

            function init() {
                //接收参数
                $scope.params = $.extend(true, {}, $rootScope.params);

                //初始化表单验证
                validateService.initValidate(indexID);

                //表单字段
                $scope.vipObj1 = {
                    "customerid" :"00000000-0000-0000-0000-000000000000",
                    "code": '',
                    "name": '',
                    //1:女
                    "sex": 0,
                    //加急发货
                    "speeddelivery": false,
                    "levelid": '',
                    "levelname": '',
                    "price": '',
                    //黑名单1
                    "status": 0,
                    "storeid": '',
                    "storename": '',
                    "buytimes": '',
                    "nationalid": '',
                    "nationalname": '',
                    "provinceid": '',
                    "provincename": "",
                    "cityid": '',
                    "cityname": '',
                    "countyid": '',
                    "countyname": '',
                    //收货人
                    "consignee": '',
                    "mobile": '',
                    "telephone": '',
                    "email": '',
                    "address": ''
                };

                $scope.vipObj= $.extend(true,{},$scope.vipObj1);

                //查询店铺
                addVipMessageService.StoreGet($scope);

                //查询会员等级
                addVipMessageService.GeneralClassiFicationGet($scope);

                //查询国家
                addVipMessageService.RegionQuery($scope,'National');

                //新增页面or修改页面
                if ($scope.params.type == 'add') {
                    $scope.vipObj = $.extend(true, {}, $scope.vipObj1);
                } else if ($scope.params.type == 'modify') {
                    $scope.vipObj = $scope.params.tableList;
                    //查询国家
                    addVipMessageService.RegionQuery($scope,'National');
                    addVipMessageService.RegionQuery($scope,'Province',$scope.vipObj.nationalid);
                    addVipMessageService.RegionQuery($scope,'City',$scope.vipObj.provinceid);
                    addVipMessageService.RegionQuery($scope,'County',$scope.vipObj.cityid);
                }

                //下拉框组件
                selectInit();

                //表单提交
                $scope.addSubmit = function () {
                    if (validateService.validateAll(indexID,'.basic-message')) {
                        addVipMessageService.CustomerSave($scope);
                    }
                };

                //返回/取消
                $scope.returnFun = function () {
                    var index = $(indexID).closest('[data-index]').attr('data-index');
                    $scope.option[index].url = '../template/marketingManage/vipMessage.html';
                    $scope.option[index].name = '会员信息';
                };

                //复选框默认不勾选
                $scope.labelSel = false;

                //复选框勾选与取消勾选
                $scope.isLabelSel = function (myEvent,content) {
                    toolsService.isLabelSel($scope, myEvent);

                    if(content=='speeddelivery'){
                        $scope.vipObj.speeddelivery = !$scope.vipObj.speeddelivery;
                    }
                };
            }

            init();

            //下拉框组件
            function selectInit() {
                //下拉选框插件 性别选择
                $scope.selectSex = {
                    isshow: false,
                    validate:true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingSex, 'id', 'name'),
                    objName: {id: $scope.vipObj.sex},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.vipObj.sex = obj.id;
                    }
                };

                //下拉选框插件 状态选择
                $scope.selectUserStatus = {
                    isshow: false,
                    validate:true,
                    info: klwTool.jsonToArray2(APP_MENU.marketingUserStatus, 'id', 'name'),
                    objName: {id: $scope.vipObj.status},
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.vipObj.status = obj.id;
                    }
                };

                //下拉选框插件 店铺
                $scope.selectStore = {
                    isshow: false,
                    validate:true,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.vipObj.storename = obj.name;
                        $scope.vipObj.storeid = obj.id;
                    }
                };

                //下拉选框插件 会员等级
                $scope.selectLevel = {
                    isshow: false,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.vipObj.levelname = obj.name;
                        $scope.vipObj.levelid = obj.id;
                    }
                };

                //下拉选框插件 国家
                $scope.selectNational = {
                    isshow: false,
                    validate:true,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.vipObj.nationalname = obj.name;
                        $scope.vipObj.nationalid = obj.id;
                        //查询省
                        addVipMessageService.RegionQuery($scope,'Province',obj.id);
                    }
                };

                //下拉选框插件 省
                $scope.selectProvince = {
                    isshow: false,
                    validate:true,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.vipObj.provincename = obj.name;
                        $scope.vipObj.provinceid = obj.id;
                        $scope.vipObj.cityname = '';
                        $scope.vipObj.cityid = '';
                        $scope.vipObj.countyname = '';
                        $scope.vipObj.countyid = '';
                        $scope.selectCity.objName={};
                        $scope.selectCounty.objName={};
                        //查询市
                        addVipMessageService.RegionQuery($scope,'City',obj.id);
                    }
                };

                //下拉选框插件 市
                $scope.selectCity = {
                    isshow: false,
                    validate:true,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.vipObj.cityname = obj.name;
                        $scope.vipObj.cityid = obj.id;
                        $scope.vipObj.countyname ='';
                        $scope.vipObj.countyid = '';
                        //查询区
                        addVipMessageService.RegionQuery($scope,'County',obj.id);
                    }
                };

                //下拉选框插件 区
                $scope.selectCounty = {
                    isshow: false,
                    validate:true,
                    info: [],
                    onChange: function (obj, index) { //点击之后的回调
                        $scope.vipObj.countyname = obj.name;
                        $scope.vipObj.countyid = obj.id;
                    }
                };

            }



        }]);