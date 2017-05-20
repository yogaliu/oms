/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('sendOrderAbnormalDetailService',['ApiService','toolsService','orderManagePublicService'
        ,function (ApiService,toolsService,orderManagePublicService) {

        //配置信息
        var configData ={
            columns : [
                {name : '日期' ,tag : 'createdate'},
                {name : '异常信息',tag :'note'}
            ]
        };

        var domOperate = {
            //页面初始化
            domInit : function (scope,orderid) {
                //日志信息
                scope.log = [];
                //列信息配置
                scope.columns = configData.columns;
                InterfaceDeal.getLog(scope,orderid);
            }
        };

        //接口数据处理
        var InterfaceDeal = {
            //获取异常订单日志数据
            getLog : function (scope,id) {
                Interface.getLog(scope,id,function (res) {
                    if(res.success){
                        scope.log = res.data;
                    }else{
                        alert('获取日志信息失败');
                    }
                });
            }
        };

        var Interface = {

            /**
             * 获取异常订单的日志信息
             * @param scope
             * @param orderid 订单id
             * @param callback
             */
            getLog : function (scope,orderid,callback) {
                var url = '/SalesOrder/SalesOrderLog/Get';
                var paramObj = ApiService.getBasicParamobj();
                paramObj.body = JSON.stringify([{
                    "OperateType":0,
                    "LogicOperateType":0,
                    "AllowEmpty":false,
                    "Field":"SalesOrderId",
                    "Name":"SalesOrderId",
                    "Value":orderid,
                    "Children":[]
                },{
                    "OperateType":0,
                    "LogicOperateType":0,
                    "AllowEmpty":false,
                    "Field":"Type",
                    "Name":"Type",
                    "Value":1,
                    "Children":[]
                }]);
                ApiService.postLoad(url,paramObj)
                    .then(function (res) {
                        callback(res);
                    });
            }
        };

        return {
            domOperate : domOperate
        }

        }
    ]);