/**
 * Created by lc on 2017/3/15.
 */
angular.module("klwkOmsApp")
    .controller("inventoryUploadController", ["$scope","$rootScope" ,"toolsService","inventoryUploadService",
        function($scope,$rootScope,toolsService,inventoryUploadService) {

            //进入页面需要执行的方法
            function init(){
                $scope.formData = {
                    "count":0,
                    'delete':true  //默认禁用删除按钮
                };
                /*默认是‘库存上传’选项卡*/
                $scope.tab = "upload";
                /*默认不增量上传*/
                $scope.ischeck = false;

                // 商品搜索项
                $scope.productItem = {};

                //选择商品集合
                $scope.association = [];

                //选择规格列配置
                $scope.theadSkuList = [
                    {name: "商品编码", tag: 'productcode'},
                    {name: "商品名称", tag: 'productname'},
                    {name: "规格编码", tag: 'code'},
                    {name: "规格名称", tag: 'description'},
                    {name: "市场价", tag: 'firstprice'},
                    {name: "重量", tag: 'weight'},
                    {name: "备注", tag: 'note'}
                ];

                //选择商品列配置
                $scope.selectProductList = [
                    {name: "状态", tag: 'status'},
                    {name: "商品编码", tag: 'code'},
                    {name: "商品名称", tag: 'description'},
                    {name: "商品简称", tag: 'shortname'},
                    {name: "商品类型", tag: 'producttype'},
                    {name: "生产方式", tag: 'productionmode'},
                    {name: "品牌名称", tag: 'brand'},
                    {name: "品牌代码", tag: 'brandcode'},
                    {name: "厂家货号", tag: 'factorycode'},
                    {name: "供应商", tag: 'suppliername'},
                    {name: "商品重量", tag: 'weight'},
                    {name: "箱规", tag: 'cartonspec'},
                    {name: "配件", tag: 'spareparts'},
                    {name: "所属公司", tag: 'companyname'},
                    {name: "外部编码", tag: 'gbcode'}
                ];

                //选择组合列配置
                $scope.productGroupList =[
                    {name: "不可拆分", tag: 'issplit'},
                    {name: "套装代码", tag: 'code'},
                    {name: "套装名称", tag: 'description'},
                    {name: "套装分类", tag: 'categoryname'},
                    {name: "套装规格", tag: 'productsize'},
                    {name: "礼盒", tag: 'isgift'},
                    {name: "重量", tag: 'weight'},
                    {name: "销售价", tag: 'costprice'},
                    {name: "备注", tag: 'note'}
                ];
                //上传结果列配置
                $scope.uploadLogList =[
                    {name: "商品编码", tag: 'productCode'},
                    {name: "商品名称", tag: 'productName'},
                    {name: "规格编码", tag: 'skuCode'},
                    {name: "规格名称", tag: 'skuName'},
                    {name: "上传数量", tag: 'quantity'},
                    {name: "状态", tag: 'status'},
                    {name: "上传时间", tag: 'createdate'},
                    {name: "上传人", tag: 'uploader'},
                    {name: "信息", tag: 'message'}
                ];



                /*查询配置*/
                inventoryUploadService.queryStore($scope);

                /*初始化店铺*/
                $scope.pullInfo = {};

                /*初始化上传状态*/
                $scope.statusIndex = 1 ; //默认查询上传成功
                $scope.uploadStatus={
                    isshow:false,
                    info:[{id:"0",name:'上传成功'},{id:"1",name:'上传失败'}],
                    onChange: function(obj,index){	//点击之后的回调
                        $scope.statusIndex = index + 1;
                    }
                };

                /*初始化选择商品下拉*/
                $scope.productInfo ={
                    isshow:false,
                    info:[
                        {id:0,name:'选择商品'},
                        {id:1,name:'选择规格'},
                        {id:2,name:'选择组合'},
                    ],
                    objName:{name:'选择商品'},
                    onChange: function(obj,index){	//点击之后的回调
                        if(index == 0){  //选择商品
                            $scope.showModal('productSelectModal',8);
                        }else if(index==1){  //选择规格
                            $scope.showModal('productSpecModal',6);
                        }else{  //选择组合
                            $scope.showModal('productGroupModal',9);
                        }
                    }
                };

                /*初始化导入商品下拉*/
                $scope.importInfo ={
                    isshow:false,
                    info:[
                        {id:0,name:'导入商品'},
                        {id:1,name:'导入规格'},
                    ],
                    objName:{name:'导入商品'},
                    onChange: function(obj,index){	//点击之后的回调
                        if(index == 0){  //导入商品

                        }else{  //导入规格

                        }
                    }
                };

                /*初始化商品搜索条件*/
                $scope.productItem = {};

            }
            init();
            $scope.zlChecked=function () {
                $scope.ischeck = !$scope.ischeck;
            };

            $scope.toggleTab = function(name){
                toolsService.toggleTab($scope,name);
            };

            /*商品规格分页*/
            $scope.paginationSkuConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 6,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [6, 15, 50, 100, 500, 1000],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: function (currentPage, itemsPerPage) {
                    $scope.paginationSkuConf.first = itemsPerPage * (currentPage - 1) + 1;
                    if ($scope.paginationSkuConf.totalItems / itemsPerPage === itemsPerPage) {
                        $scope.paginationSkuConf.last = $scope.paginationSkuConf.totalItems;
                    } else {
                        $scope.paginationSkuConf.last = currentPage * itemsPerPage;
                    }
                },
                onChange: function () {	//操作之后的回调
                    inventoryUploadService.queryGoods($scope, $scope.paginationSkuConf.currentPage, $scope.paginationSkuConf.itemsPerPage);
                }
            };
            $scope.paginationSkuConf.first = 1;
            $scope.paginationSkuConf.last = $scope.paginationSkuConf.itemsPerPage;


            /*商品分页*/
            $scope.paginationProductConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 8,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [8, 15, 50, 100, 500, 1000],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: function (currentPage, itemsPerPage) {
                    $scope.paginationProductConf.first = itemsPerPage * (currentPage - 1) + 1;
                    if ($scope.paginationProductConf.totalItems / itemsPerPage === itemsPerPage) {
                        $scope.paginationProductConf.last = $scope.paginationProductConf.totalItems;
                    } else {
                        $scope.paginationProductConf.last = currentPage * itemsPerPage;
                    }
                },
                onChange: function () {	//操作之后的回调
                    inventoryUploadService.queryproduct($scope, $scope.paginationProductConf.currentPage, $scope.paginationProductConf.itemsPerPage);
                }
            };
            $scope.paginationProductConf.first = 1;
            $scope.paginationProductConf.last = $scope.paginationProductConf.itemsPerPage;


            /*套装组合分页*/
            $scope.paginationGroupConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 500,  //总记录条数
                itemsPerPage: 9,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [9, 15, 50, 100, 500, 1000],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: function (currentPage, itemsPerPage) {
                    $scope.paginationGroupConf.first = itemsPerPage * (currentPage - 1) + 1;
                    if ($scope.paginationGroupConf.totalItems / itemsPerPage === itemsPerPage) {
                        $scope.paginationGroupConf.last = $scope.paginationGroupConf.totalItems;
                    } else {
                        $scope.paginationGroupConf.last = currentPage * itemsPerPage;
                    }
                },
                onChange: function () {	//操作之后的回调
                    inventoryUploadService.queryGroup($scope, $scope.paginationGroupConf.currentPage, $scope.paginationGroupConf.itemsPerPage);
                }
            };
            $scope.paginationGroupConf.first = 1;
            $scope.paginationGroupConf.last = $scope.paginationGroupConf.itemsPerPage;


            /*上传结果列表分页*/
            $scope.paginationUploadLogConf = {
                currentPage: 1,   //初始化默认显示第几页
                totalItems: 0,  //总记录条数
                itemsPerPage: 10,  //每页显示多少条
                pagesLength: 5, //分页长度
                perPageOptions: [10, 20, 50, 100, 500, 1000],  //配置配置可选择每页显示记录数 array
                extClick: false, //当为外部点击翻页时为true
                type: 0,  // 上一页0  下一页1
                getPageIndex: function (currentPage, itemsPerPage) {
                    $scope.paginationUploadLogConf.first = itemsPerPage * (currentPage - 1) + 1;
                    if ($scope.paginationUploadLogConf.totalItems / itemsPerPage === itemsPerPage) {
                        $scope.paginationUploadLogConf.last = $scope.paginationUploadLogConf.totalItems;
                    } else {
                        $scope.paginationUploadLogConf.last = currentPage * itemsPerPage;
                    }
                },
                onChange: function () {	//操作之后的回调
                    inventoryUploadService.getUploadLog($scope, $scope.paginationUploadLogConf.currentPage, $scope.paginationUploadLogConf.itemsPerPage);
                }
            };
            $scope.paginationUploadLogConf.first = 1;
            $scope.paginationUploadLogConf.last = $scope.paginationUploadLogConf.itemsPerPage;


            /*选中当前行*/
            $scope.selectSingle = function (event){
                if($(event.target).hasClass('icon-sel-zhengque')){
                    $(event.target).removeClass('icon-sel-zhengque');
                }else{
                    $(event.target).addClass('icon-sel-zhengque');
                }
                //激活删除按钮
                if( $(event.target).parents('.spec-content').find('.icon-sel-zhengque').length>0){
                    $scope.formData.delete = false;
                }else{
                    $scope.formData.delete = true;
                }
            };
            /*选中所有行*/
            $scope.selectAll = function (event){
                if($(event.target).hasClass('icon-sel-zhengque')){
                    $(event.target).parents('.ipt-row').find('label').find('i').removeClass('icon-sel-zhengque');
                }else{
                    $(event.target).parents('.ipt-row').find('label').find('i').addClass('icon-sel-zhengque');
                }
                //激活删除按钮
                if( $(event.target).parents('.spec-content').find('.icon-sel-zhengque').length>0){
                    $scope.formData.delete = false;
                }else{
                    $scope.formData.delete = true;
                }
            };

            //显示模态框
            $scope.showModal = function (name ,itemsPerPage) {
                /*查询配置商品*/
                if(name == 'productSpecModal'){
                    inventoryUploadService.queryGoods($scope,1,itemsPerPage,function () {
                        $(" #" + name).modal('show');
                    });
                }else if(name == 'productSelectModal'){
                    inventoryUploadService.queryproduct($scope,1,itemsPerPage,function () {
                        $(" #" + name).modal('show');
                    });
                }else{
                    inventoryUploadService.queryGroup($scope,1,itemsPerPage,function () {
                        $(" #" + name).modal('show');
                    });
                };
            };
            // 隐藏模态框
            $scope.hideModal = function (name) {
                $(" #" + name).modal('hide');
            };

            // 关联商品搜索
            $scope.productSearchEnsure = function (type) {
                if(type==0){
                    inventoryUploadService.queryproduct($scope,1,8)
                }else if(type==1){
                    inventoryUploadService.queryGoods($scope,1,6);
                }else {
                    inventoryUploadService.queryGroup($scope,1,8);
                }

            };

            // 关联商品搜索取消
            $scope.productSearchCancel = function () {
                $scope.productItem = {};
            };

            // 存储当前商品
            $scope.selectProduct = function (obj,e ,type) {  //type 0 商品   1 规格  2组合
                $(e.target).closest('tr').addClass('current').siblings().removeClass('current');
                if(type==1){
                    inventoryUploadService.getProductInventory($scope,obj);
                }
                $scope.acitveProductItem = $.extend({},obj);
            };

            // 选择商品保存
            $scope.productEnsure = function (name) {
                inventoryUploadService.getProductSpec($scope,$scope.acitveProductItem,function () {
                    if($scope.acitveProductItem.code){
                        $scope.acitveProductItem.productcode = $scope.acitveProductItem.code;
                    };
                    $scope.association.push($.extend({},$scope.acitveProductItem));
                    $scope.hideModal(name);
                });
            };

            /*显示隐藏商品规格*/
            $scope.productSpecInfo = function (index) {
                $scope.association[index].isShow = !$scope.association[index].isShow;
            };

            /*修改上传数量*/
            $scope.uploadNumber = function (e,index,index1) {
                $scope.association[index].productSpec[index1].number = $(e.target).val();
            };

            /*上传商品*/
            $scope.uploadProductSpec=function () {
                var productSpecList= [] ;  //要上传的规格数组
                for(var i = 0;i<$scope.association.length;i++){
                    for(var j=0; j<$scope.association[i].productSpec.length; j++){
                        var obj =$scope.association[i].productSpec[j];
                        productSpecList.push({
                            ProductCode:obj.productcode,
                            ProductTitle:obj.productname,
                            SkuId:obj.skuid,
                            SkuCode:obj.productcode,
                            SkuTitle:obj.description,
                            Quantity :obj.number?  obj.number : 0,
                            Deleted:false,
                            IsNew:false,
                            IsUpdate:false,
                        });
                    }
                }
                inventoryUploadService.uploadProduct($scope,productSpecList);
            };

            /*删除待上传商品*/
            $scope.deleteProductSpec = function (e) {
                var productList = $(e.target).parents('.items').find('.spec-content').find('.icon-sel-zhengque');
                $.each(productList,function (_index, obj) {
                    var parentIndex = $(obj).attr('data-parentIndex');
                    var index = $(obj).attr('data-index');
                    if(_index>0){
                        $scope.association[parentIndex].productSpec.splice(index-1,1);
                    }else{
                        $scope.association[parentIndex].productSpec.splice(index,1);
                    }
                    if($scope.association[parentIndex].productSpec.length==0){
                        $scope.association.splice(parentIndex,1);
                    }
                })
            };
            /*清空待上传商品*/
            $scope.clearProductSpec=function () {
                $scope.association = [];
            };

            /*获取上传结果*/
            $scope.getUploadLog = function () {
                inventoryUploadService.getUploadLog($scope,1,10);
            }

            /*失败重传*/
            $scope.fialUpload = function () {
                $.each($scope.tableUploadLog,function (index, obj) {
                    inventoryUploadService.failUpload($scope,obj);
                })
            }


    }]);