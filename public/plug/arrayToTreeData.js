/**
 * Created by huangbiao on 2017/4/6.
 * @description 将离散的数组转为树形结构，需要识别JSON 对象的 id  和  parentid
 * @simple
 var resourceData={data:[{code:"01",createdate:"2017-03-31 16:00:54",id:"fbb9c872-2bdd-4cc5-af17-0145794c81bb",level:3,name:"01",parentid:"84795730-c95e-49d1-9e2c-e86a6450844a"},{code:"02",createdate:"2017-03-31 16:00:17",id:"400eeed5-91fa-4b2f-9215-0f566e72fdb5",level:0,name:"中国",parentid:"00000000-0000-0000-0000-000000000000"},{code:"002",createdate:"2017-03-22 16:11:57",id:"e875e0ee-61dc-460f-84cd-71af9f4e10eb",level:0,name:"连衣裙",parentid:"00000000-0000-0000-0000-000000000000"},{code:"001",createdate:"2017-03-22 16:11:40",id:"69568003-5c26-4536-b926-fa94609fddef",level:2,name:"上衣11",parentid:"36c18eba-6bf3-44e8-bd41-332ba3e12e09"},{code:"001",createdate:"2017-03-22 16:11:22",id:"36c18eba-6bf3-44e8-bd41-332ba3e12e09",level:1,name:"女装",parentid:"f1b0d02b-1b67-4211-a259-4f67d18c8a5d"},{code:"kelly",createdate:"2017-03-22 16:11:05",id:"f1b0d02b-1b67-4211-a259-4f67d18c8a5d",level:0,name:"kelly",parentid:"00000000-0000-0000-0000-000000000000"},{code:"shouji",createdate:"2017-03-14 21:04:59",id:"6ba7d3e8-8fd6-4f72-af47-0603f1dddd06",level:2,name:"shouji1",parentid:"ae208807-a2aa-484d-b0ba-7217a75d8f03"},{code:"test-1",createdate:"2017-03-14 13:55:28",id:"953afbfe-d628-4fa3-85b6-a293fdf780b0",level:3,name:"test-12",parentid:"b5f57169-f126-47f2-807a-c07d14cb81e0"},{code:"NX",createdate:"2017-02-15 17:34:09",id:"7A0CE997-7FAB-4D23-9417-53636B9B0EBC",level:2,name:"男鞋",parentid:"25040879-C536-406D-8E34-F692284DB825"},{code:"Mario_running",createdate:"2017-02-06 19:41:21",id:"84795730-C95E-49D1-9E2C-E86A6450844A",level:2,name:"Mario_running",parentid:"07A378B3-5329-48E5-9398-682A9C7D3CAB"},{code:"Mario_basketball",createdate:"2017-02-06 19:41:00",id:"B5F57169-F126-47F2-807A-C07D14CB81E0",level:2,name:"Mario_basketball",parentid:"07A378B3-5329-48E5-9398-682A9C7D3CAB"},{code:"Mario_sport",createdate:"2017-02-06 19:40:24",id:"07A378B3-5329-48E5-9398-682A9C7D3CAB",level:1,name:"Mario_sport",parentid:"01B3F746-498C-4878-9615-24981A9836E8"},{code:"Mario",createdate:"2017-02-06 19:40:06",id:"01B3F746-498C-4878-9615-24981A9836E8",level:0,name:"Mario",parentid:"00000000-0000-0000-0000-000000000000"},{code:"sj001",createdate:"2016-11-02 19:33:38",id:"AE208807-A2AA-484D-B0BA-7217A75D8F03",level:1,name:"手机",parentid:"8792CF44-F095-4963-AF55-C5316C860E51"},{code:"x00012",createdate:"2016-11-02 19:32:39",id:"49434F85-BC57-4D7E-88D4-32DEB6E03076",level:2,name:"运动鞋",parentid:"25040879-C536-406D-8E34-F692284DB825"},{code:"x00011",createdate:"2016-11-02 19:32:11",id:"4B458FE0-7FB5-4BC8-ADEC-344961944FF7",level:2,name:"皮鞋",parentid:"25040879-C536-406D-8E34-F692284DB825"},{code:"x001",createdate:"2016-11-02 19:31:51",id:"25040879-C536-406D-8E34-F692284DB825",level:1,name:"鞋",parentid:"09F69779-59A4-42EC-BC76-3C0CCCAC1853"},{code:"67",createdate:"2016-10-22 15:26:54",id:"03E7D1EB-B3CA-4993-B19D-2B4994A8091D",level:4,name:"433",parentid:"A71B3EA2-CA44-482E-97EE-3429FE668984"},{code:"3C",createdate:"2016-06-22 14:31:30",id:"8792CF44-F095-4963-AF55-C5316C860E51",level:0,name:"3C",parentid:"00000000-0000-0000-0000-000000000000"},{code:"0008`",createdate:"2016-05-27 14:22:05",id:"A71B3EA2-CA44-482E-97EE-3429FE668984",level:3,name:"22223",parentid:"578C8E16-4EB5-4827-8FC4-CD37E98205BD"},{code:"35",createdate:"2016-05-21 08:57:31",id:"578C8E16-4EB5-4827-8FC4-CD37E98205BD",level:2,name:"裙子",parentid:"5F58D314-42DA-4108-8C13-4018289CBAB2"},{code:"34",createdate:"2016-05-21 08:57:22",id:"704A9822-196B-4093-8353-726D7247813E",level:2,name:"女裤",parentid:"5F58D314-42DA-4108-8C13-4018289CBAB2"},{code:"33",createdate:"2016-05-21 08:57:12",id:"0E8F59EF-EE67-4121-8C0B-FB3F9EB40529",level:2,name:"女上衣",parentid:"5F58D314-42DA-4108-8C13-4018289CBAB2"},{code:"32",createdate:"2016-05-21 08:57:03",id:"5F483DC8-8B7E-417F-A95B-539528C66964",level:2,name:"男裤",parentid:"B71EE1FA-50DB-4128-91C3-E63E79020465"},{code:"31",createdate:"2016-05-21 08:56:51",id:"C0D359C8-02D7-4299-B954-4059CB6D4197",level:2,name:"男上衣",parentid:"B71EE1FA-50DB-4128-91C3-E63E79020465"},{code:"22",createdate:"2016-05-21 08:56:23",id:"5F58D314-42DA-4108-8C13-4018289CBAB2",level:1,name:"女装",parentid:"09F69779-59A4-42EC-BC76-3C0CCCAC1853"},{code:"21",createdate:"2016-05-21 08:56:14",id:"B71EE1FA-50DB-4128-91C3-E63E79020465",level:1,name:"男装",parentid:"09F69779-59A4-42EC-BC76-3C0CCCAC1853"},{code:"01",createdate:"2016-05-21 08:56:03",id:"09F69779-59A4-42EC-BC76-3C0CCCAC1853",level:0,name:"鞋服",parentid:"00000000-0000-0000-0000-000000000000"}],deleted:false,errorCode:0,"new":false,success:true,update:false};
 var resourceData={data:[{id:1,name:"乐云",pid:0,parentid:0},{id:2,name:"软件",pid:1,parentid:1},{id:3,name:"网站",pid:1,parentid:1},{id:4,name:"移动应用",pid:1,parentid:1},{id:5,name:"乐云小猪",parentid:2,pid:2},{id:6,name:"乐云短信平台",pid:3,parentid:3},{id:7,name:"真郑州",pid:3,parentid:3},{id:8,name:"乐云软语",pid:3,parentid:3},{id:9,name:"乐盘",pid:3,parentid:3},{id:10,name:"乐云手机小助",pid:4,parentid:4}]};

 new originArrayToTreeData(resourceData.data);
 */
