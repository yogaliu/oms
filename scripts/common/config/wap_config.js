/**
 * 定义常量WAP_CONFIG;WAP为当前子模块功能
 * */
angular.module("klwkOmsApp")
    .constant('WAP_CONFIG', {
        host: 'http://114.55.15.205',//114.55.15.205//192.168.1.160(liyu)
        //host: 'http://www.sqhzg.cn',
        port: '30001',//30001 8080
        // 当前的模块名称
        module: 'index',
        path: '',
        version: '2.5.1.9',
        md5Key: "JE@)!%5102",
        platform: 'pc' // string 'weixin or app' 平台常量，通过此参数判断系统是在微信里面使用还是在APP里面使用，以便调用不同的微信接口

    })

    /*用户信息*/
    .value('APP_COLORS', {
        UserId: JSON.parse(sessionStorage.getItem('userInfo')) ? JSON.parse(sessionStorage.getItem('userInfo')).id : '',
        LoginKey: JSON.parse(sessionStorage.getItem('userInfo')) ? JSON.parse(sessionStorage.getItem('userInfo')).userLoginKey : '',
        username: JSON.parse(sessionStorage.getItem('userInfo')) ? JSON.parse(sessionStorage.getItem('userInfo')).username : '',
        systemConfig: JSON.parse(sessionStorage.getItem('systemConfig')) ? JSON.parse(sessionStorage.getItem('systemConfig')) : {}
    })

    /*接口数据存储 请自行添加*/
    .value('APP_DATA', {})


    /*枚举值 如不全请自行添加*/

    .constant('APP_MENU', {

        /*菜单对象*/
        menuObj: [
            /*订单管理*/
            {name: '订单列表', url: '../template/orderManage/orderList.html'},
            {name: '配货通知单', url: '../template/orderManage/allocationNoticeBill.html'},
            {name: '发货异常订单', url: '../template/orderManage/sendOrderAbnormal.html'},
            {name: '售后申请', url: '../template/orderManage/afterMarketApply.html'},
            {name: '快递签收', url: '../template/orderManage/expressGet.html'},
            {name: '退货扫描', url: '../template/orderManage/quitGoodsScan.html'},
            {name: '退换货单', url: '../template/orderManage/quitExchangeGoodsBill.html'},
            {name: '退货通知单', url: '../template/orderManage/quitGoodsNoticeBill.html'},
            {name: '退款单', url: '../template/orderManage/refundBill.html'},

            {name: '唯品档期', url: '../template/b2bVIP/runSchedule.html'},
            {name: '唯品配货单', url: '../template/b2bVIP/matchGoodsBill.html'},
            {name: '唯品送货单', url: '../template/b2bVIP/sendGoodsBill.html'},
            {name: '唯品调整单', url: '../template/b2bVIP/adjustBill.html'},
            {name: '唯品退货单', url: '../template/b2bVIP/returnGoodsBill.html'},
            {name: '唯品退货通知单', url: '../template/b2bVIP/returnGoodsNoticeBill.html'},
            {name: '唯品对账单', url: '../template/b2bVIP/checkBill.html'},

            {name: 'B2B计划单', url: '../template/b2bFBP/fbpPlanBill.html'},
            {name: 'B2B通知单', url: '../template/b2bFBP/fbpNoticeBill.html'},
            {name: '销售出库单', url: '../template/b2bFBP/fbpSellOutputBill.html'},
            {name: 'B2B退货单', url: '../template/b2bFBP/fbpQuitGoodsBill.html'},
            {name: 'B2B退货通知单', url: '../template/b2bFBP/fbpQuitGoodsNoticeBill.html'},

            /*商品管理*/
            {name: '商品设置', url: '../template/productManage/productSettingUp.html'},
            {name: '商品信息', url: '../template/productManage/productInformation.html'},
            {name: '组合套装', url: '../template/productManage/productGroup.html'},

            {name: '铺货关系', url: '../template/productManage/goodsRelationship.html'},
            {name: '铺货检查', url: '../template/productManage/goodsInspection.html'},
            {name: '铺货日志', url: '../template/productManage/goodsInspectionLog.html'},

            /*库存管理*/
            {name: '系统库存', url: '../template/inventoryManage/systemInventory.html'},
            {name: '上传配置', url: '../template/inventoryManage/uploadConfig.html'},
            {name: '库存上传', url: '../template/inventoryManage/inventoryUpload.html'},
            {name: '库存初始化', url: '../template/inventoryManage/inventoryInit.html'},
            {name: '虚拟调拨', url: '../template/inventoryManage/virtualTransfer.html'},
            {name: '实物调拨', url: '../template/inventoryManage/materialTransfer.html'},
            {name: '调拨通知单', url: '../template/inventoryManage/transferNotice.html'},
            {name: '借出单', url: '../template/inventoryManage/lendList.html'},
            {name: '还入单', url: '../template/inventoryManage/loanIn.html'},
            {name: '借调统计', url: '../template/inventoryManage/secondList.html'},
            {name: '出库订单', url: '../template/inventoryManage/outOrder.html'},
            {name: '入库订单', url: '../template/inventoryManage/inOrder.html'},

            /*营销管理*/
            {name: '会员信息', url: '../template/marketingManage/vipMessage.html'},
            {name: '赠品策略', url: '../template/marketingManage/presentTactics.html'},
            {name: '活动报名', url: '../template/marketingManage/activityApply.html'},
            {name: '预售计划', url: '../template/marketingManage/presellPlan.html'},

            /*财务管理*/
            {name: '账单记录', url: '../template/propertyManage/checkRecord.html'},
            {name: '平台对账单', url: '../template/propertyManage/platformCheck.html'},
            {name: '核销管理', url: '../template/propertyManage/verificationManage.html'},
            {name: '核销记录', url: '../template/propertyManage/verificationRecord.html'},
            {name: '手工核销', url: '../template/propertyManage/handworkVerification.html'},
            {name: '商品明细', url: '../template/propertyManage/goodsDetail.html'},

            /*采购管理*/
            {name: '供应商信息', url: '../template/purchaseManage/supplierInformation.html'},
            {name: '采购订单', url: '../template/purchaseManage/purchaseList.html'},
            {name: '采购通知单', url: '../template/purchaseManage/purchaseRequisitionList.html'},
            {name: '采购退货单', url: '../template/purchaseManage/returnRequisitionList.html'},
            {name: '采购建议', url: '../template/purchaseManage/purchaseAdvise.html'},

            /*报表管理*/

            /*配置管理*/
            {name: '短信账号', url: '../template/configManage/smsAccount.html'},
            {name: '短信模板', url: '../template/configManage/smsTemplate.html'},
            {name: '店铺信息', url: '../template/configManage/shopInformation.html'},
            {name: '仓库信息', url: '../template/configManage/storageInformation.html'},
            {name: '仓库范围', url: '../template/configManage/storageArea.html'},
            {name: '快递信息', url: '../template/configManage/expressInformation.html'},
            {name: '快递范围', url: '../template/configManage/expressArea.html'},
            {name: '区域信息', url: '../template/configManage/areaInformation.html'},
            {name: '区域关联', url: '../template/configManage/areaContact.html'},
            {name: '配货策略', url: '../template/configManage/peeringStrategy.html'},
            {name: '公司信息', url: '../template/configManage/companyInformation.html'},
            {name: '部门信息', url: '../template/configManage/departmentInformation.html'},
            {name: '角色管理', url: '../template/configManage/characterManage.html'},
            {name: '用户管理', url: '../template/configManage/userManage.html'},
            {name: '平台接口', url: '../template/configManage/platformInterface.html'},
            {name: '物流接口', url: '../template/configManage/logisticsInterface.html'},
            {name: '服务接口', url: '../template/configManage/serviceInterface.html'},
            {name: '系统设置', url: '../template/configManage/systemConfig.html'},
            {name: '通用分类', url: '../template/configManage/generalClassify.html'},
            {name: '订单配置', url: '../template/configManage/orderConfig.html'},
            {name: '退换货单配置', url: '../template/configManage/returnOrderConfig.html'},
            {name: '库存配置', url: '../template/configManage/inventoryConfig.html'},
            {name: '短信配置', url: '../template/configManage/smsConfig.html'},
            {name: '商品配置', url: '../template/configManage/productConfig.html'},
            {name: '唯品配置', url: '../template/configManage/vipConfig.html'},

            {name: '下载配置', url: '../template/configManage/downloadConfig.html'},
            {name: '系统日志', url: '../template/configManage/systemLog.html'},

        ],

        /*售前-币种*/
        currencycode: {
            "0": "RMB",
            "1": "USD"
        },
        /*售前-订单付款状态*/
        orderPaymentStatus : {
            "1":'未付款',
            "2":'已付款'
        },
        /*售前-订单状态*/
        orderStatus: {
            "0": "新建",
            "10": "审核异常",
            "11": "审核已通过",
            "20": "自动配货中",
            "21": "自动配货异常",
            "22": "已配货",
            "31": "已部分发货",
            "32": "已全部发货"
        },
        /*售前-订单来源*/
        preOrderSource: {
            "0": "PC",
            "1": "手机"
        },
        /*售前-订单处理预售类型*/
        preSellType: {
            "0": "非预售",
            "1": "部分预售",
            "2": "全部预售"
        },
        /*售前-发票种类*/
        invoiceType: {
            "0": "收据",
            "1": "个人",
            "2": "普通发票",
            "3": "个人",
        },
        /*售前-退款状态*/
        preRefundType: {
            "0": "未定义",
            "1": "部分退款",
            "2": "全部退款"
        },
        /*售前-配货状态*/
        preDistributionStatus: {
            "0": "未配货",
            "1": "部分配货",
            "2": "全部配货"
        },
        /*售前-发货状态*/
        preDelivery : {
            "0" : "未发货",
            "1" : "部分发货",
            "2" : "全部发货",
            "3" : "发货异常"
        },
        /*售前-订单处理状态*/
        preOrderHandleStatus: {
            "0": "未定义",
            "1": "新建",
            "2": "正在完整性检查",
            "3": "完整性检查完成",
            "4": "完整性检查异常",
            "5": "审核中",
            "6": "审核异常",
            "7": "审核已通过",
            "8": "自动配货中",
            "9": "自动配货异常",
            "10": "自动已配货",
            "11": "手动已配货",
            "12": "发货异常",
            "13": "已部分发货",
            "14": "已全部发货",
            "15": "自动平台发货中",
            "16": "自动平台发货异常",
            "17": "自动平台已发货",
            "18": "手动平台已发货"
        },
        /*退款方式*/
        refundWay: {
            "0": '线上退款',
            "1": '线下退款'
        },
        /*售前-订单类型*/
        preOrderType: {
            "0": "销售订单",
            "1": "退货订单",
            "2": "费用订单",
            "4": "换货订单",
            "5": "补发订单",
            "6": "补发票订单"
        },
        /*支付方式*/
        payment: {
            "0": "支付宝",
            "1": "在线支付",
            "2": "邮局汇款",
            "3": "手机支付",
            "4": "财付通",
            "5": "块钱",
            "6": "现金",
            "7": "礼品卡",
            "8": "余额支付",
            "9": "货到付款",
            "10": "PayPal",
            "11": "微信支付",
            "12": "优惠券",
            "13": "红包",
            "14": "京豆",
            "15": "积分支付",
            "16": "其他支付"
        },

        /*售前-订单状态*/
        preOrderStatus: {
            "WAIT_SELLER_SEND_GOODS": "买家已付款,等待发货",
            "TRADE_FINISHED": "交易完成"
        },

        /*售前-订单平台状态*/
        orderPlantformStatus : {
            "0":'待审核',
            "1":'待付预付款',
            "2":'待发货',
            "3":'拒单',
            "4":'部分出库',
            "5":'全部出库'
        },

        /*售前-配货状态*/
        preDistributionState: {
            "0": "已生成",
            "1": "推送中",
            "2": "已通知",
            "3": "已取消",
            "4": "已发货",
            "5": "推送失败"
        },

        /*售前-配货明细状态*/
        preAllocationDetaisStatus: {
            "0": "待发货 ",
            "1": "已取消",
            "2": "已发货"
        },

        /*售前-配货明细状态*/
        preDistributionInfoState: {
            "0": "未配货 ",
            "1": "已配货",
            "2": "已发货"
        },


        /*售后-平台状态*/
        platformState: {
            "1": "等待卖家发货",
            "2": "卖家已发货",
            "3": "交易完成",
            "4": "没有创建支付宝交易",
            "5": "等待买家付款",
            "6": "买家已签收",
            "7": "交易关闭",
            "8": "交易被淘宝关"
        },

        /*售后-退款状态*/
        refundStatus: {
            "1": "买家申请,等待卖家同意",
            "2": "卖家拒绝",
            "3": "等待买家退货",
            "4": "等待卖家确认收货",
            "5": "退款关闭",
            "6": "退款成功"
        },
        /*售后-货物状态*/
        refundGoodsStatus: {
            "1": "买家未收到货",
            "2": "买家已收到货",
            "3": "买家已退货"
        },

        /*售后-订单标记*/
        orderMark: {
            "1": "正常退货",
            "2": "次品退货"
        },

        /*售后-退款类型*/
        refundType: {
            "1": "仅退款",
            "2": "退款退货"
        },
        /*售后-退款类型*/
        afterSellRefundType: {
            "0": '不退货退款',
            "1": '退货退款',
            "2": '部分退货退款'
        },

        //订单详情-退款类型
        OrderefundType: {
            "0": '不退货退款',
            "1": '部分退款',
            "2": '部分退货退款'
        },

        /*售后-单据状态*/
        documentStatus: {
            "0": "未审核",
            "1": "已审核",
            "2": "出库已通知",
            "3": "已出库",
            "4": "入库已通知",
            "5": "已入库",
            "9": "已关闭"
        },

        /*售后-退货标记*/
        returnMark: {
            "1": "正常退货",
            "2": "次品退货"
        },

        /*售后-退货类型*/
        returnType: {
            "04": "报废(人为洗过穿过)",
            "03": "错发/漏发退回",
            "'07'": "退回假货",
            "05": "无头件",
            "'02'": "原件退回",
            "01": "正常退货",
            "'06'": "质量问题退回"
        },

        /*售后-退货标记*/
        refundMethod: {
            "0": "线上退款",
            "1": "线下退款"
        },

        /*售后-退货方式*/
        returnMethod: {
            "0": "未定义",
            "1": "正常退货",
            "2": "正常换货",
            "3": "原件退货",
            "4": "三无包裹"
        },

        /*售后-退货通知单状态*/
        returnRequisitionStauts: {
            "0": "新建",
            "1": "已通知",
            "2": "已入库",
            "3": "已取消"
        },

        /*售后-退款单状态*/
        refundOrderStatus: {
            "0": "新建",
            "1": "已审核",
            "2": "已作废",
            "3": "已复核"
        },

        /*售后-退换货单状态*/
        returnOrExchangeStatus: {
            "0": "新建",
            "1": "已审核",
            "2": "已复核",
            "3": "已入库"
        },

        /*唯品-唯品档期-活动状态*/
        CITactivityStatus: {
            "undefined": "新建",
            "0": "新建",
            "1": "已上传",
            "3": "已审核"
        },
        /*唯品-唯品档期-档期类型*/
        CITtimelineType: {
            "0": "普通档期",
            "1": "唯品专场"
        },
        /*唯品-唯品档期详情-活动状态*/
        CITdetailstatus: {
            "undefined": "未上传",
            "0": "未上传",
            "2": "已结束"
        },

        /*唯品-唯品配货单-配货单据状态*/
        CITdocumentStatus: {
            "1": "已生成",
            "2": "已通知",
            "3": "部分出库",
            "4": "全部出库",
            "9": "已关闭",
            "10": "商品异常"
        },
        /*唯品-配送方式*/
        CITshippingMethods: {
            "1": "汽运",
            "2": "空运"
        },
        /*唯品-送货单 状态*/
        CITsendGoodsStatus: {
            "2": "已审核"
        },
        /*唯品-调整单 状态*/
        CITadjustmentStatus: {
            "1": "禁用",
            "2": "新建",
            "3": "审核"
        },
        /*唯品-调整单 调整原因*/
        CITadjustmentReason: {
            "0": "平台超卖",
            "1": "撤销下线",
            "2": "中途增加",
            "3": "其他"
        },
        /*唯品-调整单 调整类型*/
        CITadjustmentType: {
            "0": "增加占用",
            "1": "减少占用"
        },
        /*唯品-退货单据状态*/
        CITreturnStatus: {
            "1": "已审核",
            "2": "已签收",
            "3": "已生成通知单",
            "4": "已作废"
        },

        /*B2B 计划单 单据状态*/
        B2BplannedOrderStatus: {
            "0": "未审核",
            "1": "已审核",
            "8": "已完成",
            "9": "已终止"
        },
        /*B2B 通知单 单据状态*/
        B2BrequisitionStatus: {
            "0": "未审核",
            "1": "已审核",
            "2": "出库已通知",
            "3": "已出库",
            "4": "入库已通知",
            "5": "已入库",
            "9": "已关闭"
        },
        /*B2B 销售出库单 单据状态*/
        B2BsellOutputStatus: {
            "0":"未审核",
            "1":"新建",
            "2":"已审核",
            "3":"已关闭",
        },
        /*B2B 销售出库单 单据状态*/
        B2BsellOutputOrdertype: {
            "0":"销售入库",
            "1":"退货入库",
        },
        /*B2B 退货单 单据状态*/
        B2BquitGoodsStatus:{
            "0":"新建",
            "1":"已签收",
            "2":"已审核",
            "3":"已生成通知单",
            "4":"已作废"
        },
        /*B2B 退货单 签收类型*/
        B2BquitGoodsreturnsigntype:{
            "0":"未签收",
            "1":"正常签收",
            "2":"异常签收"
        },
        /*B2B 退货通知单 单据状态*/
        B2BreturnSalesMemo: {
            "1": "已审核",
            "2": "已通知WMS ",
            "3": "已入库",
            "4": "已关闭"
        },
        /*B2B 退货通知单 单据类型*/
        B2BreturnReturnType: {
            "1": "一退",
            "2": "二退",
            "3": "三退"
        },
        /*B2B 退货通知单 签收类型*/
        B2BreturnReturnSignType: {
            "1": "正常签收",
            "2": "异常签收"
        },
        /*采购管理 结算方式*/
        purchaseMethod: {
            "0": "现结",
            "1": "月结 "
        },
        /*采购管理 到货状态*/
        purchaseArrivalStatus: {
            "1": "未到货",
            "2": "部分到货 ",
            "3": "全部到货"
        },
        /*采购管理 显示类型*/
        purchaseDisplayType: {
            "M": "按月显示",
            "D": "按天显示 "
        },
        /*采购管理 订单单据状态*/
        purchaseOrderStatus: {
            "0": "未审核",
            "1": "已审核",
            "2": "已完成 ",
            "3": "已作废"
        },
        /*采购管理 通知单单据状态*/
        purchaseNoticeStatus: {
            "0": "新建",
            "1": "已审核",
            "2": "已通知 ",
            "3": "部分出库",
            "4": "已关闭",
            "5": "全部出库"
        },
        /*采购管理 退货单单据状态*/
        purchaseReturnStatus: {
            "0": "未审核",
            "1": "已审核",
            "2": "已通知 ",
            "3": "部分出库",
            "4": "全部出库",
            "5": "已关闭"
        },
        /*营销管理-会员管理 会员标记*/
        marketingSign: {
            "0": "加先发货",
            "1": "送赠品",
            "2": "忠实会员"
        },
        /*营销管理-会员管理 性别*/
        marketingSex: {
            "0": "男",
            "1": "女 "
        },
        /*营销管理-会员管理 会员状态*/
        marketingUserStatus: {
            "0": "正常",
            "1": "黑名单"
        },

        /*营销管理-营销策略 赠品策略*/
        marketingGiveawayStatus: {
            "0": "新建",
            "1": "活动中",
            "2": "暂停",
            "3": "禁用"
        },
        /*营销管理-营销策略 活动范围*/
        marketingDegreeOfLatitude: {
            "1": "所有款",
            "2": "包含活动商品",
            "3": "排除活动商品"
        },
        /*营销管理-营销策略 赠品策略*/
        marketingGiftType: {
            "1": "仅送赠品",
            "2": "仅指定快递",
            "3": "指定赠品+快递"
        },
        /*营销管理-营销策略 匹配时间*/
        marketingMatchTime: {
            "1": "付款时间",
            "2": "平台制单时间"
        },
        /*营销管理-营销策略 策略类型(买就送)*/
        marketingPolicyType1: {
            "1": "买款送",
            "2": "买款满金额送"
        },
        /*营销管理-营销策略 策略类型(满就送)*/
        marketingPolicyType2: {
            "3": "满件送",
            "4": "满金额送",
            "5": "满件满金额送"
        },
        /*营销管理-营销策略 来源类型*/
        marketingSourceType: {
            "0": "所有",
            "1": "PC",
            "2": "移动"
        },
        /*营销管理-营销策略 翻倍赠送类型*/
        marketingDoubletype: {
            "1": "赠送款数翻倍",
            "2": "赠送款量翻倍"
        },
        /*营销管理-营销策略 库存扣减方式*/
        marketingInventoryDeduction: {
            "0": "拍下减库存",
            "1": "付款减库存"
        },
        /*营销管理-营销策略 活动类型*/
        marketingActivityType: {
            "1": "品牌团",
            "2": "聚划算"
        },
        marketingActivitystrategytype: {
            "0": '0',
            "1": "买就送",
            "2": "满就送",
            "3": "福袋"
        },
        /*营销管理-活动报名 活动状态*/
        marketingActivityStatus: {
            "0": "未审核",
            "1": "审核通过",
            "2": "正在审核",
            "3": "活动正在进行",
            "4": "活动已结束"
        },
        /*营销管理-预售计划 状态*/
        marketingPlanStatus: {
            "0": "活动未审核",
            "1": "活动已审核",
            "2": "活动进行中",
            "3": "活动已结束",
            "4": "活动禁用"
        },

        /*财务管理-核销管理详情 状态*/
        verificationManageDetailOrdertype: {
            "0": "销售订单",
        },
        /*财务管理-手工核销 单据类型*/
        verificationManageVerifiType: {
            "0": "销售订单",
            "1": "退款单",
            "Statements": "对账单"
        },
        /*商品管理-基本信息 商品状态*/
        productStatus: {
            "0": "待审核",
            "1": "有效",
            "2": "禁用"
        },
        /*商品管理-组合套装 状态*/
        groupStatus: {
            "0": "待确认",
            "1": "有效",
            "2": "禁用"
        },
        /*商品管理-配件*/
        spareparts: {
            "0": "",
            "1": "有配件"
        },
        /*商品管理-商品类型*/
        productType: {
            "0": "正常",
            "1": "赠品",
            "2": "虚拟",
            "3": "发票",
            "4": "正常",
            "5": "次品",
            "6": "礼盒",
            "7": "包装",
            "8": "组合套装"
        },
        /*商品管理-变价类型*/
        productChangeType: {
            "1": "分销价",
            "2": "成本价",
            "3": "市场价",
            "4": "销售价",
            "5": "实际售价",
            "6": "采购价"
        },
        /*商品管理-铺货  */
        productStatusList: {
            "0": "全部",
            "1": "在售",
            "2": "下架"
        },
        /*商品管理-铺货  */
        goodStatus: {
            "onsale": "出售中",
            "instock": "仓库中"
        },
        /*库存管理  上传状态*/
        inventoryUploadStatus: {
            "1": "上传成功",
            "2": "上传失败"
        },
        /*库存管理 虚拟调拨 单据状态*/
        inventoryFictitious: {
            "1": "待审核",
            "2": "已审核"
        },
        /*库存管理 借调管理 借调类型*/
        inventoryLoanType: [
            {name: "质检", id: '0b3caf5e-b2df-4b80-96ac-fefa29eca997'},
            {name: "拍照", id: 'a5d60026-61b8-4f8e-9a83-86e2272bb711'}
        ],

        /*库存管理 实物调拨 单据状态*/
        inventoryPracticality: {
            "0": "未审核",
            "1": "已审核",
            "8": "已完成",
            "9": "已终止"
        },
        /*库存管理 调拨通知单 单据状态*/
        inventoryChallengeNoticeStatus: {
            "0": "未审核",
            "1": "已审核",
            "2": "出库已通知",
            "3": "已出库",
            "4": "入库已通知",
            "5": "已入库",
            "9": "已关闭"
        },
        /*库存管理 借调管理 借出单状态*/
        inventoryLoanStatus: {
            "0": "新建",
            "10": "已通知",
            "20": "已出库",
            "30": "部分归还",
            "40": "全部归还",
            "50": "作废"
        },
        /*库存管理 借调管理 还入单状态*/
        inventoryAlsoInStatus: {
            "0": "新建",
            "10": "已通知",
            "30": "已出库",
            "40": "作废"
        },
        /*库存管理 出库订单（入库订单） 单据状态*/
        inventoryOutboundOrder: {
            "0": "待审核",
            "1": "已审核",
            "2": "已通知",
            "3": "部分出库",
            "4": "全部出库",
            "5": "已关闭"
        },
        /*系统配置 短信模板类型*/
        SMSType: {
            "0": "发货通知",
            "1": "退换货通知",
            "2": "订单标记通知",
            "3": "预售通知",
            "4": "营销活动预警"
        },
        /*系统配置 会员类型*/
        customerType: {
            "1": "所有会员",
            "2": "新会员",
            "3": "老会员"
        },

        /*系统配置 基础设置 配货模式*/
        theDistributionPattern: {
            "0": "明细有货先发",
            "1": "整单有货先发"
        },

        /*系统配置 基础设置 铺货规则*/
        DistributionRule: {
            "0": "规格编码",
            "1": "商品编码",
            "2": "商品与规格编码"
        },
        /*系统配置 基础设置 京东模式*/
        JDMode: {
            "0": "FBP",
            "1": "LBP",
            "2": "SOP",
            "3": "SOPL",
            "4": "N360",
            "5": "NTP"
        },
        /*系统配置 通用分类 类别*/
        classificationType: {
            "1": "退换货类型",
            "2": "商品品牌",
            "3": "生产方式",
            "4": "商品主题",
            "5": "商品年份",
            "6": "商品季节",
            "7": "商品单位",
            "8": "商品款型",
            "9": "会员标记",
            "10": "退换货标记",
            "11": "取消交易类型",
            "12": "订单标记",
            "13": "退款类型",
            "14": "商品自定义属性",
            "15": "自动审单用语",
            "16": "价格区间",
            "17": "调拨类型",
            "18": "采购类型",
            "19": "订单便签",
            "20": "退款申请标记",
            "21": "变价原因",
            "22": "活动类型",
            "23": "退款自动审核原因",
            "24": "会员等级",
            "25": "发票行业类型",
            "26": "采购退货原因",
            "27": "出库类型",
            "28": "入库类型",
            "29": "唯品承运商",
            "30": "借调类型",
            "31": "到货时间",
            "32": "明细退货原因",
            "33": "币种"
        },
        /*系统配置 店铺信息 店铺性质*/
        storeNature: {
            "0": "未定义",
            "1": "加盟",
            "2": "直营",
            "3": "联营",
            "4": "电商自营",
            "5": "分销代理",
            "6": "入仓"
        },
        /*系统配置 店铺信息 平台类型*/
        platformType: {
            "0": "未定义",
            "1": "系统网站",
            "2": "淘宝网站",
            "3": "其他",
            "4": "淘宝分销",
            "5": "拍拍商城",
            "6": "京东商城",
            "7": "当当商城",
            "8": "E链通",
            "9": "商派网站",
            "10": "POS门店",
            "11": "商派分销王",
            "12": "一号店",
            "13": "凡客商城",
            "14": "品聚网站",
            "15": "卓越亚马逊",
            "16": "易贝易趣",
            "17": "好乐买",
            "18": "QQ网购",
            "19": "趣天",
            "20": "官网商城",
            "21": "商派独立网站",
            "22": "天猫商城",
            "23": "淘宝经销",
            "24": "微购物",
            "25": "唯品会",
            "26": "速卖通",
            "27": "亚马逊国际",
            "28": "易贝",
            "29": "兰亭集市",
            "30": "聚美平台",
            "31": "聚尚平台",
            "32": "蜜芽宝贝",
            "33": "苏宁易购",
            "34": "阿里巴巴",
            "35": "爱奇艺",
            "36": "口袋通",
            "37": "工行融E购",
            "38": "美丽说",
            "39": "微店商城",
            "40": "美团",
            "40": "微盟",
            "41": "明星衣橱",
            "36": "贝贝网",
            "37": "百度Mall",
            "38": "网易绣品",
            "39": "楚楚街",
            "40": "拼多多",
            "41": "宝宝树",
            "42": "飞牛网",
            "43": "折800",
            "44": "国美",
            "45": "孩子王",
            "46": "网易考拉",
            "47": "尚宝",
            "48": "大V店",
            "49": "云集",
            "50": "新零售",
            "51": "云聚"
        },
        /*系统配置 仓库信息 仓库类型*/
        warehouseType: {
            "1": "实体仓库",
            "2": "共享仓库",
            "3": "独立仓库"
        },
        /*系统配置 仓库信息 仓储类型*/
        storageType: {
            "0": "普通仓库",
            "1": "门店仓库",
            "2": "唯品仓库",
            "3": "平台仓库"
        },
        /*系统配置 仓库信息 截单类型*/
        truncatedType: {
            "1": "时间段拦截",
            "2": "固定时间拦截"
        },
        /*系统配置 仓库信息 时间类型*/
        timeType: {
            "1": "支付时间",
            "2": "配货时间"
        },
        /*系统配置 仓库信息 快递类型*/
        expressType: {
            "1": "售前+售后",
            "2": "售前快递",
            "3": "售后快递"
        },
        /*系统配置 配货策略 配货类型*/
        matchedType: {
            "0": "未定义",
            "1": "一单一货",
            "2": "一单多货"
        },
        /*系统配置 接口应用 服务商*/
        facilitator: {
            "GreatOnce": "巨益科技",
            "Gwall": "巨软科技",
            "Best": "百世物流",
            "Qimen": "淘宝奇门",
            "FLUX": "富勒仓储",
            "Drp": "道讯",
            "Standard": "标准接口",
            "SF": "顺丰仓储",
            "Kingdee": "金蝶",
            "Runhe": "润和SCM",
            "Ectober": "靑柏",
            "Surgeon": "伯俊软件",
            "Wfy": "维富友",
            "Sap": "SAP",
            "FJ": "丰捷",
            "Ds": "笛莎公主",
            "Qianmi": "千米网",
            "POS": "POS",
            "Sc": "杉橙WMS",
            "LieBo": "裂帛",
            "Lsl": "洛诗琳"
        },
        /*系统配置  下载类型*/
        downloadType: {
            "1": "订单下载",
            "2": "退款单下载",
            "3": "商品下载"
        },
        /*系统配置  通知类型*/
        notificationType: {
            "0": "基础服务",
            "1": "下载服务",
            "2": "转化服务",
            "3": "配货服务",
            "4": "发货服务",
            "5": "接口服务",
            "6": "唯品服务"
        },
        /*系统配置  通知方式*/
        notificationMethods: {
            "0": "短信通知",
            "1": "邮件通知"
        },
        /*系统配置  日志类型*/
        logType: {
            "101": "系统配置",
            "102": "公司管理",
            "103": "部门管理",
            "104": "角色管理",
            "105": "用户管理",
            "106": "授权管理",
            "107": "通用分类",
            "108": "短信配置",
            "201": "店铺管理",
            "202": "仓库管理",
            "203": "快递管理",
            "204": "平台接口",
            "205": "物流接口",
            "206": "商品管理",
            "207": "配货模板",
            "208": "库存管理",
            "301": "配货通知",
            "302": "退换货单",
            "303": "退款单",
            "304": "销售订单",
            "401": "赠品策略",
            "402": "活动报名",
            "501": "报表导出"
        },

        /*权限类型*/
        permissionType: {
            "101": "主菜单",
            "102": "操作按钮",
            "103": "字段",
            "201": "店铺",
            "202": "仓库"
        }

    })


    .constant('APP_MEDIAQUERY', {
        'desktopLG': 1200,
        'desktop': 992,
        'tablet': 768,
        'mobile': 480
    })
    .constant('APP_REQUIRES', {
        // jQuery based and standalone scripts
        scripts: {},
        // Angular based script (use the right module name)
        modules: [
            {
                name: 'ngDialog',
                files: ['../public/plugin/ngDialog/js/ngDialog.min.js',
                    '../public/plugin/ngDialog/css/ngDialog.min.css',
                    '../public/plugin/ngDialog/css/ngDialog-theme-default.min.css']
            },
            {
                name: 'bootstrap',
                files: ['../public/js/bootstrap.min.js']
            },
            {
                name: 'echarts',
                files: ['../public/js/echarts.min.js']
            },
            {
                name: 'layer',
                files: ['../public/js/layer.js',
                    '../public/css/layer.css']
            }

        ]
    })
;
