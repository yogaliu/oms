/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('addExpressGetBillService',['ApiService','toolsService','orderManagePublicService','validateService',
        function (ApiService,toolsService,orderManagePublicService,validateService) {
            //新增快递签收单dom操作
            var addExpressDomOperate = {
                //dom初始化
                domInit : function (scope) {

                    //表单初始化验证
                    validateService.initValidate('#addExpressGetBill');
                    //添加的快递数据
                    scope.formData = [];
                    //复选框选中的数据
                    scope.orderListHasChosed = [];
                    //初始化列表
                    addExpressInterfaceDeal.getExpress(scope);
                    //初始化快递信息
                    scope.menuInfo = {
                        //快递信息选择
                        expressList : {
                            isshow:false,
                            info:[],
                            validate : true,
                            name:'请选择',
                            onChange: function(obj,index){	//点击之后的回调
                                scope.ExpressId = obj.id;
                                scope.ExpressName = obj.name;
                            }
                        }
                    };
                    //新增快递签收单列表配置
                    scope.expressColumn = [
                        {name : '',tag : ''},
                        {name : '操作',tag : ''},
                        {name : '快递名称',tag : 'ExpressName'},
                        {name : '重量',tag : 'Weight'},
                        {name : '物流单号',tag: 'ExpressNo'}
                    ];
                }
            };

            //快递签收单接口处理
            var addExpressInterfaceDeal  = {

                //获取快递信息
                getExpress : function (scope) {
                    Interface.getAllExpressInfo(scope, function (res) {
                        if(res.success){
                            scope.menuInfo.expressList.info = res.data;
                        }else{
                            toolsService.alertError('获取快递信息失败！');
                        }
                    });
                },

                //添加快递签收信息
                addExpressSign : function (scope,list,callback) {
                    Interface.addExpressSign(scope,list, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('添加成功！');
                        }else{
                            toolsService.alertError('添加失败！');
                        }
                        callback();
                    });
                }

            };

            //数据接口
            var Interface = {
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
                },
                /**
                 * 添加快递签收
                 * @param scope
                 * @param list 新增数据集合
                 * @param callback
                 */
                addExpressSign : function (scope,list,callback) {
                    var url = '/SalesOrder/Return/ReturnSign/BatchSave';
                    var paramObj = ApiService.getBasicParamobj();
                    var data = [];
                    for(var i = 0,j = list.length;i < j;i++){
                        data.push({
                            "ExpressId": list[i]['ExpressId'],
                            "ID": '',
                            "ExpressName": list[i]['ExpressName'],
                            "ExpressNo": list[i]['ExpressNo'],
                            "Qty": 1,
                            "Weight": list[i]['Weight'],
                            "Status": 1,
                            "CreateUserName": ApiService.getBasicParamobj.UserName,
                            "CreateDate": new Date().format('yyyy-MM-dd H:m:s'),
                            "IsObsolete": false,
                            "IsConfirm": false,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        });
                    }
                    paramObj.body = JSON.stringify(data);
                    var expressSign = ApiService.post(url,paramObj);
                    expressSign.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                addExpressDomOperate : addExpressDomOperate,
                addExpressInterfaceDeal : addExpressInterfaceDeal
            }
        }
    ]);