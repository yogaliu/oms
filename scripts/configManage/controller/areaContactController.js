/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("areaContactController", ["$scope","$rootScope","areaContactService" ,
        function($scope,$rootScope,areaContactService) {
            //页面service
            var currentService = areaContactService;
            //页面id
            var pageId = "#areaContact";
            //进入页面需要执行的方法
            function init(){
                //搜索条件
                $scope.formData = {
                    platform:""
                };
                //表格配置
                $scope.theadList = [
                    {name: "平台区域名称", tag: 'platformregionnameauxiliary'},
                    {name: "省", tag: 'provincename'},
                    {name: "市", tag: 'cityname'},
                    {name: "区", tag: 'countyname'}
                ];
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
                //下拉选框插件 省
                $scope.ProvinceList = {
                    isshow:false,
                    info:[],
                    onChange: function(obj,index){	//点击之后的回调
                        if($scope.activeItem.provinceid !== obj.id){
                            $scope.activeItem.provinceid = obj.id;
                            $scope.activeItem.provincename = obj.name;
                            $scope.activeItem.cityid = "";
                            $scope.activeItem.cityname = "";
                            $scope.activeItem.countyid = "";
                            $scope.activeItem.countyname = "";
                            currentService.queryCity($scope);
                        }
                    }
                };
                //下拉选框插件 市
                $scope.CityList = {
                    isshow:false,
                    info:[],
                    onChange : function(obj,index){	//点击之后的回调
                        if($scope.activeItem.cityid !== obj.id){
                            $scope.activeItem.cityid = obj.id;
                            $scope.activeItem.cityname = obj.name;
                            $scope.activeItem.countyid = "";
                            $scope.activeItem.countyname = "";
                            currentService.queryCounty($scope);
                        }
                    }
                };
                //下拉选框插件 区
                $scope.CountyList = {
                    isshow:false,
                    info:[],
                    onChange : function(obj,index){	//点击之后的回调
                        $scope.activeItem.countyid = obj.id;
                        $scope.activeItem.countyname = obj.name;
                    }
                };
                //获取页面数据
                currentService.query($scope);
                //下拉选框插件 省
                currentService.queryProvince($scope);

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
            };
            /**
             * 显示模态框
             */
            $scope.editContact = function (i) {
                $scope.activeItem = $.extend({},$scope.tableList[i]);
                if($scope.activeItem.provinceid){
                    $scope.ProvinceList.setValue({id:$scope.activeItem.provinceid});
                    currentService.queryCity($scope,true);
                }else{
                    $scope.ProvinceList.init();
                    $scope.CityList.info = [];
                    $scope.CityList.init();
                }
                if($scope.activeItem.cityid){
                    currentService.queryCounty($scope,true);
                }else{
                    $scope.CountyList.info = [];
                    $scope.CountyList.init();
                }
                $(pageId + " #editModal").modal('show');
            };
            /**
             * 修改
             */
            $scope.saveEdit = function () {
                currentService.editMapper($scope);
            };

    }]);