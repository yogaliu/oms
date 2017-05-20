/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("activityApplyService", ["ApiService", "APP_MENU", "toolsService", function (ApiService, APP_MENU, toolsService) {

        /**
         * 查询活动报名列表
         * @__scope__s
         * @constructor
         */
        var ActivityRegisterGet = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/ActivityRegister/ActivityRegister/Get";

            var data = [];

            //搜索条件
            if (__scope__.searchForm.activity !== '') {
                var obj = {
                    //活动编码
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": __scope__.searchForm.activity,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.merchandise !== '') {
                var obj = {
                    //商品编码
                    "OperateType": 8,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "SkuCode",
                    "Name": "SkuCode",
                    "Value": __scope__.searchForm.merchandise,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.storeId !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StoreId",
                    "Name": "StoreId",
                    "Value": __scope__.searchForm.storeId,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.time1Start !== '') {
                var obj = {
                    "OperateType": 3,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "BeginDate",
                    "Name": "BeginDate",
                    "Value": __scope__.searchForm.time1Start,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchForm.time1End !== '') {
                var obj = {
                    "OperateType": 5,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EndDate",
                    "Name": "EndDate",
                    "Value": __scope__.searchForm.time1End,
                    "Children": []
                };
                data.push(obj);
            }


            if (__scope__.simpleSelect.isForbid !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "isdisabled",
                    "Name": "isdisabled",
                    "Value": __scope__.simpleSelect.isForbid,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.simpleSelect.isLoad !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "islockedquantity",
                    "Name": "islockedquantity",
                    "Value": __scope__.simpleSelect.isLoad,
                    "Children": []
                };
                data.push(obj);
            }

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
                "Timespan": "00:00:00.221",
                "SeletedCount": SeletedCount,
                "Data": data,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });
            var promise = ApiService.postLoad(url, paramObj);
            promise.then(function (res) {

                //列表数据
                __scope__.tableList = res.data;

                $.each(__scope__.tableList, function (i, obj) {
                    //报名状态 根据id匹配name
                    if (obj.registrationstatus !== undefined) {
                        obj.registrationstatusName = APP_MENU.marketingActivityStatus[obj.registrationstatus];
                    }
                });

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

            paramObj['body'] = JSON.stringify([{
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
                    if (res.success) {
                        //下拉选框插件 店铺
                        __scope__.selectStore.info = res.data;
                        __scope__.selectStore.objName = {id: __scope__.searchForm.storeId};
                    }
                }, function (res) {

                }
            )
            ;
        };

        /**
         * 审核
         * @param __scope__
         * @constructor
         */
        var ActivityRegisterApproval = function (__scope__, id) {
            var url = "/ActivityRegister/ActivityRegister/Approval";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(id);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("审核通过");
                    ActivityRegisterGet(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                }
                else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 禁用
         * @param __scope__
         * @constructor
         */
        var ActivityRegisterDisabled = function (__scope__, id) {
            var url = "/ActivityRegister/ActivityRegister/Disabled";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(id);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("禁用成功");
                    ActivityRegisterGet(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                }
                else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 开始活动
         * @param __scope__
         * @constructor
         */
        var ActivityRegisterDetailStart = function (__scope__, id) {
            var url = "/ActivityRegister/ActivityRegister/DetailStart";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Id": "dede7875-53c7-4d2f-a143-53f0146ad854",
                "CreateDate": "2017-05-05 11:21:48",
                "Code": "AR1705054090800",
                "BeginDate": "2017-04-25 00:00:00",
                "EndDate": "2017-05-10 00:00:00",
                "Subject": "a1",
                "Remark": "a1q1",
                "Content": "a1",
                "RegistrationStatus": 1,
                "RegistrationUser": "jinxin",
                "ApprovalUser": "jinxin",
                "ApprovalDate": "2017-05-05 14:06:04",
                "ActivityTypeId": "a56f4919-9bb4-45e7-ba38-ea79194da1d0",
                "ActivityTypeName": "聚划算",
                "Exports": 0.00,
                "StoreId": "8c349d2a-eff9-4015-8c35-e1fbeec72bb3",
                "StoreName": "AA淘宝C店-MQ专用",
                "IsDisabled": false,
                "WarehouseOutId": "39747db7-86de-4368-b121-87f0afcb7a0e",
                "WarehouseOutName": "天猫活动仓",
                "WarehouseInId": "82fa484b-d4b7-4b22-b6e4-ac9b6ad07a1f",
                "WarehouseInName": "京东活动仓",
                "IsLockedQuantity": true,
                "SalesQty": 0,
                "Details": [
                    {
                        "Id": "3da73e36-242b-4968-8be6-fee808f1784c",
                        "CreateDate": "2017-05-05 11:21:48",
                        "ActivityId": "dede7875-53c7-4d2f-a143-53f0146ad854",
                        "ProductId": "af7d992b-5f13-4442-b1ee-14c5a601b50f",
                        "ProductCode": "M3C213194",
                        "ProductName": "M3C213194",
                        "SkuId": "fffeb8f3-a109-4adf-81f9-6d1b2343c4f5",
                        "SkuCode": "M3C213194-E16106",
                        "SkuName": "褐红色-E16 15码-106",
                        "Quantity": 1,
                        "LockedQuantity": 1,
                        "Price": 0.0,
                        "Amount": 0.0,
                        "IsProcessing": 0,
                        "SalesQty": 0,
                        "UpdateStatus": false,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    }, {
                        "Id": "b74dec02-d97f-4f09-9e37-3ebc67f4e732",
                        "CreateDate": "2017-05-05 11:21:48",
                        "ActivityId": "dede7875-53c7-4d2f-a143-53f0146ad854",
                        "ProductId": "c447713d-b450-46c8-a32a-6163af32f873",
                        "ProductCode": "E6C11D2026",
                        "ProductName": "ES2026",
                        "SkuId": "fffe6586-ce87-4e1f-b6ad-d3a3c642fd5a",
                        "SkuCode": "E6C11D2026-I01208",
                        "SkuName": "白色-I01 XXXXXL-208",
                        "Quantity": 1,
                        "LockedQuantity": 1,
                        "Price": 0.0,
                        "Amount": 0.0,
                        "IsProcessing": 0,
                        "SalesQty": 0,
                        "UpdateStatus": false,
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    }],
                "DeleteDetails": [],
                "Messages": [],
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            });
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("开始活动");
                    ActivityRegisterGet(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                }
                else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        /**
         * 结束活动
         * @param __scope__
         * @constructor
         */
        var ActivityRegisterDetailEnd = function (__scope__, id) {
            var url = "/ActivityRegister/ActivityRegister/DetailStart";
            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify(id);
            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess("结束活动");
                    ActivityRegisterGet(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                }
            }, function (res) {

            });
        };


        // public api
        return {
            "ActivityRegisterGet": ActivityRegisterGet,
            "StoreGet": StoreGet,
            "ActivityRegisterApproval": ActivityRegisterApproval,
            "ActivityRegisterDisabled": ActivityRegisterDisabled,
            "ActivityRegisterDetailStart": ActivityRegisterDetailStart,
        };

    }])
;