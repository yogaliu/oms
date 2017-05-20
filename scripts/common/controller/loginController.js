/**
 * Created by liaocan on 2017/4/18.
 */
angular.module("klwkOmsApp")
    .controller('loginController', ["$scope",'loginService' ,function($scope,loginService) {

        /*是否免登*/
        $scope.singleOn = function () {
            $scope.sing = ! $scope.sing;
        }

        /*登陆*/
        $scope.login=function () {
            var param = {
                "userName":$scope.userName,
                "passWord" : $scope.passWord,
            }
            /*登录*/
            loginService.login(param,$scope);
        }

}]);