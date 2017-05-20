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
            template : '<div class="searchItem" ng-hide="!!configData.chosed[configData.filed] || configData.disabled">'+
                        '<span class="title">{{configData.title}}</span>'+
                        '<div class="options">'+
                        '<span ng-click="conditionSetting(name,value)"' +
                                'ng-repeat="(value,name) in configData.list">'+
                        '{{name}}'+
                        '</span>'+
                        '</div>'+
                        '</div>',
            link : function (scope,ele,attrs) {
                var serarchCondition = scope.configData;
                //筛选条件单选选中
                scope.conditionSetting = function (name,value) {
                    serarchCondition.chosed[serarchCondition.filed] = {
                        title : serarchCondition.title,
                        value : value,
                        name : name,
                        filed : serarchCondition.filed
                    };
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
            template : '<div class="searchItem" ng-hide="!!searchConfig.chosed[searchConfig.filed] || searchConfig.moreChose || searchConfig.isShow || searchConfig.disabled">' +
                            '<span class="title">{{searchConfig.title}}</span>' +
                            '<div class="options">' +
                                '<span ng-click="filterContionSelect(searchName,searchConfig.title)" ng-repeat="searchName in searchConfig.list.defaultShow">'+
                                '{{searchName.name}}'+
                                '</span>' +
                            '</div>' +
                            '<div class="more">' +
                                '<div class="btn klwk-spread" ng-if="searchConfig.selectMore == true" ng-click="isMoreShow(searchConfig.filed,$event)">更多<i class="iconfont"></i></div>'+
                                '<div class="btn check-box" ng-if="searchConfig.Multiselect == true" ng-click="choseMore(searchConfig.filed)"><i class="iconfont"></i>多选</div>'+
                            '</div>'+
                        '</div>',
            link : function (scope,ele,attr) {
                var searchConfig = scope.searchConfig;

                //默认显示单选状态
                scope.moreShow = searchConfig.filed;

                //单选状态的筛选条件被选中
                scope.filterContionSelect = function (searchName,title) {
                    //将筛选条件隐藏
                    scope.moreShow = false;
                    searchConfig.isShow = false;
                    //将选中的数据添加到要展示已选中的筛选条件的对象当中
                    searchConfig.chosed[searchConfig.filed] = {
                        title : title,
                        value : searchName.id,
                        name : searchName.name,
                        filed : searchConfig.filed
                    };
                };

                //展开更多
                scope.isMoreShow = function (moreContent,myEvent) {
                    searchConfig.moreChose = false;
                    scope.moreShow = false;
                    searchConfig.isShow = true;
                    searchConfig.moreShow = moreContent;
                    searchConfig.list.globalShow = searchConfig.list.data;
                };

                //选中多选状态
                scope.choseMore = function (MultiselectContent) {
                    scope.moreShow = false;
                    searchConfig.isShow = true;
                    searchConfig.moreShow = MultiselectContent;
                    searchConfig.moreChose = MultiselectContent;
                    //显示全部数据
                    searchConfig.list.globalShow = searchConfig.list.data;
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
            template : '<div class="searchItem spread" ng-show="(searchConfig.moreShow == searchConfig.filed) && !searchConfig.disabled">' +
                        '<span class="title">{{searchConfig.title}}</span>'+
            '<div class="options">' +
                        '<input class="klw-search" ng-change="inputSearch(keyword)" ng-model="keyword"' +
                            'ng-if="searchConfig.letterClassify == true"  type="text" placeholder="{{searchConfig.placeHold}}">' +
                            '<div class="wordSearch" ng-if="searchConfig.letterClassify == true">'+
                                '<span>所搜的{{searchConfig.title}}</span>' +
                                '<span class="singleWord" ng-click="showAllStatus()">全部</span>' +
                                '<span class="singleWord"' +
                                    'ng-click="selectStoresByFirstLetter(letter,searchConfig.field)"'+
                                    'ng-repeat="letter in letterList.data"'+
                                    'ng-class="{greenSpan : (letterList.chose == letter)}">'+
                                    '{{letter}}'+
                                '</span>'+
                            '</div>'+
                            '<div class="spreadContent">'+
                                '<label ng-click="isLabelSelect($event,orderType)"'+
                                    'ng-class="{\'greenSpan\' : orderType.chosed}"'+
                                    'ng-repeat="orderType in searchConfig.list.globalShow">'+
                                    '<i ng-if="searchConfig.moreChose == searchConfig.filed" ' +
                                        'class="icon-sel iconfont"' +
                                        'ng-class="{\'icon-sel-zhengque\':orderType.chosed}"></i>'+
                                    '{{orderType.name}}'+
                                '</label>'+
                            '</div>'+
                            '<div class="spreadFooterBtn" ng-show="searchConfig.advancedSearchObj.moreSel == searchConfig.type ">'+
                                '<button class="btn btn-success btn-78" ng-click="comfirm()">确定</button>'+
                                '<button class="btn btn-default btn-78" ng-click="cancle()">取消</button>'+
                            '</div>'+
                        '</div>'+
                            '<div class="more">'+
                                '<div class="btn klwk-spread" ' +
                                    // 'ng-hide="searchConfig.advancedSearchObj.moreSel == searchConfig.type" ' +
                                    'ng-click="cancle()">收起' +
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
                var searchConfig = scope.searchConfig;
                //本地搜索
                scope.inputSearch= function (keyword) {
                    var searchDataFilter = searchConfig.list.data;
                    searchConfig.list.globalShow = [];
                    for(var i= 0,j=searchDataFilter.length;i<j;i++){
                        if(searchDataFilter[i].name.indexOf(keyword) !== -1){
                            searchConfig.list.globalShow.push(searchDataFilter[i]);
                        }
                    }
                };

                //收起更多展示默认的前几条数据
                scope.moreShowCallback = function () {
                    searchConfig.searchData.globalShow = searchConfig.searchData.defaultShow;
                };

                //确定选中
                scope.comfirm = function () {
                    //单选状态
                    if(!searchConfig.moreChose){
                        //循环查询是否有被选中的状态
                        for(var i = 0,j = searchConfig.list.globalShow.length;i <j;i++){
                            if(searchConfig.list.globalShow[i].chosed){
                                searchConfig.chosed[searchConfig.filed] = {
                                    title : searchConfig.title,
                                    value : searchConfig.list.globalShow[i].id,
                                    name : searchConfig.list.globalShow[i].name,
                                    filed : searchConfig.filed
                                };
                                searchConfig.list.globalShow[i].chosed = false;
                                break;
                            }
                        }

                    }else{//多选状态
                        var value = [];
                        var name = [];
                        var count = 0;
                        //循环查询是否有被选中的状态
                        for(var i = 0,j = searchConfig.list.globalShow.length;i <j;i++){
                            if(searchConfig.list.globalShow[i].chosed){
                                count++;
                                value.push(searchConfig.list.globalShow[i].id);
                                name.push(searchConfig.list.globalShow[i].name);
                                searchConfig.isShow = true;
                                searchConfig.list.globalShow[i].chosed = false;
                            }
                        }
                        //如果count大于0表示有选中的
                        if(count  > 0){
                            //将选中的添加到对象中
                            searchConfig.chosed[searchConfig.filed] = {
                                title : searchConfig.title,
                                value : value.join(','),
                                name : name.join(','),
                                filed : searchConfig.filed
                            };
                        }
                    }
                    searchConfig.moreShow = false;
                    searchConfig.moreChose = false;
                    searchConfig.isShow = false;
                };

                //取消选中
                scope.cancle = function () {
                    searchConfig.moreShow = false;
                    searchConfig.isShow = false;
                    searchConfig.moreChose = false;
                    for(var i = 0,j = searchConfig.list.globalShow.length;i <j;i++){
                        searchConfig.list.globalShow[i].chosed = false;
                    }
                };

                //将选中的数据添加到要展示选中数据的单元中
                scope.isLabelSelect = function (myEvent,status) {

                    //单选状态
                    if(!searchConfig.moreChose){
                        //将选中的那个状态变成已选中状态
                        status.chosed = true;
                        //循环将其它已选中的状态取消
                        for(var i = 0,j = searchConfig.list.globalShow.length;i <j;i++){
                            if(searchConfig.list.globalShow[i] != status){
                                searchConfig.list.globalShow[i].chosed = false;
                            }
                        }
                    }else{//多选状态
                        status.chosed = !status.chosed;
                    }
                };

                //更多选项里面配置数据
                scope.letterList = {
                    data : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
                    chose : ''
                };
                //选中一个字母，则对应的以该字母开头的数据展示出来
                scope.selectStoresByFirstLetter = function (letter,type) {
                    var ele = searchConfig.list;
                    //选中店铺，则设置相应状态
                    if(scope.letterList.chose != letter){
                        scope.letterList.chose = letter;
                        ele.globalShow = ele[letter];
                    }else{
                        scope.letterList.chose = '';
                        ele.globalShow = ele.data;
                    }
                };

                //显示全部状态
                scope.showAllStatus = function () {
                    searchConfig.list.globalShow = searchConfig.list.data;
                };
            }
        }
    });
