/**
 * Created by cj on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("addGroupController", ["$scope", "$rootScope", "addGroupService","toolsService","ApiService","validateService",
        function ($scope, $rootScope, addGroupService,toolsService,ApiService,validateService) {
            var pageId = '#addGroup';  // 页面Id
            //进入页面需要执行的方法
            function init() {
                var params = $rootScope.groupParams;   // 接收参数
                // 初始化表单验证
                validateService.initValidate(pageId);
                // 商品信息列表配置
                $scope.theadSkuList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];
                // 组合套装明细列表配置
                $scope.theadInfoList = [
                    {name: "主商品", tag: 'ismainsku'},
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "销售价", tag: 'saleprice'},
                    {name: "数量", tag: 'quantity'},
                    {name: "重量", tag: 'weight'},
                    {name: "上传比例", tag: 'uploadratio'},
                    {name: "有效开始时间", tag: 'effectivetimebegin'},
                    {name: "有效结束时间", tag: 'effectivetimeend'}
                ];
                if(params.type == 'edit') {
                    $scope.groupItem = {
                        'skuid':params.data.skuid,
                        'productcode':params.data.productcode,
                        'productname':params.data.productname,
                        // 套装编码
                        'code':params.data.code,
                        // 套装名称
                        'description':params.data.description,
                        // 套装规格
                        'productsize':params.data.productsize,
                        // 重量
                        'weight':params.data.weight?params.data.weight:0,
                        // 销售价
                        'wholesaleprice':params.data.wholesaleprice?params.data.wholesaleprice:0,
                        // 商品分类
                        'categoryname':params.data.categoryname,
                        // 是否是礼盒
                        'isgift':params.data.isgift,
                        // 组合编码
                        'giftskucode':params.data.giftskucode,
                        // 备注
                        'note':params.data.note,
                        "producttype":params.data.productType,
                        "firstprice": params.data.firstprice,
                        "retailprice": params.data.retailprice,
                        "purchaseprice": params.data.purchaseprice,
                        "costprice": params.data.costprice,
                        "platformprice": params.data.platformprice,
                        "length": params.data.length,
                        "width": params.data.width,
                        "height": params.data.height,
                        "volume": params.data.volume,
                        "quantity": params.data.quantity,
                        "isGift": params.data.isgift,
                        "issplit": params.data.issplit,
                        "categoryid": params.data.categoryid,
                        "IsCombined": params.data.iscombined,
                        "Status": params.data.status,
                        "CreateDate": params.data.createdate,
                        "IsComb": params.data.iscomb
                    };
                    // 获取商品明细
                    addGroupService.groupDetail($scope);
                } else if(params.type == 'new'){
                    $scope.groupItem = {};
                }
                // 初始化仓库
                addGroupService.warehouseGet($scope);
                // 商品搜索项
                $scope.productItem = {};
                //当前编辑项
                $scope.activeItem = {};
                // 当前编辑项集合
                $scope.activeItemList = [];
                // 存储选中商品
                $scope.tableInfoList = [];
                // 存储删除商品
                $scope.deleteItem = [];
                //新增商品枚举值
                $scope.addOrder = 'addBefore';
            }

            init();

            //模态框显示
            $scope.showModal = function (name) {
                $("#" + name).modal("show");
                // 商品分类
                addGroupService.classify($scope);
            };

            //子分类收起&隐藏
            $scope.toggleExpand = function (e) {
                var obj = $(e.target);
                obj.closest('.classify').children('.classify').toggle("fast").removeClass('hide');
                obj.closest(".classify-bg").find("i").toggleClass("icon-icon_zhankaiKPA");
                if(obj.closest('.classify').find('.classify').length == 0) {
                    $scope.groupItem.categoryname = obj.closest('.classify').find('.classify-text').text();
                    $(pageId + ' #classifyModal').modal('hide');
                }
            };

            // 复选框公用方法
            $scope.checkItem = function (item,name) {
                item[name] = !item[name];
            };

            /*新增商品模块 返回数组 ($scope.tableInfoList)*/
            $scope.addProduct = {
                //初始化商品
                isInit:function () {
                    addGroupService.productQuery($scope,1,10)
                },
                // 搜索
                search: function (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        addGroupService.productQuery($scope,1,10,1);
                    }
                },
                // 模块之间显示隐藏
                module:function (module,type) {
                    $scope[module] = type;
                },
                //复选框改变单条数据的isdatacheck属性
                selectItem:function (i,name) {
                    $scope[name][i].isdatacheck = !$scope[name][i].isdatacheck;
                    $scope.isalldatacheck = true;
                    $.each($scope[name],function (index, obj) {
                        if(!obj.isdatacheck){
                            $scope.isalldatacheck = false;
                        }
                    });
                },
                //复选框改变所有数据的isdatacheck属性
                selectAll:function (name) {
                    if($scope.isalldatacheck){
                        $.each($scope[name],function (index, obj) {
                            obj.isdatacheck = false;
                            $scope.isalldatacheck = false;
                        })
                    }else{
                        $.each($scope[name],function (index, obj) {
                            obj.isdatacheck = true;
                            $scope.isalldatacheck = true;
                        })
                    }
                },
                // 设为主商品
                mainProduct: function (i) {
                    $scope.activeItem = $.extend({},$scope.tableInfoList[i]);
                    if(!$scope.activeItem.ismainsku) {
                        $.each($scope.tableInfoList,function (index,obj) {
                            obj.ismainsku = false;
                        });
                        $scope.tableInfoList[i].ismainsku = true;
                    } else {
                        toolsService.alertMsg({content : '该商品已为主商品',time : 1000});
                    }

                },
                //确定
                save:function () {
                    // 追加勾选的商品
                    $.each($scope.tableSkuList, function (index,obj) {
                        if(obj.isdatacheck) {
                            $scope.activeItemList.push(obj);
                        }
                    });
                    if($scope.activeItemList.length != 0) {
                        // 过滤已存在的商品
                        for(var i = 0; i < $scope.tableInfoList.length; i++) {
                            for(var j = 0; j < $scope.activeItemList.length; j++) {
                                if($scope.activeItemList[j].skuid == $scope.tableInfoList[i].skuid) {
                                    $scope.activeItemList.removeByValue($scope.activeItemList[j]);
                                }
                            }
                        }
                        $scope.tableInfoList = $scope.tableInfoList.concat($scope.activeItemList);
                        $scope.addOrder = '';
                        $scope.activeItemList = [];
                        //是否全选
                        $scope.isalldatacheck = false;
                        $.each($scope.tableInfoList, function (index,obj) {
                            //默认数据未勾选
                            obj.isdatacheck = false;
                        });
                    } else {
                        toolsService.alertMsg({content : '请选择要添加的商品',time : 1000});
                    }
                },
                // 取消
                cancel:function () {
                    $scope.activeItemList = [];
                    if($scope.tableInfoList.length > 0) {
                        $scope.addOrder = '';
                    } else {
                        $scope.addOrder = 'addBefore';
                    }
                },
                //批量删除
                delete:function () {
                    var isHasCheck = false;
                    $.each($scope.tableInfoList,function (index,obj) {
                        if(obj.isdatacheck){
                            isHasCheck = true;
                            return false;
                        }
                    });
                    if(isHasCheck){
                        // 删除的商品
                        $.each($scope.tableInfoList, function (index,obj) {
                            if(obj.isdatacheck) {
                                $scope.deleteItem.push(obj);
                            }
                        });
                        // 去除删除商品
                        $.each($scope.deleteItem, function (index,obj) {
                            if($scope.tableInfoList.contains(obj) != -1) {
                                if(!obj.editdata) {
                                    $scope.tableInfoList.removeByValue(obj);
                                } else {
                                    obj.deleted = true;
                                }
                                // 页面不显示已删除的商品
                                obj.isShow = false;
                            }
                        });
                    }else{
                        toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                    }
                    //是否全选
                    $scope.isalldatacheck = false;
                    $.each($scope.tableInfoList, function (index,obj) {
                        //默认数据未勾选
                        obj.isdatacheck = false;
                    });
                    if($scope.tableInfoList.length > 0) {
                        $scope.addOrder = '';
                    } else {
                        $scope.addOrder = 'addBefore';
                    }
                },
                //查看仓库
                viewInventory:function (obj,i) {
                    $.each($scope.tableSkuList, function (index,obj) {
                        obj.isSelect = false;
                    });
                    $scope.tableSkuList[i].isSelect = true;
                    $scope.acitveProductItem = $.extend({},obj);
                    addGroupService.getInventory($scope,obj);
                }
            };

            // 保存组合套装
            $scope.saveGroupInfo = function () {
                if(validateService.validateAll(pageId,'.add-group')){
                    $scope.tableData = [];
                    $.each($scope.tableInfoList, function (index,obj) {
                        $scope.tableData.push(
                            {
                                "Id": obj.id?obj.id:"00000000-0000-0000-0000-000000000000",
                                "CombinedProductId": obj.combinedproductid?obj.combinedproductid:"00000000-0000-0000-0000-000000000000",
                                "ProductId": obj.productid,
                                "ProductCode": obj.productcode,
                                "ProductName": obj.productname,
                                "SkuId": obj.skuid,
                                "SkuCode": obj.code,
                                "SkuName": obj.description,
                                "SalePrice": obj.saleprice?obj.saleprice:0,
                                "Quantity": obj.quantity,
                                "UploadRatio": obj.uploadratio?obj.uploadratio:0,
                                "Weight": obj.weight?obj.weight:0,
                                "CostPrice": obj.costprice,
                                "EffectiveTimeBegin": obj.effectivetimebegin,
                                "EffectiveTimeEnd": obj.effectivetimeend,
                                "IsMainSku": obj.ismainsku,
                                "Deleted": obj.deleted,
                                "IsNew": false,
                                "IsUpdate": false
                            }
                        )
                    });
                    addGroupService.save($scope,$scope.groupItem);
                }
            };

            // 返回组合套装
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/productGroup.html';
                $scope.option[index].name = '组合套装';
            };

            /*商品信息分页*/
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage, itemsPerPage) {
                $scope.first = itemsPerPage * (currentPage - 1) + 1;
                if ($scope.paginationSkuConf.totalItems / itemsPerPage === itemsPerPage) {
                    $scope.last = $scope.paginationSkuConf.totalItems;
                } else {
                    $scope.last = currentPage * itemsPerPage;
                }

            };
            $scope.paginationSkuConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 0,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    addGroupService.productQuery($scope, $scope.paginationSkuConf.currentPage, $scope.paginationSkuConf.itemsPerPage);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationSkuConf.itemsPerPage;

        }]);