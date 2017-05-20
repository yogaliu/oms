/**
 * 创建了一个indexController
 * */
angular.module("klwkOmsApp")
	.controller('indexController', ["$scope","$rootScope","$q",function($scope,$rootScope,$q) {
		//页面跳转传参
		$rootScope.params = {};
		//字母列表
		$scope.wordList = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		//分类类型
		$rootScope.classificationtype = [
			{'id':1,'name':"退换货类型"},
			{'id':2,'name':"商品品牌"},
			{'id':3,'name':"生产方式"},
			{'id':4,'name':"商品主题"},
			{'id':5,'name':"商品年份"},
			{'id':6,'name':"商品季节"},
			{'id':7,'name':"商品单位"},
			{'id':8,'name':"商品款型"},
			{'id':9,'name':"会员标记"},
			{'id':10,'name':"退换货标记"},
			{'id':11,'name':"取消交易类型"},
			{'id':12,'name':"订单标记"},
			{'id':13,'name':"退款类型"},
			{'id':14,'name':"商品自定义属性"},
			{'id':15,'name':"自动审单用语"},
			{'id':16,'name':"价格区间"},
			{'id':17,'name':"调拨类型"},
			{'id':18,'name':"采购类型"},
			{'id':19,'name':"订单便签"},
			{'id':20,'name':"退款申请标记"},
			{'id':21,'name':"变价原因"},
			{'id':22,'name':"活动类型"},
			{'id':23,'name':"退款自动审核原因"},
			{'id':24,'name':"会员等级"},
			{'id':25,'name':"发票行业类型"},
			{'id':26,'name':"采购退货原因"},
			{'id':27,'name':"出库类型"},
			{'id':28,'name':"入库类型"},
			{'id':29,'name':"唯品承运商"},
			{'id':30,'name':"借调类型"},
			{'id':31,'name':"到货时间"},
			{'id':32,'name':"明细退货原因"},
			{'id':33,'name':"币种"}
		];
		/**
		 * 选中全部行
		 */
		$scope.selectAll = function (e) {
			var obj = $(e.target);
			if(obj.closest('th').find('.klwk-check').length > 0){
				obj.closest('table').find('.klwk-check').removeClass('klwk-check').addClass('klwk-check-x');
			}else if(obj.closest('th').find('.klwk-check-x').length > 0){
				obj.closest('table').find('.klwk-check-x').removeClass('klwk-check-x').addClass('klwk-check');
			}
		};
		/**
		 * 选中单行
		 */
		$scope.selectOne = function (e) {
			var obj = $(e.target);
			if(obj.closest('td').find('.klwk-check').length > 0){
				obj.closest('td').find('.klwk-check').removeClass('klwk-check').addClass('klwk-check-x');
			}else if(obj.closest('td').find('.klwk-check-x').length > 0){
				obj.closest('td').find('.klwk-check-x').removeClass('klwk-check-x').addClass('klwk-check');
			}
		};

	}]);