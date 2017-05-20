/**
 * Created by jx on 2017/3/31.
 */

angular.module("klwkOmsApp")
    .factory("checkRecordService", ["ApiService","toolsService", function (ApiService,toolsService) {


        /**
         * 查询账单记录
         * @__scope__
         * @constructor
         */
        var AlipayRecordQuery = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/Finance/AlipayRecord/Query";
            var data=[];

            //搜索条件
            if(__scope__.searchForm.alipayOrderNo !== ''){
                var obj = {
                    //账单单号
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "AlipayOrderNo",
                    "Name": "AlipayOrderNo",
                    "Value": __scope__.searchForm.alipayOrderNo,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.typeDesc !== ''){
                var obj = {
                    //财务类型
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "TypeDesc",
                    "Name": "TypeDesc",
                    "Value": __scope__.searchForm.typeDesc,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.orderNo !== ''){
                var obj = {
                    //平台订单号
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "OrderNo",
                    "Name": "OrderNo",
                    "Value": __scope__.searchForm.orderNo,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.storeId !== ''){
                var obj = {
                    //店铺id
                    "OperateType": 6,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StoreId",
                    "Name": "StoreId",
                    "Value": __scope__.searchForm.storeId,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.beginCreateDate !== ''){
                var obj = {
                    ///创建时间
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "CreateDate",
                    "Name": "BeginCreateDate",
                    "Value": __scope__.searchForm.beginCreateDate,
                    "Children": []
                };
                data.push(obj);
            }
            if(__scope__.searchForm.endCreateDate !== ''){
                var obj = {
                    //结束时间
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "CreateDate",
                    "Name": "EndCreateDate",
                    "Value": __scope__.searchForm.endCreateDate,
                    "Children": []
                };
                data.push(obj);
            }
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] =JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
                "SeletedCount": SeletedCount,
                "Data": data,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {

                //列表数据
                __scope__.tableList = res.data;
                //总条数
                __scope__.paginationConf.totalItems = res.total;
            }, function (res) {
                console.log("我是错误的方法");
            });
        };


        /**
         * 查询店铺
         * @param __scope__
         * @constructor
         */
        var StoreGet = function (__scope__) {
            var url = "/BasicInformation/Store/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] =JSON.stringify( [{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "IsDisabled",
                "Name": "IsDisabled",
                "Value": false,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {

                if(res.success){
                    __scope__.storeList = res.data;

                    __scope__.selectStore.info = res.data;

                }
            }, function (res) {

            });
        };


        /**
         * 下载
         * @param __scope__
         * @constructor
         */
        var AlipayRecordDownload = function (__scope__) {
            var url = "/Finance/AlipayRecord/Download";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['startTime'] =__scope__.loadForm.startData;
            paramObj['endTime'] =__scope__.loadForm.endData;
            paramObj['storeId'] = __scope__.loadForm.storeId;
            paramObj['step'] =__scope__.loadForm.step;


            var promise = ApiService.post(url, paramObj);
            promise.then(function (res) {
                if(res.success){
                    toolsService.alertSuccess("后台已开始下载");
                }
            }, function (res) {

            });
        };


        // public api
        return {
            "AlipayRecordQuery": AlipayRecordQuery,
            "AlipayRecordDownload": AlipayRecordDownload,
            "StoreGet": StoreGet
        };

    }]);