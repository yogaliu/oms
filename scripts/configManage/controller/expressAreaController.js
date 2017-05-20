/**
 * Created by xs on 2017/3/22.
 */
angular.module("klwkOmsApp")
    .controller("expressAreaController", ["$scope","$rootScope","expressAreaService","ApiService","toolsService" ,
        function($scope,$rootScope,expressAreaService,ApiService,toolsService) {
            //页面service
            var currentService = expressAreaService;
            //页面id
            var pageId = "#expressArea";
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
                    ExpressId:'',
                    ProvinceId:'',
                    CityId:'',
                    CountyId:''
                };
                //表格配置
                $scope.theadList = [
                    {name: "快递公司", tag: 'expressname'},
                    {name: "国家", tag: 'countryname'},
                    {name: "省", tag: 'provincename'},
                    {name: "市", tag: 'cityname'},
                    {name: "区", tag: 'countyname'},
                    {name: "集结地编码", tag: 'packagecentercode'},
                    {name: "集结地名称", tag: 'packagecentername'},
                    {name: "国际区域", tag: 'isinternational'},
                    {name: "关键字到达", tag: 'iskeywordarrive'},
                    {name: "关键字", tag: 'keyword'}
                ];
                currentService.query($scope);
                //获取省选项 筛选条件
                currentService.queryProvince($scope);
                //当前服务中没有快递选项时请求获取 有则直接配置仓库选项组件
                var promise = ApiService.listenAll(function(deffer){
                    if($.isEmptyObject(currentService.allExpress)){
                        currentService.getExpress(deffer);
                    }else{
                        deffer.resolve();
                    }
                });
                promise.then(function(){
                    //下拉选框 快递名称
                    $scope.Express.info = currentService.allExpress;
                    $scope.setExpressList.info = currentService.allExpress;
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
                //下拉选框插件 区
                $scope.CountyList = {
                    isshow:false,
                    info:[],
                    onChange : function(obj,index){	//点击之后的回调
                        $scope.formData.CountyId = obj.id;
                    }
                };
                //下拉选框 快递名称
                $scope.Express ={
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){
                        $scope.formData.ExpressId = obj.id;
                    }
                };
                //下拉选框 快递名称
                $scope.setExpressList ={
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){
                        if($scope.setExpressId != obj.id){
                            $scope.setExpressId = obj.id;
                            $scope.setExpressName = obj.name;
                            $scope.allRegion = [];
                            //获取所选快递的区域设置
                            currentService.getExpressRegion($scope);
                        }
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
                $scope.Express.init();
                $scope.ProvinceList.init();
                $scope.CityList.info = [];
                $scope.CityList.init();
                $scope.CountyList.info = [];
                $scope.CountyList.init();
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
             * 修改
             */
            $scope.goEditPage = function (i) {
                $rootScope.params = {
                    'oprate':'edit',
                    'obj':$scope.tableList[i]
                };
                $scope.addTab('快递范围：修改快递范围','../template/configManage/newExpressArea.html');
            };
            /**
             * 新增
             */
            $scope.goCreatPage = function () {
                $rootScope.params = {
                    'oprate':'creat'
                };
                $scope.addTab('快递范围：新增快递范围','../template/configManage/newExpressArea.html');
            };
            /**
             * 导出
             */
            $scope.exportFile = function () {
                currentService.exportFile($scope);
            };
            /**
             * 区域设置 初始化弹框
             */
            $scope.showAreaSetModal = function () {
                $scope.allRegion = [];
                $scope.setExpressId = "";
                $scope.setExpressList.init();
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
                            "ExpressName": $scope.setExpressName,
                            "Id": "",
                            "CreateDate": new Date().format('YYYY-MM-DD hh:mm:ss'),
                            "ExpressId": $scope.setExpressId,
                            "CountryId": "c52cb98c-cd0e-4cd8-8eba-131e94fcdf34",
                            "CountryName": "中国",
                            "ProvinceId": provinceObj.id,
                            "ProvinceName": provinceObj.name,
                            "ProvinceAllArrive": false,
                            "CityId": cityObj.id,
                            "CityName": cityObj.name,
                            "CityAllArrive": false,
                            "CountyId": obj.id,
                            "CountyName": obj.name,
                            "IsKeywordArrive": false,
                            "IsInternational": false,
                            "IsDisabled": false,
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