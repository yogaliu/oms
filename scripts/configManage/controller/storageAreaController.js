/**
 * Created by xs on 2017/3/24.
 */
angular.module("klwkOmsApp")
    .controller("storageAreaController", ["$scope","$rootScope","storageAreaService","ApiService","toolsService","validateService" ,
        function($scope,$rootScope,storageAreaService,ApiService,toolsService,validateService) {
            //页面service
            var currentService = storageAreaService;
            //页面id
            var pageId = "#storageArea";
            //进入页面需要执行的方法
            function init(){
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
                //搜索条件
                $scope.formData = {
                    'WarehouseId' : '', //仓库
                    'ProvinceId' : '', //省
                    'CityId' : '', //市
                    'CountyId' : '' //区
                };
                //表格配置
                $scope.theadList = [
                    {name: "仓库名称", tag: 'warehousename'},
                    {name: "省", tag: 'provincename'},
                    {name: "市", tag: 'cityname'},
                    {name: "区", tag: 'countyname'}
                ];
                currentService.query($scope);
                //获取省选项
                currentService.queryProvince($scope);
                //当前服务中没有仓库选项时请求获取 有则直接配置仓库选项组件
                var promise = ApiService.listenAll(function(deffer){
                    if($.isEmptyObject(currentService.allWarehouse)){
                        currentService.getWarehouse(deffer);
                    }else{
                        deffer.resolve();
                    }
                });
                promise.then(function(){
                    //得到数据后配置仓库选项
                    $scope.setWarehouseList.info = currentService.allWarehouse;
                    $scope.WarehouseList.info = currentService.allWarehouse;
                    $scope.editWarehouseList.info = currentService.allWarehouse;
                });
                //下拉选框插件 省
                $scope.ProvinceList = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        if($scope.formData.ProvinceId !== obj.id){
                            $scope.formData.ProvinceId = obj.id;
                            $scope.formData.CityId = "";
                            $scope.formData.CountyId = "";
                            currentService.queryCity($scope);
                        }
                    }
                };
                $scope.editProvinceList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        if($scope.activeItem.provinceid !== obj.id){
                            $scope.activeItem.provinceid = obj.id;
                            $scope.activeItem.provincename = obj.name;
                            $scope.activeItem.cityid = "";
                            $scope.activeItem.cityname = "";
                            $scope.activeItem.countyid = "";
                            $scope.activeItem.countyname = "";
                            currentService.queryEditCity($scope);
                        }
                    }
                };
                //下拉选框插件 市
                $scope.CityList = {
                    isshow:false,
                    info:[],
                    onChange : function(obj,index){	//点击之后的回调
                        if($scope.formData.CityId !== obj.id){
                            $scope.formData.CityId = obj.id;
                            $scope.formData.CountyId = "";
                            currentService.queryCounty($scope);
                        }
                    }
                };
                $scope.editCityList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange : function(obj,index){	//点击之后的回调
                        if($scope.activeItem.cityid !== obj.id){
                            $scope.activeItem.cityid = obj.id;
                            $scope.activeItem.cityname = obj.name;
                            $scope.activeItem.countyid = "";
                            $scope.activeItem.countyname = "";
                            currentService.queryEditCounty($scope);
                        }
                    }
                };
                //下拉选框插件 区
                $scope.CountyList = {
                    isshow:false,
                    info:[],
                    onChange : function(obj,index){	//点击之后的回调
                        $scope.formData.CountyId = obj.id;
                    }
                };
                $scope.editCountyList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange : function(obj,index){	//点击之后的回调
                        $scope.activeItem.countyid = obj.id;
                        $scope.activeItem.countyname = obj.name;
                    }
                };
                //区域设置 仓库选项
                $scope.setWarehouseList = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){
                        if($scope.setWarehouseId != obj.id){
                            $scope.setWarehouseId = obj.id;
                            $scope.setWarehouseName = obj.name;
                            $scope.allRegion = [];
                            //获取所选仓库的区域设置
                            currentService.getWarehouseRegion($scope);
                        }
                    }
                };
                $scope.WarehouseList = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.formData.WarehouseId = obj.id;
                    }
                };
                $scope.editWarehouseList = {
                    isshow:false,
                    validate:true,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.activeItem.warehouseid = obj.id;
                        $scope.activeItem.warehousename = obj.name;
                    }
                };
            }
            init();
            /**
             * 搜索
             */
            $scope.search = function () {
                currentService.query($scope);
            };
            /**
             * 清空
             */
            $scope.clearOnly = function () {
                for(var name in $scope.formData){
                    $scope.formData[name] = "";
                }
                //市 区 选项重置为空 各下拉框恢复默认值
                $scope.WarehouseList.init();
                $scope.ProvinceList.init();
                $scope.CityList.info = [];
                $scope.CityList.init();
                $scope.CountyList.info = [];
                $scope.CountyList.init();
            };
            /**
             * 新增 显示弹框
             */
            $scope.showAddModal = function () {
                $scope.activeItem = {
                    "Id": "00000000-0000-0000-0000-000000000000",
                    "CreateDate": "0001-01-01 00:00:00",
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                };
                $scope.editWarehouseList.init();
                $scope.editProvinceList.init();
                $scope.editCityList.init();
                $scope.editCityList.info = [];
                $scope.editCountyList.info = [];
                $(pageId + " #editAreaModal").modal('show');
            };
            /**
             * 修改 显示弹框 设置默认值
             */
            $scope.showEditModal = function (i) {
                $scope.activeItem = $.extend({
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                },$scope.tableList[i]);
                $scope.editWarehouseList.setValue({id:$scope.activeItem.warehouseid});
                $scope.editProvinceList.setValue({id:$scope.activeItem.provinceid});
                currentService.queryEditCity($scope,'init');
                currentService.queryEditCounty($scope,'init');
                $(pageId + " #editAreaModal").modal('show');
            };
            /**
             * 新增&修改
             */
            $scope.editItem = function () {
                if(validateService.validateAll(pageId,"#editAreaModal")){
                    currentService.editItem($scope);
                }
            };
            /**
             * 删除
             */
            $scope.deleteItem = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                toolsService.alertConfirm({
                    "msg":"数据删除后不可恢复，是否继续删除？",
                    okBtn : function(index, layero){
                        currentService.deleteItem($scope,'single');
                        layer.close(index);
                    }
                });
            };
            /**
             * 批量删除
             */
            $scope.batchDelete = function () {
                var isHasCheck = false;
                $.each($scope.tableList,function (index, obj) {
                    if(obj.isdatacheck){
                        isHasCheck = true;
                        return false;
                    }
                });
                if(isHasCheck){
                    toolsService.alertConfirm({
                        "msg":"数据删除后不可恢复，是否继续删除？",
                        okBtn : function(index, layero){
                            currentService.deleteItem($scope,'batch');
                            layer.close(index);
                        }
                    });
                }else{
                    toolsService.alertMsg({content : '请选择要操作的行',time : 1000});
                }
            };
            /**
             * 复选框改变单条数据的isdatacheck属性
             */
            $scope.selectItem = function (i) {
                $scope.tableList[i].isdatacheck = !$scope.tableList[i].isdatacheck;
                $scope.isalldatacheck = true;
                $.each($scope.tableList,function (index, obj) {
                    if(!obj.isdatacheck){
                        $scope.isalldatacheck = false;
                    }
                })
            };
            /**
             * 复选框改变所有数据的isdatacheck属性
             */
            $scope.selectAll = function () {
                if($scope.isalldatacheck){
                    $.each($scope.tableList,function (index, obj) {
                        obj.isdatacheck = false;
                        $scope.isalldatacheck = false;
                    })
                }else{
                    $.each($scope.tableList,function (index, obj) {
                        obj.isdatacheck = true;
                        $scope.isalldatacheck = true;
                    })
                }
            };
            /**
             * 区域设置 初始化弹框
             */
            $scope.showAreaSetModal = function () {
                $scope.allRegion = [];
                $scope.setWarehouseId = "";
                $scope.setWarehouseList.init();
                $(pageId + " #areaSetModal").modal('show');
            };
            /**
             * 区域设置 保存
             */
            $scope.saveAreaSet = function () {
                $scope.selectList = [];
                var isCountySelect = false;
                getAllSelectNode($scope.allRegion);
                $.each($scope.selectList,function (index, obj) {
                    if(obj.regionlevel == 4){
                        isCountySelect = true;
                    }
                });
                if(isCountySelect){
                    $scope.selectList = [];
                    formatSelectNode($scope.allRegion);
                    currentService.saveAreaSet($scope);
                }else{
                    toolsService.alertMsg({content : '请选择要保存的省市区',time : 1000});
                }
            };
            /**
             * 获取所有被勾选的节点 用于判断是否选中了区级节点
             */
            function getAllSelectNode(arr) {
                $.each(arr,function (index, obj) {
                    if(obj.isdatacheck){
                        $scope.selectList.push(obj);
                        if(obj.children){
                            getAllSelectNode(obj.children);
                        }
                    }
                })
            }
            /**
             * 获取被勾选的区级节点 格式化请求接口
             */
            function formatSelectNode(arr) {
                $.each(arr,function (index, obj) {
                    if(obj.isdatacheck && obj.regionlevel == 4){
                        var cityObj = findObjByid($scope.allRegion,obj.parentid);
                        var provinceObj = findObjByid($scope.allRegion,cityObj.parentid);
                        var o = {
                            "WarehouseId": $scope.setWarehouseId,
                            "WarehouseName": $scope.setWarehouseName,
                            "Id": "",
                            "CreateDate": new Date().format('YYYY-MM-DD hh:mm:ss'),
                            "ProvinceId": provinceObj.id,
                            "ProvinceName": provinceObj.name,
                            "CityId": cityObj.id,
                            "CityName": cityObj.name,
                            "CountyId": obj.id,
                            "CountyName": obj.name,
                            "Deleted": false,
                            "IsNew": false,
                            "IsUpdate": false
                        };
                        $scope.selectList.push(o);
                    }
                    if(obj.children){
                        formatSelectNode(obj.children);
                    }
                })
            }
            /**
             * 给一个ID，返回该ID 的对象，会影响到源数据
             */
            function findObjByid(originData, targetId){
                var result = null;
                // 判断数据源是否是数组
                if(_.isArray(originData)){
                var length = originData.length;
                    for(var i = 0; i < length; i++){
                        var currentObj = originData[i];
                        // 如果当前对象的ID 符合查找的ID，则返回该对象，则停止循环
                        if(currentObj.id == targetId){
                            result = currentObj;
                            break;
                        }
                        // 如果当前对象有子节点，则需要递归判断
                        if(currentObj.children !== undefined){
                            result = findObjByid(currentObj.children, targetId);
                            // 如果result 不为null，表示已经查询到该结果，则停止循环
                            if(result != null){
                                break;
                            }
                       }
                   }
                }
                return result;
            }

    }]);