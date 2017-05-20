/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('quitExchangeGoodsBillDetailService',['ApiService','toolsService','orderManagePublicService',
        function (ApiService,toolsService,orderManagePublicService) {

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
                    {name : '实退金额',tag:'actualamount'}
                ],

                //换出商品列表配置
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
                    {name : '内容',tag : 'messagestring'},
                    {name : '创建人',tag: 'username'},
                    {name : '时间',tag : 'createdate'}
                ],
                //日志信息
                operateLogColumn : [
                    {name : '操作人',tag : 'createusername'},
                    {name : '操作日期',tag: 'createdate'},
                    {name : '内容',tag : 'note'}
                ]

            };

            //dom操作
            var quitExchangeGoodsDetailsDomOperate = {
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

                    //tab栏切换函数
                    scope.isShow= function (content) {
                        scope.tab = content;
                    };
                    //初始化退入商品数据
                    InterfaceDeal.getBackInProductDeal(scope,id);
                    //初始化换出商品数据
                    InterfaceDeal.getSwapOutProductDeal(scope,id);
                    //获取内部标签
                    InterfaceDeal.getLabelDeal(scope,id,salesorderid);
                    //获取操作日志
                    InterfaceDeal.getProductLogDeal(scope,id);
                }
            };

            //接口处理
            var InterfaceDeal = {
                //退入商品接口数据处理
                getBackInProductDeal : function (scope,id){
                    Interface.getBackInProduct(scope,id, function (res) {
                        if(res.success){
                            //退货数量
                            scope.productInQuantity = 0;
                            //应退金额
                            scope.productInShouldRefund = 0;
                            //实退金额
                            scope.productInRealRefund = 0;
                            for(var i = 0,j = res.data.length;i < j;i++){
                                scope.productInQuantity += res.data[i].quantity ? res.data[i].quantity : 0;
                                scope.productInShouldRefund += res.data[i].refundamount ? res.data[i].refundamount : 0;
                                scope.productInRealRefund += res.data[i].actualamount ? res.data[i].actualamount : 0;
                            }
                            scope.refundBillDetails = res.data;
                        }else{
                            toolsService.alertError('获取退入商品失败！');
                        }
                    });
                },
                //换出商品接口数据处理
                getSwapOutProductDeal : function (scope,id){
                    Interface.getSwapOutProduct(scope,id, function (res) {
                        if(res.success){
                            //换出商品数量
                            scope.productOutQuantity = 0;
                            //换货金额
                            scope.productOutRefund = 0;
                            for(var i = 0,j = res.data.length;i < j;i++){
                                scope.productOutQuantity += res.data[i].quantity ? res.data[i].quantity : 0;
                                scope.productOutRefund += res.data[i].actualamount ? res.data[i].actualamount : 0;
                            }
                            scope.swapOutGoods = res.data;
                        }else{
                            toolsService.alertError('获取换出商品失败！');
                        }
                    });
                },
                //内部标签接口处理
                getLabelDeal : function(scope,businessid,orderid){
                    Interface.getLabel(scope,businessid,orderid,function (res) {
                        if(res.success){
                            scope.productLabel = res.data;
                        }else{
                            toolsService.alertError('获取内部标签失败！');
                        }
                    })
                },
                //操作日志
                getProductLogDeal : function (scope,val) {
                    Interface.getProductLog(scope,val,function (res) {
                        if(res.success){
                            scope.operateLog = res.data;
                        }else{
                            toolsService.alertError('获取日志失败！');
                        }
                    })
                },
                //添加内部标签
                addLabelDeal : function (scope,message,id,salesorderid) {
                    Interface.addLabel(scope,message,id,salesorderid,function (res) {
                        $('.info-get-modal').modal('hide');
                        scope.content = '';
                        if(res.success){
                            toolsService.alertSuccess('添加成功！');
                            InterfaceDeal.getLabelDeal(scope,scope.id,scope.salesorderid);
                        }else{
                            toolsService.alertError('添加失败！');
                        }
                    })
                },
                //修改便签
                modifyLabelDeal : function (scope, noteId, message, bussinessId, orderId) {
                    Interface.modifyLabel(scope,noteId,message,bussinessId, orderId,function (res) {
                        $('.info-get-modal').modal('hide');
                        scope.content = '';
                        if(res.success){
                            toolsService.alertSuccess('修改成功！');
                            InterfaceDeal.getLabelDeal(scope,scope.id,scope.salesorderid);
                        }else{
                            toolsService.alertError('修改失败！');
                        }
                    })
                }
            };

            //退款单详情接口
            var Interface = {
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
                getProductLog : function (scope,id,callback){
                    var url = '/SalesOrder/Return/ReturnOrder/GetLogs';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = id;
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
                quitExchangeGoodsDetailsDomOperate : quitExchangeGoodsDetailsDomOperate,
                InterfaceDeal : InterfaceDeal
            }

        }]
);