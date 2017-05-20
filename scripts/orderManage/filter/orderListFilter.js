/**
 * Created by zgh on 2017/4/7.
 */
angular.module('klwkOmsApp')
    .filter('OrderListFilter',['$sce','APP_MENU', function ($sce,APP_MENU) {
        /**
         *订单列表过滤器
         * @param original 要过滤掉的字符串
         * @param tag 要提取出的字段
         * @param list 要过滤的全部字段
         * @param otherInfo 其它的字段，如果有则提取该字段
         * @returns {*}
         */
        return function(original,tag,list,otherInfo){
            if(tag == 'tips'){
                var html = '';
                html += (list['islock'] ? '<span class="order-list-lock">锁定</span>•' : '') +
                        (list['issplitforce'] ? '<span class="order-list-issplit-force">拆单</span>•' : '')+
                        (list['iscod'] ? '<span class="order-list-iscod">货到付款</span>•' : '')+
                        (list['speeddelivery'] ? '<span class="order-list-speeddelivery">加急</span>•' : '') +
                        (list['ishold'] ? '<span class="order-list-hold">留单</span>•' : '') +
                        (list['isabnormal'] ? '<span class="order-list-abnormal">异常</span>•' : '') +
                        (list['isobsolete'] ? '<span class="order-list-obsolete">作废</span>•' : '') +
                        (list['ismanual'] ? '<span class="order-list-manual">手工处理</span>•' : '') +
                        (list['expressfeeiscod'] ? '<span class="order-list-expressfeeiscod">物流到付</span>•' : '') +
                        (list['hasinvoice'] ? '<span class="order-list-hasinvoice">需要发票</span>•' : '') +
                        (list['subOrder']['isblacklist'] ? '<span class="order-list-blacklist">黑名单</span>•' : '') +
                        (list['subOrder']['isprime'] ? '<span class="order-list-prime">售后无忧</span>•' : '') +
                        (list['subOrder']['iselectronicinvoicecreated'] ? '<span class="order-list-electronicinvoicecreated">已开电子发票</span>•' : '') +
                        (list['subOrder']['isprepay'] ? '<span class="order-list-prepay">预付款</span>•' : '') +
                        (list['isoutofstock'] ? '<span>缺货</span>•' : '');
                html = html.slice(0,-1);
                return $sce.trustAsHtml(html);
            //如果字段是整形，则用otherInfo里面的对应参数来代替
            }else if(otherInfo){
                return otherInfo[original];
                //发货快递、发货仓库、快递单号
            }else if(tag == 'expressname' || tag == 'warehousename' || tag == 'expressnumber'){
                return list['deliveryInfo'][tag];
                //是否已开电子发票
            }else if(tag == 'hasinvoice'){
                if(original == 0){
                    return '';
                }
                return $sce.trustAsHtml('<i class="iconfont icon-icon9 correct ng-scope"></i>');
                //字段不为空，则return原来字符
            }else if(original !== undefined){
                return original;
                //如果最外层对象没有该字段，则从子对象提取
            }else{
                return list['subOrder'][tag];
            }
        }
    }])
    .filter('htmlFilter',['$sce', function ($sce) {
        return function (input,flag) {
            if(flag == '$'){
                return $sce.trustAsHtml(input);
            }
            return input;
        }
    }])
    //过滤订单特殊标志
    .filter('shipmentsFilter',['$sce',function ($sce) {
        return function (input,item,list) {
            if(item.tag == 'tips'){
                var html = '';
                html += (list['iscod'] ? '<span class="order-list-lock">货到付款</span>•' : '') +
                        (list['isneedinvoice'] ? '<span class="order-list-lock">发票</span>•' : '') +
                        (list['ismerger'] ? '<span class="order-list-lock">合并</span>•' : '') +
                        (list['iswmscannel'] ? '<span class="order-list-lock">WMS取消</span>•' : '') ;
                html = html.slice(0,-1);
                return $sce.trustAsHtml(html);
                //如果字段是整形，则用otherInfo里面的对应参数来代替
            }else if(item.tag == 'status'){
                return item.otherInfo[input];
            }
            return input ;
        }
    }])
    //过滤特殊的列名
    .filter('specialColumnFilter',['$sce', function ($sce) {
        return function (input,param){
            if(param.name == 'chose'){
                return $sce.trustAsHtml('<input type="checkbox" />');
            }
            return input;
        }
    }])
    .filter('specialLabelFilter',['$sce', function ($sce) {
        /**
         *对售后申请后台的数据进行过滤
         * @param input 后台传入的列数据
         * @param column 列的各项字段
         * @param list  从后台获取的详细数据
         * @returns {*}
         */
        return function (input,column,list) {
            //设定特殊标识
            if(column.tag == 'tips'){
                var html = '';
                html += (list['isrefund'] ? '<span class="order-list-lock">退款</span>•' : '') +
                (list['isreturn'] ? '<span class="order-list-lock">退货</span>•' : '') +
                (list['isquickrefund'] ? '<span class="order-list-lock">快速退款</span>•' : '') ;
                html = html.slice(0,-1);
                return $sce.trustAsHtml(html);
            //是否需要退货
            }else if(column.tag == 'hasgoodreturn'){
                return (input == 1) ? $sce.trustAsHtml('<i class="iconfont icon-icon9 correct ng-scope"></i>') : '';
            //传过来的数据的otherInfo字段不为空，则将对应的字段展示出来
            }else if(column.otherInfo){
                return column.otherInfo[input];
            }
            return input;
        }
    }])
    .filter('expressFilter',['$sce', function ($sce) {
        /**
         *对快递的列数据进行过滤
         * @param input 后台传入的列数据
         * @param column 列的各项字段
         * @param list  从后台获取的详细数据
         * @returns {*}
         */
        return function (input, column, list) {
            if(column.tag == 'tips'){
                var html = '';
                html += (list['isobsolete'] ? '<span class="order-list-lock">作废</span>•' : '') +
                (list['isconfirm'] ? '<span class="order-list-lock">确认</span>•' : '')  ;
                html = html.slice(0,-1);
                return $sce.trustAsHtml(html);
            //传过来的数据的otherInfo字段不为空，则将对应的字段展示出来
            }else if(column.otherInfo){
                return column.otherInfo[input];
            }
            return input;
        }
    }])
    .filter('returnOrder',['$sce', function ($sce) {
        /**
         *对退换货单的列数据进行过滤
         * @param input 后台传入的列数据
         * @param column 列的各项字段
         * @param list  从后台获取的详细数据
         * @returns {*}
         */
        return function (input,column,list) {
            if(column.tag == 'tips'){
                var html = '';
                html += (list['isobsolete'] ? '<span class="order-list-lock">作废</span>•' : '') +
                (list['isreplace'] ? '<span class="order-list-lock">换货</span>•' : '')  +
                (list['isrefund'] ? '<span class="order-list-lock">退款</span>•' : '')  +
                (list['isconfirm'] ? '<span class="order-list-lock">确认</span>•' : '')  +
                (list['isabnormal'] ? '<span class="order-list-lock">异常</span>•' : '')  +
                (list['isprime'] ? '<span class="order-list-lock">售后无忧</span>•' : '')  +
                (list['iscreatenoticed'] ? '<span class="order-list-lock">已生成通知单</span>•' : '')  +
                (list['iselectronicinvoicecreated'] ? '<span class="order-list-lock">已开电子发票</span>•' : '')  +
                (list['iscod'] ? '<span class="order-list-lock">货到付款</span>•' : '')  ;
                html = html.slice(0,-1);
                return $sce.trustAsHtml(html);
            //传过来的数据的otherInfo字段不为空，则将对应的字段展示出来
            }else if(column.otherInfo){
                return column.otherInfo[input];
            //全选的字段类型
            }else if(column.name == 'chose'){
                return $sce.trustAsHtml('<input type="checkbox" />');
            }
            return input;
        }
    }])
    .filter('quitGoodsListFilter',['$sce', function ($sce) {
        /**
         *对退货通知单的列数据进行过滤
         * @param input 后台传入的列数据
         * @param column 列的各项字段
         * @param list  从后台获取的详细数据
         * @returns {*}
         */
        return function (input,column,list) {
            if(column.otherInfo){
                return column.otherInfo[input];
            //全选的字段类型
            }else if(column.name == 'chose'){
                return $sce.trustAsHtml('<input type="checkbox" />');
            }
            return input;
        }
    }])
    .filter('refoundBillFilter',['$sce', function ($sce) {
        /**
         *对退款单的列数据进行过滤
         * @param input 后台传入的列数据
         * @param column 列的各项字段
         * @param list  从后台获取的详细数据
         * @returns {*}
         */
        return function (input,column,list) {
            //对订单的标识进行字段处理
            if(column.tag == 'tips'){
                var html = '';
                html += (list['isquickrefund'] ? '<span class="order-list-lock">快速退款</span>•' : '') +
                (list['islocked'] ? '<span class="order-list-lock">锁定</span>•' : '')  +
                (list['iscod'] ? '<span class="order-list-lock">货到付款</span>•' : '')  ;
                html = html.slice(0,-1);
                return $sce.trustAsHtml(html);
                //传过来的数据的otherInfo字段不为空，则将对应的字段展示出来
            }else if(column.otherInfo){
                return column.otherInfo[input];
                //全选的字段类型
            }else if(column.name == 'chose'){
                return $sce.trustAsHtml('<input type="checkbox" />');
            }
            return input;
        }
    }])
    .filter('productStatusFilter',function(){
        return function (input,list) {
            if(list.contains(input) !== -1){
                return true;
            }else{
                return false;
            }
        }
    })
    .filter('orderDetailsFilter', function ($sce) {
        return function (input,column,list) {
            //明细状态
            if(column.tag == 'status'){
                return column['otherInfo'][input];
            }else if((column.tag == 'isoutofstock') || (column.tag == 'isrefunded') || (column.tag == 'isobsolete')){
                return input ? $sce.trustAsHtml('<i class="iconfont icon-icon9 correct ng-scope" ng-if="item.isdisabled"></i>') : '';
            }else if(column.tag == 'num'){
                return list['platformProduct']['num'];
            }

            return input;
        }
    })
    //商品信息字段过滤（订单详情）
    .filter('productDetailsFilter',['$sce','APP_MENU', function ($sce,APP_MENU) {
        return function (input,column,list) {
            if(column.tag == 'status'){
                return APP_MENU['preDistributionInfoState'][input];
            }else if(column.tag == 'tips'){
                var html = '';
                html += (list['isoutofstock'] ? '<span class="order-list-lock">缺货</span>•' : '') +
                (list['isrefunded'] ? '<span class="order-list-lock">退款</span>•' : '')  +
                (list['isdeleted'] ? '<span class="order-list-lock">作废</span>•' : '')  +
                (list['isabnormal'] ? '<span class="order-list-abnormal">异常明细</span>•' : '')  +
                (list['iscombproduct'] ? '<span class="order-list-lock">套装</span>•' : '')  +
                (list['ismanual'] ? '<span class="order-list-lock">手工添加</span>•' : '')  ;
                html = html.slice(0,-1);
                return $sce.trustAsHtml(html);
            }else if(column.tag == 'detailtype'){
                return APP_MENU['productType'][input];
            }else if(column.tag == 'refundstatus'){
                return APP_MENU['preRefundType'][list.platformProduct.refund_status];
            }
            return input;
        }
    }])
    //手工配货订单信息数据过滤
    .filter('manualOrderFilter', ['$sce',function ($sce) {
        //input传入的值
        //order订单信息
        //订单列信息
        return function (input,order,column) {
            if(column.tag == 'buyermemo'){
                return order['subOrder']['buyermemo'];
            }else if(column.tag == 'sellermemo'){
                return order['subOrder']['sellermemo'];
            }else if(column.tag == 'customername'){
                return order['customername'];
            }else if(column.tag == 'tagname'){
                return order['tagname'];
            }else if(column.tag == 'storename'){
                return order['storename'];
            }else if(column.tag == 'iscod'){
                if(order['iscod']){
                    return $sce.trustAsHtml('<i class="iconfont icon-icon9 correct ng-scope"></i>');
                }
            }
            return input;
        }
    }])
    //配货信息过滤器
    .filter('allocationFilter',['$sce', function ($sce) {
        return function (input,tagname) {
            if(tagname == 'dispatched'){
                return order['iscod'] ? $sce.trustAsHtml('<i class="iconfont icon-icon9 correct ng-scope"></i>') : '';
            }
            return input;
        }
    }])
    //新增订单时，给商品数量，优惠金额，这些没有值的添加默认值
    .filter('productInfoFilter', function () {
        return function (input, tagname) {
            if(tagname == 'quality'){
                return 1;
            }else if(tagname == 'discountamount'){
                if(!input){
                    return 0;
                }
            }
            return input;
        }
    })
    //套装信息字段过滤
    .filter('suitInfoFilter',['$sce', function ($sce) {
        return function (input,tagname) {
            if(tagname == 'issplit'){//是否不可拆分
                return input ? $sce.trustAsHtml('<i class="iconfont icon-icon9 correct ng-scope"></i>') : '';
            }else if(tagname == 'isgift'){//是否是礼盒
                return input ? $sce.trustAsHtml('<i class="iconfont icon-icon9 correct ng-scope"></i>') : '';
            }
            return input;
        }
    }])
    //退货扫描订单信息过滤
    .filter('quitGoodsScanOrderFilter',['APP_MENU', function (APP_MENU) {
        return function (input,tagname) {
            if(tagname == 'refundstatus'){
                return APP_MENU.preRefundType[input];
            }
            return input;
        }
    }])
    //退货扫描订单明细过滤
    .filter('quitGoodsScanDetailsFilter',['$sce', function ($sce) {
        return function (input,tagname) {
            if(tagname == 'isrefunded'){
                return input ? $sce.trustAsHtml('<i class="iconfont icon-icon9 correct ng-scope"></i>') : '';
            }
            return input;
        }
    }]);