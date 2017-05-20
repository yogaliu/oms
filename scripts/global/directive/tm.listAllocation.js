/**
 * 对表格的列 进行显示、隐藏、列显示的先后顺序
 * Created by huangbiao on 2017/5/10.
 */
angular.module("klwkOmsApp").directive('tmListallocation',["$timeout",function($timeout){
    return {
        restrict: 'EA',
        templateUrl:"../template/directive/tmListallocation.html",
        replace: true,
        scope: {
            allo: '='
        },
        controller:function($scope){
            // 标题列表,用来显示
            $scope.colLists = [].concat($scope.allo.theadList);
            console.log("controller");
            console.dir($scope);
        },
        link: function(scope, element, attrs,ctrl) {

            //scope.initFunc = function(){
            //    alert("init ok");
            //}

            // 将时间戳作为 导航控制面板的唯一标识
            var timeStamp = new Date().getTime();
            scope.timestamp = timeStamp;

            scope.allo.timestamp = timeStamp;

            // 获取列表控制器的唯一标识
            function getPluginId(){
                return scope.allo.timestamp;
            }

            function getIndexByKey(originArray,key){
                var length = originArray.length;
                var result = -1;
                for(var i = 0; i < length; i++){
                    var currentObj = originArray[i];
                    if(currentObj["tag"] == key){
                        result = i;
                        break;
                    }
                }
                return result;
            }

            // 获取显示指定的列 的数组标题
            function getShowItemArray(){
                var result = [];
                $("#"+getPluginId() + ".listAllocationDiv .iconfont.icon-sel-zhengque").each(function(){
                    var tempArray = $(this).attr("itemobj").split("-");
                    result.push({"tag":tempArray[0],"name":tempArray[1]})
                });
                return result;
            }

            function tableChangeAction(){
                var selectedArray = getShowItemArray();
                scope.allo.theadList.splice(0,scope.allo.theadList.length);
                for(var i = 0; i <= selectedArray.length-1;i++){
                    scope.allo.theadList.push(selectedArray[i]);
                }
                // 隐藏面板
                scope.cancelBtn();
            }

            scope.tableChangeAction = tableChangeAction;

            // var panelData = $.extend({},allo.theadList);

            //列表配置上下移动
            scope.moveBefore = function (content, index) {
                scope.colLists.moveBefore(index);
            };

            //列表配置首位或末尾移动
            scope.moveAfter = function (content, index) {
                scope.colLists.moveAfter(index);
            };

            // 移动到首位
            scope.moveFirst = function (content, index) {
                scope.colLists.moveFirst(index);
            };

            // 移动到末尾
            scope.moveLast = function (content, index) {
                scope.colLists.moveLast(index);
            };

            // 是否显示
            scope.toggleShow = function(myevent,index){
                var currentObj = $(myevent.target);
                var tempObj = scope.colLists[index];

                currentObj.toggleClass("icon-sel-zhengque");

                // 如果让其不选中
                //if(currentObj.hasClass("icon-sel-zhengque")){
                //    var tempIndex = getIndexByKey(scope.allo.theadList, tempObj.tag);
                //    scope.allo.theadList.splice(tempIndex,1);
                //    currentObj.toggleClass("icon-sel-zhengque");
                //}else{
                //    currentObj.toggleClass("icon-sel-zhengque");
                //    var selectedArray = getShowItemArray();
                //    scope.allo.theadList.splice(0,scope.allo.theadList.length);
                //    for(var i = 0;i<selectedArray.length-1;i++){
                //        scope.allo.theadList.push(selectedArray[i]);
                //    }
                //}

            };

            // 取消按钮
            scope.cancelBtn = function(){
               // allo.isListAllocation(false,$event)
                $("#" + getPluginId()).hide();
            };
        }


    }
}]);
