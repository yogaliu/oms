/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("productSettingUpController", ["$scope", "$rootScope", "toolsService", "productSettingUpService","validateService",
        function ($scope, $rootScope, toolsService, productSettingUpService,validateService) {
            var pageId = '#productSettingUp';  // 页面Id
            //进入页面需要执行的方法
            function init() {
                // 初始化表单验证
                validateService.initValidate(pageId);
                //tab,默认商品规则编码
                $scope.tab = 'first';
                //商品规则编码列表配置
                $scope.theadListRule = [
                    {name: "禁用", tag: 'isdisabled'},
                    {name: "显示", tag: 'isshow'},
                    {name: "生成款号", tag: 'isproduct'},
                    {name: "编码", tag: 'code'},
                    {name: "名称", tag: 'name'},
                    {name: "排序", tag: 'seq'}
                ];
                productSettingUpService.ruleQuery($scope,1,10);
                //自定义属性列表配置
                $scope.theadListAttribute = [
                    {name: "编码", tag: 'code'},
                    {name: "名称", tag: 'name'},
                    {name: "分类", tag: 'classificationname'},
                    {name: "创建日期", tag: 'createdate'}
                ];
                // 商品规则 批量操作插件
                $scope.menuRule = {
                    isshow: false,
                    info: [
                        {name: '删除'},
                        {name: '启用'},
                        {name: '禁用'}
                    ],
                    objName: {name: '批量操作'},
                    onChange: function (obj, index) {	//点击之后的回调
                        switch (index) {
                            case 0:
                                // 删除
                                $scope.batchDeleteRule();
                                break;
                            case 1:
                                // 启用
                                $scope.batchEnabled();
                                break;
                            case 2:
                                // 禁用
                                $scope.batchDisabled();
                                break;
                        }
                    }
                };
                // 自定义属性 批量操作插件
                $scope.menuAttribute = {
                    isshow: false,
                    info: [
                        {name: '删除'}
                    ],
                    objName: {name: '批量操作'},
                    onChange: function (obj,index) {	//点击之后的回调
                        // 删除
                        $scope.batchAttributeDelete();
                    }
                };
                 //属性分类下拉选项配置
                $scope.selectAttribute = {
                    isshow: false,
                    info:[],
                    onChange: function (obj,index) {	//点击之后的回调
                        $scope.activeAttributeItem.classificationname = obj.name;
                        $scope.activeAttributeItem.classificationid = obj.id;
                    }
                };
                productSettingUpService.attributeClassify($scope);
                //当前规则编辑项
                $scope.activeRuleItem = {};
                //当前规则编辑项集合
                $scope.activeRuleItemList = [];
                // 存储批量删除规则数据集合
                $scope.batchValue = [];
                //当前属性编辑项
                $scope.activeAttributeItem = {};
                //当前属性编辑项集合
                $scope.activeAttributeItemList = [];
                //当前商品分类编辑项
                $scope.classifyItem = {};
            }
            init();
            //商品管理默认页
            $rootScope.activePage = "productManage";

            //复选框改变单条数据的isdatacheck属性
            $scope.selectItem = function (i, name) {
                $scope[name][i].isdatacheck = !$scope[name][i].isdatacheck;
                $scope.isalldatacheck = true;
                $.each($scope[name], function (index, obj) {
                    if (!obj.isdatacheck) {
                        $scope.isalldatacheck = false;
                    }
                })
            };
            //复选框改变所有数据的isdatacheck属性
            $scope.selectAll = function (name) {
                if ($scope.isalldatacheck) {
                    $.each($scope[name], function (index, obj) {
                        obj.isdatacheck = false;
                        $scope.isalldatacheck = false;
                        $scope[name].batchBtn = false;
                    })
                } else {
                    $.each($scope[name], function (index,obj) {
                        obj.isdatacheck = true;
                        $scope.isalldatacheck = true;
                    })
                }
            };

            //tab栏切换
            $scope.toggleTab = function (content) {
                $scope.tab = content;
                if(content == 'first') {
                    productSettingUpService.ruleQuery($scope,1,10);
                } else if (content == 'second') {
                    productSettingUpService.attributeQuery($scope, 1, 10);
                } else {
                    productSettingUpService.classifyQuery($scope);
                }
            };

            //规则列表刷新
            $scope.ruleRefresh = function () {
                productSettingUpService.ruleQuery($scope,1,10);
            };

            //查看规则属性值
            $scope.getRuleValue = function (obj,i) {
                $.each($scope.tableListRule, function (index,obj) {
                    obj.isSelect = false;
                });
                $scope.tableListRule[i].isSelect = true;
                productSettingUpService.ruleValue($scope, obj);
            };

            //禁用规则
            $scope.singleDisabled = function () {
                productSettingUpService.disabledRule($scope,'single');
            };
            //批量禁用规则提示
            $scope.batchDisabled = function () {
                var isHasCheck = false;
                $.each($scope.tableListRule, function (index, obj) {
                    if (obj.isdatacheck) {
                        isHasCheck = true;
                        return false;
                    }
                });
                if (isHasCheck) {
                    $scope.showModal(-1, 'batchIsDisabledModal', 'rule');
                } else {
                    toolsService.alertMsg({content: '请选择要操作的行', time: 1000});
                }
            };
            // 批量禁用规则操作
            $scope.batchDisabledOp = function () {
                productSettingUpService.disabledRule($scope, 'batch');
            };

            // 启用规则
            $scope.singleEnabled = function (i) {
                $scope.activeRuleItem = $.extend({},$scope.tableListRule[i]);
                if ($scope.activeRuleItem.isdisabled) {
                    productSettingUpService.enabledRule($scope, 'single');
                }
            };
            //批量启用规则
            $scope.batchEnabled = function () {
                var isHasCheck = false;
                $.each($scope.tableListRule, function (index, obj) {
                    if (obj.isdatacheck) {
                        isHasCheck = true;
                        return false;
                    }
                });
                if (isHasCheck) {
                    productSettingUpService.enabledRule($scope, 'batch');
                } else {
                    toolsService.alertMsg({content: '请选择要操作的行', time: 1000});
                }
            };

            //删除规则
            $scope.singleDeleteRule = function () {
                productSettingUpService.ruleValue($scope, $scope.activeRuleItem, 'single');
            };
            // 批量删除规则提示
            $scope.batchDeleteRule = function () {
                var isHasCheck = false;
                $.each($scope.tableListRule, function (index, obj) {
                    if (obj.isdatacheck) {
                        isHasCheck = true;
                        return false;
                    }
                });
                if (isHasCheck) {
                    $.each($scope.tableListRule, function (index,obj) {
                        if (obj.isdatacheck) {
                            productSettingUpService.ruleValue($scope,obj,'batch');
                        }
                    });
                    $scope.showModal(-1, 'batchDeleteRuleModal', 'rule');
                } else {
                    toolsService.alertMsg({content: '请选择要操作的行', time: 1000});
                }
            };
            //批量删除规则操作
            $scope.batchDeleteRuleOp = function () {
                productSettingUpService.deleteRule($scope,$scope.batchValue,'batch');
            };

            //新增规则
            $scope.addRules = function () {
                $rootScope.productRuleParams = {
                    type: 'new'
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/addProductRules.html';
                $scope.option[index].name = '商品编码规则：新增规则';
            };

            //修改规则
            $scope.editRules = function (i) {
                $rootScope.productRuleParams = {
                    data: $scope.tableListRule[i],
                    type: 'edit'
                };
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/addProductRules.html';
                $scope.option[index].name = '商品编码规则：修改规则';
            };

            //自定义属性联合搜索
            $scope.myKeyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    productSettingUpService.attributeQuery($scope, 1, 10, 1);
                }
            };

            //属性列表刷新
            $scope.attributeRefresh = function () {
                // 清空搜索条件
                $scope.code = '';
                productSettingUpService.attributeQuery($scope,1,10);
            };

            // 删除属性
            $scope.attributeDelete = function () {
                productSettingUpService.attributeDelete($scope, 'single');
            };
            //批量删除属性提示
            $scope.batchAttributeDelete = function () {
                var isHasCheck = false;
                $.each($scope.tableListAttribute, function (index, obj) {
                    if (obj.isdatacheck) {
                        isHasCheck = true;
                        return false;
                    }
                });
                if (isHasCheck) {
                    $scope.showModal(-1, 'batchDeleteAttributeModal', 'attribute');
                } else {
                    toolsService.alertMsg({content: '请选择要操作的行', time: 1000});
                }
            };
            //批量删除属性操作
            $scope.batchAttributeDeleteOp = function () {
                productSettingUpService.attributeDelete($scope, 'batch');
            };

            //保存自定义属性
            $scope.attributeSave = function () {
                if (validateService.validateAll(pageId,'#attributeModal')) {
                    productSettingUpService.saveAttribute($scope);
                }
            };

            //保存商品分类
            $scope.classifySave = function () {
                if (validateService.validateAll(pageId,'#classifyModal')) {
                    productSettingUpService.saveClassify($scope);
                }
            };

            //子分类收起/隐藏
            $scope.toggleExpand = function (e) {
                var obj = $(e.target);
                obj.closest('.classify').children('.classify').toggle("fast").removeClass('hide');
                obj.closest(".classify-bg").find("i").toggleClass("icon-icon_zhankaiKPA");
            };

            //显示模态框
            $scope.showModal = function (i,name,type,module) {
                // 初始化弹框
                validateService.clearValidateClass(pageId,'#'+name);
                if (i >= 0) {
                    if (type == 'rule') {
                        // 编码规则
                        $scope.activeRuleItem = $.extend({}, $scope.tableListRule[i]);
                        // 禁用状态下不能禁用
                        if(name == 'isDisabledModal') {
                            if($scope.activeRuleItem.isdisabled) {
                                return;
                            }
                        }
                    } else if (type == 'attribute') {
                        $scope.activeAttributeItem = $.extend({}, $scope.tableListAttribute[i]);
                        // 自定义属性
                        if(module == 'new') {
                            // 新增属性
                            $scope.activeAttributeItem = {};
                            $scope.selectAttribute.init();
                            $scope.activeAttributeItem.title = '新增属性';
                        } else if(module == 'edit') {
                            $scope.selectAttribute.setValue({id:$scope.activeAttributeItem.classificationid});
                            $scope.activeAttributeItem.title = '修改属性';
                        }
                    }
                }
                // 商品分类
                if(name == 'classifyModal') {
                    // 新增子分类
                    if(module == 'new') {
                        $scope.classifyItem = {};
                        $scope.classifyItem.title = '新增商品分类';
                        $scope.classifyItem.parentid = i.id;
                        $scope.classifyItem.level = i.level + 1;
                    } else if (module == 'edit') {
                        // 修改分类
                        $scope.classifyItem = {
                            id: i.id,
                            code: i.code,
                            name: i.name,
                            parentid: i.parentid,
                            level: i.level,
                            createdate: i.createdate
                        };
                        $scope.classifyItem.title = '修改商品分类';
                    } else if(module == 'parent') {
                        // 新增一级分类
                        $scope.classifyItem = {};
                        $scope.classifyItem.title = '新增商品分类';
                    }
                }
                $(pageId + " #" + name).modal('show');
            };

            /*商品编码规则分页*/
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage, itemsPerPage) {
                $scope.first = itemsPerPage * (currentPage - 1) + 1;
                if ($scope.rulesPaginationConf.totalItems / itemsPerPage === itemsPerPage) {
                    $scope.last = $scope.rulesPaginationConf.totalItems;
                } else {
                    $scope.last = currentPage * itemsPerPage;
                }

            };
            //分页配置
            $scope.rulesPaginationConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 0,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    productSettingUpService.ruleQuery($scope,$scope.rulesPaginationConf.currentPage,$scope.rulesPaginationConf.itemsPerPage);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.rulesPaginationConf.itemsPerPage;
            //外部上一页
            $scope.prevRule = function () {
                $scope.rulesPaginationConf.currentPage--;
                $scope.rulesPaginationConf.type = 0;
                $scope.rulesPaginationConf.extClick = true;
                $scope.getPageIndex($scope.rulesPaginationConf.currentPage, $scope.rulesPaginationConf.itemsPerPage);
            };
            //外部下一页
            $scope.nextRule = function () {
                $scope.rulesPaginationConf.currentPage++;
                $scope.rulesPaginationConf.type = 1;
                $scope.rulesPaginationConf.extClick = true;
                $scope.getPageIndex($scope.rulesPaginationConf.currentPage, $scope.rulesPaginationConf.itemsPerPage);
            };


            /*自定义属性分页*/
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage, itemsPerPage) {
                $scope.first = itemsPerPage * (currentPage - 1) + 1;
                if ($scope.attributPaginationConf.totalItems / itemsPerPage === itemsPerPage) {
                    $scope.last = $scope.attributPaginationConf.totalItems;
                } else {
                    $scope.last = currentPage * itemsPerPage;
                }

            };
            //分页配置
            $scope.attributPaginationConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 0,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [500, 10, 15, 20, 25, 50],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function () {	//操作之后的回调
                    productSettingUpService.attributeQuery($scope, $scope.attributPaginationConf.currentPage, $scope.attributPaginationConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.attributPaginationConf.itemsPerPage;
        }]);
