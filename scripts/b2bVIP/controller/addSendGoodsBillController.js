/**
 * Created by jx on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("addSendGoodsBillController", ["$scope", "$rootScope", "addSendGoodsBillService", "APP_MENU", "ApiService","validateService","toolsService", function ($scope, $rootScope, addSendGoodsBillService, APP_MENU, ApiService,validateService,toolsService) {

        //当前页面id
        var indexID = '#addSendGoodsBill';
        //进入页面需要执行的方法
        function init() {
            //接收参数
            $scope.params = $.extend(true,{},$rootScope.params);

            //初始化表单验证
            validateService.initValidate(indexID);

            //表单字段
            $scope.modify1 = {
                "PoCode": '',
                "SendWarehouseId": '',
                "SendWarehouseName": '',
                "CarrierName": '',
                "CarrierCode": '',
                "DeliveryMethod": '',
                "ArrivalTime": '',
                "VipArrivalTime": '',
                "DeliveryTime": '',
                "WaybillNumber": '',
                "ScheduleCode": '',
                "ScheduleName": '',
                "ScheduleId": '',
                "StoreId": '',
                "StoreName": '',
                "note": '',
                "id": '0',
                "creatDate": '0001-01-01 00:00:00'
            };
            $scope.modify = $.extend(true, {}, $scope.modify1);

            //修改页面
            if($scope.params.type=='modify'){
                $scope.modify = $.extend(true, {}, $scope.params.tableList);
            }

            addSendGoodsBillService.GeneralClassiFicationGet($scope);
            addSendGoodsBillService.GeneralClassiFicationGet2($scope);
            addSendGoodsBillService.GeneralClassiFicationGet3($scope);
            addSendGoodsBillService.WarehouseGet($scope);
            //唯品店铺
            addSendGoodsBillService.StoreGet($scope);
            //唯品档期
            addSendGoodsBillService.VipScheduleGet($scope);

            //下拉框组件
            selectFun();

            //档期选择侧滑框
            $scope.rightSideObj = {
                searchText: '',
                schedulenameShow: function () {
                    $(indexID + ' #rightSideModal').show(500);
                },
                hideModal: function () {
                    $(indexID + ' #rightSideModal').hide(500);
                    $scope.rightSideObj.searchText = '';
                    $.each($scope.tableRightSideList, function (i, obj) {
                        obj.isHide = false;
                    });
                },
                search: function () {
                    $.each($scope.tableRightSideList, function (i, obj) {
                        if (JSON.stringify(obj).indexOf($scope.rightSideObj.searchText) != -1) {
                            obj.isHide = false;
                        } else {
                            obj.isHide = true;
                        }
                    });
                },
                select: function (obj, e) {
                    $scope.selectSchedulename = obj.schedulename;
                    $scope.selectSchedulecode = obj.schedulecode;
                    $scope.selectScheduleid = obj.id;
                    $scope.selectStoreid = obj.storeid;
                    $scope.selectPoCode = obj.pocode;
                    $scope.selectStoreName = obj.storename;

                    $(e.target).closest('tbody').find('tr').removeClass('green');
                    $(e.target).closest('tr').addClass('green');
                },
                ensure: function () {
                    $scope.modify.ScheduleCode = $scope.selectSchedulecode;
                    $scope.modify.ScheduleName = $scope.selectSchedulename;
                    $scope.modify.ScheduleId = $scope.selectScheduleid;
                    $scope.modify.PoCode = $scope.selectPoCode;
                    $scope.modify.StoreId = $scope.selectStoreid;
                    $scope.modify.StoreName = $scope.selectStoreName;
                    $scope.selectStore.objName = {id: $scope.modify.StoreId};

                    $(indexID + ' #rightSideModal').hide(500);
                }
            };

            //保存
            $scope.submit = function () {

                if (!$scope.modify.ScheduleId) {
                    toolsService.alertMsg("请选择唯品档期");
                    return false;
                }

                if(validateService.validateAll(indexID,'.basic-message')){
                    addSendGoodsBillService.VipStockAdjustOrderSave($scope);
                }

            };
            //返回//取消
            $scope.returnFun = function () {
                var index = $('#addSendGoodsBill').closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/b2bVIP/sendGoodsBill.html';
                $scope.option[index].name = '唯品送货单';
            }
        }

        init();

        function selectFun() {
            //下拉选框插件 配送方式
            $scope.selectDeliveryMethod = {
                isshow: false,
                validate:true,
                info: klwTool.jsonToArray2(APP_MENU.CITshippingMethods, 'id', 'name'),
                objName: {id: $scope.modify.DeliveryMethod},
                onChange: function (obj, index) { //点击之后的回调
                    $scope.modify.DeliveryMethod = obj.id;
                }
            };

            //下拉选框插件 唯品店铺
            $scope.selectStore = {
                isshow: false,
                validate:true,
                info:[],
                onChange: function (obj, index) { //点击之后的回调
                    $scope.modify.StoreId = obj.id;
                    $scope.modify.StoreName = obj.name;
                }
            };

            //下拉选框插件 品牌
            $scope.selectBrand = {
                isshow: false,
                validate:true,
                info: [],
                onChange: function (obj, index) { //点击之后的回调
                    $scope.modify.BrandCode = obj.code;
                    $scope.modify.BrandName = obj.name;
                    $scope.modify.BrandId = obj.id;
                }
            };

            //下拉选框插件 承运商
            $scope.selectCarrierName = {
                isshow: false,
                validate:true,
                info: [],
                onChange: function (obj, index) { //点击之后的回调
                    $scope.modify.CarrierName = obj.name;
                    $scope.modify.CarrierCode = obj.code;
                    $scope.modify.CarrierId = obj.id;
                }

            };

            //下拉选框插件 到货时间
            $scope.selectVipArrivalTime = {
                isshow: false,
                validate:true,
                info: [],
                onChange: function (obj, index) { //点击之后的回调
                    $scope.modify.VipArrivalTime = obj.name;
                    $scope.modify.VipArrivalTimeId = obj.id;
                }
            };

            //下拉选框插件 到货仓库
            $scope.selectSendWareHouse = {
                isshow: false,
                validate:true,
                info: [],
                onChange: function (obj, index) { //点击之后的回调
                    $scope.modify.SendWarehouseId = obj.id;
                    $scope.modify.SendWarehouseName = obj.name;
                }
            };
        }

        //配置时间控件
        $(indexID + ' .dateTime').datetimepicker({
            format: 'yyyy-mm-dd',
            weekStart: 1,
            autoclose: true,
            startView: 2,
            minView: 2,
            forceParse: false,
            todayBtn: 1,
            language: 'zh-CN'
        });
        // 点击触发时间控件
        $scope.showDatetimePick = function (myevent) {
            $(myevent.target).datetimepicker('show');
        };

    }]);