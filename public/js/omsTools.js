/**
 * @description 扩展JS 基础对象，然后对外提供一个klwTool对象，提供基本放放
 * @version v1.0
 * @author huangbiao 2017/03/29
 */
;(function(__WINDOW__){

    /****************** Array 对象扩展***********************/
    /**
     * @exports Array
     * Array 对象扩展
     * @type {{removeRepeat: Function, del: Function, indexOf: Function, contains: Function}}
     */
    Array.prototypeExtend = {
        /**
         * 去除数组中的重复项
         * @returns {Array} 返回几个新的数组
         */
        removeRepeat: function () {
            var reset = [], done = {};
            for (var i = 0; i < this.length; i++) {
                var temp = this[i];
                //这里的json对象一定要以数组的方式访问，否则会认为找不到这个对象
                if (!done[temp]) {
                    done[temp] = true;
                    reset.push(temp);
                }
            }
            return reset;
        },

        /**
         * 删除指定的数组
         * @param n
         * @returns {*}
         */
        del: function (n) {
            if (n < 0) return this;
            return this.slice(0, n).concat(this.slice(n + 1, this.length));
        },

        /**
         * 克隆当前数组
         * @returns {Array.<T>}
         */
        clone : function(){
            return  [].concat(this);
        },
        /**
         * 数组第一次出现指定元素值的位置
         * @param o
         * @returns {number}
         */
        indexOf: function (o) {
            for (var i = 0; i < this.length; i++) if (this[i] == o) return i;
            return -1;
        },

        /**
         *  检索数组元素（原型扩展或重载）
         * @param {o} 被检索的元素值
         * @type int
         * @returns 元素索引
         */
        contains: function (o) {
            var index = -1;
            for (var i = 0; i < this.length; i++) {
                if (this[i] == o) {
                    index = i;
                    break;
                }
            }
            return index;
        },

        /**
         * 从数组中删除指定值元素
         * @param val 指定元素的值
         */
        removeByValue: function (val) {
            for(var i=0; i<this.length; i++) {
                if(this[i] == val) {
                    this.splice(i, 1);
                    break;
                }
            }
        },

        /**
         * 指定数组元素往前移动一位
         * @param index
         * @returns {Array}
         * @example
         console.dir(myArray.moveBefore(6));
         console.dir(myArray.moveBefore(66));
         console.dir(myArray.moveBefore(-66));
         */
        moveBefore : function(index){
            // 如果传入的参数不是数字
            if(isNaN(index)){
                return this;
            }
            // 如果传入的参数是数字
            else{
                var myArray = this;
                var arrayLength = this.length - 1;
                // 如果传入的参数小于等于0，则不用往前移动
                if(index <= 0){
                    return this;
                }
                // 如果大于最大索引，则设置index 为最后的索引
                else if(index > arrayLength){
                    index = arrayLength;
                }

                var targetArray = myArray.splice(index,1);
                myArray.splice(index-1,0,targetArray[0]);
                return myArray;
            }
        },

        /**
         * 指定数组元素往后移动一位
         * @param index
         * @returns {Array}
         * @example
         console.dir(myArray.moveAfter(6));
         console.dir(myArray.moveAfter(66));
         console.dir(myArray.moveAfter(-66));
         */
        moveAfter : function(index){
            // 如果传入的参数不是数字
            if(isNaN(index)){
                return this;
            }
            // 如果传入的参数是数字
            else{
                var arrayLength = this.length - 1;
                var myArray = this;
                // 如果选择的索引大于最大数组长度,则返回当前对象
                if(index >= arrayLength){
                    return this;
                }
                // 如果索引小于等于0，则设置index为0
                else if(index <=0){
                    index = 0;
                }
                var targetArray = myArray.splice(index,1);
                myArray.splice(index+1,0,targetArray[0]);
                return myArray;
            }
        },

        /**
         * 指定数组元素往前移动第一位
         * @param index
         * @returns {Array}
         * @example
         console.dir(myArray.moveFirst(6));
         console.dir(myArray.moveFirst(66));
         console.dir(myArray.moveFirst(-66));
         */
        moveFirst : function(index){
            // 如果传入的参数不是数字
            if(isNaN(index)){
                return this;
            }
            // 如果传入的参数是数字
            else{
                var arrayLength = this.length - 1;
                var myArray = this;
                if(index <= 0){
                    return this;
                }
                // 如果选择的索引大于最大数组长度
                if(index >= arrayLength){
                    index = arrayLength;
                }
                var targetArray = myArray.splice(index,1);
                myArray.splice(0,0,targetArray[0]);
                return myArray;
            }
        },

        /**
         * 指定数组元素往前移动一位
         * @param index
         * @returns {Array}
         * @example
         console.dir(myArray.moveLast(6));
         console.dir(myArray.moveLast(76));
         console.dir(myArray.moveLast(-76));
         */
        moveLast : function(index){
            // 如果传入的参数不是数字
            if(isNaN(index)){
                return this;
            }
            // 如果传入的参数是数字
            else{
                var arrayLength = this.length - 1;
                var myArray = this;
                if(index >= arrayLength){
                    return this;
                }
                // 如果选择的索引大于最大数组长度
                if(index <= 0){
                    index = 0;
                }
                var targetArray = myArray.splice(index,1);
                myArray.splice(arrayLength,0,targetArray[0]);
                return myArray;
            }
        },

        /**
         *
         * @param selectedArray
         * @returns {{selected: Array, unselected: Array}}
         * @example
         * [1, 2, 3,4,5].divideArrayByIndexs([1,3])
           返回
            {
                "selected":[2, 4],
                "unselected":[1,3,5]
            }
         */
        divideArrayByIndexs : function(selectedArray){
            // 1、将索引转为JSON 对象，用于后面的快速查找
            var selectedArrayLength = selectedArray.length;
            var selectedArrayObj = {};
            for(var i = 0; i < selectedArrayLength; i++){
                var currentObj = selectedArray[i];
                selectedArrayObj[currentObj] = currentObj;
            }

            var that = this;
            // 2、循环遍历原始的数组
            var length = that.length;
            var result = {
                "selected":[],
                "unselected":[]
            };
            for(var i = 0; i < length; i++){
                // 如果不是选中的节点
                if(selectedArrayObj[i] === undefined){
                    result["unselected"].push(that[i]);
                }
                // 如果是选中的节点
                else{
                    result["selected"].push(that[i]);
                }
            }
            return result;
        },

        /**
         *
         * @param selectedArray
         * @returns {*}
         * @example
         * [1, 2, 3,4,5].divideArrayByIndexs([1,3])
         返回
         [2, 4]
         */
        getSubArrayByIndex : function(selectedArray){
            return this.divideArrayByIndexs(selectedArray)[selected];
        }
    };
    Array.prototype = $.extend(true,Array.prototype,Array.prototypeExtend);

    /****************** Date 对象扩展***********************/

    /**
     * @exports Date
     * Date 对象扩展
     * @type {{getWeek: Function, addSeconds: Function, addMinutes: Function, addHours: Function, addDays: Function, addWeeks: Function, addMonths: Function, addYears: Function, format: (*|Function), dateDiff: Function, dateAdd: Function, getBeforeDate: Function, getAfterDate: Function, datePart: Function, toArray: Function, isLeapYear: Function}}
     */
    Date.prototypeExtend = {
        /**
         * 获取星期
         * @returns {*}
         */
        getWeek: function () {
            var a = new Array("日", "一", "二", "三", "四", "五", "六");
            var week = new Date().getDay();
            var str = a[week];
            return str;
        },

        /**
         * 将指定的秒数加到此实例的值上
         * @param value
         * @returns {Date}
         */
        addSeconds: function (value) {
            var second = this.getSeconds();
            this.setSeconds(second + value);
            return this;
        },

        /**
         * 将指定的分钟数加到此实例的值上
         * @param value
         * @returns {Date}
         */
        addMinutes: function (value) {
            var minute = this.getMinutes();
            this.setMinutes(minute + value);
            return this;
        },


        /**
         * 将指定的小时数加到此实例的值上
         * @param value
         * @returns {Date}
         */
        addHours: function (value) {
            var hour = this.getHours();
            this.setHours(hour + value);
            return this;
        },


        /**
         * 将指定的天数加到此实例的值上
         * @param value
         * @returns {Date}
         */
        addDays: function (value) {
            var date = this.getDate();
            this.setDate(date + value);
            return this;
        },

        /**
         * 将指定的星期数加到此实例的值上
         * @param value
         * @returns {Date}
         */
        addWeeks: function (value) {
            return this.addDays(value * 7);
        },


        /**
         * 将指定的月份数加到此实例的值上
         * @param value
         * @returns {Date}
         */
        addMonths: function (value) {
            var month = this.getMonth();
            this.setMonth(month + value);
            return this;
        },

        /**
         * 将指定的年份数加到此实例的值上
         * @param value
         * @returns {Date}
         */
        addYears: function (value) {
            var year = this.getFullYear();
            this.setFullYear(year + value);
            return this;
        },

        /**
         * 日期格式化（原型扩展或重载）
         * 格式 YYYY/yyyy/YY/yy 表示年份
         * MM/M 月份
         * W/w 星期
         * dd/DD/d/D 日期
         * hh/HH/h/H 时间
         * mm/m 分钟
         * ss/SS/s/S 秒
         * @param {formatStr} 格式模版
         * @type string
         * @returns 日期字符串
         */
        format: Date.prototype.format || function (formatStr) {
            var str = formatStr;
            var Week = ['日', '一', '二', '三', '四', '五', '六'];
            str = str.replace(/yyyy|YYYY/, this.getFullYear());
            str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
            str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
            str = str.replace(/M/g, this.getMonth());
            str = str.replace(/w|W/g, Week[this.getDay()]);
            str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
            str = str.replace(/d|D/g, this.getDate());
            str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
            str = str.replace(/h|H/g, this.getHours());
            str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
            str = str.replace(/m/g, this.getMinutes());
            str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
            str = str.replace(/s|S/g, this.getSeconds());
            return str;
        },

        /**
         * 比较日期差（原型扩展或重载）
         * @param {strInterval} 日期类型:'y、m、d、h、n、s、w'
         * @param {dtEnd} 格式为日期型或者 有效日期格式字符串
         * @type int
         * @returns 比较结果
         */
        dateDiff: function (strInterval, dtEnd) {
            var dtStart = this;
            if (typeof dtEnd == 'string') { //如果是字符串转换为日期型
                dtEnd = StringToDate(dtEnd);
            }
            switch (strInterval) {
                case 's' :
                    return parseInt((dtEnd - dtStart) / 1000);
                case 'n' :
                    return parseInt((dtEnd - dtStart) / 60000);
                case 'h' :
                    return parseInt((dtEnd - dtStart) / 3600000);
                case 'd' :
                    return parseInt((dtEnd - dtStart) / 86400000);
                case 'w' :
                    return parseInt((dtEnd - dtStart) / (86400000 * 7));
                case 'm' :
                    return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
                case 'y' :
                    return dtEnd.getFullYear() - dtStart.getFullYear();
            }
        },

        /**
         * 日期计算（原型扩展或重载）
         * @param {strInterval} 日期类型:'y、m、d、h、n、s、w'
         * @param {Number} 数量
         * @type Date
         * @returns 计算后的日期
         */
        dateAdd: function (strInterval, Number) {
            var dtTmp = this;
            switch (strInterval) {
                case 's' :
                    return new Date(Date.parse(dtTmp) + (1000 * Number));
                case 'n' :
                    return new Date(Date.parse(dtTmp) + (60000 * Number));
                case 'h' :
                    return new Date(Date.parse(dtTmp) + (3600000 * Number));
                case 'd' :
                    return new Date(Date.parse(dtTmp) + (86400000 * Number));
                case 'w' :
                    return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
                case 'q' :
                    return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                case 'm' :
                    return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                case 'y' :
                    return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            }
        },

        /**
         * daysNumber 表示当前日期往前推的天数
         * return Array
         * @param number
         */
        getBeforeDate: function (daysNumber) {
            var myDate = this;
            var dateArray = [];
            for (var i = 1; i <= daysNumber; i++) {
                var tempDate = new Date(myDate.getTime() - i * 24 * 3600 * 1000);
                //dateArray.push(tempDate.format('yyyy/MM/dd'));
                dateArray.push(tempDate);
            }
            return dateArray;
        },

        /**
         * daysNumber 表示当前日期往后推的天数
         * return Array
         * @param number
         */
        getAfterDate: function (daysNumber) {
            var myDate = this;
            var dateArray = [];
            for (var i = 1; i <= daysNumber; i++) {
                var tempDate = new Date(myDate.getTime() + i * 24 * 3600 * 1000);
                //dateArray.push(tempDate.format('yyyy/MM/dd'));
                dateArray.push(tempDate);
            }
            return dateArray;
        },

        /**
         * 取得日期数据信息（原型扩展或重载）
         * @param {interval} 日期类型:'y、m、d、h、n、s、w'
         * @type int
         * @returns 指定的日期部分
         */
        datePart: function (interval) {
            var myDate = this;
            var partStr = '';
            var Week = ['日', '一', '二', '三', '四', '五', '六'];
            switch (interval) {
                case 'y' :
                    partStr = myDate.getFullYear();
                    break;
                case 'm' :
                    partStr = myDate.getMonth() + 1;
                    break;
                case 'd' :
                    partStr = myDate.getDate();
                    break;
                case 'w' :
                    partStr = Week[myDate.getDay()];
                    break;
                case 'ww' :
                    partStr = myDate.WeekNumOfYear();
                    break;
                case 'h' :
                    partStr = myDate.getHours();
                    break;
                case 'n' :
                    partStr = myDate.getMinutes();
                    break;
                case 's' :
                    partStr = myDate.getSeconds();
                    break;
            }
            return partStr;
        },


        /**
         * 把日期分割成数组（原型扩展或重载）
         * @type array
         * @returns 日期数组
         */
        toArray: function () {
            var myDate = this;
            var myArray = Array();
            myArray[0] = myDate.getFullYear();
            myArray[1] = myDate.getMonth() + 1;
            myArray[2] = myDate.getDate();
            myArray[3] = myDate.getHours();
            myArray[4] = myDate.getMinutes();
            myArray[5] = myDate.getSeconds();
            return myArray;
        },

        /**
         * 判断闰年（原型扩展或重载）
         * @type boolean
         * @returns 是否为闰年 true/false
         */
        isLeapYear: function () {
            return (0 == this.getYear() % 4 && ((this.getYear() % 100 != 0) || (this.getYear() % 400 == 0)));
        }


    };
    Date.prototype = $.extend(true,Date.prototype,Date.prototypeExtend);


    /****************** String 对象扩展***********************/

    /**
     * @exports Sring
     * String 对象扩展
     * @type {{htmlEncode: (*|Function), toJson: Function}}
     */
    String.prototypeExtend = {
        /**
         * 检查是否是URL地址
         */
        isURL: function () {
            var re = /http[s]?:\/\/([\w-]+.)+[\w-]+(\/[\w-./?%&=]*)?/;
            var result = re.test(this);
            return result;
        },

        /**
         * 检查表单是否是email字符串
         */
        isEmail: function () {
            var re = /\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*/;
            var result = re.test(this);
            return result;
        },

        /**
         * 检查号码，正确格式为:XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX
         */
        isPhoneNumber: function () {
            var re = /^((\d{3,4})|\d{3,4}-)?\d{7,8}$/;
            var result = re.test(this);
            return result;
        },
        /**
         * 获取字符串长度（原型扩展或重载）
         * @type int
         * @returns 字符串长度
         */
        len: function () {
            var arr = this.match(/[^\x00-\xff]/ig);
            return this.length + (arr == null ? 0 : arr.length);
        },

        /**
         * //检查是否是浮点数，包括0，包括正浮点数  负浮点数
         * @returns {boolean}
         */
        isFloat: function () {
            var re = /^-?([1-9]\d*.\d+|0.\d*[1-9]\d*|0?.0+|0)$/;
            var result = re.test(this);
            return result;
        },

        /**
         * //检查是否是非负浮点数，包括0
         * @param isContainZero
         * @returns {boolean}
         */
        isFloatNegativ: function (isContainZero) {
            if (isContainZero) {
                var re = /(^-([1-9]\d*.\d+|0.\d*[1-9]\d*)$)|(0)/;
                var result = re.test(this);
                return result;
            } else {
                var re = /^-([1-9]\d*.\d+|0.\d*[1-9]\d*)$/;
                var result = re.test(this);
                return result;
            }
        },
        /**
         * //检查是否是正浮点数，包括0
         * @param isContainZero
         * @returns {boolean}
         */
        isFloatPositive: function (isContainZero) {

            if (isContainZero) {
                var re = /^[1-9]\d*.\d+|0.\d*[1-9]\d*|0?.0+|0$/;
                var result = re.test(this);
                return result;
            } else {
                var re = /^[1-9]\d*.\d+|0.\d*[1-9]\d*$/;
                var result = re.test(this);
                return result;
            }
        },
        /**
         * //检查是否是整数，包括0，正整数，负整数
         * @returns {boolean}
         */
        isInt: function () {
            var re = /^-?\d+$/;
            var result = re.test(this);
            return result;
        },

        /**
         * 检查是否是正整数
         * isContainZero 是否包含0
         */
        isIntPositive: function (isContainZero) {
            if (isContainZero) {
                var re = /(^[0-9]*[1-9][0-9]*$)|(0)/;
                var result = re.test(this);
                return result;
            } else {
                var re = /^[0-9]*[1-9][0-9]*$/;
                var result = re.test(this);
                return result;
            }
        },
        /**
         * 检查是否是负整数
         * @param isContainZero 是否包含0
         * @returns {boolean}
         */
        isIntNegativ: function (isContainZero) {
            if (isContainZero) {
                var re = /(^-[0-9]*[1-9][0-9]*$)|(0)/;
                var result = re.test(this);
                return result;
            } else {
                var re = /^-[0-9]*[1-9][0-9]*$/;
                var result = re.test(this);
                return result;
            }
        },
        /**
         * 检查字符串是否是指定字符串开头，返回true 和 false
         * @param str
         * @returns {boolean}
         */
        isStartWith: function (str) {
            var reg = new RegExp("^" + str);
            return reg.test(this);
        },
        /**
         * 检查字符串是否是指定字符串结尾，返回true 和 false
         * @param str
         * @returns {boolean}
         */
        isEndWith: function (str) {
            var reg = new RegExp(str + "$");
            return reg.test(this);
        },
        /**
         * 一个单词首字母大写,返回字符串
         * @returns {string}
         */
        capitalize: function () {
            var result = this.charAt(0).toUpperCase() + this.substring(1).toLocaleLowerCase();
            return result;
        },
        /**
         * 保留字母和空格,返回字符串
         * @returns {string}
         */
        getEn: function () {
            var result = this.replace(/[^A-Z a-z]/g, "");
            return result;
        },
        /**
         * 逆序
         * @returns {string}
         */
        reverse: function () {
            return this.split("").reverse().join("");
        },
        /**
         * 检查字符串是否包含自定字符串，返回true 和 false
         * @param target
         * @returns {boolean}
         */
        isContains: function (target) {
            var myReg = new RegExp(target);
            var result = myReg.test(this);
            return result;
        },
        /**
         * 去除两边的空格,返回字符串
         * @returns {string}
         */
        trim: function () {
            var result = this.replace(/^\s+|\s+$/g, "");
            return result;
        },
        /**
         * 除去左边空白,返回字符串
         * @returns {string}
         */
        trimLeft: function () {
            return this.replace(/^\s+/g, "");
        },
        /**
         * 除去右边空白,返回字符串
         * @returns {string}
         */
        trimRight: function () {
            return this.replace(/\s+$/g, "");
        },
        /**
         * 去除所有的空白
         * @returns {*}
         */
        delBlank: function () {
            var result = this.replace(/\s+/g, "");
            return result;
        },

        /**
         * 字符串转换为日期型（原型扩展或重载）
         * @returns {Date} 日期
         */
        toDate: function () {
            var converted = Date.parse(this);
            var myDate = new Date(converted);
            if (isNaN(myDate)) {
                var arys = this.split('-');
                myDate = new Date(arys[0], --arys[1], arys[2]);
            }
            return myDate;
        },

        /**
         * HTML转义字符
         * @returns {string}
         * @example
         * var userInput = "我要点击<a href='https://www.baidu.com'>百度链接</a>测试<span style='color:red'>我是红色的字</span>";
         * console.log(userInput.htmlEncode());
         */
        htmlEncode: function () {
            var s = "";
            if (!this) return s;

            if (this.length == 0) return "";
            s = this.replace(/&/g, "&amp;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            return s;
        },

        /**
         * 删除字符串中HTML标签
         * @returns {*}
         * @example
         * var userInput = "我要点击<a href='https://www.baidu.com'>百度链接</a>测试<span style='color:red'>我是红色的字</span>";
         * console.log(userInput.removeHtmlTag());
         */
        removeHtmlTag: function () {
            var s = this.replace(/<\/?[^>]*>/g,'');
            return s;
        },
        /**
         * 将json字符串转为json对象
         * @returns {*}
         */
        toJson: function () {
            return (new Function("return " + this))();
        },

        /**
         * 检查用户输入的文字只能是中文，英文，数字，如果非则字符则替换空
         */
        normalCharInputOnly : function () {
            if (this.length >= 1) {
                return this.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
            }
            return "";
        },
        /**
         * 检查是否是中文，英文，数字，如果是返回false，否则返回true
         */
        isNormalChar : function () {
            var re = /[^a-zA-Z0-9\u4e00-\u9fa5]/g;
            var result = re.test(this);
            return result;
        },

        /**
         * 用于把用utf16编码的字符转换成实体字符，以供后台存储
         * @param  {string} 将要转换的字符串，其中含有utf16字符将被自动检出
         * @return {string} 转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符
         */
        getEntitiesByUtf16: function () {
            var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
            var result = "";
            result = this.replace(patt, function (char) {
                var H, L, code;
                if (char.length === 2) {
                    H = char.charCodeAt(0); // 取出高位
                    L = char.charCodeAt(1); // 取出低位
                    // 转换算法
                    code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
                    return "&#" + code + ";";
                } else {
                    return char;
                }
            });
            return result;
        }
    };
    String.prototype = $.extend(true,String.prototype,String.prototypeExtend);

    Number.prototypeExtend = {
        toLowerCase : function(){
            return this;
        },
        toUpperCase : function(){
            return this;
        }
    };
    Number.prototype = $.extend(true,Number.prototype,Number.prototypeExtend);

    __WINDOW__.klwTool = {
        /**
         * 将数组转为JSON 对象，方便快速查找
         * @param originArray  需要转换的数组
         * @param keyName  将数组对象中的一个属性作为 新对象的key
         * @example
         [{
            "code": "MQdlc01",
            "createdate": "2017-03-27 15:49:52",
            "id": "39747db7-86de-4368-b121-87f0afcb7a0e",
            "isdisabled": false,
            "name": "天猫活动仓",
            "parentid": "4d35415b-3176-4a5c-8928-62a5d794dff1",
            "warehousetype": 3
            }]

         转为

         {
             "39747db7-86de-4368-b121-87f0afcb7a0e":{
             "code": "MQdlc01",
             "createdate": "2017-03-27 15:49:52",
             "id": "39747db7-86de-4368-b121-87f0afcb7a0e",
             "isdisabled": false,
             "name": "天猫活动仓",
             "parentid": "4d35415b-3176-4a5c-8928-62a5d794dff1",
             "warehousetype": 3
             }
         }
         */
        arrayToJson : function(originArray,keyName){
            var length = originArray.length;
            var result = {};
            for(var i = 0; i < length; i++){
                var currentObj = originArray[i];
                var key = currentObj[keyName];
                result[key] = currentObj;
            }
            return result;
        },

        /**
         * 将JSON的第一层 转为 一维数组,与 arrayToJson 的方式相反
         * @param originJson
         */
        jsonToArray : function(originJson){
            var result = [];
            for(key in originJson){
                result.push(originJson[key]);
            }
            return result;
        },

        /**
         * 将枚举对象转为数组，方便ng-repeat遍历
         * @param enumerate
         * @example
         * inventoryOutboundOrder:{
            "0" : "待审核",
            "1" : "已审核",
            "2" : "已通知"
        }
         =>
         [
         {id:0,name:"待审核"}
         {id:1,name:"已审核"}
         {id:2,name:"已通知"}
         ]
         */
        enumerateToArray:function(enumerate){
            var result = [];
            for(key in enumerate){
                var tempObj = {};
                tempObj["id"] = key;
                tempObj["name"] = enumerate[key];
                result.push(tempObj);
            }
            return result;
        },

        /**
         * 将JSON的第一层 转为 一维数组,与 arrayToJson 的方式相反
         *
         * @param originJson
         */
        jsonToArray2 : function(originJson,keyname,valuename){
            var result = [];
            for(key in originJson){
                var obj = {};
                obj[keyname] = key;
                obj[valuename] = originJson[key];
                result.push(obj);
            }
            return result;
        },

        /**
         * 将JSON对象转为字符串，
         * 调试JSON字符串
         */
        obj2str: function (o) {
            var r = [];
            if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
            if (typeof o == "undefined") return "undefined";
            if (typeof o == "object") {
                if (o === null) return "null";
                else if (!o.sort) {
                    for (var i in o)
                        r.push(i + ":" + this.obj2str(o[i]))
                    r = "{" + r.join() + "}"
                } else {
                    for (var i = 0; i < o.length; i++)
                        r.push(this.obj2str(o[i]))
                    r = "[" + r.join() + "]"
                }
                return r;
            }
            return o.toString();
        },

        /**
         * 将json对象转为String
         * @param o 为JSON对象
         * @returns {string}
         */
        JsonToString: function (o) {
            var arr = [];
            var fmt = function (s) {
                if (typeof s == 'object' && s != null) return this.JsonToString(s);
                return /^(string)$/.test(typeof s) ? '"' + s + '"' : s;
            };
            for (var i in o)
                arr.push("'" + i + "':" + fmt(o[i]));
            return '{' + arr.join(',') + '}';
        },

        /**
         * //历史回退到上一个链接地址
         */
        goBack: function () {
            window.history.go(-1);
        },

        /**
         * //页面跳转转到target属性指明的链接，obj代表控件this
         * @param obj
         */
        jumpTo: function (obj) {
            var _href = obj.getAttribute("target");
            window.location.href = _href;
        },

        /**
         * 获取屏幕宽度
         * @returns {number}
         */
        getScreenWidth: function () {
            return document.documentElement.clientWidth;
        },

        /**
         * 获取屏幕高度
         * @returns {number}
         */
        getScreenHeight: function () {
            return document.documentElement.clientHeight;
        },

        /**
         * 只允许输入数字
         * @param obj 为控件对象
         * @param event 为触发的事件
         */
        numberInputOnly: function (obj, event) {
            if (obj.value.length == 1) {
                obj.value = obj.value.replace(/[^1-9]/g, '');
            } else {
                obj.value = obj.value.replace(/\D/g, '');
            }
        },

        /**
         * 深复制对象方法
         * @returns {{}}
         */
        cloneObj : function(obj){
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
        },
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

})(window);