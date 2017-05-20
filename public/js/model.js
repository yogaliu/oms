

window.Model = (function(){

    // 原始数据
    var ORIGIN_CACHE = "originCache";
    var ORIGIN_DATA = "originData";
    // 行列转换的数据
    var ROW_TO_COLUMN_DATA = "rowToColumnData";

    // 定义的一个工具类
    var Util = function(){};
    Util.prototype = {

        // 判断对象是否为空
        isEmptyObject : function(obj){
            for(var key in obj){
                break;  return false
            };
            return true;
        },
        // 获取Json的长度
        getJsonLength: function (jsonData) {
            var jsonLength = 0;
            for(var item in jsonData){
                jsonLength++;
            }
            return jsonLength;
        },
        /**
         * 如果字符串为 空、null、 undefined 则表示是无效的，返回true
         * @param checkedStr 被检测的字符串
         */
        isInvalidStr : function(checkedStr){
            if(checkedStr == "" || checkedStr == undefined || checkedStr == null ){
                return true;
            }
            return false;
        },

        /**
         * 打印字符串
         */
        log: function (obj) {
            console.log(obj);
        },
        /**
         * 打印错误的方法
         */
        logError: function (obj) {
            console.error(obj);
        },
        /**
         * 打印对象
         */
        logDir : function(obj){
            console.dir(obj);
        },
        test : function(){
            alert("test");
        }
    };


    /**
     * 定义一个缓存工厂类
     */
    var CacheFactory = function(){
        // cacheFactoryObj 是缓存的顶级节点，所有的数据全部缓存到该对象中
        var cacheFactoryObj = {};
        cacheFactoryObj[ORIGIN_CACHE] = {};
        //获取 cacheFactoryObj 对象
        this.getCacheFactoryObj = function(){
            return cacheFactoryObj;
        };
    };
    /**
     * 定义 缓存工厂类 有的属性
     */
    CacheFactory.prototype = {
        util : new Util(),
        /**
         * 创建一个缓存对象，需要传递一个 cacheName，作为唯一标识
         * @param cacheName
         */
        createCacheObj:function(cacheName){
            var cacheFactoryObj = this.getCacheFactoryObj();
            if(cacheName in cacheFactoryObj){
                logError("该缓存对象已经存在，请重新添加");
                return false;
            }

            // 检查用户输入的字符串是否是有效的，如果是有效的，则创建一个cache对象
            if(!util.isInvalidStr(cacheName)){
                this.getCacheFactoryObj[cacheName] = {};
            }else{
                logError("创建cache对象传递的名字无效");
            }
        },
        /**
         * 创建一个缓存对象，需要传递一个 cacheName，作为唯一标识
         * @param cacheName
         */
        getOriginCache : function(){
            return this.getCacheFactoryObj()[ORIGIN_CACHE];
        },
        addItem:function(key,data){},
        getItem:function(key){},

    };



    // 定义了打印字符串方法
    var log =  Util.prototype.log;
    // 定义了打印对象方法
    var logDir =  Util.prototype.logDir;
    var logError =  Util.prototype.logError;

    // 定义一个 ModelPlugin 类，用来对原始的数据做相关的操作的封装
    var ModelPlugin = function(originData){
        // 初始化执行的方法
        this.initFunc(originData);
    };

    // ModelPlugin 类的原型方法
    ModelPlugin.prototype = {
        // 继承一个工具类
        util : new Util(),
        // 获取工具对象
        getUtilObj : function(){
            return this.util;
        },

        // 添加一个缓存对象
        cacheFactory : new CacheFactory(),
        // 获取 cacheFactory 对象
        getCacheFactory : function(){
            return this.cacheFactory;
        },
        // 获取原始数据的 cache 对象
        getOriginCacheObj : function(){
            return this.cacheFactory.getOriginCache();
        },
        //

        // 数据源的标题,是一个JSON对象
        dataTitles : {},
        // 获取数据源的标题
        getDataTitles : function(){
            return this.dataTitles;
        },
        // 设置数据源的标题
        setDataTitles : function(dataTitles){
            this.dataTitles = dataTitles;
        },
        // 是否有标题名字
        hasDataTitle : function(titleName){
            if(titleName in this.dataTitles){
                return true;
            }
            return false;
        },
        // 初始化
        initSetTitles : function(originData){
            var result = {};
            var firstObj = originData[0];
            // 确定有多少列数据
            for (var key in firstObj) {
                result[key] = key;
            }
            this.setDataTitles(result);
        },


        // 行列转换 row TO colums
        rowToColumnJson : function(originData){
            var result = {};
            var firstObj = originData[0];

            // 确定有多少列数据
            for (var key in firstObj) {
                result[key] = [];
            }

            //遍历原数组
            for (var i = 0; i < originData.length; i++) {
                var currentObj = originData[i];
                for (var key in currentObj) {
                    result[key].push( originData[i][key]);
                }
            }

            return result;
        },

        /**
         * 获取某一标题的数据
         * @param title
         */
        getColumnDataByTitle : function(title){
            // 获取缓存数据的对象
            var originCacheObj = this.getOriginCacheObj();
            var titleJsonData = originCacheObj[ROW_TO_COLUMN_DATA];

            var utilObj = this.getUtilObj();
            // 如果是无效的title，则返回为一个Null
            if(utilObj.isInvalidStr(title)){
                return null;
            }else{
                return titleJsonData[title];
            }
        },

        // 创建一个对象初始化的方法
        initFunc : function(originData){
            // 将原始数据做行列转换
            var rowToColumnData =  this.rowToColumnJson(originData);
            this.initSetTitles(originData);
            // 获取默认缓存对象
            var originCacheObj = this.getOriginCacheObj();

            // 缓存原始数据
            originCacheObj[ORIGIN_DATA] = originData;
            // 将行列转换之后的数据缓存起来
            originCacheObj[ROW_TO_COLUMN_DATA] = rowToColumnData;

        }

    };

    return ModelPlugin;

})();


