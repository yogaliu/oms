/**
 * Created by xs on 2017/3/20.
 */
angular.module("klwkOmsApp")
    .controller("systemLogController", ["$scope","APP_MENU","ApiService" ,function($scope,APP_MENU,ApiService) {
        //获取身份验证
        var paramObj = ApiService.getBasicParamobj();
        var pageId = "#systemLog";
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
                    query();
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
            //配置时间控件
            $(pageId + ' #beginDate').datetimepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                startView: 2,
                minView: 2,
                forceParse: false,
                todayBtn:1,
                language: 'zh-CN'
            });
            $(pageId + ' #endDate').datetimepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                startView: 2,
                minView: 2,
                forceParse: false,
                todayBtn:1,
                language: 'zh-CN'
            });
            //表格配置
            $scope.theadList = [
                {name: "操作人", tag: 'username'},
                {name: "操作日期", tag: 'createdate'},
                {name: "内容", tag: 'note'}
            ];
            //表格筛选条件
            $scope.formData = {
                "username":"", //操作人
                "beginDate":"", //开始时间
                "endDate":"", //结束时间
                "moduleType":"" //日志类型
            };
            //下拉组件 日志类型
            $scope.logtypeList = {
                isshow:false,
                info:klwTool.jsonToArray2(APP_MENU.logType,'id','name'),
                onChange: function(obj,index){	//点击之后的回调
                    $scope.formData.moduleType = obj.id;
                }
            };
            query();
        }
        init();
        /**
         * 清空搜索条件
         */
        $scope.clearOnly = function () {
            for(var name in $scope.formData){
                $scope.formData[name] = "";
            }
            $scope.logtypeList.init();
        };
        /**
         * 搜索
         */
        $scope.query = function () {
            query();
        };
        /**
         * 获取表格数据
         */
        function query() {
            var url = "/BasicInformation/SystemLog/Get";
            var param = $.extend({
                body: JSON.stringify({
                    "PageIndex": $scope.paginationConf.currentPage,
                    "PageSize": $scope.paginationConf.itemsPerPage,
                    "Timespan": "00:00:00.688",
                    "SeletedCount": 0,
                    "Data": [{
                        "OperateType": 3,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "CreateDate",
                        "Name": "BeginDate",
                        "Value": $scope.formData.beginDate,
                        "Children": []
                    }, {
                        "OperateType": 5,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "CreateDate",
                        "Name": "EndDate",
                        "Value": $scope.formData.endDate,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "UserName",
                        "Name": "UserName",
                        "Value": $scope.formData.username,
                        "Children": []
                    }, {
                        "OperateType": 0,
                        "LogicOperateType": 0,
                        "AllowEmpty": false,
                        "Field": "ModuleType",
                        "Name": "ModuleType",
                        "Value": $scope.formData.moduleType,
                        "Children": []
                    }],
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                })
            }, paramObj);
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    //配置分页插件 数据总条数
                    $scope.paginationConf.totalItems = res.total;
                    $scope.tableList = res.data;
                }
            });
        }

    }]);