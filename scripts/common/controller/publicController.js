/**
 * Created by liaocan on 2017/3/16.
 * 处理公共区域业务
 */
angular.module("klwkOmsApp")
    .controller('publicController', ["$scope","$rootScope",
        function($scope,$rootScope) {

            //默认导航栏
            $scope.crumbs = {
                first : '订单管理',
                two : "B2C售前-订单",
                three : "订单列表"
            };


            //默认选项数组
            $scope.option = [
                {name:'订单列表',url:'../template/orderManage/orderList.html',crumbs:$scope.crumbs},
            ];


            //默认页
            $scope.index = 0;

            //默认不显示选项卡集合
            $scope.tabList = false;

            if(JSON.parse(sessionStorage.getItem("menuPower"))){
                $rootScope.menuPower = JSON.parse(sessionStorage.getItem("menuPower"));
            }

            //头部模块切换
            $scope.loadPageContent = function(num,name){
                $scope.moduleName = name;
				/*切换头部样式*/
                $(".top-menu .item").removeClass('active');
                $('.top-menu .item:eq('+(num-1)+')').addClass('active');
                $('.leftMenu .it').css('display','none')
                $('.leftMenu .it:eq('+(num-1)+')').css('display','block');
            };


			/*B2C CIT FBP 切换*/
            $scope.chekcMenu = function (e,index) {
                $('#leftMenu .orderManage .item').removeClass('active-menu');
                $(e.target).addClass('active-menu');
                $('#leftMenu .left-container .option').css('display','none');
                $('#leftMenu .left-container .option:eq('+(index-1)+')').css('display','block');
            };

            /*手动切换tab栏*/
            $scope.changeTab = function (index,obj) {
                $scope.index = index ;
                //隐藏选项卡集合
                $scope.tabList = false;

                $scope.crumbs = $.extend(true,[],obj.crumbs);
            };

            /*修改导航栏*/
            $scope.updateCrumbs = function (e) {
                $scope.crumbs = $(e.target).attr('data-crumbs');
            }

            /*新增tab栏*/
            $scope.addTab = function (name,url,e) {
                if(e){
                    $scope.crumbs = {
                        first : $scope.moduleName?$scope.moduleName : '订单管理',
                        two : $(e.target).parent().find('.one-name').text(),
                        three : name
                    }
                }
                //多个选项卡时 去除left导航标记
                $("#leftMenu .it .hre").removeClass('active');

                $scope.tabList = false;

                //如果数组中不存在则直接切换显示
                for(var i = 0;i < $scope.option.length; i++){
                    if($scope.option[i].name.indexOf(name) >=0 || name.indexOf($scope.option[i].name) >=0){
                        //显示想应元素
                        $scope.option[i].name = name;
                        $scope.option[i].url = url;
                        $scope.option[i].crumbs.three = name;
                        if(i>6){  //目前设置最大数量为6  方便测试 后续修改
                            $scope.option[6]={name:name,url:url};
                            $scope.option[$scope.option.length - 1] = $scope.option[6];
                            $scope.changeTab(i,$scope.option[6]);
                            $scope.index = 6;
                        }else{
                            $scope.changeTab(i,$scope.option[i]);
                        }
                        return;
                    }
                }
                $scope.index = 0;
                //如果数组中不存在则添加显示//
                var obj={name:name,url:url,crumbs:$.extend(true,[],$scope.crumbs)};
                $scope.option.unshift(obj);
            }

            /*删除tab栏*/
            $scope.deleteTab = function (index) {
                if($scope.option.length==1){   //最后一个选项卡不能双出
                    return;
                }else{
                    //获取当前页面索引
                    var _index= $('.container-body .info > div').index( $('.container-body .info .active'));

                    //删除选项卡及对应的内容
                    $('#public-tabs .tab:eq('+index+')').remove();
                    $('.container-body .info > div:eq('+index+')').remove();

                    //删除数组元素
                    $scope.option.splice(index,1);


                    if(index === 0 && _index === 0){
                        $scope.index = 0;
                    }else{
                        if(_index <= index){   //删除当前选项卡之前的
                            $scope.index = _index;
                            if(_index === $scope.option.length){
                                $scope.index = _index-1;
                            }
                        }else{   //删除当前选项卡之后的
                            if(_index == $scope.option.length -1){
                                $scope.index = _index;
                            }else {
                                $scope.index = _index -1 ;
                            }
                        }
                    }
                    $scope.changeTab($scope.index);
                }
            }

            /*显示隐藏所有选项卡*/
            $scope.showTabList = function () {
                $scope.tabList = ! $scope.tabList;
            }
        }
    ]);