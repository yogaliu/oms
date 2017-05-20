/**
 * Created by cj on 2017/4/5.
 */
angular.module("klwkOmsApp")
    .factory('addProductService', ["ApiService","APP_MENU", function (ApiService,APP_MENU) {
        //获取身份验证
         var paramObj = ApiService.getBasicParamobj();

        /**
         * 供应商
         * @constructor
         */
        var getSupplier = function (scope) {
            var url = "/Purchase/Supplier/Get ";
            var param = $.extend({
                body:JSON.stringify([])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    // 将数据转换成id,name形式
                    $.each(res.data, function (index,obj) {
                        obj.id = obj.supplierid;
                        obj.name = obj.shortname;
                    });
                    scope.selectSupplier.info = res.data;
                    if(scope.formData.type == 'edit') {
                        scope.selectSupplier.setValue({id:scope.formData.supplierid});
                    } else if(scope.formData.type == 'new') {
                        scope.selectSupplier.init();
                    }
                }

            });
        };

        /**
         * 通用分类
         * @constructor
         */
        var generalClassify = function (scope,value) {
            var url = "/BasicInformation/GeneralClassiFication/Get ";
            var param = $.extend({
                body:JSON.stringify([{
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
                    "Value": value,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    switch (value) {
                        case 2:
                            // 商品品牌
                            scope.selectBrand.info = res.data;
                            if(scope.formData.type == 'edit') {
                                if(scope.formData.brand) {
                                    scope.selectBrand.setValue({id:scope.getId(scope.formData.brand,res.data)});
                                }
                            } else if(scope.formData.type == 'new') {
                                scope.selectBrand.init();
                            }
                            break;
                        case 3:
                            // 生产类型
                            scope.selectType.info = res.data;
                            if(scope.formData.type == 'edit') {
                                if(scope.formData.productionmode) {
                                    scope.selectType.setValue({id:scope.getId(scope.formData.productionmode,res.data)});
                                }
                            } else if(scope.formData.type == 'new') {
                                scope.selectType.init();
                            }
                            break;
                        case 4:
                            // 主题
                            scope.selectTheme.info = res.data;
                            if(scope.formData.type == 'edit') {
                                if(scope.formData.theme) {
                                    scope.selectTheme.setValue({id:scope.getId(scope.formData.theme,res.data)});
                                }
                            } else if(scope.formData.type == 'new') {
                                scope.selectTheme.init();
                            }
                            break;
                        case 5:
                            // 年份
                            scope.selectYear.info = res.data;
                            if(scope.formData.type == 'edit') {
                                if(scope.formData.year) {
                                    scope.selectYear.setValue({id:scope.getId(scope.formData.year,scope.selectYear.info)});
                                }
                            } else if(scope.formData.type == 'new') {
                                scope.selectYear.init();
                            }
                            break;
                        case 6:
                            // 商品季节
                            scope.selectSeason.info = res.data;
                            if(scope.formData.type == 'edit') {
                                if(scope.formData.season) {
                                    scope.selectSeason.setValue({id:scope.getId(scope.formData.season,scope.selectSeason.info)});
                                }
                            } else if(scope.formData.type == 'new') {
                                scope.selectSeason.init();
                            }
                            break;
                        case 7:
                            // 基本单位
                            scope.selectUnit.info = res.data;
                            if(scope.formData.type == 'edit') {
                                if(scope.formData.unit) {
                                    scope.selectUnit.setValue({id:scope.getId(scope.formData.unit,scope.selectUnit.info)});
                                }
                            } else if(scope.formData.type ==  'new') {
                                scope.selectUnit.init();
                            }
                    }
                }
            });
        };

        /**
         * 商品分类
         * @constructor
         */
        var classify = function (scope) {
            var url = "/Product/ProductCategory/Get";
            var promise = ApiService.post(url,$.extend({},paramObj));
            promise.then(function (res) {
                // 将离散数据转成树形结构数据
                scope.classifyList = new originArrayToTreeData(res.data);
            });
        };

        /**
         * 公司
         * @constructor
         */
        var getCompany = function (scope) {
            var url = "/BasicInformation/Company/Get ";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    // 公司信息
                    scope.selectCompany.info = res.data;
                    if(scope.formData.type == 'edit') {
                        if(scope.formData.companyid) {
                            scope.selectCompany.setValue({id:scope.formData.companyid});
                        }
                    } else if(scope.formData.type == 'new') {
                        scope.selectCompany.init();
                    }
                }

            });
        };


        /**
         * 规格信息
         * @constructor
         */
        var skuQuery = function (scope) {
            var url = "/Product/ProductSku/QueryProductSku";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "pro.Productid",
                    "Name": "proid",
                    "Value": scope.formData.productid,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.tableListSkus = [];
                    $.each(res.data, function (index,obj) {
                        // 商品状态根据id匹配name
                        if (obj.status !== undefined) {
                            obj.statusname = APP_MENU.groupStatus[obj.status];
                            obj.skuid = '';
                        }
                    });
                    // 后台所需
                    if(res.data.length != 0) {
                        $.each(res.data, function (index,obj) {
                            scope.tableListSkus.push($.extend({
                                "Deleted": false,
                                "IsNew": false,
                                "IsUpdate": false
                            },obj));
                        });
                    }
                    // 根据是否有商品明细判断按钮位置
                    if (res.data.length <= 0) {
                        scope.standardInfo = 'start';
                    } else {
                        scope.standardInfo = '';
                    }
                }

            });
        };

        /**
         * 变价信息
         * @constructor
         */
        var changeQuery = function (scope) {
            var url = "/Product/ProductPriceChange/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "ProductId",
                    "Name": "proid",
                    "Value": scope.formData.productid,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    // 列表数据
                    scope.tableListChange = res.data;
                }
            });
        };

        /**
         * 操作日志
         * @constructor
         */
        var operateLog = function (scope) {
            var url = "/Product/ProductLog/Get ";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "Productid",
                    "Name": "proid",
                    "Value": scope.formData.productid,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.tableListLog = [];
                    // 后台必需
                    if(res.data.length != 0) {
                        $.each(res.data, function (index,obj) {
                            scope.tableListLog.push($.extend({
                                "Deleted": false,
                                "IsNew": false,
                                "IsUpdate": false
                            },obj));
                        });
                    }
                }
            });
        };

        /**
         * 商品编码规则
         * @constructor
         */
        var getRule = function (scope) {
            var url = "/Product/ProductEncodeRule/Get";
            var param = $.extend({
                body:JSON.stringify([{
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
                    "Field": "IsShow",
                    "Name": "IsShow",
                    "Value": true,
                    "Children": []
                }, {
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsProduct",
                    "Name": "IsProduct",
                    "Value": false,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.ruleList = res.data;
                    $.each(scope.ruleList,function (index,obj) {
                        // 商品规则默认未勾选
                        obj.isSelect = false;
                    });
                }
            });
        };

        /**
         * 商品编码规则属性值
         * @constructor
         */
        var getRuleValue = function (scope,index,id) {
            var url = "/Product/ProductEncodeRuleDetail/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "EncodeRuleId",
                    "Name": "EncodeRuleId",
                    "Value": id,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    $.each(res.data, function (index,obj) {
                        // 默认未勾选
                        obj.isdatacheck = false;
                    });
                    scope.valueList.push({
                        'isalldatacheck':false,
                        'data':res.data
                    });
                }
            });
        };

        /**
         * 商品自定义属性分类
         * @constructor
         */
        var getAttribute = function (scope) {
            var url = "/BasicInformation/GeneralClassiFication/Get";
            var param = $.extend({
                body:JSON.stringify([{
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
                    "Value": 14,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    scope.attributeData = [];
                    for (var j = 1; j <= 20; j++) {
                        var temp = {
                            name: '属性' + j,
                            value: '',
                            id: '',
                            worth: scope.formData['attribute' + j],
                            children: ''
                        };
                        scope.attributeData.push(temp);
                    }
                    var length = res.data.length;
                    for (var i = 0; i < length; i++) {
                        scope.attributeData[res.data[i]['value'] - 1] = {
                            name: res.data[i]['name'],
                            value: res.data[i]['value'],
                            id: res.data[i]['id'],
                            worth: scope.formData['attribute' + (i+1)],
                            children: ''
                        };
                    }
                    getAttributeValue(scope);
                }
            });
        };


        /**
         * 商品自定义属性值
         * @constructor
         */
        var getAttributeValue = function (scope) {
            var url = "/Product/ProductAttribute/Get";
            var param = $.extend({
                body:JSON.stringify([{
                    "OperateType": 0,
                    "LogicOperateType": 0,
                    "AllowEmpty": false,
                    "Field": "IsDisabled",
                    "Name": "IsDisabled",
                    "Value": false,
                    "Children": []
                }])
            },paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function (res) {
                if (res.success) {
                    for (var k = 0; k < scope.attributeData.length; k++) {
                        var children = [];// 存储属性值
                        for (var z = 0; z < res.data.length; z++) {
                            if (scope.attributeData[k].id == res.data[z].classificationid) {
                                // 属性分类第几个
                                res.data[z] = $.extend({
                                    'parentvalue':scope.attributeData[k].value
                                },res.data[z]);
                                children.push(res.data[z]);
                            }
                        }
                        scope.attributeData[k].children = children;
                    }
                    scope.storageDefineData = $.extend(true,[],scope.attributeData);
                }
            });
        };

        /**
         * 保存商品信息
         * @constructor
         */
        var save = function (scope,data) {
            $.each(scope.tableListSkus, function (index,obj) {
                // 后台解析错误,保存前必须将其删除
                if(obj.brand) {
                    delete obj.brand
                }
            });
            var url = "/Product/Product/Save";
            var param = $.extend({
                body:JSON.stringify({
                    "ProductId": data.productid ? data.productid : "00000000-0000-0000-0000-000000000000",
                    "Code": data.code,
                    "Description": data.description,
                    "ShortName": data.shortname,
                    "Brand": data.brand,
                    "Year": data.year,
                    "Season": data.season,
                    "Unit": data.unit,
                    "Theme": data.theme,
                    "CategoryId": data.categoryid,
                    "CategoryName": data.categoryname,
                    "CompanyId": data.companyid,
                    "CompanyName": data.companyname,
                    "ProductionMode": data.productionmode,
                    'Note': data.note,
                    "FirstPrice": data.firstprice?data.firstprice:0,
                    "RetailPrice": data.retailprice?data.retailprice:0,
                    "FirstCost": data.firstcost?data.firstcost:0,
                    "PurchasePrice": data.purchaseprice?data.purchaseprice:0,
                    "WholeSalePrice": data.wholesaleprice?data.wholesaleprice:0,
                    "PlatformPrice": data.platformprice?data.platformprice:0,
                    "Attribute1":scope.attributeData[0].worth,
                    "Attribute2":scope.attributeData[1].worth,
                    "Attribute3":scope.attributeData[2].worth,
                    "Attribute4":scope.attributeData[3].worth,
                    "Attribute5":scope.attributeData[4].worth,
                    "Attribute6":scope.attributeData[5].worth,
                    "Attribute7":scope.attributeData[6].worth,
                    "Attribute8":scope.attributeData[7].worth,
                    "Attribute9":scope.attributeData[8].worth,
                    "Attribute10":scope.attributeData[9].worth,
                    "Attribute11":scope.attributeData[10].worth,
                    "Attribute12":scope.attributeData[11].worth,
                    "Attribute13":scope.attributeData[12].worth,
                    "Attribute14":scope.attributeData[13].worth,
                    "Attribute15":scope.attributeData[14].worth,
                    "Attribute16":scope.attributeData[15].worth,
                    "Attribute17":scope.attributeData[16].worth,
                    "Attribute18":scope.attributeData[17].worth,
                    "Attribute19":scope.attributeData[18].worth,
                    "Attribute20":scope.attributeData[19].worth,
                    "OrderPrice": data.orderprice?data.orderprice:0,
                    "TakePrice": data.takeprice?data.takeprice:0,
                    "Weight": data.weight?data.weight:0,
                    "Length":0.0,
                    "Breadth":0.0,
                    "Height": 0.0,
                    "Volume": data.volume?data.volume:0,
                    "GbCode": data.gbcode,
                    "ProductType": data.producttype,
                    "FactoryCode": data.factorycode,
                    "CreateUserName":data.createusername,
                    "SupplierId": data.supplierid,
                    "SupplierName": data.suppliername,
                    "BrandCode": data.brandcode,
                    "CartonSpec": data.cartonspec?data.cartonspec:0,
                    "SpareParts": data.spareparts?true:false,
                    "CreateDate": data.createdate?data.createdate:"0001-01-01 00:00:00",
                    "ReturnPeriod": data.returnperiod,
                    "NewOnlineDate":data.newonlinedate,
                    "OfflineDate": data.offlinedate,
                    "SafetyStockDays": data.safetystockdays,
                    "CeilingDay": data.ceilingday,
                    "LowerDay": data.lowerday,
                    "Skus": scope.tableListSkus?scope.tableListSkus:[],
                    "Logs":scope.tableListLog?scope.tableListLog:[],
                    "PriceChanges":scope.tableListChange?scope.tableListChange:[],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            },paramObj);
            var promise = ApiService.post(url, param);
            promise.then(function (res) {
                if (res.success) {
                    scope.goBack();
                }
            });
        };

        return {
            "getSupplier": getSupplier,
            "classify": classify,
            "getCompany": getCompany,
            "generalClassify": generalClassify,
            "skuQuery": skuQuery,
            "changeQuery":changeQuery,
            "operateLog":operateLog,
            "getRule": getRule,
            "getRuleValue": getRuleValue,
            "getAttribute": getAttribute,
            "getAttributeValue": getAttributeValue,
            "save": save
        };

    }]);