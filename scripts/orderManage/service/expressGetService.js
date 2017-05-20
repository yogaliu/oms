/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('expressGetService',['ApiService','toolsService','orderManagePublicService',
        function (ApiService,toolsService,orderManagePublicService) {
            //配置数据
            var configData = {
                //快递签收列定义
                columns : [
                    {name : '签收单特殊标识',tag : 'tips'},
                    {name : '状态',tag : 'status',otherInfo : {1: '正常签收',2 : '异常签收'}},
                    {name : '物流公司',tag : 'expressname'},
                    {name : '物流单号', tag : 'expressno'},
                    {name : '签收异常类型', tag : 'signerrortypename'},
                    {name : '包裹重量', tag : 'weight'},
                    {name : '备注', tag : 'remarks'},
                    {name : '制单人', tag : 'createusername'},
                    {name : '确认人', tag : 'confirmusername'},
                    {name : '确认日期', tag : 'confirmdate'}

                ]
            };

            //快递签收dom方法
            var expressGetDomOperate = {
                //初始化
                domInit : function (scope){

                    //配置列数据
                    scope.expressHead = configData.columns;
                    //列信息修改配置
                    scope.allocation = {
                        "theadList" : scope.expressHead,
                        // 指令控制器的ID唯一标识
                        "timestamp" : null
                    };

                    //初始化分页
                    this.pageSet(scope);
                    //向上一页翻
                    scope.prev = function () {
                        orderManagePublicService.orderManagerPublicFunction.prevPage(scope);
                    };
                    //向下一页翻
                    scope.next = function () {
                        orderManagePublicService.orderManagerPublicFunction.nextPage(scope);
                    };
                    //高级搜索初始化
                    scope.advancedSearchObj1 = orderManagePublicService.orderManagerPublicFunction.advanceSearch(scope);
                    scope.advancedSearchObj = $.extend(true, {}, scope.advancedSearchObj1);

                    //复选框默认不勾选
                    scope.labelSel = false;

                    //批量操作配置
                    this.pullSelect(scope);

                    //制单时间（开始）
                    this.timePicker('CreateDate1');
                    //制单时间（结束）
                    this.timePicker('CreateDate2');
                    //确认时间(开始）
                    this.timePicker('ConfirmBeginDate');
                    //确认时间（结束）
                    this.timePicker('ConfirmEndDate');

                    //高级搜索信息收集(填写)
                    scope.formData = {};
                    //高级搜索信息收集(选择)
                    scope.formChoseData = {};

                    //高级搜索条件
                    scope.expressList = {};

                    //获取快递信息
                    expressGetInterfaceDeal.getAllExpressInfo(scope);
                    //列表初始化
                    expressGetInterfaceDeal.getExpressInfo(scope);
                },
                //批量操作配置
                pullSelect : function (scope) {
                    //下拉框配置
                    scope.menuInfo = {
                        //批量操作配置
                        batch : {
                            isshow:false,
                            info:[
                                {name:'批量备注',tag : 'batchNote'},
                                {name : '作废' ,tag : 'invalid'}
                            ],
                            name:'批量操作',
                            onChange: function(obj,index){	//点击之后的回调
                                //获取所有已选中的订单信息
                                var ids = [];
                                for(var i = 0, j = scope.expressBody.length;i < j;i++){
                                    if(scope.expressBody[i].trShow){
                                        ids.push(scope.expressBody[i].id);
                                    }
                                }
                                if(ids.length < 1){
                                    toolsService.alertMsg('请先选择订单信息');
                                }else{
                                    //作废
                                    if(obj.tag == 'invalid'){
                                        expressGetInterfaceDeal.obsoleteExpress(scope,ids);
                                        //批量备注
                                    }else if(obj.tag =='batchNote'){
                                        //模态框配置信息
                                        scope.modal = {
                                            title : '提示',
                                            confirm : function (content) {
                                                $('.info-get-modal').modal('hide');
                                                expressGetInterfaceDeal.batchAddTagName(scope,content,ids);
                                                //清空提示框里面的文字
                                                scope.modal.content = '';
                                            }
                                        };
                                        $('.info-get-modal').modal('show');
                                    }
                                }
                            }
                        }
                    };
                },
                //分页配置
                pageSet : function (scope) {
                    //公共方法中的分页配置
                    orderManagePublicService.orderManagerPublicFunction.pageSet(scope, function () {
                        expressGetInterfaceDeal.getExpressInfo(scope,
                            function (pageNum) {
                                //ng-repeat执行完后的回调
                                scope.$on("conditionCallback",function(){
                                    //$('#expressTable').fixedHeaderTable({
                                    //    footer: false,
                                    //    fixedColumns: 1,
                                    //    destroy :true
                                    //});
                                });
                            });
                    });
                },
                //日期控件
                timePicker : function (id) {
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
                }
            };

            //快递签收接口处理
            var expressGetInterfaceDeal = {
                //获取快递签收信息数据
                getExpressInfo : function (scope) {
                    Interface.getExpressInfo(scope, function (res) {
                        if(res.success){
                            //清空全选
                            scope.checkAll = false;
                            //列表详细数据
                            scope.expressBody = res.data;
                            scope.paginationConf.totalItems = res.total;
                        }else{
                            toolsService.alertError(res.errMessage);
                        }
                    });
                },

                //快递公司
                getAllExpressInfo : function (scope){
                    Interface.getAllExpressInfo(scope, function (res) {
                        if(res.success){
                            //对快递信息进行格式化处理
                            toolsService.setDataShowType(scope,res.data,scope.expressList,5);
                        }else{
                            toolsService.alertError(res.errMessage);
                        }
                    });
                },
                //作废已签收的快递
                obsoleteExpress : function (scope,ids) {
                    Interface.obsoleteExpress(scope,ids, function (res) {
                        if(res.success){
                            //作废成功
                            toolsService.alertSuccess('作废成功！');
                            //刷新页面
                            expressGetInterfaceDeal.getExpressInfo(scope);
                        }else{
                            toolsService.alertError(res.errMessage);
                        }
                    });
                },
                //添加备注
                batchAddTagName : function (scope,tagname,ids){
                    Interface.batchAddTagName(scope,tagname,ids, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('添加成功！');
                            //刷新页面
                            expressGetInterfaceDeal.getExpressInfo(scope);
                        }else{
                            toolsService.alertError(res.errMessage);
                        }
                    });
                }
            };

            //接口请求
            var Interface = {

                /**
                 * 快递信息批量备注
                 * @param scope
                 * @param tagname 要备注的内容
                 * @param ids 要备注的信息的id
                 * @param callback
                 */
                batchAddTagName : function (scope,tagname,ids,callback) {
                    var url = '/SalesOrder/Return/ReturnSign/BatchSaveRemark';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Id",
                        "Value":ids,
                        "Children":[]
                    },{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Remark",
                        "Value":tagname,
                        "Children":[]
                    }]);
                    var tagName = ApiService.postLoad(url,paramObj);
                    tagName.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 快递签收中作废快递信息
                 * @param scope
                 * @param ids 要作废快递信息的id号
                 * @param callback
                 */
                obsoleteExpress : function (scope,ids,callback) {
                    var url = '/SalesOrder/Return/ReturnSign/Obsolete';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(ids);
                    var express = ApiService.postLoad(url,paramObj);
                    express.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取签收的快递
                 * @param scope
                 * @param callback
                 */
                getExpressInfo : function (scope,callback) {
                    var url = '/SalesOrder/Return/ReturnSign/Query';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "SeletedCount":0,
                        "Data":[
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsObsolete",
                                "Name": "IsObsolete",
                                "Value": scope.formData.IsObsolete,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "IsConfirm",
                                "Name": "IsConfirm",
                                "Value": scope.formData.IsConfirm,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CreateDate",
                                "Name": "CreateDate1",
                                "Value": scope.formData.CreateDate1,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "CreateDate",
                                "Name": "CreateDate2",
                                "Value": scope.formData.CreateDate2,
                                "Children": []
                            },
                            {
                                "OperateType": 3,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ConfirmDate",
                                "Name": "ConfirmBeginDate",
                                "Value": scope.formData.ConfirmBeginDate,
                                "Children": []
                            },
                            {
                                "OperateType": 5,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ConfirmDate",
                                "Name": "ConfirmEndDate",
                                "Value": scope.formData.ConfirmEndDate,
                                "Children": []
                            },
                            {
                                "OperateType": 0,
                                "LogicOperateType": 0,
                                "AllowEmpty": false,
                                "Field": "ExpressId",
                                "Name": "ExpressId",
                                "Value": scope.formChoseData.ExpressId ? scope.formChoseData.ExpressId.value : undefined,
                                "Children": []
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var express = ApiService.postLoad(url,paramObj);
                    express.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取所有快递信息
                 * @param scope $scope对象
                 * @param callback 获取后台信息后的回调函数
                 */
                getAllExpressInfo : function (scope,callback) {
                    var url = '/BasicInformation/Express/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = [];
                    var express = ApiService.postCache(url,paramObj);
                    express.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                expressGetInterfaceDeal : expressGetInterfaceDeal,
                expressGetDomOperate : expressGetDomOperate
            }
        }
    ]);
