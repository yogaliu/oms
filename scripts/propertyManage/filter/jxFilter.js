/**
 * Created by jx on 2017/4/6.
 */
angular.module("klwkOmsApp")
    .filter("jxFilter", function () {
        return function (inputValue, parameter, module) {
            //手工核销
            if (module == 'handworkVerification') {
                //单据类型
                if (parameter === 'verifiType') {
                    var state1;
                    switch (inputValue) {
                        case 0:
                            state1 = '销售订单';
                            break;

                        case 'Statements':
                            state1 = '对账单';
                            break;
                    }
                    return state1;
                }
                else {
                    return inputValue;
                }
            }
            //核销管理详情
            else if (module == 'verificationManageDetail') {
                //单据类型
                if (parameter === 'ordertype') {
                    var state2;
                    switch (inputValue) {
                        case 0:
                            state2 = '销售订单';
                            break;
                        case 1:
                            state2 = '退款单';
                            break;
                    }
                    return state2;

                }
                else {
                    return inputValue;
                }
            }
            //赠品策略
            else if (module == 'presentTactics') {
                //状态
                if (parameter === 'status') {
                    var state3;
                    switch (inputValue) {
                        case 0:
                            state3 = '新建';
                            break;
                        case 1:
                            state3 = '活动中';
                            break;
                        case 2:
                            state3 = '暂停';
                            break;
                        case 3:
                            state3 = '禁用';
                            break;
                    }
                    return state3;
                }
                //策略名称
                else if (parameter === 'activitystrategytype') {
                    var state4;
                    switch (inputValue) {
                        case 1:
                            state4 = '买就送';
                            break;
                        case 2:
                            state4 = '满就送';
                            break;
                        case 3:
                            state4 = '福袋';
                            break;
                        default :
                            state4 = 0;
                            break;
                    }
                    return state4;
                }
                //活动范围
                else if (parameter === 'activityproductrange') {
                    var state4;
                    switch (inputValue) {
                        case 0:
                            state4 = '所有款';
                            break;
                        case 1:
                            state4 = '活动商品';
                            break;
                        case 2:
                            state4 = '排除活动商品';
                            break;
                        default :
                            state4 = '请选择活动范围';
                            break;
                    }
                    return state4;
                }
                //赠送类型
                else if (parameter === 'activitysendtype') {
                    var state4;
                    switch (inputValue) {
                        case 0:
                            state4 = '仅送赠品';
                            break;
                        case 1:
                            state4 = '仅指定快递';
                            break;
                        case 2:
                            state4 = '指定赠品+快递';
                            break;
                        default :
                            state4 = '请选择赠送类型';
                            break;
                    }
                    return state4;
                }
                //匹配时间
                else if (parameter === 'datetype') {
                    var state4;
                    switch (inputValue) {
                        case 1:
                            state4 = '付款时间';
                            break;
                        case 2:
                            state4 = '平台制单时间';
                            break;
                        default :
                            state4 = '请选择匹配时间';
                            break;
                    }
                    return state4;
                }
                //策略类型
                else if (parameter === 'strategytype') {
                    var state4;
                    switch (inputValue) {
                        case 0:
                            state4 = '买款送';
                            break;
                        case 1:
                            state4 = '买款满金额';
                            break;
                        case 2:
                            state4 = '满金额送';
                            break;
                        case 3:
                            state4 = '满件送';
                            break;
                        case 4:
                            state4 = '满件满金额送';
                            break;
                        default :
                            state4 = '请选择策略类型';
                            break;
                    }
                    return state4;
                }
                //来源类型
                else if (parameter === 'orderfrom') {
                    var state4;
                    switch (inputValue) {
                        case 1:
                            state4 = '所有';
                            break;
                        case 2:
                            state4 = 'PC';
                            break;
                        case 3:
                            state4 = '移动';
                            break;
                        default :
                            state4 = '请选择来源类型';
                            break;
                    }
                    return state4;
                }
                else {
                    return inputValue;
                }
            }
            //活动报名
            else if (module == 'activityApply') {
                // 活动状态
                if (parameter === 'registrationstatus') {
                    var state5;
                    switch (inputValue) {
                        case 0:
                            state5 = '未审核';
                            break;
                        case 1:
                            state5 = '审核通过';
                            break;
                        case 2:
                            state5 = '正在审核';
                            break;
                        case 3:
                            state5 = '活动正在进行';
                            break;
                        case 4:
                            state5 = '活动已结束';
                            break;
                    }
                    return state5;
                }
                else {
                    return inputValue;
                }
            }
            //预售计划
            else if (module == 'presellPlan') {
                //颜色状态
                if (parameter === 'colorstatus') {
                    var state6;
                    switch (inputValue) {
                        case 0:
                            state6 = '未修改';
                            break;
                    }
                    return state6;
                }
                //number
                else if (parameter === 'salesqty' || parameter === 'cansalesqty' || parameter === 'onthewayquantity' || parameter === 'totalsalesqty'||  parameter === 'totalpresellquantity') {

                    if (inputValue === '' || inputValue === undefined) {
                        return 0;
                    } else {
                        return inputValue;
                    }
                }
                else {
                    return inputValue;
                }
            }
            //新增预售计划
            else if (module == 'addPresellPlan') {
                //店铺上传比例
                if (parameter === 'rate') {
                    if (inputValue === '' || inputValue === undefined) {
                        return 100;
                    } else {
                        return inputValue;
                    }

                }
                else {
                    return inputValue;
                }
            }
            //新增买就送
            else if (module == 'addBuy') {
                //sku.brand
                if (parameter === 'sku') {
                    return inputValue.brand;
                }
                else {
                    return inputValue;
                }
            }
            //会员信息
            else if (module == 'VipMessage') {
                //加急发货  0/1 转为true/false
                if (parameter === 'speeddelivery') {
                    var state4;
                    switch (inputValue) {
                        case 1:
                            state4 = true;
                            break;
                        default :
                            state4 = false;
                            break;
                    }
                    return state4;
                }
                //性别  0/1 转为true/false
                if (parameter === 'sexName') {
                    var state4;
                    switch (inputValue) {
                        case undefined:
                            state4 = '男';
                            break;
                        default :
                            state4 = inputValue;
                            break;
                    }
                    return state4;
                }

                else {
                    return inputValue;
                }
            }
            //唯品档期详情
            else if (module == 'runScheduleDetail') {
                //number过滤
                if (parameter === 'planqty' || parameter === 'lockqty' ||parameter === 'occupationquantity' ||parameter === 'outqty' ||parameter === 'releaseqty') {
                    var state4;
                    switch (inputValue) {
                        case undefined:
                            state4 = 0;
                            break;
                        default :
                            state4 = inputValue;
                    }
                    return state4;
                }
                else {
                    return inputValue;
                }
            }
            else {
                return inputValue;
            }

        }

    })
;