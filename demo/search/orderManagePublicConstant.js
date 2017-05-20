/**
 * Created by zgh on 2017/4/11.
 * 订单管理常用数据配置
 */

angular.module('klwkOmsApp')
    //订单列表的高级搜索菜单配置
    .constant('orderManageConfigData', {
            orderStatus :[
                {
                    id : 0,
                    name : '新建',
                    type : 'Status',
                    re : '订单状态'
                },
                {
                    id : 10,
                    name : '审核异常',
                    type : 'Status',
                    re : '订单状态'
                },
                {
                    id : 11,
                    name : '审核已通过',
                    type : 'Status',
                    re : '订单状态'
                },
                {
                    id : 20,
                    name : '自动配货中',
                    type : 'Status',
                    re : '订单状态'
                },
                {
                    id : 21,
                    name : '自动配货异常',
                    type : 'Status',
                    re : '订单状态'
                },
                {
                    id : 22,
                    name : '已配货',
                    type : 'Status',
                    re : '订单状态'
                },
                {
                    id : 31,
                    name : '已部分发货',
                    type : 'Status',
                    re : '订单状态'
                },
                {
                    id : 32,
                    name : '已全部发货',
                    type : 'Status',
                    re : '订单状态'
                }
            ],
            PlatformType : [
                {
                    id : 1,
                    name : '平台类型1',
                    type : 'PlatformType',
                    re : '平台类型'
                },
                {
                    id : 2,
                    name : '平台类型2',
                    type : 'PlatformType',
                    re : '平台类型'
                },
                {
                    id : 3,
                    name : '平台类型3',
                    type : 'PlatformType',
                    re : '平台类型'
                }
            ],
            TransType :[
                {
                    id : 0,
                    name : '销售订单',
                    type : 'TransType',
                    re : '订单类型'
                },
                {
                    id : 2,
                    name : '费用订单',
                    type : 'TransType',
                    re : '订单类型'
                },
                {
                    id : 3,
                    name : '预定订单',
                    type : 'TransType',
                    re : '订单类型'
                },
                {
                    id : 4,
                    name : '换货订单',
                    type : 'TransType',
                    re : '订单类型'
                },
                {
                    id : 5,
                    name : '补发订单',
                    type : 'TransType',
                    re : '订单类型'
                },
                {
                    id : 6,
                    name : '补发票订单',
                    type : 'TransType',
                    re : '订单类型'
                }
            ],
            SourceType:[
                {
                    id : 0,
                    name : 'PC',
                    type : 'SourceType',
                    re : '订单来源'
                },
                {
                    id : 1,
                    name : '手机',
                    type : 'SourceType',
                    re : '订单来源'
                }
            ],
            RefundStatus : [
                {
                    id : 0,
                    name : '未定义',
                    type : 'RefundStatus',
                    re : '退款状态'
                },
                {
                    id : 1,
                    name : '部分退款',
                    type : 'RefundStatus',
                    re : '退款状态'
                },
                {
                    id : 2,
                    name : '全部退款',
                    type : 'RefundStatus',
                    re : '退款状态'
                }
            ],
            PreSaleType : [
                {
                    id : 0,
                    name : '非预售',
                    type : 'PreSaleType',
                    re : '预售类型'
                },
                {
                    id : 1,
                    name : '部分预售',
                    type : 'PreSaleType',
                    re : '预售类型'
                },
                {
                    id : 2,
                    name : '全部预售',
                    type : 'PreSaleType',
                    re : '预售类型'
                }
            ],
            DispatchTypeStatus:[
                {
                    id : 0,
                    name : '未配货',
                    type : 'DispatchTypeStatus',
                    re : '配货状态'
                },
                {
                    id : 1,
                    name : '部分配货',
                    type : 'DispatchTypeStatus',
                    re : '配货状态'
                },
                {
                    id : 2,
                    name : '全部配货',
                    type : 'DispatchTypeStatus',
                    re : '配货状态'
                }
            ],
            DeliveryTypeStatus : [
                {
                    id : 0,
                    name : '未发货',
                    type  : 'DeliveryTypeStatus',
                    re : '发货状态'
                },
                {
                    id  : 1,
                    name : '部分发货',
                    type : 'DeliveryTypeStatus',
                    re : '发货状态'
                },
                {
                    id  : 2,
                    name : '全部发货',
                    type : 'DeliveryTypeStatus',
                    re : '发货状态'
                }
            ]
        }
    );