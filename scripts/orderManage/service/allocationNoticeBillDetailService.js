/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('allocationNoticeBillDetailService',['ApiService','toolsService','orderManagePublicService',
        function (ApiService,toolsService,orderManagePublicService) {

            var configData = {

                //配货通知单详情的列配置
                allocationNoticeBillDetailsColumn : [
                    {name : '操作',tag : ''},
                    {name : '状态',tag : 'status',otherInfo:{0:'待发货',1:'已取消',2:'已发货'}},
                    {name : '订单编号',tag : 'salesordercode'},
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag :'productname'},
                    {name : '规格编码',tag : 'productskucode'},
                    {name : '规格名称',tag : 'productskuname'},
                    {name : '数量',tag : 'quantity'},
                    {name : '原始价',tag : 'priceoriginal'},
                    {name : '销售价',tag :'priceselling'},
                    {name : '销售金额',tag : 'amount'},
                    {name : '折扣金额',tag:'discountamount'},
                    {name : '结算金额',tag : 'amountactual'},
                    {name : '分销金额',tag:'distributionamount'}
                ],

                //操作日志列表配置
                operateLogColumn : [
                    {name : '操作人',tag:'username'},
                    {name : '操作日期',tag :'createdate'},
                    {name : '内容',tag : 'note'}
                ]

            };


            //dom操作
            var noticeBillDetailsDomOperate = {
                //dom初始化
                domInit : function (scope,id) {
                    scope.tab = 'first';

                    //配货通知单详情
                    scope.allocationNoticeBillDetails = [];
                    scope.allocationNoticeBillDetailsColumn = configData.allocationNoticeBillDetailsColumn;

                    //配货通知单操作日志
                    scope.operateLog = [];
                    scope.operateLogColumn = configData.operateLogColumn;

                    //tab栏切换函数
                    scope.isShow= function (content) {
                        scope.tab = content;
                    };
                    //配货通知单详情
                    interfaceDeal.getOrderDetails(scope,id);
                    //配货通知单操作日志
                    interfaceDeal.allocationNoticeBillLog(scope,id);
                }
            };

            //接口处理
            var interfaceDeal = {
                //获取配货通知单详情
                getOrderDetails : function (scope,id){
                    Interface.getOrderDetails(scope,id, function (res) {
                        if(res.success){
                            scope.allocationNoticeBillDetails = res.data;
                        }else{
                            toolsService.alertError('获取配货通知单详情失败！');
                        }
                    });
                },
                //获取配货通知单操作日志
                allocationNoticeBillLog : function (scope,id) {
                    Interface.allocationNoticeBillLog(scope,id, function (res) {
                        if(res.success){
                            scope.operateLog = res.data;
                        }else{
                            toolsService.alertError('获取配货通知单操作日志失败！');
                        }
                    });
                },
                //取消明细
                cancleAllocationNoticeDetails : function (scope,orderId,detailsId,reason){
                    Interface.cancleAllocationNoticeDetails(scope,orderId,detailsId,reason, function (res) {
                        if(res.success){
                            toolsService.alertSuccess('取消成功！');
                        }else{
                            toolsService.alertError(res.errorMessage);
                        }
                    });
                }
            };

            //接口请求
            var Interface = {
                /**
                 * 获取配货通知单详情
                 * @param scope
                 * @param id 要获取详情的订单的id
                 * @param callback
                 */
                getOrderDetails : function (scope,id,callback) {
                    var url = '/SalesOrder/Dispatch/GetDetail';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"DispatchOrderId",
                        "Name":"DispatchOrderId",
                        "Value":id,
                        "Children":[]
                    }]);
                    var orderDetails = ApiService.post(url,paramObj);
                    orderDetails.then(function(res){
                        callback(res);
                    });
                },
                /**
                 * 配货通知单操作日志
                 * @param scope
                 * @param id
                 * @param callback
                 */
                allocationNoticeBillLog : function (scope,id,callback){
                    var url = '/BasicInformation/SystemLog/Get';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":50,
                        "Timespan":"00:00:00.065",
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"ObjectId",
                            "Name":"ObjectId",
                            "Value":id,
                            "Children":[]}
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var log = ApiService.post(url,paramObj);
                    log.then(function (res) {
                        callback(res);
                    });
                },
                /**
                 *取消明细
                 * @param scope
                 * @param orderId 订单id
                 * @param detailsId 明细Id
                 * @param reason 取消明细原因
                 * @param callback
                 */
                cancleAllocationNoticeDetails: function (scope,orderId,detailsId,reason,callback) {
                    var url ='/SalesOrder/Dispatch/CancelDetail';
                    var paramObj = ApiService.getBasicParamobj();
                    paramObj.dispatchOrderId = detailsId;
                    paramObj.dispatchOrderDetailId = orderId;
                    paramObj.reson = reason;
                    var details = ApiService.post(url,paramObj);
                    details.then(function (res) {
                        callback(res);
                    });
                }
            };

            return {
                noticeBillDetailsDomOperate : noticeBillDetailsDomOperate,
                interfaceDeal : interfaceDeal
            }

    }]
);