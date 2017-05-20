/**
 * Created by xs on 2017/4/13.
 */
angular.module("klwkOmsApp")
    .filter("classificationtype",function(){
        //公用分类类型过滤器
        return function (input,name) {
            if(name == 'classificationtype'){
                switch (input)
                {
                    case 1:
                        return "退换货类型";
                        break;
                    case 2:
                        return "商品品牌";
                        break;
                    case 3:
                        return "生产方式";
                        break;
                    case 4:
                        return "商品主题";
                        break;
                    case 5:
                        return "商品年份";
                        break;
                    case 6:
                        return "商品季节";
                        break;
                    case 7:
                        return "商品单位";
                        break;
                    case 8:
                        return "商品款型";
                        break;
                    case 9:
                        return "会员标记";
                        break;
                    case 10:
                        return "退换货标记";
                        break;
                    case 11:
                        return "取消交易类型";
                        break;
                    case 12:
                        return "订单标记";
                        break;
                    case 13:
                        return "退款类型";
                        break;
                    case 14:
                        return "商品自定义属性";
                        break;
                    case 15:
                        return "自动审单用语";
                        break;
                    case 16:
                        return "价格区间";
                        break;
                    case 17:
                        return "调拨类型";
                        break;
                    case 18:
                        return "采购类型";
                        break;
                    case 19:
                        return "订单便签";
                        break;
                    case 20:
                        return "退款申请标记";
                        break;
                    case 21:
                        return "变价原因";
                        break;
                    case 22:
                        return "活动类型";
                        break;
                    case 23:
                        return "退款自动审核原因";
                        break;
                    case 24:
                        return "会员等级";
                        break;
                    case 25:
                        return "发票行业类型";
                        break;
                    case 26:
                        return "采购退货原因";
                        break;
                    case 27:
                        return "出库类型";
                        break;
                    case 28:
                        return "入库类型";
                        break;
                    case 29:
                        return "唯品承运商";
                        break;
                    case 30:
                        return "借调类型";
                        break;
                    case 31:
                        return "到货时间";
                        break;
                    case 32:
                        return "明细退货原因";
                        break;
                    case 33:
                        return "币种";
                        break;
                }
            }
            return input;
        }

    });