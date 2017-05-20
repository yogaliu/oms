/**
 * Created by zgh on 2017/4/11.
 */
angular.module('klwkOmsApp')
    .service('quitGoodsNoticeBillService',['ApiService','toolsService','orderManagePublicService','APP_MENU',
        function (ApiService,toolsService,orderManagePublicService,APP_MENU) {
            //配置数据
            var configData = {
                //退货通知单列定义
                columns : [
                    {name : '状态',tag : 'status',otherInfo:APP_MENU['returnRequisitionStauts']},
                    {name : '单据编号',tag : 'code'},
                    {name : '箱码',tag : 'packageno'},
                    {name : '制单人', tag : 'createusername'},
                    {name : '制单时间', tag : 'createdate'},
                    {name : '退入仓库', tag : 'warehousename'},
                    {name : '快递公司', tag : 'expresscode'},
                    {name : '快递编码', tag : 'expressno'}
                ]
            };

            //dom操作
            var noticeBillDomOperate = {
                domInit : function (scope) {
                    //退货通知单表头信息
                    scope.quitGoodsHead = configData.columns;
                    //分页配置
                    this.pageSet(scope);
                    //已经选中的订单
                    scope.orderListHasChosed = [];
                    //选中订单的各个字段的合法性
                    scope.orderListValidity = {};
                    //右侧列表配置显示与收起
                    scope.listAllocation = false;
                    //批量取消是否可以点击
                    scope.batchCancleEnabled = true;
                    //高级搜索初始化
                    scope.advancedSearchObj1 = orderManagePublicService.orderManagerPublicFunction.advanceSearch(scope);
                    scope.advancedSearchObj = $.extend(true, {}, scope.advancedSearchObj1);
                    //上一页初始化
                    scope.prev = function () {
                        orderManagePublicService.orderManagerPublicFunction.prevPage(scope);
                    };
                    //下一页初始化
                    scope.next = function () {
                        orderManagePublicService.orderManagerPublicFunction.nextPage(scope);
                    };

                    //制单时间（开始）
                    this.timePicker('CreateDateBegin');
                    //制单时间（结束）
                    this.timePicker('CreateDateEnd');
                    //高级搜索条件初始化
                    this.searchCondition(scope);

                    //列信息修改配置
                    scope.allocation = {
                        "theadList" : scope.quitGoodsHead,
                        // 指令控制器的ID唯一标识
                        "timestamp" : null
                    };
                    //初始化配货通知单数据
                    quitGoodsListInterfaceDeal.getQuitGoodsListDeal(scope);
                    //获取仓库信息
                    quitGoodsListInterfaceDeal.getAllWareHouseDeal(scope);
                },
                //分页配置
                pageSet : function (scope){
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope,function(){
                        quitGoodsListInterfaceDeal.getQuitGoodsListDeal(scope);
                    });
                },
                //时间控件
                timePicker : function (id){
                    $('#'+id).datetimepicker({
                        format: 'yyyy-mm-dd H:i:s',
                        weekStart: 1,
                        autoclose: true,
                        startView: 2,
                        minView: 2,
                        forceParse: false,
                        todayBtn:1,
                        language: 'zh-CN'
                    });
                },
                //高级搜索筛选条件
                searchCondition : function (scope){
                    //高级搜索条件（输入）
                    scope.formData = {};
                    //高级搜索条件（选择）
                    scope.formChoseData = {};
                    //退入仓库
                    scope.wareHouse = {};
                }
            };

            //接口数据处理
            var quitGoodsListInterfaceDeal = {
                //初始化配货通知单数据
                getQuitGoodsListDeal : function (scope) {
                    quitGoodsListInterface.getQuitGoodsList(scope,function (res) {
                        if(res.success){
                            //批量取消置灰
                            scope.batchCancleEnabled = true;
                            //取消全选标志
                            scope.checkAll = false;
                            scope.quitGoodsBody = res.data;
                            //重新设置分页的页数
                            scope.paginationConf.totalItems = res.total;
                            scope.$on("conditionCallback",function(){
                                //$('#invoicesList').DataTable( {
                                //    scrollY: 440,
                                //    scrollX:true,
                                //    paging: false,
                                //    searching: false,
                                //    info : false,
                                //    destory : true
                                //} );
                            });
                        }
                    });
                },

                /**
                 * 取消退货通知单
                 * @param scope
                 * @param list 要取消的那个通知单数据
                 * @param details 商品信息
                 */
                cancleQuitGoodsDeal : function (scope,list,details) {
                    quitGoodsListInterface.cancleQuitGoods(scope,list,details, function (res) {
                        if(res.success){
                            quitGoodsListInterfaceDeal.getQuitGoodsListDeal(scope);
                        }else{
                            alert('取消失败');
                        }
                    });
                },

                //获取仓库信息
                getAllWareHouseDeal : function (scope){
                    quitGoodsListInterface.getAllWareHouse(scope, function (res) {
                        if(res.success){
                            //对仓库数据进行整理
                            toolsService.setDataShowType(scope,res.data,scope.wareHouse,5);
                        }else{
                            alert('取消失败');
                        }
                    });
                },

                /**
                 * 获取退货通知单详情
                 * @param scope
                 * @param list 订单信息
                 */
                getQuitGoodsDetails : function (scope,list) {
                    var id = list.id;
                    quitGoodsListInterface.getQuitGoodsDetails(scope,id, function (res) {
                        if(res.success){
                            list.details = res.data;
                        }else{
                            alert('取消失败');
                        }
                    });
                }
            };

            //退货通知单接口
            var quitGoodsListInterface = {
                /**
                 * 获取所有仓库信息
                 * @param scope $scope对象
                 * @param callback 获取仓库后的回调函数
                 */
                getAllWareHouse : function (scope,callback) {
                    var url = '/BasicInformation/Warehouse/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":5000,
                        "SeletedCount":0,
                        "Data":[],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var wareHose = ApiService.postCache(url,paramObj);
                    wareHose.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取退货通知单信息
                 * @param scope
                 * @param callback 回调函数
                 */
                getQuitGoodsList : function (scope,callback) {
                    var url = '/SalesOrder/Return/ReturnNotice/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "Timespan":"00:00:00.201",
                        "SeletedCount":0,
                        "Data":[
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Code",
                                "Name": "Code",
                                "Value": scope.formData.Code,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CreateDate",
                                "Name": "CreateDateBegin",
                                "Value": scope.formData.CreateDateBegin,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CreateDate",
                                "Name": "CreateDateEnd",
                                "Value": scope.formData.CreateDateEnd,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Product",
                                "Name": "Product",
                                "Value": scope.formData.Product,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "PackageNo",
                                "Name": "PackageNo",
                                "Value": scope.formData.PackageNo,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "Status",
                                "Name": "Status",
                                "Value": scope.formChoseData.Status ? scope.formChoseData.Status.value : undefined,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "WarehouseName",
                                "Name": "WarehouseName",
                                "Value": scope.formChoseData.WarehouseName ? scope.formChoseData.WarehouseName.value : undefined,
                                "Children": []
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var quitGoodsList = ApiService.postLoad(url,paramObj);
                    quitGoodsList.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 退货通知单取消
                 * @param scope
                 * @param list 要取消掉的订单的数据
                 * @param details 商品详情
                 * @param callback
                 */
                cancleQuitGoods : function (scope,list,details,callback){
                    var url = '/SalesOrder/Return/ReturnNotice/Cannel';
                    var paramObj = ApiService.getBasicParamobj();
                    var tmp = [];
                    for(var i = 0,j = list.length;i < j;i++){
                        tmp.push({
                            "Id": list[i].id,
                            "ApproveUser": list[i].approveuser ? list[i].approveuser : '',
                            "ApproveDate": list[i].approvedate ? list[i].approvedate : '',
                            "CreateUserName": list[i].createusername ? list[i].createusername : '',
                            "CreateDate": list[i].createdate ? list[i].createdate : '',
                            "WarehouseName": list[i].warehousename ? list[i].warehousename : '',
                            "WarehouseCode": list[i].warehousecode ? list[i].warehousecode : '',
                            "Code": list[i].code ? list[i].code : '',
                            "Status": 0,
                            "PackageNo": list[i].packageno ? list[i].packageno : '',
                            "Details": list[i].details,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        });
                    }
                    paramObj.body = JSON.stringify(tmp);
                    var quitGoodsList = ApiService.postLoad(url,paramObj);
                    quitGoodsList.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 获取退货通知单详情
                 * @param scope
                 * @param id 要获取详情的配货通知单的id
                 * @param callback
                 */
                getQuitGoodsDetails : function (scope,id,callback){
                    var url = '/SalesOrder/Return/ReturnNotice/DetailQuery';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = id;
                    var quitGoodsList = ApiService.postLoad(url,paramObj);
                    quitGoodsList.then(function (res) {
                        callback(res);
                    });
                }

            };

            return {
                quitGoodsListInterfaceDeal : quitGoodsListInterfaceDeal,
                noticeBillDomOperate : noticeBillDomOperate
            }

        }
    ]);