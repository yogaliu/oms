/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('refundBillDetailService',['ApiService','toolsService',
        function (ApiService,toolsService) {

            var configData = {
                //退入商品的列配置
                refundBillDetailsColumn : [
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag :'productname'},
                    {name : '规格编码',tag : 'skucode'},
                    {name : '规格名称',tag : 'skuname'},
                    {name : '系统订单',tag : 'salesordercode'},
                    {name : '退货数量',tag : 'quantity'},
                    {name : '应退金额',tag :'refundamount'},
                    {name : '补偿金额',tag : 'offsetamount'},
                    {name : '实退金额',tag:'refundamount'}
                ],

                //换出列表配置
                swapOutGoodsColumn : [
                    {name : '商品编码',tag:'productcode'},
                    {name : '商品名称',tag :'productname'},
                    {name : '规格编码',tag : 'skucode'},
                    {name : '规格名称',tag : 'skuname'},
                    {name : '换货数量',tag : 'quantity'},
                    {name : '换货金额',tag : 'actualamount'}
                ],
                //内部标签列配置
                productLabelColumn : [
                    {name : '操作',tag :''},
                    {name : '内容',tag : 'messagestring'},
                    {name : '创建人',tag: 'username'},
                    {name : '时间',tag : 'createdate'}
                ],
                //日志信息
                operateLogColumn : [
                    {name : '操作人',tag : 'username'},
                    {name : '操作日期',tag: 'createdate'},
                    {name : '内容',tag : 'note'}
                ]

            };

            //dom操作
            var refoundBillDetailsDomOperate = {
                //dom初始化
                domInit : function (scope,id,salesorderid) {
                    scope.tab = 'first';

                    //订单id
                    scope.id = id;
                    //订单主id
                    scope.salesorderid = salesorderid;

                    //模态框配置
                    scope.modal = {
                        title : '请输入便签内容',
                        confirm : ''
                    };
                    //退货数量
                    scope.refundQuality = 0;
                    //应退金额
                    scope.shoutRefundAmount = 0;
                    //补偿金额
                    scope.compensateAmount = 0;
                    //实退金额
                    scope.refundRealAmount = 0;

                    //换出商品数量
                    scope.changeGoodsQuality = 0;
                    //换出商品金额
                    scope.changeGoodsAmount = 0;

                    //退入商品单详情
                    scope.refundBillDetails = [];
                    scope.refundBillDetailsColumn = configData.refundBillDetailsColumn;

                    //换出商品详情
                    scope.swapOutGoods = [];
                    scope.swapOutGoodsColumn = configData.swapOutGoodsColumn;

                    //内部标签
                    scope.productLabel = [];
                    scope.productLabelColumn = configData.productLabelColumn;

                    //操作日志
                    scope.operateLog = [];
                    scope.operateLogColumn = configData.operateLogColumn;

                    //初始化退入商品数据
                    refundBillInterfaceDeal.getBackInProductDeal(scope,id);
                    //初始化换出商品数据
                    refundBillInterfaceDeal.getSwapOutProductDeal(scope,id);
                    //获取内部标签
                    refundBillInterfaceDeal.getLabelDeal(scope,id,salesorderid);
                    //获取操作日志
                    refundBillInterfaceDeal.getProductLogDeal(scope,id);
                }
            };

            //接口处理
            var refundBillInterfaceDeal = {
                //退入商品接口数据处理
                getBackInProductDeal : function (scope,id){
                    refundBillInterface.getBackInProduct(scope,id, function (res) {
                        if(res.success){
                            scope.refundBillDetails = res.data;
                            //计算退货数量、应退金额、补偿金额、实退金额小计
                            for(var i = 0,j = res.data.length;i < j;i++){
                                scope.refundQuality += Number(res.data[i].quantity);
                                scope.shoutRefundAmount += Number(res.data[i].refundamount);
                                scope.compensateAmount += Number(res.data[i].offsetamount);
                                scope.refundRealAmount += Number(res.data[i].refundamount);
                            }
                        }else{
                            toolsService.alertError('获取退入商品失败！');
                        }
                    });
                },
                //换出商品接口数据处理
                getSwapOutProductDeal : function (scope,id){
                    refundBillInterface.getSwapOutProduct(scope,id, function (res) {
                        if(res.success){
                            scope.swapOutGoods = res.data;
                            //计算换货数量、换货金额小计
                            for(var i = 0,j = res.data.length;i < j;i++){
                                scope.changeGoodsQuality = Number(res.data[i].quantity);
                                scope.changeGoodsAmount = Number(res.data[i].actualamount);
                            }
                        }else{
                            toolsService.alertError('获取换出商品失败！');
                        }
                    });
                },
                //内部标签数据接口处理
                getLabelDeal : function(scope,businessid,orderid){
                    refundBillInterface.getLabel(scope,businessid,orderid,function (res) {
                        if(res.success){
                            scope.productLabel = res.data;
                        }else{
                            toolsService.alertError('获取内部标签失败！');
                        }
                    })
                },
                //操作日志
                getProductLogDeal : function (scope,val) {
                    refundBillInterface.getProductLog(scope,val,function (res) {
                        if(res.success){
                            scope.operateLog = res.data;
                        }else{
                            toolsService.alertError('获取操作日志失败！');
                        }
                    })
                },
                //添加内部标签
                addLabelDeal : function (scope,message,id,salesorderid) {
                    refundBillInterface.addLabel(scope,message,id,salesorderid,function (res) {
                        $('.info-get-modal').modal('hide');
                        if(res.success){
                            refundBillInterfaceDeal.getLabelDeal(scope,scope.id,scope.salesorderid);
                            //清空内部标签数据
                            scope.content = '';
                            toolsService.alertSuccess('添加成功！');
                        }else{
                            toolsService.alertError('添加内部标签失败！');
                        }
                    })
                },
                //修改便签
                modifyLabelDeal : function (scope, noteId, message, bussinessId, orderId) {
                    refundBillInterface.modifyLabel(scope,noteId,message,bussinessId, orderId,function (res) {
                        $('.info-get-modal').modal('hide');
                        if(res.success){
                            refundBillInterfaceDeal.getLabelDeal(scope,scope.id,scope.salesorderid);
                            //清空内部标签数据
                            scope.content = '';
                            toolsService.alertSuccess('修改成功！');
                        }else{
                            toolsService.alertError('修改失败！');
                        }
                    })
                }
            };

            //退款单详情接口
            var refundBillInterface = {
                /**
                 * 获取退入商品
                 * @param scope
                 * @param id 要获取退入商品的订单号
                 * @param callback
                 */
                getBackInProduct : function (scope,id,callback){
                    var url = '/SalesOrder/Return/ReturnOrder/GetDetails';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(id);
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 * 获取换出商品
                 * @param scope
                 * @param id 要获取换出商品的订单号
                 * @param callback
                 */
                getSwapOutProduct : function (scope,id,callback){
                    var url = '/SalesOrder/Return/ReturnOrder/GetOutDetails';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify(id);
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取内部标签
                 * @param scope
                 * @param businessid 退换货单id
                 * @param orderid salesorderid（	订单主ID）
                 * @param callback
                 */
                getLabel : function (scope,businessid,orderid,callback) {
                    var url = '/OrderMessage/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.businessid = businessid;
                    paramObj.orderid = orderid;
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },
                //获取系统日志
                getProductLog : function (scope,val,callback){
                    var url = '/BasicInformation/SystemLog/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                            "PageIndex": 1,
                            "PageSize": 500,
                            "Timespan": "00:00:00.039",
                            "SeletedCount": 0,
                            "Data": [
                                {
                                    "OperateType": 0,
                                    "LogicOperateType": 0,
                                    "AllowEmpty": false,
                                    "Field": "ObjectId",
                                    "Name": "ObjectId",
                                    "Value": val,
                                    "Children": []
                                }
                            ],
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        });
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 添加内部标签
                 * @param scope
                 * @param message 标签内容
                 * @param bussinessId 订单id
                 * @param orderId 订单主Id
                 * @param callback
                 */
                addLabel : function (scope,message,bussinessId,orderId,callback) {
                    var url = '/OrderMessage/AddNote';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.message = message;
                    paramObj.bussinessId = bussinessId;
                    paramObj.orderId = orderId;
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 修改内部标签
                 * @param scope
                 * @param noteId 标签Id
                 * @param message 标签内容
                 * @param bussinessId 订单id
                 * @param orderId 订单主Id
                 * @param callback
                 */
                modifyLabel : function (scope,noteId,message,bussinessId,orderId,callback) {
                    var url = '/OrderMessage/UpdateNote';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.noteId = noteId;
                    paramObj.message = message;
                    paramObj.bussinessId = bussinessId;
                    paramObj.orderId = orderId;
                    var RefoundBill = ApiService.postLoad(url,paramObj);
                    RefoundBill.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                refoundBillDetailsDomOperate : refoundBillDetailsDomOperate,
                refundBillInterfaceDeal : refundBillInterfaceDeal
            }

        }]
);