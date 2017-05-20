/**
 * Created by zgh on 2017/4/11.
 */
/**
 * 订单管理公共服务，主要是配置订单管理中可以公共使用的接口，以及dom操作方法
 */
angular.module('klwkOmsApp')
    .service('orderManagePublicService',['ApiService','toolsService',
        function (ApiService, toolsService) {


            //配置数据
            var configData = {
                /**
                 * 获取默认参数
                 * @returns {{TimeStamp: string, Sign: string, Version: string, SessionId: string, UserId: string, UserName: string, Token: string, CompanyId: string, LoginKey: string}}
                 */
                getParamObj : function () {
                    return {
                        'TimeStamp': '2017-04-15 11:54:40',
                        'Sign': '282DAE8EF665158EAB38799BA4B09ADD',
                        'Version': '2.5.1.9',
                        'SessionId' : '',
                        'UserId': '8d4082c4-b85c-4696-b238-f0239bd20dbf',
                        'UserName': 'zgh',
                        'Token' : '',
                        'CompanyId' : '',
                        'LoginKey': 'eda9ff0b-8c57-45c2-be04-92e2a57465d8'
                    };
                },
                //使用人
                user : 'zgh'
            };

            /**
             * 订单管理公共接口
             * @type {{getAllShops: Function}}
             */
            var orderManagerPublicInterface = {

                //订单列表
                getOrderList : function (scope,callback) {
                    var url = '/SalesOrder/SalesOrder/Query';
                    var paramObj = configData.getParamObj();
                    paramObj['body'] = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "Timespan":"00:00:41.452",
                        "SeletedCount":0,
                        "Data":[
                            {
                                "OperateType":0,
                                "LogicOperateType":0,
                                "AllowEmpty":false,
                                "Field":"IsObsolete",
                                "Name":"IsObsolete",
                                "Value":false,
                                "Children":[]
                            }
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var orderlist = ApiService.postLoad(url,paramObj);
                    orderlist.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 获取所有店铺的接口
                 * @param scope $scope对象
                 * @param callback 调用接口成功后的回调函数
                 */
                getAllShops : function (scope,callback) {
                    var url = '/BasicInformation/Store/Get';
                    var paramObj = configData.getParamObj();
                    paramObj.body = [{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "IsDisabled",
                        "Name": "IsDisabled",
                        "Value": false,
                        "Children": []
                    }];
                    var shopList = ApiService.post(url,paramObj);
                    shopList.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
                    });
                },

                /**
                 * 获取所有平台信息
                 * @param scope $scope对象
                 * @param callback 获取平台信息后的回调函数
                 */
                getPlantformType : function (scope,callback) {
                    var url  = '/BasicInformation/PlatformInterface/Get';
                    var paramObj = configData.getParamObj();
                    var plantformType = ApiService.post(url,paramObj);
                    plantformType.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
                    });
                },

                /**
                 * 获取所有仓库信息
                 * @param scope $scope对象
                 * @param callback 获取仓库后的回调函数
                 */
                getAllWareHouse : function (scope,callback) {
                    var url = '/BasicInformation/Warehouse/Query';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":5000,
                        "SeletedCount":0,
                        "Data":[],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var wareHose = ApiService.post(url,paramObj);
                    wareHose.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
                    });
                },

                /**
                 * 获取所有快递信息
                 * @param scope $scope对象
                 * @param callback 获取后台信息后的回调函数
                 */
                getAllExpressInfo : function (scope,callback) {
                    var url = '/BasicInformation/Express/Get';
                    var paramObj = configData.getParamObj();
                    paramObj.body = [];
                    var express = ApiService.post(url,paramObj);
                    express.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
                    });
                },

                /**
                 * 获取所有订单标记信息
                 * @param scope $scope
                 * @param callback 获取完后台数据后的回调函数
                 */
                getAllOrderMarks : function (scope,callback) {
                    var url = '/BasicInformation/GeneralClassiFication/Get';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify([
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "IsDisabled",
                            "Name": "IsDisabled",
                            "Value": false,
                            "Children": []
                        },
                        {
                            "OperateType": 0,
                            "LogicOperateType": 0,
                            "AllowEmpty": false,
                            "Field": "ClassiFicationType",
                            "Name": "ClassiFicationType",
                            "Value": 12,
                            "Children": []
                        }
                    ]);
                    var orderMarks = ApiService.post(url,paramObj);
                    orderMarks.then(function (res) {
                        if(res.success){
                                callback(res.data);
                        }
                    });
                },

                //获取所有会员信息
                getVipCustomer : function (scope,callback) {
                    var url = '/Customer/Customer/Get';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":50,
                        "Timespan":"00:00:15.863",
                        "SeletedCount":0,
                        "Data":[],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var vipCustomer = ApiService.post(url,paramObj);
                    vipCustomer.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
                    });
                },

                //获取所有商品信息
                getAllProducts : function (scope,callback) {
                    var url = '/Product/ProductSku/Query';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":50,
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"sku.Status",
                            "Name":"skustatus",
                            "Value":1,
                            "Children":[]
                        },{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"sku.IsCombined",
                            "Name":"IsCombined",
                            "Value":"0","Children":[]
                        },{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"pro.Status",
                            "Name":"prostatus",
                            "Value":1,
                            "Children":[]
                        }],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var product = ApiService.post(url,paramObj);
                    product.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
                    });
                },

                //获取单个商品的库存信息
                GetOccupation : function (scope,code,callback) {
                    var url = '/Inventory/InventoryVirtual/GetOccupation';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Code",
                        "Name":"Code",
                        "Value":code,
                        "Children":[]
                    }]);
                    var occupation = ApiService.post(url,paramObj);
                    occupation.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
                    });
                },
                
                //获取仓库Id与仓库名称对应的关系表
                getWareHouseById : function (scope,id,callback) {
                    var url = '/BasicInformation/Warehouse/GetById';
                    var paramObj = configData.getParamObj();
                    paramObj.body = id;
                    var wareHouse = ApiService.post(url,paramObj);
                    wareHouse.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
                    });
                },

                //获取套装信息
                getCombinedProduct : function (scope,callback){
                    var url ='/Product/CombinedProduct/Query';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":50,
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"Status",
                            "Name":"Status",
                            "Value":1,
                            "Children":[]
                        }],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var combinedProduct = ApiService.post(url,paramObj);
                    combinedProduct.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
                    });
                },

                //获取订单标记
                getOrderLabel : function (scope,callback){
                    var url = '/BasicInformation/GeneralClassiFication/Query';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":50,
                        "Timespan":"00:00:00.061",
                        "SeletedCount":0,
                        "Data":[{
                            "OperateType":0,
                            "LogicOperateType":0,
                            "AllowEmpty":false,
                            "Field":"ClassiFicationType",
                            "Name":"ClassiFicationType",
                            "Value":12,
                            "Children":[]
                        }],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var label = ApiService.post(url,paramObj);
                    label.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
                    });
                },

                /**
                 * 锁定订单
                 * @param orderIds 要锁定的订单的id数组
                 * @param callback
                 */
                lockOrder : function (orderIds,callback){
                    console.log(orderIds);
                    var url = '/SalesOrder/SalesOrder/Lock';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify(orderIds);
                    var lockOrder = ApiService.post(url,paramObj);
                    lockOrder.then(function (res) {
                        if(res.success){
                            callback(res);
                        }
                    });
                },

                /**
                 * 解锁订单
                 * @param scope
                 * @param orderIds 要解锁的订单的id数组
                 * @param callback
                 */
                unLockOrder : function (scope,orderIds,callback) {
                    var url = '/SalesOrder/SalesOrder/UnLock';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify(orderIds);
                    var unLock = ApiService.post(url,paramObj);
                    unLock.then(function (res) {
                        if(res.success){
                            callback();
                        }
                    });
                },

                /**
                 * 添加订单标记
                 * @param scope
                 * @param label 要添加的订单标记
                 * @param ids 要添加的订单的id
                 * @param callback
                 */
                addOrderLabel : function (scope,label,ids,callback){
                    var url = '/SalesOrder/SalesOrder/AddTag';
                    var paramObj = configData.getParamObj();
                    paramObj['tagname'] = label;
                    paramObj['orderids'] = JSON.stringify(ids);
                    var orderLabel = ApiService.post(url,paramObj);
                    orderLabel.then(function (res) {
                        if(res.success){
                            callback();
                        }
                    });
                },

                /**
                 * 添加推荐快递
                 * @param scope
                 * @param express 推荐快递名称
                 * @param expid 推荐快递id
                 * @param ids 要添加的订单id
                 * @param callback
                 */
                addCommendExpress : function(scope,express,expid,ids,callback){
                    var url = '/SalesOrder/SalesOrder/ChangedExpress';
                    var paramObj = configData.getParamObj();
                    paramObj['orderids'] = JSON.stringify(ids);
                    paramObj['expname'] = express;
                    paramObj['expid'] = expid;
                    var commendExpress = ApiService.post(url,paramObj);
                    commendExpress.then(function (res) {
                        if(res.success){
                            callback();
                        }
                    });
                },

                /**
                 * 新增推荐仓库
                 * @param scope
                 * @param wareHouse 仓库名
                 * @param wareid 仓库id
                 * @param ids 要推荐的订单号
                 * @param callback
                 */
                addCommendWareHouse : function (scope,wareHouse,wareid,ids,callback){
                    var url = '/SalesOrder/SalesOrder/ChangedWarehouse';
                    var paramObj =configData.getParamObj();
                    paramObj['orderids'] = JSON.stringify(ids);
                    paramObj['wareid'] = wareid;
                    paramObj['warename'] = wareHouse;
                    var commendWareHouse = ApiService.post(url,paramObj);
                    commendWareHouse.then(function (res) {
                        if(res.success){
                            callback();
                        }
                    });
                },

                /**
                 * 重置状态
                 * @param scope
                 * @param ids 要重置的id
                 * @param callback
                 */
                resetOrderStatus : function (scope,ids,callback){
                    var url = '/SalesOrder/SalesOrder/ResetStatus';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify(ids);
                    var orderStatus = ApiService.post(url,paramObj);
                    orderStatus.then(function (res) {
                        if(res.success){
                            callback();
                        }
                    });
                },

                /**
                 * 作废订单
                 * @param scope
                 * @param ids 要作废的订单号
                 * @param callback
                 */
                obsoluteOrder : function (scope,ids,callback){
                    var url = '/SalesOrder/SalesOrder/Obsolete';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify(ids);
                    var obsoluteOrder = ApiService.post(url,paramObj);
                    obsoluteOrder.then(function (res) {
                        if(res.success){
                            callback();
                        }
                    });
                },

                /**
                 * 订单审核
                 * @param scope
                 * @param ids 要审核的订单
                 * @param callback
                 */
                auditOrder : function (scope,ids,callback) {
                    var url = '/SalesOrder/SalesOrder/Audit';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify(ids);
                    var audit = ApiService.post(url,paramObj);
                    audit.then(function (res) {
                        if(res.success){
                            callback();
                        }else{
                            alert(res.errorMessage);
                        }
                    });
                },

                /**
                 * 自动配货
                 * @param scope
                 * @param ids 要自动配货的订单
                 * @param callback
                 */
                autoDispatch : function (scope,ids,callback){
                    var url = '/SalesOrder/Dispatch/AutoDispatch';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify(ids);
                    var dispatch = ApiService.post(url,paramObj);
                    dispatch.then(function (res) {
                        if(res.success){
                            callback();
                        }
                    });
                },

                /**
                 * 强制拆单
                 * @param scope
                 * @param ids 被强制拆单的订单
                 * @param callback
                 */
                forceSplitOrder : function (scope,ids,callback){
                    var url = '/SalesOrder/SalesOrder/MandatorySplit';
                    var paramObj = configData.getParamObj();
                    paramObj.orderids = JSON.stringify(ids);
                    var dispatch = ApiService.post(url,paramObj);
                    dispatch.then(function (res) {
                        if(res.success){
                            callback();
                        }
                    });
                },
                
                //取消配货
                orderBatchCancel : function (scope,ids,callback) {
                    var url = '/SalesOrder/Dispatch/BatchCancel';
                    var paramObj = configData.getParamObj();
                    paramObj.dispatchOrderIds = JSON.stringify(ids);
                    var batchCancel = ApiService.post(url,paramObj);
                    batchCancel.then(function (res) {
                        if(res.success){
                            callback();
                        }else{
                            alert(res.errorMessage);
                        }
                    });
                },

                //重新推送
                updataOrderStatus : function (scope) {
                    var url = '/SalesOrder/Dispatch/UpdateDispatchOrderStatus';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify([]);
                    var orderStatus = ApiService.post(url,paramObj);
                    orderStatus.then(function (res) {
                        if(res.success){
                            callback();
                        }else{
                            alert(res.errorMessage);
                        }
                    });
                },

                //导出
                orderListExport : function (scope) {
                   //等后台将数据转化为excel文件
                },

                /**
                 * 获取配货通知单详情
                 * @param scope
                 * @param id 要获取详情的订单的id
                 * @param callback
                 */
                getOrderDetails : function (scope,id,callback) {
                    var url = '/SalesOrder/Dispatch/GetDetail';
                    var paramObj = configData.getParamObj();
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
                        if(res.success){
                            callback(res.data);
                        }
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
                    var paramObj = configData.getParamObj();
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
                            "Value":"13181071329542144",
                            "Children":[]}
                        ],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var log = ApiService.post(url,paramObj);
                    log.then(function (res) {
                        if(res.success){
                            callback(res.data);
                        }
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
                    var paramObj = configData.getParamObj();
                    paramObj.dispatchOrderId = detailsId;
                    paramObj.dispatchOrderDetailId = orderId;
                    paramObj.reson = reason;
                    var details = ApiService.post(url,paramObj);
                    details.then(function (res) {
                        if(res.success){
                            callback();
                        }else{
                            alert(res.errorMessage);
                        }
                    });
                },

                /**
                 * 获取所有售后申请
                 * @param scope
                 * @param currentPage 当前页数
                 * @param pageSize 每页的数据大小
                 * @param paramObj 向后台发送的配置数据
                 * @param callback 回调函数
                 */
                getAllAfterMarketApplications : function (scope,currentPage,pageSize,paramObj,callback) {
                    var url = '/SalesOrder/ApplyRefundOrder/Query';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":1,
                        "PageSize":50,
                        "SeletedCount":0,
                        "Data":[],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var applications = ApiService.post(url,paramObj);
                    applications.then(function (res) {
                        if(res.success){
                            callback(res);
                        }
                    });
                },

                //添加标记
                afterMarkAddLabel : function (scope,label,ids,callback) {
                    var url = '/SalesOrder/ApplyRefundOrder/AddTag';
                    var paramObj = configData.getParamObj();
                    paramObj['tagname'] = label;
                    paramObj['orderids'] = JSON.stringify(ids);
                    var label = ApiService.post(url,paramObj);
                    label.then(function (res) {
                        callback(res);
                    });
                },


                /**
                 * 获取签收的快递
                 * @param scope
                 * @param callback
                 */
                getExpressInfo : function (scope,callback) {
                    var url = '/SalesOrder/Return/ReturnSign/Query';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify({
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "SeletedCount":0,
                        "Data":[],
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    });
                    var express = ApiService.post(url,paramObj);
                    express.then(function (res) {
                       callback(res);
                    });
                },

                /**
                 * 快递签收中作废快递信息
                 * @param scope
                 * @param flag 要作废快递信息的id号
                 * @param callback
                 */
                obsoleteExpress : function (scope,flag,callback) {
                    var url = '/SalesOrder/Return/ReturnSign/Obsolete';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify(flag);
                    var express = ApiService.post(url,paramObj);
                    express.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 快递信息批量备注
                 * @param scope
                 * @param tagname 要备注的内容
                 * @param ids 要备注的信息的id
                 * @param callback
                 */
                batchAddTagName : function (scope,tagname,ids,callback) {
                    var url = '/SalesOrder/Return/ReturnSign/BatchSaveRemark';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify([{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Id",
                        "Value":ids,
                        "Children":[]
                    },{
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"Remark",
                        "Value":tagname,
                        "Children":[]
                    }]);
                    var tagName = ApiService.post(url,paramObj);
                    tagName.then(function (res) {
                        callback(res);
                    });
                },

                /**
                 * 添加快递签收
                 * @param scope
                 * @param list 新增数据集合
                 * @param callback
                 */
                addExpressSign : function (scope,list,callback) {
                    var data = [];
                    console.log(list);
                    for(var i = 0,j = list.length;i < j;i++){
                        data.push({
                            "ExpressId": list[i]['ExpressId'],
                            "ID": '',
                            "ExpressName": list[i]['ExpressName'],
                            "ExpressNo": list[i]['ExpressNo'],
                            "Qty": 1,
                            "Weight": list[i]['Weight'],
                            "Status": 1,
                            "CreateUserName": configData.user,
                            "CreateDate": new Date().format('yyyy-MM-dd H:m:s'),
                            "IsObsolete": false,
                            "IsConfirm": false,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        });
                    }
                    var url = '/SalesOrder/Return/ReturnSign/BatchSave';
                    var paramObj = configData.getParamObj();
                    paramObj.body = JSON.stringify(data);
                    var expressSign = ApiService.post(url,paramObj);
                    expressSign.then(function (res) {
                        callback(res);
                    });
                },

                //审核退换货单
                auditExchangeOrder : function (scope) {
                    var url = '/SalesOrder/Return/ReturnOrder/Audit';
                    var paramObj = configData.getParamObj();
                }
            };

            /**
             * 订单管理公共方法
             * @type {{setDataShowType: Function}}
             */
            var orderManagerPublicFunction = {
                //设置高级搜索的公共配置
                getCommonConfigData : function(data,scope){
                    var obj = {
                        //是否显示多选
                        moreShow:'true',
                        //是否显示更多
                        selectMore:'true',
                        //是否显示搜索和按字母索引数据
                        letterClassify : 'true',
                        //将选中的条件保存起来到这个对象当中
                        searchConditionsCollect : scope.searchHformData,
                        //高级筛选的配置数据
                        advancedSearchObj : scope.advancedSearchObj,
                        //要展示的已选中的筛选条件的集合
                        searchOrderListCollect : scope.searchConditions
                    };
                    for(var item in data){
                        obj[item] = data[item];
                    }
                    return obj;
                },

                /**
                 * 设置从后台获取的高级搜索条件的字段数据
                 * @param scope
                 * @param data 从后台获取字段的详细数据
                 * @param dataType 字段类型
                 */
                setDataShowType : function (scope,data,dataType) {
                    var characterFirst;
                    var letter = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                    //默认展示的数据
                    dataType.defaultShow = [];
                    //全局展示的数据
                    dataType.globalShow = [];
                    //将首字母开头的数组全部初始化
                    for(var x = 0,y = letter.length;x < y; x++){
                        dataType[letter[x]] = [];
                    }
                    //将所有汉字以首字母大写归类
                    for(var i = 0,j = data.length; i < j;i++){
                        if(i < dataType.listNum){
                            dataType.defaultShow.push(data[i]);
                        }
                        //获取首字母
                        characterFirst = toolsService.getcharacterFirstLetter(data[i].name);
                        (letter.toString().indexOf(characterFirst) != -1)
                            ? dataType[characterFirst].push(data[i])
                            : '' ;
                    }
                    dataType.globalShow = dataType.defaultShow;
                },

                //计算每页的数据索引
                calculateInde : function (scope) {
                    scope.getPageIndex = function (currentPage, itemsPerPage) {
                        if(currentPage === 0 || currentPage== Math.ceil(scope.paginationConf.totalItems / itemsPerPage + 1 )) return;
                        scope.first = itemsPerPage * (currentPage - 1) + 1;
                        if (scope.paginationConf.totalItems / itemsPerPage === itemsPerPage) {
                            scope.last = scope.paginationConf.totalItems;
                        } else {
                            scope.last = currentPage * itemsPerPage;
                        }
                    };
                },

                //高级搜索设置
                advanceSearch : function (scope) {
                    scope.advancedSearchObj1 = {
                        //是否展开高级搜索，默认不展开
                        advancedSearch: false,

                        //已经被选中的筛选条件
                        hasChoseFilter : [],

                        //是否展开制单时间，默认不展开
                        timeShow: false,

                        //制单时间的展开/收起
                        timeText: '展开',

                        //高级搜索更多展开
                        moreShow: false,

                        //高级搜索多选复选框
                        moreSel: false,

                        //高级搜索show函数
                        isShow: function (content, myEvent) {
                            toolsService.isShow(scope, content, myEvent);
                        },

                        //制单时间show函数
                        isTimeShow: function () {
                            toolsService.isTimeShow(scope);
                        },

                        //高级搜索更多显示
                        isMoreShow: function (moreContent, myEvent,callback) {
                            console.log(moreContent);
                            if(callback){
                                callback();
                            }
                            toolsService.isMoreShow(scope, moreContent, myEvent);
                        },

                        //高级搜索多选显示复选框
                        isMoreSelShow: function (moreSelContent,callback) {
                            console.log(moreSelContent);
                            if(callback){
                                callback();
                            }
                            toolsService.isMoreSelShow(scope, moreSelContent);
                        }
                    };
                    scope.advancedSearchObj = $.extend(true, {}, scope.advancedSearchObj1);
                    //复选框默认不勾选
                    scope.labelSel = false;

                    return scope.advancedSearchObj1;
                },

                //分页配置
                pageSet : function (scope,callback) {
                    this.calculateInde(scope);
                    //分页配置
                    scope.paginationConf = {
                        currentPage: 1,   //初始化默认显示第几页
                        totalItems: 0,  //总记录条数
                        itemsPerPage: 10,  //每页显示多少条
                        pagesLength: 5, //分页长度
                        perPageOptions: [20, 50, 100, 500, 1000],  //配置配置可选择每页显示记录数 array
                        extClick: false, //当为外部点击翻页时为true
                        type: 0,  // 上一页0  下一页1
                        getPageIndex: scope.getPageIndex,
                        onChange: function () {	//操作之后的回调
                            callback();
                        }
                    };
                    scope.first = 1;
                    scope.last = scope.paginationConf.itemsPerPage;
                },
                //分页配置扩张通用类
                pageSetExtend : function (tableLayout,callback) {
                    this.calculateInde(tableLayout);
                    //分页配置
                    tableLayout.paginationConf = {
                        currentPage: 1,   //初始化默认显示第几页
                        totalItems: 0,  //总记录条数
                        itemsPerPage: 10,  //每页显示多少条
                        pagesLength: 5, //分页长度
                        perPageOptions: [20, 50, 100, 500, 1000],  //配置配置可选择每页显示记录数 array
                        extClick: false, //当为外部点击翻页时为true
                        type: 0,  // 上一页0  下一页1
                        getPageIndex: tableLayout.getPageIndex,
                        onChange: function () {	//操作之后的回调
                            callback();
                        }
                    };
                    tableLayout.first = 1;
                    tableLayout.last = tableLayout.paginationConf.itemsPerPage;
                },

                //分页中向上翻页
                prevPage : function (scope) {
                    scope.paginationConf.currentPage--;
                    scope.paginationConf.type = 0;
                    scope.paginationConf.extClick = true;
                    scope.getPageIndex(scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                },

                //分页中向下翻页
                nextPage : function (scope) {
                    scope.paginationConf.currentPage++;
                    scope.paginationConf.type = 1;
                    scope.paginationConf.extClick = true;
                    scope.getPageIndex(scope.paginationConf.currentPage, scope.paginationConf.itemsPerPage);
                },

                /**
                 * 根据拼音首字母获取所需信息
                 * @param scope $scope对象
                 * @param letter 要筛选的首字母
                 * @param type 筛选的条件类型
                 */
                selectStoresByFirstLetter : function (scope,letter,type) {
                    var ele ;
                    ele = scope.orderListCollect[type];
                    ele.globalShow = ele[letter];
                    //选中店铺，则设置相应状态
                    if(scope.orderListCollect.letterList.chose != letter){
                        scope.orderListCollect.letterList.chose = letter;
                    }else{
                        scope.orderListCollect.letterList.chose = '';
                        ele.globalShow = ele.data;
                    }
                },

                /**
                 * 获取高级搜索的条件
                 * @param scope $scope对象
                 * @param key 筛选的条件
                 * @param val 筛选条件的名字
                 * @param type 筛选的状态类型
                 * @param name 筛选条件的名字
                 */
                conditionSetting : function(scope,key,val,type,name){
                    var data = {
                        name : name,
                        val : name,
                        type : type
                    };
                    scope.orderListCollect.searchConditions[key] = [data];
                },

                //重置订单的是否合法的状态
                resetCheckLegal : function (obj) {
                    for(var item in obj){
                        obj[item] = false;
                    }
                },

                //检测选中订单的数据是否合法
                checkOrderListValidity : function (scope,obj,label) {
                    this.resetCheckLegal(label);
                    for(var i = 0,j = obj.length;i < j;i++){
                        //是不是已经锁定
                        label['locked'] =  label['locked'] || obj[i].islock;
                        //是不是自己锁定的订单
                        label['isSelfLocked'] = (label['isSelfLocked']) || (obj[i].lockedusername != configData.user);
                        //已全部配货
                        label['isPicked'] = label['isPicked'] || (obj[i].dispatchtypestatus == 2);
                        //是否允许重置状态
                        label['notAllowReset'] = label['notAllowReset'] || (obj[i].status != 10 && obj[i].status != 11 && obj[i].status != 21);
                        //是否允许作废
                        label['notAllowObsolute'] = label['notAllowObsolute']
                                                || (obj[i].status != 0 && obj[i].status != 10 && obj[i].status != 11 && obj[i].status != 21);
                        //是否允许审核
                        label['noteAllowAudit'] = label['noteAllowAudit'] || (obj[i].status != 0 && obj[i].status != 10);
                        //是否允许自动配货
                        label['noteAllowAutoDispatch'] = label['noteAllowAutoDispatch']
                                                        || (obj[i].status != 11 && obj[i].status != 20 && obj[i].status != 21);
                    }
                },
                //锁定订单
                lockOrder : function (scope,obj,type) {
                    if(type['locked']){
                        alert('有锁定的不能批量操作');
                    }else{
                        var ids = this.getOrderId(obj);
                        orderManagerPublicInterface.lockOrder(ids, function (res) {
                            orderManagerPublicInterface.getOrderList(scope, function () {
                                alert('锁定成功');
                            });

                        });
                    }
                },
                //解锁订单
                unlockOrder : function (scope,obj,type) {
                    if(type['isSelfLocked']){
                        alert('不可解锁别人锁定的订单');
                        return false;
                    }
                    var ids = this.getOrderId(obj);
                    orderManagerPublicInterface.unLockOrder(scope,ids, function () {
                        for(var i = 0,j = obj.length;i < j;i++){
                            obj[i]['islock'] = false;
                            obj[i]['lockedusername'] = '';
                        }
                        alert('解锁成功');
                    });

                },
                /**
                 * 添加订单标记
                 * @param scope
                 * @param obj 存储选中的订单列表
                 * @param name 要添加的订单标记名字
                 */
                addLabels : function (scope,obj,name,type) {
                    var ids = this.getOrderId(obj,type);
                    orderManagerPublicInterface.addOrderLabel(scope,name,ids, function () {
                        for(var i= 0,j = obj.length;i < j;i++){
                            obj[i]['tagname'] = name;
                        }
                    });
                },

                /**
                 * 添加推荐快递
                 * @param scope
                 * @param obj 存储选中的订单列表
                 * @param name 推荐快递名称
                 * @param expid 推荐快递Id
                 * @param type 订单批量操作特殊标记
                 */
                addCommendExpress : function (scope,obj,name,expid,type) {
                    if(type['isPicked']){
                        alert('全部配货订单，不可设置快递');
                        return false;
                    }
                    var ids = this.getOrderId(obj);
                    orderManagerPublicInterface.addCommendExpress(scope,name,expid,ids, function () {
                        for(var i= 0,j = obj.length;i < j;i++){
                            obj[i]['suggestexpressname'] = name;
                        }
                    });
                },
                /**
                 * 添加推荐仓库
                 * @param scope
                 * @param obj 存储选中的订单列表
                 * @param name  推荐仓库名称
                 * @param wareid 仓库id
                 * @param type 订单批量操作特殊标记
                 * @returns {boolean}
                 */
                addCommendWareHouse : function (scope,obj,name,wareid,type) {
                    if(type['isPicked']){
                        alert('全部配货订单，不可设置仓库');
                        return false;
                    }
                    var ids = this.getOrderId(obj);
                    orderManagerPublicInterface.addCommendWareHouse(scope,name,wareid,ids, function () {
                        for(var i= 0,j = obj.length;i < j;i++){
                            obj[i]['suggestwarehousename'] = name;
                        }
                    });
                },
                /**
                 * 重置状态
                 * @param scope
                 * @param obj 存储选中的订单列表
                 * @param type 订单批量操作特殊标记
                 */
                resetOrderStatus : function (scope,obj,type) {
                    if(!type['locked']){
                        alert('必须先锁定才可以重置状态');
                        return false;
                    }
                    if(type['isSelfLocked']){
                        alert('不可重置别人锁定的订单');
                        return false;
                    }
                    if(type['notAllowReset']){
                        alert('该状态不允许重置状态');
                        return false;
                    }
                    var ids = this.getOrderId(obj);
                    orderManagerPublicInterface.resetOrderStatus(scope,ids, function () {
                        for(var i= 0,j = obj.length;i < j;i++){
                            obj[i]['status'] = 0;
                        }
                    });
                },
                /**
                 * 作废订单
                 * @param scope
                 * @param obj 存储选中的订单列表
                 * @param type 订单批量操作特殊标记
                 * @returns {boolean}
                 */
                obsoluteOrder : function (scope,obj,type) {
                    if(!type['locked']){
                        alert('必须先锁定才可以作废');
                        return false;
                    }
                    if(type['isSelfLocked']){
                        alert('不可作废别人锁定的订单');
                        return false;
                    }
                    if(type['notAllowObsolute']){
                        alert('该状态不允许作废');
                        return false;
                    }
                    var ids = this.getOrderId(obj);
                    orderManagerPublicInterface.obsoluteOrder(scope,ids, function () {

                        //这里要判断是不是可以查看作废订单的状态，如果是，要添加特殊标识，否则就去掉这条订单信息，不展示出来
                    });
                },

                /**
                 * 审核订单
                 * @param scope
                 * @param obj 存储选中的订单列表
                 * @param type 订单批量操作特殊标记
                 */
                auditOrder : function (scope,obj,type) {
                    if(!type['locked']){
                        alert('必须先锁定才可以作废');
                        return false;
                    }
                    if(type['isSelfLocked']){
                        alert('不可审核别人锁定的订单');
                        return false;
                    }
                    if(type['noteAllowAudit']){
                        alert('该状态不允许审核');
                        return false;
                    }
                    var ids = this.getOrderId(obj);
                    orderManagerPublicInterface.auditOrder(scope,ids, function () {
                       //这里需要重新刷新页面获取订单状态
                    });
                },
                //订单自动配货
                autoDispatch : function (scope,obj,type) {
                     if(!type['locked']){
                         alert('必须先锁定才可以自动配货');
                         return false;
                     }
                    if(type['isSelfLocked']){
                        alert('不可自动配货别人锁定的订单');
                        return false;
                    }
                    if(type['noteAllowAutoDispatch']){
                        alert('改状态不允许自动配货');
                    }
                    var ids = this.getOrderId(obj);
                    orderManagerPublicInterface.autoDispatch(scope,ids, function () {
                        //这里需要重新刷新页面获取订单状态
                    });
                },

                /**
                 * 强制拆单
                 * @param scope
                 * @param obj 存储选中的订单列表
                 * @param type 订单批量操作特殊标记
                 */
                forceSplitOrder : function (scope,obj,type) {
                    var ids = this.getOrderId(obj);
                    orderManagerPublicInterface.forceSplitOrder(scope,ids, function () {
                        for(var i= 0,j = obj.length;i < j;i++){
                            obj[i]['issplitforce'] = true;
                        }
                    });
                },
                //获取选中订单的id
                getOrderId : function(obj,type){
                    var ids = [];
                    if(!type) type =  'orderid';
                    for(var i = 0,j = obj.length;i < j;i++){
                        ids.push(obj[i][type]);
                    }
                    return ids;
                }
            };

            return {
                orderManagerPublicInterface : orderManagerPublicInterface,
                orderManagerPublicFunction : orderManagerPublicFunction
            }

        }
    ]);