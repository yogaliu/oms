/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .service('quitGoodsNoticeBillDetailService',['ApiService','toolsService','orderManagePublicService',
        function (ApiService,toolsService,orderManagePublicService) {

            var configData = {
                //配货通知单详情的列配置
                quitGoodsNoticeBillColumn : [
                    {name : '商品编码',tag : 'productcode'},
                    {name : '商品名称',tag : 'productname'},
                    {name : '规格编码',tag : 'skucode'},
                    {name : '规格名称',tag : 'skuname'},
                    {name : '数量',tag :'quantity'},
                    {name : '入库数量',tag : 'inquantity'},
                    {name : '次品入库数量',tag : 'defectivequantity'},
                    {name : '金额',tag : 'price'},
                    {name : '仓库入库时间',tag : 'warehousestoragetime'}
                ]

            };

            //dom操作
            var quitGoodsNoticeBillDomOperate = {
                //dom初始化
                domInit : function (scope,id) {
                    scope.tab = 'first';

                    //配货通知单详情
                    scope.quitGoodsNoticeBillDetails = [];
                    scope.quitGoodsNoticeBillColumn = configData.quitGoodsNoticeBillColumn;
                    //tab栏切换函数
                    scope.isShow= function (content) {
                        scope.tab = content;
                    };

                    //初始化详情列表
                    interfaceDeal.getQuitGoodsDetailsDeal(scope,id);
                }
            };

            //接口处理
            var interfaceDeal = {
                //获取退货通知单详情接口数据处理
                getQuitGoodsDetailsDeal : function (scope,id) {
                    quitGoodsInterface.getQuitGoodsDetails(scope,id, function (res) {
                        scope.quitGoodsNoticeBillDetails = res.data;
                        //商品数量
                        scope.allotionQuantity = 0;
                        //入库数量
                        scope.roomQuantity = 0;
                        for(var i = 0, j = res.data.length;i < j;i++){
                            scope.allotionQuantity += Number(res.data[i].quantity);
                            scope.roomQuantity += Number(res.data[i].defectivequantity ? res.data[i].defectivequantity : 0);
                        }
                    });
                }
            };

            //退货通知单详情接口
            var quitGoodsInterface = {
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
                quitGoodsNoticeBillDomOperate : quitGoodsNoticeBillDomOperate,
                interfaceDeal : interfaceDeal
            }

        }]
);