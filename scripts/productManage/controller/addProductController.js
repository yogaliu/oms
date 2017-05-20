/**
 * Created by cj on 2017/3/21.
 */
angular.module("klwkOmsApp")
    .controller("addProductController", ["$scope", "$rootScope", "addProductService","APP_MENU","toolsService","ApiService","validateService",
        function ($scope, $rootScope,addProductService,APP_MENU,toolsService,ApiService,validateService) {
            var pageId = '#addProduct'; //页面Id
            // 存储基本信息待定值
            var storageInfoData = {};
            //进入页面需要执行的方法
            function init() {
                var params = $rootScope.productParams;   // 接收参数
                // 初始化表单验证
                validateService.initValidate(pageId);
                // 规格信息初始化
                $scope.theadListSkus = [
                    {name: "状态", tag: 'statusname'},
                    {name: "自定义编码", tag: 'customcode'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "颜色", tag: 'color'},
                    {name: "尺码", tag: 'size'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "财务成本", tag: 'costprice'},
                    {name: "实际售价", tag: 'retailprice'},
                    {name: "采购价", tag: 'purchaseprice'},
                    {name: "经销价", tag: 'platformprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];
                //修改页面,页面呈现数据
                if (params.type == 'edit') {
                    //基本信息显示状态,默认显示仅读
                    $scope.basicInfo = 'addAfter';
                    // 基本信息
                    $scope.formData = {
                        'productid': params.data.productid,
                        // 商品编码
                        "code": params.data.code,
                        // 外部编码
                        "gbcode": params.data.gbcode,
                        // 商品分类
                        "categoryid": params.data.categoryid,
                        "categoryname": params.data.categoryname,
                        // 年份
                        "year": params.data.year,
                        // 商品名称
                        "description": params.data.description,
                        // 商品简称
                        "shortname":params.data.shortname,
                        // 季节
                        "season": params.data.season,
                        // 厂家货号
                        "factorycode": params.data.factorycode,
                        // 供应商名称
                        "supplierid": params.data.supplierid,
                        "suppliername":params.data.suppliername,
                        // 生产方式
                        "productionmode": params.data.productionmode,
                        // 品牌
                        "brand": params.data.brand,
                        // 品牌编码
                        "brandcode": params.data.brandcode,
                        // 重量
                        "weight": params.data.weight?params.data.weight:'',
                        // 体积
                        "volume": params.data.volume?params.data.volume:'',
                        // 箱规
                        "cartonspec": params.data.cartonspec?params.data.cartonspec:0,
                        // 公司
                        "companyid": params.data.companyid,
                        "companyname": params.data.companyname,
                        // 市场价
                        "firstprice": params.data.firstprice?params.data.firstprice:0,
                        // 销售价
                        "wholesaleprice": params.data.wholesaleprice?params.data.wholesaleprice:0,
                        // 实际售价
                        "retailprice": params.data.retailprice?params.data.retailprice:0,
                        //商品类型
                        "producttype": params.data.producttype,
                        //财务成本
                        "costprice": params.data.costprice?params.data.costprice:0,
                        // 经销价
                        "platformprice": params.data.platformprice?params.data.platformprice:0,
                        // 采购价
                        "purchaseprice": params.data.purchaseprice,
                        // 主题
                        "theme": params.data.theme,
                        // 基本单位
                        "unit": params.data.unit,
                        // 回货周期
                        "returnperiod": params.data.returnperiod,
                        // 上线日期
                        "newonlinedate": params.data.newonlinedate,
                        // 下线日期
                        "offlinedate": params.data.offlinedate,
                        // 安全库存天数
                        "safetystockdays": params.data.safetystockdays,
                        // 上限日期
                        "ceilingday": params.data.ceilingday,
                        // 下限日期
                        "lowerday": params.data.lowerday,
                        // 是否有配件
                        "spareparts": params.data.spareparts,
                        // 备注
                        "note":params.data.note,
                        "createdate": params.data.createdate,
                        "createusername":params.data.createusername,
                        'type':'edit'
                    };
                    // 规格信息列表数据
                    addProductService.skuQuery($scope);
                    // 变价信息列表数据
                    addProductService.changeQuery($scope);
                    // 操作日志列表数据
                    addProductService.operateLog($scope);
                    // 自定义属性显示状态,默认显示仅读
                    $scope.attributeInfo = 'addAfter';
                    // 自定义属性
                    for(var i = 1 ; i <= 20 ; i++) {
                        $scope.formData["attribute" + i] = params.data["attribute" + i]?params.data["attribute" + i]:'';
                    }
                }
                // 新增页面,页面显示数据
                else if (params.type == 'new') {
                    $scope.formData = {
                        'type':'new'
                    };
                    //基本信息显示状态,默认显示新增按钮
                    $scope.basicInfo = 'addBefore';
                    // 规格信息显示状态,默认显示新增按钮
                    $scope.standardInfo = 'start';
                    // 存储规格信息表格数据
                    $scope.tableListSkus = [];
                    // 自定义属性显示状态,默认显示新增按钮
                    $scope.attributeInfo = 'addBefore';
                }
                //存储默认基本信息待修改
                storageInfoData = $.extend({},$scope.formData);
                // 自定义属性标题信息
                addProductService.getAttribute($scope);
                //自动生成步骤,默认第一步
                $scope.standardStep = 'first';
                // 规格信息输入项存储
                $scope.standardItem = {};
                // 规格信息自动生成项
                $scope.autoItemList = [];
                // 存储编码规则的属性值
                $scope.valueList = [];
                // 存储选择的属性值
                $scope.singleValue = [];
                // 商品类型根据Id获取name
                $scope.formData.producttypename = $scope.formData.producttype?APP_MENU.productType[$scope.formData.producttype]:'';
                /*下拉列表初始化 配置*/
                // 商品类型
                $scope.selectProduct = {
                    isshow:false,
                    info:[
                            {name:'正常',id:'0'},
                            {name:'赠品',id:'1'},
                            {name:'虚拟',id:'2'},
                            {name:'发票',id:'3'},
                            {name:'次品',id:'5'},
                            {name:'礼盒',id:'6'},
                            {name:'包装',id:'7'},
                            {name:'组合套装',id:'8'}
                    ],
                    objName:{id:$scope.formData.producttype == 4?$scope.formData.producttype = 0:$scope.formData.producttype},
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.producttype = index;
                        $scope.formData.producttypename = $scope.formData.producttype?APP_MENU.productType[$scope.formData.producttype]:'';
                    }
                };
                //供应商信息初始化
                $scope.selectSupplier = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.supplierid = obj.supplierid;
                        $scope.formData.suppliername = obj.shortname;
                    }
                };
                addProductService.getSupplier($scope);
                //商品品牌初始化
                $scope.selectBrand = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.brand = obj.name;
                        $scope.formData.brandcode = obj.code;
                    }
                };
                addProductService.generalClassify($scope, 2);
                //生产方式初始化
                $scope.selectType = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.productionmode = obj.name;
                    }
                };
                addProductService.generalClassify($scope, 3);
                //商品主题初始化
                $scope.selectTheme = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.theme = obj.name;
                    }
                };
                addProductService.generalClassify($scope, 4);
                //商品年份初始化
                $scope.selectYear = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.year = obj.name;
                    }
                };
                addProductService.generalClassify($scope, 5);
                //季节初始化
                $scope.selectSeason = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.season = obj.name;
                    }
                };
                addProductService.generalClassify($scope, 6);
                //基本单位初始化
                $scope.selectUnit = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.unit = obj.name;
                    }
                };
                addProductService.generalClassify($scope, 7);
                //公司信息初始化
                $scope.selectCompany = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.companyid = obj.id;
                        $scope.formData.companyname = obj.name;
                    }
                };
                addProductService.getCompany($scope);
                // 时间控件初始化
                $(pageId + ' .datePlugin').datetimepicker({
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                    forceParse: false,
                    todayBtn:1,
                    language: 'zh-CN'
                });
            }
            init();

            // 新增商品模块显示隐藏
            $scope.module = function (module,type) {
                $scope[module] = type;
            };

            // 复选框公用方法
            $scope.checkItem = function (item,name,param) {
                // 获取到已选择的编码规则
                if(param) {
                    item.isSelect = !item.isSelect;
                } else {
                    item[name] = !item[name];
                }
            };

            // 通过name匹配id
            $scope.getId = function (name,data) {
                for(var i = 0; i < data.length; i++) {
                    if(data[i].name == name) {
                        return data[i].id;
                    }
                }
            };

            //基本信息修改
            $scope.editInfo = function () {
                // 初始化表单
                validateService.clearValidateClass(pageId,'.add-basic');
                $scope.module('basicInfo','addAmong');
            };

            // 基本信息确定
            $scope.storedEnsure = function () {
                if(validateService.validateAll(pageId,'.add-basic')) {
                    $scope.basicInfo = 'addAfter';
                    storageInfoData = $.extend(false,{},$scope.formData);
                }
            };

            // 基本信息取消
            $scope.storedCancel = function () {
                $scope.formData = $.extend(false,{},storageInfoData);
            };

            /*新增规格信息处理逻辑*/
            $scope.standard = {
                //手动输入取消
                inputCancel:function () {
                    // 清空表单
                    $scope.standardItem = {};
                    // 初始化表单
                    validateService.clearValidateClass(pageId,'.add-standard');
                    // 根据是否有商品明细判断按钮位置
                    if($scope.tableListSkus.length == 0) {
                        $scope.standardInfo = 'start';
                    } else {
                        $scope.standardInfo = '';
                    }
                },
                // 手动输入确定
                inputSave: function () {
                    if(validateService.validateAll(pageId,'.add-standard')) {
                        var step = {
                            // 后台生成
                            "skuid":'',
                            // 默认状态待确认
                            "status":0,
                            "productid":$scope.formData.productid,
                            // 规格编码
                            "code": $scope.standardItem.code,
                            // 规格名称
                            "description": $scope.standardItem.description,
                            // 颜色
                            "color": $scope.standardItem.color,
                            // 尺码
                            "size": $scope.standardItem.size,
                            // 自定义编码
                            "customcode": $scope.standardItem.customcode,
                            // 备注
                            "note": $scope.standardItem.note,
                            // 市场价,默认为0
                            "firstprice": 0,
                            //财务成本,默认为0
                            "costprice":0,
                            // 实际售价,默认为0
                            "retailprice": 0,
                            // 采购价,默认为0
                            "purchaseprice": 0,
                            // 经销价,默认为0
                            "platformprice": 0,
                            // 重量,默认为0
                            "weight":0,
                            "wholesaleprice": 0,
                            "length": 0,
                            "width": 0,
                            "height": 0,
                            "volume": 0,
                            "quantity": 0,
                            "isgift": false,
                            "issplit": false,
                            "categoryid": "00000000-0000-0000-0000-000000000000",
                            "iscombined": false,
                            "createdate": "0001-01-01 00:00:00",
                            "iscomb": false,
                            "producttype": 0,
                            "Deleted": false,
                            "IsNew": true,
                            "IsUpdate": false
                        };
                        $scope.tableListSkus.push(step);
                        $.each($scope.tableListSkus, function (index,obj) {
                            // 商品状态根据id匹配name
                            if (obj.status !== undefined) {
                                obj.statusname = APP_MENU.groupStatus[obj.status];
                            }
                        });
                        // 清空表单
                        $scope.standardItem = {};
                        $scope.standardInfo = '';
                        // 初始化表单
                        validateService.clearValidateClass(pageId,'.add-standard');
                    }
                },
                // 自动生成第一步
                autoFirst:function () {
                    // 初始化表单
                    validateService.clearValidateClass(pageId,'.add-standard');
                    // 自动生成商品编码不为空
                    if($scope.formData.code) {
                        // 自动生成,显示第一步
                        $scope.standardInfo = 'auto';
                        $scope.standardStep = 'first';
                        // 商品编码规则
                        addProductService.getRule($scope);
                    } else {
                        toolsService.alertMsg({content : '请填写商品编码！',time : 1000});
                    }
                },
                // 自动生成第二步
                autoSecond:function () {
                    // 清空选择的编码规则
                    $scope.selectRule = [];
                    // 清空选择的编码规则对应的属性值
                    $scope.valueList = [];
                    // 清空勾选的编码规则属性值
                    $scope.singleValue = [];
                    $.each($scope.ruleList, function (index,obj) {
                        if(obj.isSelect) {
                            // 遍历勾选商品规则对应的属性值
                            $scope.selectRule.push(obj);
                            addProductService.getRuleValue($scope,index,obj.id);
                            // 存储勾选项
                            $scope.singleValue.push([]);
                        }
                    });
                },
                // 自动生成取消
                autoCancel:function () {
                    // 根据是否有商品明细判断按钮位置
                    if($scope.tableListSkus.length == 0) {
                        $scope.standardInfo = 'start';
                    } else {
                        $scope.standardInfo = '';
                    }
                    // 清空选中规则数组
                    $scope.selectRule = [];
                },
                // 自动生成确认
                autoSave:function () {
                    $scope.tableListSkus.push($scope.value);
                },
                //复选框改变单条数据的isdatacheck属性
                selectItem:function (item,index) {
                    item.isdatacheck = !item.isdatacheck;
                    $scope.valueList[index].isalldatacheck = true;
                    $scope.singleValue[index] = [];
                    $.each($scope.valueList[index].data,function (i,v) {
                        if(!v.isdatacheck){
                            $scope.valueList[index].isalldatacheck = false;
                        } else {
                            $scope.singleValue[index].push(v.name);
                        }
                    });
                    // 转换数据
                    $scope.getArr($scope.singleValue);
                    console.log($scope.singleValue);
                },
                //复选框改变所有数据的isdatacheck属性
                selectAll:function (index) {
                    if($scope.valueList[index].isalldatacheck){
                        $scope.valueList[index].isalldatacheck = false;
                        $.each($scope.valueList[index].data,function (index, obj) {
                            obj.isdatacheck = false;
                        })
                    }else{
                        $scope.valueList[index].isalldatacheck = true;
                        $.each($scope.valueList[index].data,function (index, obj) {
                            obj.isdatacheck = true;
                        })
                    }
                    $scope.singleValue[index] = [];
                    $.each($scope.valueList[index].data,function (i, v) {
                        if(v.isdatacheck){
                            $scope.singleValue[i].push(v.name);
                        }
                    });
                    // 转换数据
                    $scope.getArr($scope.singleValue);
                    console.log($scope.singleValue);
                }
            };

            // 下拉框点击获取属性
            $scope.getAttribute = function (i,name,event) {
                $(event.target).closest('.attribute-list').css('display','none');
                $(event.target).closest('.attribute-list').siblings('span').html(name);
                $scope.attributeData[i-1].worth = name;
            };
            //经过
            $scope.showAttribute = function (e) {
                $(e.target).find('.attribute-list').css('display','block');
            };
            //离开
            $scope.hideAttribute = function (e) {
                $(e.target).find('.attribute-list').css('display','none');
            };

            // 自定义属性确定
            $scope.attributeEnsure = function () {
                $scope.storageDefineData = $.extend(true,[],$scope.attributeData);
            };

            // 自定义属性取消
            $scope.attributeCancel = function () {
                $scope.attributeData = $.extend(true,[],$scope.storageDefineData);
            };

            //模态框显示
            $scope.showModal = function (name) {
                $("#" + name).modal("show");
                // 获取商品分类
                addProductService.classify($scope);
            };

            //子分类收起/隐藏
            $scope.toggleExpand = function (e,i) {
                var obj = $(e.target);
                obj.closest('.classify').children('.classify').toggle("fast").removeClass('hide');
                obj.closest(".classify-bg").find("i").toggleClass("icon-icon_zhankaiKPA");
                if(obj.closest('.classify').find('.classify').length == 0) {
                    $scope.formData.categoryname = i.name;
                    $scope.formData.categoryid = i.id;
                    $(pageId + ' #classifyModal').modal('hide');
                }
            };

            //配置时间控件 配置
            $scope.showDatetimePick = function(myevent) {
                $(myevent.target).datetimepicker({
                    format: 'yyyy-mm-dd',
                    weekStart: 1,
                    autoclose: true,
                    startView: 2,
                    minView: 2,
                    forceParse: false,
                    todayBtn:1,
                    language: 'zh-CN'
                });
            };

            //保存商品
            $scope.saveProduct = function () {
                if(validateService.validateAll(pageId,'.add-basic')){
                    addProductService.save($scope, $scope.formData);
                }
            };

            //返回商品信息
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/productInformation.html';
                $scope.option[index].name = '商品信息';
            };

            /*自动生成规格编码算法*/
            $scope.getArr = function (data) {
                var DescartesUtils = {
                    /**
                     * 如果传入的参数只有一个数组，求笛卡尔积结果
                     * @param arr1 一维数组
                     * @returns {Array}
                     */
                    descartes1:function(arr1){
                        // 返回结果，是一个二维数组
                        var result = [];
                        var i = 0;
                        for (i = 0; i < arr1.length; i++) {
                            var item1 = arr1[i];
                            result.push([item1]);
                        }
                        return result;
                    },
                    /**
                     * 如果传入的参数只有两个数组，求笛卡尔积结果
                     * @param arr1 一维数组
                     * @param arr2 一维数组
                     * @returns {Array}
                     */
                    descartes2: function(arr1, arr2) {
                        // 返回结果，是一个二维数组
                        var result = [];
                        var i = 0, j = 0;
                        for (i = 0; i < arr1.length; i++) {
                            var item1 = arr1[i];
                            for (j = 0; j < arr2.length; j++) {
                                var item2 = arr2[j];
                                result.push([item1, item2]);
                            }
                        }
                        return result;
                    },
                    /**
                     *
                     * @param arr2D 二维数组
                     * @param arr1D 一维数组
                     * @returns {Array}
                     */
                    descartes2DAnd1D: function(arr2D, arr1D) {
                        var i = 0, j = 0;
                        // 返回结果，是一个二维数组
                        var result = [];

                        for (i = 0; i < arr2D.length; i++) {
                            var arrOf2D = arr2D[i];
                            for (j = 0; j < arr1D.length; j++) {
                                var item1D = arr1D[j];
                                result.push(arrOf2D.concat(item1D));
                            }
                        }
                        return result;
                    },
                    descartes3: function(list) {
                        var listLength = list.length;
                        var i = 0, j = 0;
                        // 返回结果，是一个二维数组
                        var result = [];
                        // 为了便于观察，采用这种顺序
                        var arr2D = DescartesUtils.descartes2(list[0], list[1]);
                        for (i = 2; i < listLength; i++) {
                            var arrOfList = list[i];
                            arr2D = DescartesUtils.descartes2DAnd1D(arr2D, arrOfList);
                        }
                        return arr2D;
                    },
                    //笛卡儿积组合
                    descartes: function(list)
                    {
                        if (!list) {
                            return [];
                        }
                        if (list.length <= 0) {
                            return [];
                        }
                        if (list.length == 1) {
                            return DescartesUtils.descartes1(list[0]);
                        }
                        if (list.length == 2) {
                            return DescartesUtils.descartes2(list[0], list[1]);
                        }
                        if (list.length >= 3) {
                            return DescartesUtils.descartes3(list);
                        }
                    }
                };
                return DescartesUtils.descartes(data);
            }


        }]);