/**
 * Created by xs on 2017/4/17.
 */
angular.module("klwkOmsApp").directive('menu', function ($compile) {
    return {
        restrict: 'EA',
        replace: true,

        scope: {
            expander: '=',
            children: '=',
            allMenu : '='
        },

        template: '<div class="classify" data-id="{{expander.id}}"> ' +
        '<div class="classify-bg" ng-class="{true:\'noPadding\',false:\'\'}[!!children]"> ' +
        '<span class="classify-text cf" ng-click="toggleExpand($event)">' +
        '<span class="line fl" ng-click="selectNode(expander,$event)">' +
        '<div class="klwk-check" ng-hide="expander.isdatacheck"><i class="iconfont check"></i></div>' +
        '<div class="klwk-check-x" ng-show="expander.isdatacheck"><i class="iconfont check"></i></div></span>' +
        '<i class="iconfont icon-icon_zhkairenwu_default fl" ng-if="children"></i>' +
        '<span class="fl">{{expander.name}}</span>' +
        '<span ng-if="children" class="check-all" ng-click="checkChildren(expander,$event)">选择所有子集</span>' +
        '</span></div></div>',

        link: function ($scope, elm) {
            if ($scope.expander.children) {
                var html = $compile("<menu expander='expander' all-menu='allMenu' children='expander.children' ng-repeat='expander in expander.children'></menu>")($scope);
                elm.append(html);
            }
            $('.classify > .classify').addClass('hide');
            /**
             * 子集收起/隐藏
             */
            $scope.toggleExpand = function (e) {
                var obj = $(e.target);
                obj.closest('.classify').children('.classify').toggle("fast").removeClass('hide');
                obj.closest(".classify-bg").find("i.icon-icon_zhkairenwu_default").toggleClass("icon-icon_zhankaiKPA");
            };
            /**
             * 勾选&取消勾选节点
             */
            $scope.selectNode = function (obj,e) {
                e.stopPropagation();
                if(obj.isdatacheck){
                    //取消勾选时 到最深一级子集全部取消勾选
                    obj.isdatacheck = false;
                    unSelectChildren(obj);
                }else{
                    //勾选时 到最顶层父级全部勾选
                    obj.isdatacheck = true;
                    //找到所有父级节点id
                    var idList = getParentIdsById($scope.allMenu,obj.id);
                    $.each(idList,function (i, o) {
                        //通过每层父节点的id找到父节点对象 并勾选
                        var currentObj = findObjByid($scope.allMenu,o);
                        currentObj.isdatacheck = true;
                    })
                }
            };
            function unSelectChildren(obj) {
                if(obj.children){
                    $.each(obj.children,function (i, o) {
                        o.isdatacheck = false;
                        if(o.children){
                            unSelectChildren(o);
                        }
                    })
                }
            }
            // 给一个ID，返回该ID 的所有父节点id的集合
            function getParentIdsById(originData, targetId){
                var resultArray = null;
                // 标记，判断是否已经找到，如果找到则为不继续递归查询了，否则继续递归查找
                var isFindOk = false;
                function recursion(originData, targetId,parentIdsArray){
                    // 判断是否找到了结果
                    if(!isFindOk){
                        // 判断数据源是否是数组
                        if(_.isArray(originData)) {
                            var length = originData.length;
                            for (var i = 0; i < length; i++) {
                                var currentObj = originData[i];
                                // 判断是否有父亲ID记录，如果有,则继续添加，如果没有，则创建一个空的数组，用于记录
                                if (parentIdsArray === undefined) {
                                    parentIdsArray = [];
                                }
                                // 判断当前对象的ID 是否与 目标ID 相等，如果相等，则返回路径
                                if (currentObj.id == targetId) {
                                    parentIdsArray.push(currentObj.id);
                                    resultArray = parentIdsArray;
                                    isFindOk = true;
                                }
                                else {
                                    // 判断当前对象是否有子节点，如果有，则继续递归
                                    if (currentObj.children !== undefined) {
                                        var newArray = parentIdsArray.concat([currentObj.id]);
                                        parentIdsArray.concat(recursion(currentObj.children, targetId, [].concat(newArray)));
                                    }
                                }
                            }
                        }
                    }
                }
                recursion(originData, targetId);
                return resultArray;
            }
            // 给一个ID，返回该ID 的对象，会影响到源数据
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
            /**
             * 全选所有子节点 同时勾选所有父节点
             */
            $scope.checkChildren = function (obj,e) {
                e.stopPropagation();
                obj.isdatacheck = true;
                selectChildren(obj);
                //找到所有父级节点id
                var idList = getParentIdsById($scope.allMenu,obj.id);
                $.each(idList,function (i, o) {
                    //通过每层父节点的id找到父节点对象 并勾选
                    var currentObj = findObjByid($scope.allMenu,o);
                    currentObj.isdatacheck = true;
                })
            };
            function selectChildren(obj) {
                if(obj.children){
                    $.each(obj.children,function (i, o) {
                        o.isdatacheck = true;
                        if(o.children){
                            selectChildren(o);
                        }
                    })
                }
            }

        }
    };
});