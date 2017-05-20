/**
 * Created by zgh on 2017/4/11.
 * 订单管理的公共指令方法
 */
angular.module('klwkOmsApp')
    .directive('advancedSearchList', function () {
        return {
            restrict : 'E',
            replace : true,
            scope : {
                configData : '='
            },
            template : '<div class="searchItem" ng-hide="configData.searchOrderListCollect[configData.field]">'+
                        '<span class="title">{{configData.title}}</span>'+
                        '<div class="options">'+
                        '<span ng-click="conditionSetting(orderstatus)"' +
                                'ng-class="{\'greenSpan\':(searchData[orderstatus.type][\'val\'] == orderstatus.id)}"'+
                                'ng-repeat="orderstatus in configData.searchData">'+
                        '{{orderstatus.name}}'+
                        '</span>'+
                        '</div>'+
                        '</div>',
            link : function (scope,ele,attrs) {
                var serarchCondition = scope.configData;
                //筛选条件单选选中
                scope.conditionSetting = function (orderstatus) {
                    //筛选的条件字段值
                    var key = orderstatus.type;
                    //筛选条件的具体值
                    var val = orderstatus.id;
                    //筛选条件的类型
                    var type = orderstatus.re;
                    //筛选条件的具体值
                    var name = orderstatus.name;
                    var data = {
                        name : name,
                        val : val,
                        type : type,
                        field : serarchCondition.field
                    };
                    serarchCondition.show = true;
                    //点击选中筛选条件
                    serarchCondition.searchOrderListCollect[serarchCondition.field] = [data];
                    serarchCondition.searchConditionsCollect[serarchCondition.field] = [data];
                }
            }
        }
    })
    //包含可以多选和更多的筛选条件
    .directive('advancedSearchMoreList', function () {
        return {
            restrict : "E",
            replace : true,
            scope : {
                searchConfig : '='
            },
            template : '<div class="searchItem" ng-hide="(searchConfig.advancedSearchObj.moreShow == searchConfig.type) || searchConfig.searchOrderListCollect[searchConfig.field]">' +
                            '<span class="title">{{searchConfig.title}}</span>' +
                            '<div class="options">' +
                                '<span ng-click="filterContionSelect(searchName,searchConfig.title)" ng-repeat="searchName in searchConfig.searchData.defaultShow">'+
                                '{{searchName.name}}'+
                                '</span>' +
                            '</div>' +
                            '<div class="more">' +
                                '<div class="btn klwk-spread" ng-if="searchConfig.selectMore == \'true\'" ng-click="isMoreShow(searchConfig.type,$event,moreShowCallback)">更多<i class="iconfont"></i></div>'+
                                '<div class="btn check-box" ng-if="searchConfig.moreShow == \'true\'" ng-click="searchConfig.advancedSearchObj.isMoreSelShow(searchConfig.type,choseMore)"><i class="iconfont"></i>多选</div>'+
                            '</div>'+
                        '</div>',
            link : function (scope,ele,attr) {
                //console.log(scope.searchConfig.searchOrderListCollect);
                var searchConfig = scope.searchConfig;
                scope.isMoreShow = function (moreContent,myEvent) {
                    searchConfig.advancedSearchObj.moreShow = moreContent;
                    searchConfig.advancedSearchObj.moreSel = false;
                    //高级搜索中展开情况下取消按钮，清空已经勾选的复选框
                    if (myEvent && moreContent == 'false') {
                        $(myEvent.target).closest('.spread').find('i.icon-sel-zhengque').removeClass('icon-sel-zhengque');
                    }
                    searchConfig.searchData.globalShow = searchConfig.searchData.data;
                };

                //单选状态的筛选条件被选中
                scope.filterContionSelect = function (searchName,title) {
                    var data = {
                        name : searchName.name,
                        type : title,
                        val : searchName.id,
                        field : searchConfig.type
                    };
                    //将选中的数据添加到要展示已选中的筛选条件的对象当中
                    searchConfig.searchOrderListCollect[searchConfig.field] = [data];
                    //将选中的数据添加到要发送给后台的数据当中
                    searchConfig.searchConditionsCollect[searchConfig.field] = [data];
                };

                //选中多选状态
                scope.choseMore = function () {
                    searchConfig.advancedSearchObj.moreShow = false;
                    searchConfig.searchData.globalShow = searchConfig.searchData.data;
                };
            }
        }
    })
    //展示更多的数据和多选时
    .directive('advanceSearchMoreListShow', function () {
        return {
            restrict : 'E',
            replace : true,
            scope : {
                searchConfig : '='
            },
            template : '<div class="searchItem spread" ng-show="(searchConfig.advancedSearchObj.moreShow == searchConfig.type) && !searchConfig.searchOrderListCollect[searchConfig.field]">' +
                        '<span class="title">{{searchConfig.title}}</span>'+
                        '<div class="options">' +
                        '<input class="klw-search" ng-change="inputSearch(keyword)" ng-model="keyword"' +
                            'ng-if="searchConfig.letterClassify == \'true\'"  type="text" placeholder="{{searchConfig.placeHold}}">' +
                            '<div class="wordSearch" ng-if="searchConfig.letterClassify == \'true\'">'+
                                '<span>所搜的{{searchConfig.title}}</span>' +
                                '<span class="singleWord">全部</span>' +
                                '<span class="singleWord"' +
                                    'ng-click="selectStoresByFirstLetter(letter,searchConfig.type)"'+
                                    'ng-repeat="letter in letterList.data"'+
                                    'ng-class="{greenSpan : (letterList.chose == letter)}">'+
                                    '{{letter}}'+
                                '</span>'+
                            '</div>'+
                            '<div class="spreadContent">'+
                                '<label ng-click="isLabelSelect($event,orderType)"'+
                                    'ng-repeat="orderType in searchConfig.searchData.globalShow">'+
                                    '<i ng-class="{\'icon-sel iconfont\':searchConfig.advancedSearchObj.moreSel==searchConfig.type}"></i>'+
                                    '{{orderType.name}}'+
                                '</label>'+
                            '</div>'+
                            '<div class="spreadFooterBtn" ng-show="searchConfig.advancedSearchObj.moreSel == searchConfig.type ">'+
                                '<button class="btn btn-success btn-78" ng-click="searchConfig.advancedSearchObj.isMoreShow(\'false\',$event,successOperate)">确定</button>'+
                                '<button class="btn btn-default btn-78" ng-click="searchConfig.advancedSearchObj.isMoreShow(\'false\',$event,cancleSearchData)">取消</button>'+
                            '</div>'+
                        '</div>'+
                            '<div class="more">'+
                                '<div class="btn klwk-spread" ' +
                                    'ng-hide="searchConfig.advancedSearchObj.moreSel == searchConfig.type" ' +
                                    'ng-click="searchConfig.advancedSearchObj.isMoreShow(false,$event,moreShowCallback)">收起' +
                                    '<i class="iconfont"></i>' +
                                '</div>'+
                                '<div class="btn check-box" ' +
                                    'ng-if="searchConfig.moreShow == \'true\'"' +
                                    'ng-click="searchConfig.advancedSearchObj.isMoreSelShow(searchConfig.type,choseMore)" ' +
                                    'ng-hide="searchConfig.advancedSearchObj.moreSel == searchConfig.type">' +
                                    '<i class="iconfont"></i>多选'+
                                '</div>'+
                            '</div>'+
                        '</div>',
            link : function (scope,ele,attr) {
                //scope.test =true;
                var searchConfig = scope.searchConfig;
                scope.tmpData ={};
                scope.inputSearch= function (keyword) {
                    var searchDataFilter = searchConfig.searchData.data;
                    searchConfig.searchData.globalShow = [];
                    for(var i= 0,j=searchDataFilter.length;i<j;i++){
                        if(searchDataFilter[i].name.indexOf(keyword) !== -1){
                            console.log(searchDataFilter[i].name);
                            searchConfig.searchData.globalShow.push(searchDataFilter[i]);
                        }
                    }
                };
                //确定多选按钮
                scope.successOperate = function (){
                    searchConfig.searchOrderListCollect[searchConfig.field] = scope.tmpData[searchConfig.field];
                    searchConfig.searchConditionsCollect[searchConfig.field] = scope.tmpData[searchConfig.field];
                    searchConfig.advancedSearchObj.moreShow = false;
                    searchConfig.searchData.globalShow = searchConfig.searchData.defaultShow;
                };

                //选中多选状态
                scope.choseMore = function () {
                    searchConfig.searchData.globalShow = searchConfig.searchData.data;
                };

                //取消多选
                scope.cancleSearchData = function () {
                    delete searchConfig.searchOrderListCollect[searchConfig.field];
                    searchConfig.searchData.globalShow = searchConfig.searchData.data;
                };

                //收起更多展示默认的前几条数据
                scope.moreShowCallback = function () {
                    searchConfig.searchData.globalShow = searchConfig.searchData.defaultShow;
                };
                //将选中的数据添加到要展示选中数据的单元中
                scope.isLabelSelect = function (myEvent,res) {
                    console.log(searchConfig);
                    var data = {
                        name : res.name,
                        type : searchConfig.title,
                        val : res.id
                    };
                    var iClass = $(myEvent.target).closest('label').find('i.icon-sel');
                    //选中对应的状态
                    if (!iClass.hasClass('icon-sel-zhengque')) {
                        //单选情况
                        if(!searchConfig.advancedSearchObj.moreSel){
                            searchConfig.searchStatus = true;
                            iClass.parent('label').siblings().find('i.icon-sel-zhengque').removeClass('icon-sel-zhengque');
                            searchConfig.searchOrderListCollect[searchConfig.field] = [data];
                            searchConfig.searchConditionsCollect[searchConfig.field] = [data];
                            searchConfig.advancedSearchObj.moreShow = false;
                            searchConfig.searchOrderListCollect[searchConfig.field].globalShow = searchConfig.searchOrderListCollect[searchConfig.field].defaultShow;
                        }else{
                            searchConfig.searchData.moreSelect = true;
                        //多选情况
                            console.log(searchConfig.field in scope.tmpData);
                            if(searchConfig.field in scope.tmpData){
                                scope.tmpData[searchConfig.field].push(data);
                            }else{
                                scope.tmpData[searchConfig.field] = [data];
                            }
                        }
                        iClass.addClass('icon-sel-zhengque');
                    //取消对应的选中状态
                    } else {
                        var tmpData = [];
                        var searchData = searchConfig.searchOrderListCollect[searchConfig.field];
                        //第二次点击取消多选选中的内容
                        for(var i = 0,j = searchData.length;i < j;i++){
                            if(searchData[i].name != data.name){
                                tmpData.push(searchData[i]);
                            }
                        }
                        if(tmpData.length){
                            searchConfig.searchOrderListCollect[searchConfig.field] = tmpData;
                        }else{
                            delete searchConfig.searchOrderListCollect[searchConfig.field];
                        }
                        iClass.removeClass('icon-sel-zhengque');
                    }
                };
                //更多选项里面配置数据
                scope.letterList = {
                    data : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
                    chose : ''
                };
                //选中一个字母，则对应的以该字母开头的数据展示出来
                scope.selectStoresByFirstLetter = function (letter,type) {
                    var ele = searchConfig.searchData;
                    //选中店铺，则设置相应状态
                    if(scope.letterList.chose != letter){
                        scope.letterList.chose = letter;
                        ele.globalShow = ele[letter];
                    }else{
                        scope.letterList.chose = '';
                        ele.globalShow = ele.data;
                    }
                }
            }
        }
    });
    //.directive('textField', function () {
    //    return {
    //        restrict : 'E',
    //        scope : {
    //
    //        }
    //    }
    //});