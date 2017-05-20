/**
 * Created by lc on 2017/4/18.
 */

angular.module("klwkOmsApp")
    .factory('loginService', ["ApiService","WAP_CONFIG","APP_COLORS","APP_MENU","$state","$rootScope",function(ApiService,WAP_CONFIG,APP_COLORS,APP_MENU,$state,$rootScope){
        /**
         * 登陆
         */
        var login = function (obj,scope){
            var url = "/System/Login";
            var param = {
                "LoginName" : obj.userName,
                "Password" : obj.passWord,
                "TimeStamp" : ApiService.getMd5code.timestamp,
                "sign" : ApiService.getMd5code.code,
                "Version" : '',
                "Session" : ''
            }
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    sessionStorage.setItem('userInfo',JSON.stringify(res.data.user));
                    APP_COLORS.UserId = res.data.user.id;
                    APP_COLORS.LoginKey = res.data.user.userLoginKey;
                    APP_COLORS.username = res.data.user.username;

                    getUserAll(scope,function () {
                        $state.go("index.orderList");
                    })

                }
            });
        };

        /**
         * 获取系统配置
         */
        var getSystemConfig = function (obj,scope){
            var url = "/BasicInformation/SystemConfig/GetSystemConfig";
            var param = {
                "LoginName" : obj.userName,
                "Password" : obj.passWord,
                "TimeStamp" : ApiService.getMd5code().timestamp,
                "sign" : ApiService.getMd5code().code,
                "Version" : WAP_CONFIG.version,
                "Session" : ''
            }
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    sessionStorage.setItem('systemConfig',JSON.stringify(res.data))
                    APP_COLORS.systemConfig = res.data;
                }
            });
        };

        /**
         * 获取用户权限
         */
        var getUserAll = function (scope,_callBack){
            var url = "/BasicInformation/Privilege/UserAll";
            var param = {
                "UserId" : APP_COLORS.UserId,
                "UserName" : APP_COLORS.username,
                "TimeStamp" : ApiService.getMd5code().timestamp,
                "sign" : ApiService.getMd5code().code,
                "Version" : WAP_CONFIG.version,
                "LoginKey": APP_COLORS.LoginKey,
                "Session" : '',
                "CompanyId": '',
                "Token" :''
            }
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    /*存储用户所有权限*/
                    APP_COLORS.userPower = klwTool.arrayToJson(res.data,'objectid');

                    /*存储用户菜单权限*/
                    APP_COLORS.userMenu=[];
                    $.each(res.data,function (index,obj) {
                        if(obj.type == '101'){
                            APP_COLORS.userMenu.push(obj);
                        }
                    })
                    APP_COLORS.userMenu = klwTool.arrayToJson(APP_COLORS.userMenu,'objectid');

                    /*获取所有菜单权限*/
                    getMenu(scope,_callBack);
                };
            });
        };

        /**
         *  获取菜单
         */
        var getMenu = function (scope,_callBack){
            var url = "/BasicInformation/Menu/GetWeb";
            var param = {
                "UserId" : APP_COLORS.UserId,
                "UserName" : APP_COLORS.username,
                "TimeStamp" : ApiService.getMd5code().timestamp,
                "sign" : ApiService.getMd5code().code,
                "Version" : WAP_CONFIG.version,
                "LoginKey": APP_COLORS.LoginKey,
                "Session" : '',
                "CompanyId": '',
                "Token" :''
            }
            var promise = ApiService.post(url,param);
            promise.then(function(res){
                if(res.success){
                    APP_COLORS.menuPower=[];
                    /*根据用户菜单权限获取菜单*/
                    $.each(res.data,function (index ,menuPower) {
                        $.each( APP_COLORS.userMenu,function (index ,userMenu) {
                            if(userMenu.objectid == menuPower.id){
                                APP_COLORS.menuPower.push(menuPower);
                            };
                        })
                    })

                    $.each(APP_MENU.menuObj,function (index,obj) {
                        $.each(APP_COLORS.menuPower,function (index,menuPower) {
                            if(obj.name == menuPower.name){
                                menuPower.url = obj.url;
                            };
                        });
                    });
                    $rootScope.menuPower =  new originArrayToTreeData(APP_COLORS.menuPower);

                    /*将菜单存入session*/
                    sessionStorage.setItem("menuPower",JSON.stringify($rootScope.menuPower)) ;
                    _callBack();
                };
            });
        };

        return {
            "login" : login,
            "getSystemConfig" : getSystemConfig,
            "getUserAll" : getUserAll,
            "getMenu" : getMenu,
        };
    }]);

