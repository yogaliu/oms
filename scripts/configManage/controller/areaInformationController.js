/**
 * Created by xs on 2017/3/22.
 */
angular.module("klwkOmsApp")
    .controller("areaInformationController", ["$scope","validateService","areaInformationService" ,
        function($scope,validateService,areaInformationService) {
            //页面service
            var currentService = areaInformationService;
            //页面id
            var pageId = "#areaInformation";
            //进入页面需要执行的方法
            function init(){
                currentService.query($scope);
                $scope.creatItem = {
                    "code": "", //区域代码
                    "name": "", //区域名称
                    "zip": "" //邮编
                };
                validateService.initValidate(pageId);
            }
            init();
            /**
             * 子分类收起/隐藏
             */
            $scope.toggleExpand = function (e) {
                var obj = $(e.target);
                obj.closest('.classify').children('.classify').toggle("fast").removeClass('hide');
                obj.closest(".classify-bg").find("i").toggleClass("icon-icon_zhankaiKPA");
            };
            /**
             * 新增&修改 初始化模态框
             */
            $scope.showModal = function (obj,oprate) {
                if(oprate == 'creat'){
                    $scope.creatItem = {
                        "Id": "00000000-0000-0000-0000-000000000000",
                        "CreateDate": "0001-01-01 00:00:00",
                        "code": "", //区域代码
                        "name": "", //区域名称
                        "ParentId": obj.id, //父级id
                        "RegionLevel": obj.regionlevel + 1, //新建的子级比父级多一级
                        "zip": "", //邮编
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    };
                }else if(oprate == 'edit'){
                    $scope.creatItem = $.extend({
                        "Deleted": false,
                        "IsNew": false,
                        "IsUpdate": false
                    },obj);
                }
                validateService.clearValidateClass(pageId,"#creatModal");
                $(pageId + " #creatModal").modal('show');
            };
            /**
             * 新增第一级 初始化模态框
             */
            $scope.showAddFirst = function () {
                $scope.creatItem = {
                    "Id": "00000000-0000-0000-0000-000000000000",
                    "CreateDate": "0001-01-01 00:00:00",
                    "code": "", //区域代码
                    "name": "", //区域名称
                    "ParentId": "00000000-0000-0000-0000-000000000000",
                    "RegionLevel": 0,
                    "zip": "", //邮编
                    "Deleted": false,
                    "IsNew": false,
                    "IsUpdate": false
                };
                validateService.clearValidateClass(pageId,"#creatModal");
                $(pageId + " #creatModal").modal('show');
            };
            /**
             * 新增&新增第一级&修改
             */
            $scope.creatArea = function () {
                if(validateService.validateAll(pageId,"#creatModal")){
                    currentService.creatArea($scope);
                }
            };


    }]);