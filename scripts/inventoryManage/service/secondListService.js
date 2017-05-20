/**
 * Created by lc on 2017/4/24.
 * 功能：库存上传页面请求
 */
/**
 * 定义lendListService服务
 * 功能：借出单页面请求
 * */
angular.module("klwkOmsApp")
    .factory('secondListService', ["ApiService","APP_COLORS","WAP_CONFIG","APP_MENU","APP_DATA","toolsService",function(ApiService,APP_COLORS,WAP_CONFIG,APP_MENU,APP_DATA,toolsService){
        var configParam = {
            getParamObj: function () {
                return {
                    UserId : APP_COLORS.UserId,
                    UserName : APP_COLORS.username,
                    TimeStamp : ApiService.getMd5code().timestamp,
                    sign : ApiService.getMd5code().code,
                    Version : WAP_CONFIG.version,
                    LoginKey : APP_COLORS.LoginKey
                };
            }
        };

        /**
         * 借调统计列表数据
         */
        var queryLoanAnalysis = function (scope){
            var url = "/Inventory/LoanOut/QueryLoanAnalysis";
            var paramObj = configParam.getParamObj();
            var data = [];
            if(scope.OperateType == 4 || (scope.revert == true || scope.revert == false)){
                data = [{
                    "OperateType": scope.OperateType,  //是否超期  超期 4  其他0 （存在查询所有和未超级结果相同的情况）
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsNeedReturn",
                    "Name": "IsNeedReturn",
                    "Value": scope.revert,   //是否归还  归还 true  未归还 false  所有 当前时间
                    "Children": []
                }]
            };
            if(scope.formData.productCode){
                data.push(
                    {                         //商品编码条件搜索
                        "OperateType":6,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"sku.ProductCode",
                        "Name":"ProductCode",
                        "Value":scope.formData.productCode,
                        "Children":[]
                    }
                )
            };
            if(scope.formData.skuCode){
                data.push(
                    {                         //规格编码条件搜索
                        "OperateType":6,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"sku.Code",
                        "Name":"SkuCode",
                        "Value":scope.formData.skuCode,
                        "Children":[]
                    }
                )
            };
            if(scope.formData.loanUser){
                data.push(
                    {                         //借调人条件搜索
                        "OperateType":0,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"LoanUser",
                        "Name":"LoanUser",
                        "Value":scope.formData.loanUser,
                        "Children":[]
                    }
                )
            };

            if(scope.formData.loanUser){
                data.push(
                    {                         //开始时间条件搜索
                        "OperateType":3,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"l.CreateDate",
                        "Name":"BeginCreateDate",
                        "Value":scope.formData.beginCreateDate,
                        "Children":[]
                    }
                )
            };
            if(scope.formData.beginCreateDate){
                data.push(
                    {                         //开始时间条件搜索
                        "OperateType":3,
                        "LogicOperateType":0,
                        "AllowEmpty":false,
                        "Field":"l.CreateDate",
                        "Name":"BeginCreateDate",
                        "Value":scope.formData.beginCreateDate,
                        "Children":[]
                    }
                )
            };
            var param = $.extend({
                body: JSON.stringify(
                    {
                        "PageIndex":scope.paginationConf.currentPage,
                        "PageSize":scope.paginationConf.itemsPerPage,
                        "Timespan":"00:00:00.236",
                        "SeletedCount":0,
                        "Data":data,
                        "Deleted":false,
                        "IsNew":false,
                        "IsUpdate":false
                    }
                )
            }, paramObj);
            var promise = ApiService.postLoad(url,param);
            promise.then(function(res){
                if(res.success){
                    scope.loanList = res.data;
                    scope.paginationConf.totalItems = res.total;
                };
            });
        };




        return {
            "queryLoanAnalysis" : queryLoanAnalysis,
        };

    }]);