;(function(WINDOW){

    var IsToos = {
        /**
         * Object.prototype.toString 方法返回一个表示该对象的字符串
         所有的对象继承Object类，只是覆盖了 toString 方法
         因此调用 Object.prototype.toString 就能返回数据类型
         * @param checkedData 被检测数据
         * @returns {string}
         * @example
         * var argsTag = '[object Arguments]',
         arrayTag = '[object Array]',
         asyncTag = '[object AsyncFunction]',
         boolTag = '[object Boolean]',
         dateTag = '[object Date]',
         errorTag = '[object Error]',
         funcTag = '[object Function]',
         genTag = '[object GeneratorFunction]',
         numberTag = '[object Number]',
         objectTag = '[object Object]',
         proxyTag = '[object Proxy]',
         regexpTag = '[object RegExp]',
         stringTag = '[object String]';
         */
        checkDataType: function (checkedData){
            return Object.prototype.toString.call(checkedData);
        },

        /**
         * 判断是否 Arguments 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isArguments : function(obj){
            if('[object Arguments]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 AsyncFunction 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isAsyncFunction : function(obj){
            if('[object AsyncFunction]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 String 对象
         * @param obj 被检测数据
         * @returns {boolean}
         * @example
         *
         * var name = "黄彪";
         * var simpleDemo = inherit(BaseClassExtend.prototype);
         * alert(simpleDemo.isString(name));
         */
        isString : function(obj){
            if('[object String]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 RegExp 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isRegExp : function(obj){
            if('[object RegExp]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 Proxy 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isProxy : function(obj){
            if('[object Proxy]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },


        /**
         *  判断是否 Object 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isObject : function(obj){
            if('[object Object]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 Number 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isNumber : function(obj){
            if('[object Number]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 GeneratorFunction 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isGeneratorFunction : function(obj){
            if('[object GeneratorFunction]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 Function 对象
         * @param obj 被检测数据
         * @returns {boolean}
         * @example
         *
         *  function abc(){}
         *  var simpleDemo = inherit(BaseClassExtend.prototype);
         *  alert(simpleDemo.isFunction(abc));
         */
        isFunction : function(obj){
            if('[object Function]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 Error 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isError : function(obj){
            if('[object Error]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 Array 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isArray : function(obj){
            if('[object Array]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 Boolean 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isBoolean : function(obj){
            if('[object Boolean]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        },

        /**
         *  判断是否 Date 对象
         * @param obj 被检测数据
         * @returns {boolean}
         */
        isDate : function(obj){
            if('[object Date]' == this.checkDataType(obj)){
                return true;
            }
            return false;
        }
    };

    function cloneObj(obj){
        var newObj = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (var key in obj) {
            var val = obj[key];
            //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
            newObj[key] = typeof val === 'object' ? this.cloneObj(val): val;
        }
        return newObj;
    }

    function obj2str(o) {
        var r = [];
        if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
        if (typeof o == "undefined") return "undefined";
        if (typeof o == "object") {
            if (o === null) return "null";
            else if (!o.sort) {
                for (var i in o)
                    r.push(i + ":" + obj2str(o[i]))
                r = "{" + r.join() + "}"
            } else {
                for (var i = 0; i < o.length; i++)
                    r.push(obj2str(o[i]))
                r = "[" + r.join() + "]"
            }
            return r;
        }
        return o.toString();
    }

    Number.prototype.toLowerCase = function(){
        return this;
    };

    Number.prototype.toUpperCase = function(){
        return this;
    };

    /**
     * 对外暴露的方法
     */
    function originArrayToTreeData(resourceData){
        // 对原始数据做校验
        resourceData = this.invalidateRes(resourceData);

        //1、 将从发送ajax请求的数据全部转为json对象
        var classesObject = this.resourceDataArrayToJson(resourceData);
        // 2、获取数据的顶级节点
        var topNodes = this.getTopNodes(resourceData,classesObject);
        console.dir(topNodes);
        // 3、 分类原始数据，获取所有含有子节点的数据
        var prarentClassesObj = this.getPrarentClassesObjs(resourceData,classesObject);
        console.dir(prarentClassesObj);
        // 4、从顶级节点递归
        var result = this.recursionData(topNodes,prarentClassesObj);

        return result;
    }

    originArrayToTreeData.prototype = {
        /**
         * 对原始数据做校验
         * 1、如果没有 parentid ,则添加 parentid
         */
        invalidateRes : function(resourceDataArray){
            var length = resourceDataArray.length;
            for (var i = 0; i < length; i++) {
                var currentObj = resourceDataArray[i];
                if(currentObj["parentid"] === undefined || currentObj["parentid"] == null){
                    currentObj["parentid"] = "";
                }
            }
            return resourceDataArray;
        },
        //1、 将从发送ajax请求的数据全部转为json对象
        resourceDataArrayToJson: function (resourceDataArray) {
            var result = {};
            var length = resourceDataArray.length;
            for (var i = 0; i < length; i++) {
                var currentObj = resourceDataArray[i];
                var id = currentObj.id.toLowerCase();
                result[id] = currentObj;
            }
            return result;
        },

        // 2、获取数据的顶级节点
        getTopNodes: function (resourceDataArray,classesObject) {
            var topNodes = [];
            var length = resourceDataArray.length;
            for (var i = 0; i < length; i++) {
                var currentObj = resourceDataArray[i];
                var parentId = currentObj.parentid.toLowerCase();
                if (classesObject[parentId] === undefined) {
                    topNodes.push(currentObj)
                }
            }
            return topNodes;
        },

        // 3、 分类原始数据，获取所有含有子节点的数据
        getPrarentClassesObjs: function (resourceDataArray, classesObject) {
            //	var classesObject = cloneObj(classesObject);
            var length = resourceDataArray.length;
            for (var i = 0; i < length; i++) {
                var currentObj = resourceDataArray[i];
                var parentId = currentObj.parentid.toLowerCase();
                var id = currentObj.id.toLowerCase();
                // 如果当前节点的父亲节点属于查询的节点范围，则记录当前节点
                if (classesObject[parentId] != undefined) {
                    if (classesObject[parentId]["children"] === undefined) {
                        classesObject[parentId]["children"] = [];
                    }
                    classesObject[parentId]["children"].push(currentObj)
                }
            }
            return classesObject;
        },

        // 4、从顶级节点递归
        recursionData: function (topNodes,prarentClassesObj) {
            var result = [];
            var length = topNodes.length;
            for (var i = 0; i < length; i++) {
                var topNodesId = topNodes[i]["id"].toLowerCase();
                /*console.log("topNodesId : " + topNodesId);
                console.log(obj2str(prarentClassesObj[topNodesId]));*/
                result.push(prarentClassesObj[topNodesId]);
            }
            return result;
        }
    };

    WINDOW.originArrayToTreeData = originArrayToTreeData;

})(window);


