/**
 * Created by jx on 2017/4/5.
 */

angular.module("klwkOmsApp")
    .factory("addVipMessageService", ["ApiService", function (ApiService) {

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
                    __scope__.selectStore.setValue({id: __scope__.vipObj.storeid});
                }

            }, function (res) {

            });
        };

        /**
         * 查询会员等级
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
                "Value": 24,
                "Children": []
            }]);


            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    //下拉选框插件 会员等级
                    __scope__.selectLevel.info = res.data;
                    __scope__.selectLevel.setValue({id: __scope__.vipObj.levelid});
                }

            }, function (res) {

            });
        };


        /**
         * 查询地区/国家
         * @param __scope__
         * @constructor
         */
        var RegionQuery = function (__scope__, type ,parentId) {
            var url = "/BasicInformation/Region/Query";

            var paramObj = ApiService.getBasicParamobj();

            switch (type) {
                case 'National':
                    paramObj['body'] = JSON.stringify([{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "RegionLevel",
                        "Value": 1,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ParentId",
                        "Value": "00000000-0000-0000-0000-000000000000",
                        "Children": []
                    }]);
                    break;
                case 'Province':
                    paramObj['body'] = JSON.stringify([{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "RegionLevel",
                        "Value": 2,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ParentId",
                        "Value":parentId,
                        "Children": []
                    }]);
                    break;
                case 'City':
                    paramObj['body'] = JSON.stringify([{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "RegionLevel",
                        "Value": 3,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ParentId",
                        "Value": parentId,
                        "Children": []
                    }]);
                    break;
                case 'County':
                    paramObj['body'] = JSON.stringify([{
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "RegionLevel",
                        "Value": 4,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ParentId",
                        "Value": parentId,
                        "Children": []
                    }]);
                    break;
            }

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    switch (type) {
                        case 'National':
                            //下拉选框插件 国家
                            __scope__.selectNational.info = res.data;
                            __scope__.selectNational.setValue({id: __scope__.vipObj.nationalid});
                            break;
                        case 'Province':
                            //下拉选框插件 省
                            __scope__.selectProvince.info = res.data;
                            __scope__.selectProvince.setValue({id: __scope__.vipObj.provinceid});
                            break;
                        case 'City':
                            //下拉选框插件 市
                            __scope__.selectCity.info = res.data;
                            __scope__.selectCity.setValue({id: __scope__.vipObj.cityid});
                            break;
                        case 'County':
                            //下拉选框插件 区
                            __scope__.selectCounty.info = res.data;
                            __scope__.selectCounty.setValue({id: __scope__.vipObj.countyid});
                            break;
                    }
                }

            }, function (res) {

            });
        };

        /**
         * 保存
         * @param __scope__
         * @constructor
         */
        var CustomerSave = function (__scope__) {
            var url = "/Customer/Customer/Save";

            var paramObj = ApiService.getBasicParamobj();

            paramObj['body'] = JSON.stringify({
                "Code": __scope__.vipObj.code,
                "CustomerId": __scope__.vipObj.customerid,
                "CreateDate": __scope__.vipObj.createdate,
                "Name": __scope__.vipObj.name,
                //1:女
                "Sex": __scope__.vipObj.sex,
                //加急发货
                "SpeedDelivery": __scope__.vipObj.speeddelivery,
                "LevelId": __scope__.vipObj.levelid,
                "LevelName": __scope__.vipObj.levelname,
                "Price": __scope__.vipObj.price,
                //黑名单1
                "Status": __scope__.vipObj.status,
                "StoreId": __scope__.vipObj.storeid,
                "StoreName": __scope__.vipObj.storename,
                "BuyTimes": __scope__.vipObj.buytimes,
                "NationalId": __scope__.vipObj.nationalid,
                "NationalName": __scope__.vipObj.nationalname,
                "ProvinceId": __scope__.vipObj.provinceid,
                "ProvinceName": __scope__.vipObj.provincename,
                "CityId": __scope__.vipObj.cityid,
                "CityName": __scope__.vipObj.cityname,
                "CountyId": __scope__.vipObj.countyid,
                "CountyName": __scope__.vipObj.countyname,
                //收货人
                "Consignee": __scope__.vipObj.consignee,
                "Mobile": __scope__.vipObj.mobile,
                "Telephone": __scope__.vipObj.telephone,
                "EMail": __scope__.vipObj.email,
                "Address": __scope__.vipObj.address,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false

            });

            var promise = ApiService.post(url, paramObj);

            promise.then(function (res) {
                if (res.success) {
                    __scope__.returnFun();
                } else {

                }
            }, function (res) {

            });
        };


        // public api
        return {
            "StoreGet": StoreGet,
            "CustomerSave": CustomerSave,
            "RegionQuery": RegionQuery,
            "GeneralClassiFicationGet": GeneralClassiFicationGet
        };

    }
    ])
;