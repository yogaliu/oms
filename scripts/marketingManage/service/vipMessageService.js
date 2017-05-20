/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("vipMessageService", ["ApiService", "APP_MENU", "toolsService", function (ApiService, APP_MENU, toolsService) {


        /**
         * 查询vip信息
         * @__scope__
         * @constructor
         */
        var CustomerGet = function (__scope__, PageIndex, PageSize, SeletedCount, isInit) {
            var url = "/Customer/Customer/Get";
            var data = [];
            //搜索条件
            if (__scope__.searchObj.vipName !== '') {
                var obj = {
                    "OperateType": 10,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Name",
                    "Name": "Name",
                    "Value": __scope__.searchObj.vipName,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchObj.vipCode !== '') {
                var obj = {
                    "OperateType": 10,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Code",
                    "Name": "Code",
                    "Value": __scope__.searchObj.vipCode,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchObj.consignee !== '') {
                var obj = {
                    "OperateType": 10,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Consignee",
                    "Name": "Consignee",
                    "Value": __scope__.searchObj.consignee,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchObj.storeId !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "StoreId",
                    "Name": "StoreId",
                    "Value": __scope__.searchObj.storeId,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.searchObj.tagName !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "TagName",
                    "Name": "TagName",
                    "Value": __scope__.searchObj.tagName,
                    "Children": []
                };
                data.push(obj);
            }
            if (__scope__.simpleSelect.isUrgent !== '') {
                var obj = {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "speeddelivery",
                    "Name": "speeddelivery",
                    "Value": __scope__.simpleSelect.isUrgent,
                    "Children": []
                };
                data.push(obj);
            }

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "PageIndex": PageIndex,
                "PageSize": PageSize,
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
                    //状态 根据id匹配name
                    if (obj.status !== undefined) {
                        obj.statusName = APP_MENU.marketingUserStatus[obj.status];
                    }
                    //性别 根据id匹配name
                    if (obj.sex !== undefined) {
                        obj.sexName = APP_MENU.marketingSex[obj.sex];
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
                //下拉选框插件 店铺
                __scope__.selectStore.info = res.data;

            }, function (res) {

            });
        };

        /**
         * 查询会员标记
         * @param __scope__
         * @constructor
         */
        var GeneralClassiFicationGet = function (__scope__) {
            var url = "/BasicInformation/GeneralClassiFication/Get";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify([{
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "IsDisabled",
                "Name": "IsDisabled",
                "Value": false,
                "Children": []
            }, {
                "OperateType": 0,
                "LogicOperateType": 0,
                "AllowEmpty": false,
                "Field": "ClassiFicationType",
                "Name": "ClassiFicationType",
                "Value": 9,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                //下拉选框插件 会员标记
                __scope__.selectTag.info = res.data;

                __scope__.signObj = res.data;
            }, function (res) {

            });
        };

        /**
         * 标记
         * @param __scope__
         * @constructor
         */
        var CustomerAddTag = function (__scope__, orderids, tagname) {
            var url = "/Customer/Customer/AddTag";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['orderids'] = JSON.stringify([orderids]);
            paramObj['tagname'] = tagname;

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    toolsService.alertSuccess('标记成功');
                    CustomerGet(__scope__, 1, __scope__.paginationConf.itemsPerPage, 0, false);
                } else {
                    toolsService.alertError(res.errorMessage);
                }
            }, function (res) {

            });
        };

        // public api
        return {
            "CustomerGet": CustomerGet,
            "StoreGet": StoreGet,
            "CustomerAddTag": CustomerAddTag,
            "GeneralClassiFicationGet": GeneralClassiFicationGet
        };
    }]);