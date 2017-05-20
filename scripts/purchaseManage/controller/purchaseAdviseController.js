/**
 * Created by cj on 2017/3/16.
 */
angular.module("klwkOmsApp")
    .controller("purchaseAdviseController", ["$scope", "$rootScope", "purchaseAdviseService",
        function ($scope, $rootScope, purchaseAdviseService) {
            var pageId = '#purchaseAdvise';   // 页面Id
            //进入页面需要执行的方法
            function init() {
                //列表配置
                $scope.theadList = [
                    {name: "一级分类", tag: 'oneCategoryName'},
                    {name: "二级分类", tag: 'twoCategoryName'},
                    {name: "三级分类", tag: 'threeCategoryName'},
                    {name: "商品代码", tag: 'code'},
                    {name: "规格代码", tag: 'skuCode'},
                    {name: "颜色", tag: 'color'},
                    {name: "尺寸", tag: 'size'},
                    {name: "年份", tag: 'productYear'},
                    {name: "备注", tag: 'skuRemark'},
                    {name: "销售数量", tag: 'saleQuantity'},
                    {name: "库存数", tag: 'IVQuantity'},
                    {name: "平均日销", tag: 'daySale'},
                    {name: "可销天数", tag: 'canSaleDays'},
                    {name: "上新日期", tag: 'newOnlineDate'},
                    {name: "供应商", tag: 'supplierName'},
                    {name: "在途", tag: 'onWayQty'},
                    {name: "下限天数", tag: 'lowerDay'},
                    {name: "上限天数", tag: 'ceilingDay'},
                    {name: "推荐采购", tag: 'suggestPurchaseQuantity'}
                ];
                // 标题控制器指令的配置文件
                $scope.allocation = {
                    "theadList" : $scope.theadList,
                    // 指令控制器的ID唯一标识
                    "timestamp" : 'purchaseAdvise'
                };
                // 商品信息列表配置
                $scope.theadSkuList = [
                    {name: "状态", tag: 'statusname'},
                    {name: "商品编码", tag: 'code'},
                    {name: "商品名称", tag: 'description'},
                    {name: "商品简称", tag: 'shortname'},
                    {name: "商品类型", tag: 'producttypename'},
                    {name: "生产方式", tag: 'productionmode'},
                    {name: "品牌名称", tag: 'brand'},
                    {name: "品牌代码", tag: 'brandcode'},
                    {name: "厂家货号", tag: 'factorycode'},
                    {name: "供应商", tag: 'suppliername'},
                    {name: "商品重量", tag: 'weight'},
                    {name: "箱规", tag: 'cartonspec'},
                    {name: "有配件", tag: 'spareparts'},
                    {name: "所属公司", tag: 'companyname'},
                    {name: "外部编码", tag: 'gbcode'}
                ];
                //搜索项
                $scope.searchItem = {};
                // 开始时间,默认当前时间
                $scope.searchItem.beginDate = new Date().format('YYYY-MM-DD hh:mm:ss')|| Date.prototype.format;
                // 结束时间,默认一个月后
                $scope.searchItem.endDate = new Date().addMonths(1).format('YYYY-MM-DD hh:mm:ss')|| Date.prototype.format;
                //初始化显示类型
                $scope.selectType = {
                    isshow: false,
                    info: [
                        {'id':1,'name':'按月显示'},
                        {'id':2,'name':'按天显示'}
                    ],
                    onChange: function (obj,index) {	//点击之后的回调
                        if(index == 0) {
                            $scope.searchItem.returnType = 'M';
                        } else if(index == 1) {
                            $scope.searchItem.returnType = 'D';
                        }
                    }
                };
                // 商品搜索项
                $scope.productItem = {};
                //商品当前编辑项
                $scope.acitveProductItem = {};
                // 绘制销量数组
                $scope.draw = [];
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

            //搜索
            $scope.search = function (type) {
                if(type == 'ensure') {
                    purchaseAdviseService.query($scope,1,10,1);
                } else if (type == 'empty'){
                    $scope.searchItem = {};
                    $scope.selectType.init();
                }
            };

            /*选择商品*/
            $scope.SelectProduct = {
                // 搜索
                search:function () {
                    purchaseAdviseService.productQuery($scope,1,6,1);
                },
                // 搜索取消
                searchCancel:function () {
                    $scope.productItem = {};
                    purchaseAdviseService.productQuery($scope,1,6);
                },
                // 选择商品
                select:function (obj,i) {
                    $scope.acitveProductItem = $.extend({},obj);
                    $.each($scope.tableSkuList, function (index,obj) {
                        obj.isProductSelect = false;
                    });
                    $scope.tableSkuList[i].isProductSelect = true;
                },
                // 保存
                save:function () {
                    $scope.searchItem.productCode = $scope.acitveProductItem.code;
                    $scope.hideModal('productSelectModal');
                }
            };

            // 显示模态框
            $scope.showModal = function (name) {
                $(pageId +' #' + name).modal('show');
                purchaseAdviseService.productQuery($scope,1,10);
            };

            // 隐藏模态框
            $scope.hideModal = function (name) {
                $(pageId +' #' + name).modal('hide');
            };

            //商品走势折线图
            $scope.productPicChart = function () {
                var ProductSalesChart = echarts.init(document.getElementById("productSales"));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (e) {
                            return e.name + "<br/>" + '数量' + e.value;
                        },
                        backgroundColor: '#000',
                        textStyle: {
                            fontSize: 12
                        },
                        padding: [5, 16]
                    },
                    //右上角工具条
                    toolbox: {
                        show: true
                    },
                    calculable: true,
                    grid: {
                        show: false,
                        top: 20,
                        left: 20,
                        bottom: 20,
                        right: 20
                    },
                    xAxis: [
                        {
                            boundaryGap: false,
                            data: [0,0.2,0.4,0.6,0.8,1]
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#EEE'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            lineStyle: {
                                normal: {
                                    color: "#53A8E2"
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0, color: '#53A8E2' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#fff' // 100% 处的颜色
                                    }], false),
                                    shadowColor: '#53A8E2',
                                    opacity: .3
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: "#53A8E2"
                                }
                            },
                            symbolSize: 10,
                            showAllSymbol: true,
                            type: 'line',
                            data: $scope.draw
                        }
                    ]
                };
                ProductSalesChart.setOption(option);
            };
            //页面加载完成后折线图绘制
            $scope.$watch('$viewContentLoaded', function () {
                $scope.productPicChart();
            });


            // 显示配置列的控制面板
            $scope.showColumnConfigPanel = function(){
                $("#"+$scope.allocation.timestamp).show();
            };

            /*规格信息分页*/
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
                    purchaseAdviseService.productQuery($scope, $scope.paginationSkuConf.currentPage, $scope.paginationSkuConf.itemsPerPage,1);
                }
            };
            $scope.first = 1;
            $scope.last = $scope.paginationSkuConf.itemsPerPage;

        }]);
