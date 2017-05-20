/**
 * Created by cj on 2017/4/6.
 */
angular.module("klwkOmsApp")
    .factory('addSupplierInformationService', ["ApiService","toolsService", function (ApiService,toolsService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();

        /**
         * 保存供应商信息
         * @constructor
         */
        var save = function (scope,data) {
            var url = "/Purchase/Supplier/Save";
            var param = $.extend({
                body:JSON.stringify({
                    "Code": data.code,
                    "SupplierId": data.supplierid?data.supplierid:"00000000-0000-0000-0000-000000000000",
                    "CreateDate": data.createdate?data.createdate:"0001-01-01 00:00:00",
                    "ShortName": data.shortname,
                    "FullName": data.fullname,
                    "Telephone": data.telephone,
                    "Mobile": data.mobile,
                    "Contact": data.contact,
                    "Email": data.email,
                    "WebSite": data.webSite,
                    "FaxNumber": data.faxNumber,
                    "Address": data.address,
                    "Status": data.status,
                    "Remarks": data.remarks,
                    "SupplierSettlementType": data.settlementtype,
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.postLoad(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.goBack();
                    toolsService.alertSuccess({"msg": "保存成功！", time: 2000});
                } else {
                    toolsService.alertMsg({content : res.errorMessage,time : 1000});
                }
            });
        };

        return {
            "save": save
        };

    }]);