/**
 * Created by xs on 2017/3/30.
 */
angular.module("klwkOmsApp")
    .controller("characterManageController", ["$scope","ApiService","characterManageService","validateService" ,
        function($scope,ApiService,characterManageService,validateService) {
        var pageId = "#characterManage";
        var currentService = characterManageService;
        function init(){
            validateService.initValidate(pageId);
            //计算每页的数据索引
            $scope.getPageIndex = function (currentPage,itemsPerPage) {
                //超出页码范围 return
                if(currentPage === 0 || currentPage == Math.ceil($scope.paginationConf.totalItems / itemsPerPage + 1 )) return;
                $scope.first = itemsPerPage * (currentPage-1) + 1;
                if(Math.ceil($scope.paginationConf.totalItems / itemsPerPage)  === currentPage){
                    $scope.last = $scope.paginationConf.totalItems;
                }else{
                    $scope.last = currentPage *  itemsPerPage;
                }
            };
            $scope.paginationConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 0,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [6, 10, 15, 20, 25,50],  //配置配置可选择每页显示记录数 array
                extClick : false , //当为外部点击翻页时为true
                type: 0 ,  // 上一页0  下一页1
                getPageIndex: $scope.getPageIndex,
                onChange: function(){	//操作之后的回调
                    currentService.query($scope);
                }
            };
            //初始化第一页
            $scope.first = 1;
            //初始化最后一页
            $scope.last = $scope.paginationConf.itemsPerPage;
            //外部上一页
            $scope.prev = function () {
                $scope.paginationConf.currentPage--;
                $scope.paginationConf.type = 0 ;
                $scope.paginationConf.extClick = true;
                $scope.getPageIndex($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
            };
            //外部下一页
            $scope.next = function () {
                $scope.paginationConf.currentPage++;
                $scope.paginationConf.type = 1 ;
                $scope.paginationConf.extClick = true;
                $scope.getPageIndex($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
            };
            //表格筛选条件
            $scope.formData = {
                "code":"",
                "name":""
            };
            //表格配置
            $scope.theadList = [
                {name: "角色编码", tag: 'code'},
                {name: "角色名称", tag: 'name'},
                {name: "创建日期", tag: 'createdate'},
                {name: "备注", tag: 'note'}
            ];
            //当前编辑项
            $scope.activeItem = {};
            //查询主表
            currentService.query($scope);
        }
        init();
        /**
         * 搜索
         */
        $scope.search = function () {
            currentService.query($scope);
        };
        /**
         * 清空搜索条件
         */
        $scope.clearOnly = function () {
            for(var name in $scope.formData){
                $scope.formData[name] = "";
            }
        };
        /**
         * 新增 显示弹框
         */
        $scope.add = function () {
            $scope.activeItem = {
                "code": "", //角色编码
                "Id": "00000000-0000-0000-0000-000000000000",
                "name": "", //角色名称
                "note": "", //备注
                "IsDisabled": false,
                "CreateDate": "0001-01-01 00:00:00",
                "IsSystem": false,
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            };
            validateService.clearValidateClass(pageId,"#creatModal");
            $(pageId + " #creatModal").modal('show');
        };
        /**
         * 修改 显示弹框
         */
        $scope.edit = function (i) {
            $scope.activeItem = $.extend({
                "Deleted": false,
                "IsNew": false,
                "IsUpdate": false
            },$scope.tableList[i]);
            validateService.clearValidateClass(pageId,"#creatModal");
            $(pageId + " #creatModal").modal('show');
        };
        /**
         * 新增&修改
         */
        $scope.newItem = function () {
            if(validateService.validateAll(pageId,"#creatModal")) {
                currentService.newItem($scope);
            }
        };
        /**
         * 店铺权限 初始化弹框
         */
        $scope.showShopPermissionModal = function (i) {
            //当前服务中没有所有所有平台类型时请求获取 用于过滤字段
            var promise = ApiService.listenAll(function(deffer){
                if($.isEmptyObject(currentService.allPlatformType)){
                    currentService.getPlatformType(deffer);
                }else{
                    deffer.resolve();
                }
            });
            promise.then(function(){
                //未选择数组
                $scope.noCheckList = [];
                //已选择数组
                $scope.hasCheckList = [];
                //默认店铺未全选
                $scope.isleftalldatacheck = false;
                $scope.isrightalldatacheck = false;
                //默认店铺没有勾选项
                $scope.isLeftHasCheck = false;
                $scope.isRightHasCheck = false;
                $scope.leftSearchText = "";
                $scope.rightSearchText = "";
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                currentService.getStorePrivilege($scope);
                $(pageId + " #shopPermissionModal").modal('show');
            });
        };
        /**
         * 仓库权限 初始化弹框
         */
        $scope.showWarehousePermissionModal = function (i) {
            //未选择数组
            $scope.noCheckList = [];
            //已选择数组
            $scope.hasCheckList = [];
            //默认店铺未全选
            $scope.isleftalldatacheck = false;
            $scope.isrightalldatacheck = false;
            //默认店铺没有勾选项
            $scope.isLeftHasCheck = false;
            $scope.isRightHasCheck = false;
            $scope.leftSearchText = "";
            $scope.rightSearchText = "";
            $scope.activeItem = $.extend({},$scope.tableList[i]);
            currentService.getWarehousePrivilege($scope);
            $(pageId + " #warehousePermissionModal").modal('show');
        };
        /**
         * 搜索左边
         */
        $scope.searchLeft = function (type) {
            $.each($scope.noCheckList,function (index, obj) {
                var allText = '';
                if(type == 'store'){
                    allText = obj.code + obj.name + obj.platformtypename;
                }else {
                    allText = obj.code + obj.name + obj.warehousetypename + obj.storagetypename;
                }
                if(allText.toLowerCase().indexOf($scope.leftSearchText) == -1){
                    obj.ishide = true;
                }else{
                    obj.ishide = false;
                }
            })
        };
        /**
         * 搜索右边
         */
        $scope.searchRight = function (type) {
            $.each($scope.hasCheckList,function (index, obj) {
                var allText = '';
                if(type == 'store'){
                    allText = obj.code + obj.name + obj.platformtypename;
                }else {
                    allText = obj.code + obj.name + obj.warehousetypename + obj.storagetypename;
                }
                if(allText.toLowerCase().indexOf($scope.rightSearchText) == -1){
                    obj.ishide = true;
                }else{
                    obj.ishide = false;
                }
            })
        };
        /**
         * 勾选左边 未选择
         */
        $scope.selectLeft = function (i) {
            $scope.noCheckList[i].isdatacheck = !$scope.noCheckList[i].isdatacheck;
            $scope.isleftalldatacheck = true;
            $scope.isLeftHasCheck = false;
            $.each($scope.noCheckList,function (index, obj) {
                if(!obj.isdatacheck){
                    //有未勾选项 即未全选
                    $scope.isleftalldatacheck = false;
                }else{
                    //有勾选项 即有已选项
                    $scope.isLeftHasCheck = true;
                }
            })
        };
        /**
         * 全选左边 未选择
         */
        $scope.selectLeftAll = function () {
            if($scope.isleftalldatacheck){
                $.each($scope.noCheckList,function (index, obj) {
                    obj.isdatacheck = false;
                });
                $scope.isleftalldatacheck = false;
                $scope.isLeftHasCheck = false;
            }else{
                $.each($scope.noCheckList,function (index, obj) {
                    obj.isdatacheck = true;
                });
                $scope.isleftalldatacheck = true;
                $scope.isLeftHasCheck = true;
            }
        };
        /**
         * 勾选右边 已选择
         */
        $scope.selectRight = function (i) {
            $scope.hasCheckList[i].isdatacheck = !$scope.hasCheckList[i].isdatacheck;
            $scope.isrightalldatacheck = true;
            $scope.isRightHasCheck = false;
            $.each($scope.hasCheckList,function (index, obj) {
                if(!obj.isdatacheck){
                    //有未勾选项 即未全选
                    $scope.isrightalldatacheck = false;
                }else{
                    //有勾选项 即有已选项
                    $scope.isRightHasCheck = true;
                }
            })
        };
        /**
         * 全选右边 已选择
         */
        $scope.selectRightAll = function () {
            if($scope.isrightalldatacheck){
                $.each($scope.hasCheckList,function (index, obj) {
                    obj.isdatacheck = false;
                });
                $scope.isrightalldatacheck = false;
                $scope.isRightHasCheck = false;
            }else{
                $.each($scope.hasCheckList,function (index, obj) {
                    obj.isdatacheck = true;
                });
                $scope.isrightalldatacheck = true;
                $scope.isRightHasCheck = true;
            }
        };
        /**
         * 左边到右边 添加
         */
        $scope.toAdd = function () {
            if($scope.isLeftHasCheck){
                var list = [];
                $.each($scope.noCheckList,function (index, obj) {
                    //已选添加到右边 未选留在左边
                    if(obj.isdatacheck){
                        obj.isdatacheck = false;
                        $scope.hasCheckList.push(obj);
                    }else {
                        list.push(obj);
                    }
                });
                $scope.noCheckList = list;
                $scope.isleftalldatacheck = false;
                $scope.isLeftHasCheck = false;
            }else{
                return;
            }
        };
        /**
         * 右边到左边 移除
         */
        $scope.toDelete = function () {
            if($scope.isRightHasCheck){
                var list = [];
                $.each($scope.hasCheckList,function (index, obj) {
                    //已选移除到左边 未选留在右边
                    if(obj.isdatacheck){
                        obj.isdatacheck = false;
                        $scope.noCheckList.push(obj);
                    }else {
                        list.push(obj);
                    }
                });
                $scope.hasCheckList = list;
                $scope.isrightalldatacheck = false;
                $scope.isRightHasCheck = false;
            }else{
                return;
            }
        };
        /**
         * 保存店铺权限
         */
        $scope.saveStorePrivilege = function () {
            var list = [];
            $.each($scope.hasCheckList,function (index, obj) {
                //待保存的店铺权限对象
                var thisObj = {
                    "Id": "", //传空 后台生成
                    "OperaterId": $scope.activeItem.id, //角色id
                    "ObjectId": obj.id, //店铺id
                    "Type": 201, //权限类型 店铺
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                };
                list.push(thisObj);
            });
            currentService.saveStorePrivilege($scope,list);
        };
        /**
         * 保存仓库权限
         */
        $scope.saveWarehousePrivilege = function () {
            var list = [];
            $.each($scope.hasCheckList,function (index, obj) {
                //待保存的仓库权限对象
                var thisObj = {
                    "Id": "", //传空 后台生成
                    "OperaterId": $scope.activeItem.id, //角色id
                    "ObjectId": obj.id, //店铺id
                    "Type": 202, //权限类型 仓库
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                };
                list.push(thisObj);
            });
            currentService.saveWarehousePrivilege($scope,list);
        };
        /**
         * 菜单权限 初始化弹框
         */
        $scope.showMenuPermissionModal = function (i) {
            $scope.activeItem = $.extend({},$scope.tableList[i]);
            $scope.allMenu = [];
            currentService.getMenuPrivilege($scope);
            $(pageId + " #menuPermissionModal").modal('show');
        };
        /**
         * 操作权限 初始化弹框
         */
        $scope.showOperationPermissionModal = function (i) {
            $scope.activeItem = $.extend({},$scope.tableList[i]);
            $scope.allOperation = [];
            currentService.getOperationPrivilege($scope);
            $(pageId + " #operationPermissionModal").modal('show');
        };
        /**
         * 字段权限 初始化弹框
         */
        $scope.showFieldPermissionModal = function (i) {
            $scope.activeItem = $.extend({},$scope.tableList[i]);
            $scope.allField = [];
            currentService.getFieldPrivilege($scope);
            $(pageId + " #fieldPermissionModal").modal('show');
        };
        /**
         * 菜单权限 保存
         */
        $scope.saveMenuPrivilege = function () {
            $scope.selectList = [];
            getSelectNode($scope.allMenu,101);
            currentService.saveMenuPrivilege($scope);
        };
        /**
         * 操作权限 保存
         */
        $scope.saveOperationPrivilege = function () {
            $scope.selectList = [];
            getSelectNode($scope.allOperation,102);
            currentService.saveOperationPrivilege($scope);
        };
        /**
         * 字段权限 保存
         */
        $scope.saveFieldPrivilege = function () {
            $scope.selectList = [];
            getSelectNode($scope.allField,103);
            currentService.saveFieldPrivilege($scope);
        };
        /**
         * 获取被勾选的节点
         */
        function getSelectNode(arr,type) {
            $.each(arr,function (index, obj) {
                if(obj.isdatacheck){
                    var o = {
                        "Id": "", //传空 后台生成
                        "OperaterId": $scope.activeItem.id, //角色id
                        "ObjectId": obj.id, //菜单id
                        "Type": type, //权限类型
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                    $scope.selectList.push(o);
                    if(obj.children){
                        getSelectNode(obj.children,type);
                    }
                }
            })
        }




    }]);