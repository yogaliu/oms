/**
 * Created by cj on 2017/3/22.
 */
angular.module("klwkOmsApp")
    .controller("addProductRulesController", ["$scope", "$rootScope", "addProductRulesService","toolsService","validateService", "$state",
        function ($scope, $rootScope, addProductRulesService,toolsService,validateService) {
            var pageId = '#addProductRules';  // 页面Id
            //进入页面需要执行的方法
            function init() {
                // 初始化表单验证
                validateService.initValidate(pageId);
                // 表格默认不能编辑
                $scope.isEdit = false;
                var params = $rootScope.productRuleParams;  // 接收参数
                if(params.type == 'edit'){
                    //修改页面
                    $scope.parentItem = {
                        'id':params.data.id,
                        //  编码
                        "code": params.data.code,
                        // 名称
                        "name": params.data.name,
                        // 序号
                        "seq": params.data.seq,
                        //禁用
                        "isShow": params.data.isshow,
                        // 生成款号
                        "isNumber": params.data.isproduct,
                        "createDate":params.data.createdate
                    };
                    // 获取商品规则属性值
                    addProductRulesService.getRuleValue($scope);

                } else if(params.type == 'new'){
                    // 新增页面
                    $scope.parentItem = {
                        // 默认显示为true
                        "isShow": true,
                        // 默认生成款号为false
                        "isNumber": false,
                        "details":[]
                    };
                    // 新增规则属性值按钮位置
                    $scope.ruleValue = 'start';
                }
                //规则属性值列表配置
                $scope.theadList = [
                    {name: "代码", tag: 'code'},
                    {name: "名称", tag: 'name'},
                    {name: "排序", tag: 'seq'}
                ];
                // 规则属性值存储
                $scope.childItem = {};
            }

            init();

            // 复选框公用方法
            $scope.checkItem = function (item,name) {
                item[name] = !item[name];
            };

            /*规则属性值逻辑处理*/
            $scope.child = {
                // 模块显示隐藏
                module:function (module,type) {
                    $scope[module] = type;
                },
                // 确定
                ensure:function () {
                    if(validateService.validateAll(pageId,'.child-rules')) {
                        // 生成表格
                        var column = {
                            // 编码
                            "code": $scope.childItem.code,
                            // 名称
                            "name": $scope.childItem.name,
                            // 序号
                            "seq": $scope.childItem.seq,
                            // 父规则Id
                            "encoderuleId": $scope.parentItem.id,
                            // 默认启用
                            "isdiabled":false,
                            "deleted": false,
                            "isnew": false,
                            "isupdate": false
                        };
                        $scope.parentItem.details.push(column);
                        $scope.ruleValue = '';
                        // 清空规则属性值
                        $scope.childItem = {};
                        // 初始化表单
                        validateService.clearValidateClass(pageId,'.child-rules');
                    }
                },
                // 取消
                cancel:function () {
                    // 初始化表单
                    validateService.clearValidateClass(pageId,'.child-rules');
                    // 清空子规则值
                    $scope.childItem = {};
                    // 根据是否有规则属性值判断按钮位置
                    if($scope.parentItem.details.length != 0) {
                        $scope.ruleValue = '';
                    } else {
                        $scope.ruleValue = 'start';
                    }
                }
            };
            
            // 表格编辑
            $scope.tableEdit = function () {
                $scope.isEdit = true;
            };

            // 编码规则属性值
            $scope.userChange = function(event,data,index){
                var value = $(event.target).closest('td').text();
                // 不允许用户换行
                value = value.replace(/<\/?.+?>/g,"");
                value = value.replace(/[\r\n]/g, "");
                $(event.target).closest('td').text(value);
                $scope.parentItem.details[index][data] = event.target.innerText;
            };


            //保存规则
            $scope.saveRule = function () {
                if(validateService.validateAll(pageId,'.parent-rules')) {
                    addProductRulesService.save($scope,$scope.parentItem);
                }
            };

            //返回商品编码规则
            $scope.goBack = function () {
                var index = $(pageId).closest('[data-index]').attr('data-index');
                $scope.option[index].url = '../template/productManage/productSettingUp.html';
                $scope.option[index].name = '商品编码规则';
            };

        }]);