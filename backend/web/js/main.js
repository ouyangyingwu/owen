/*  定义全局使用的量  */

//定义验证字符
var token = $('meta[name=csrf-token]').attr('content');

//定义所有ajax的路径
var url={
    //site Logout
    logout: 'site/logout',
    // api/alumna
    alumnaList: 'api/alumna/list',
    alumnaEdit: 'api/alumna/edit',
    alumnaAdd: 'api/alumna/add',
    // api/classRoom
    roomOne: 'api/class-room/oen',
    roomData: 'api/class-room/data',
    roomList: 'api/class-room/list',
    roomEdit: 'api/class-room/edit',
    roomUpdate: 'api/class-room/update',
    roomAdd: 'api/class-room/add',
    // api/course
    courseData: 'api/course/data',
    courseList: 'api/course/list',
    courseListData: 'api/course/list-data',
    courseEdit: 'api/course/edit',
    courseAdd: 'api/course/add',
    // api/Dashboard
    dashboardTodo: 'api/dashboard/todo',
    // api/Department
    departmentOne:'api/department/one',
    departmentData:'api/department/data',
    departmentListData:'api/department/list-data',
    departmentList:'api/department/list',
    departmentEdit:'api/department/edit',
    departmentAdd:'api/department/add',
    // api/file
    fileUrl:'api/file/url',
    fileDelete:'api/file/delete',
    fileAdd:'api/file/add',
    // api/information
    informationOne:'api/information/one',
    informationList:'api/information/list',
    informationEdit:'api/information/edit',
    informationUpdate: 'api/information/update',
    informationAdd:'api/information/add',
    // api/major
    majorOne:'api/major/one',
    majorData:'api/major/data',
    majorListData:'api/major/list-data',
    majorList:'api/major/list',
    majorEdit:'api/major/edit',
    majorAdd:'api/major/add',
    // api/Register
    registerData: 'api/register/data',
    registerList: 'api/register/list',
    registerListData: 'api/register/list-data',
    registerEdit: 'api/register/edit',
    registerAdd: 'api/register/add',
    // api/team
    teamData:'api/team/data',
    teamListData:'api/team/list-data',
    teamList:'api/team/list',
    teamEdit:'api/team/edit',
    teamAdd:'api/team/add',
    // api/user
    userOne:'api/user/one',
    userNumber:'api/user/number',
    userData:'api/user/list-data',
    userList:'/api/user/list',
    userStudent:'/api/user/list-student',
    userTeacher:'/api/user/list-teacher',
    userEdit:'/api/user/edit',
    userUpdate:'/api/user/update',
    userResetPassword:'/api/user/reset-password',
    userAdd:'/api/user/add',
    userFinishSchool:'/api/user/finish-school',
    menuList:'api/user/menu-list',
};

/**
 * Created by admin on 2017/11/1.
 */
//时间处理函数
var timeFormatRegList = ["Y","t","m","j","d","H","h","g","i","s","A","a","M", "P"];
var timeMonthShortArr = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'};
var timeZoneArr = {"-5": "EST","-6": "CST","-7": "MST","-8": "PST","-9": "AKST","-10": "HST"};
var datePeriodList =  {
    "Early Morning": "7:00",
    "Mid Morning": "10:00",
    "Early Afternoon": "13:00",
    "Late Afternoon": "16:00",
    "Evening": "18:00"
}
//中文数字与阿拉伯数字互相装换
var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
var chnUnitSection = ["","万","亿","万亿","亿亿"];
var chnUnitChar = ["","十","百","千"];
var charNumChn = {
    零:0,
    一:1,
    二:2,
    三:3,
    四:4,
    五:5,
    六:6,
    七:7,
    八:8,
    九:9
};
var chnNameValue = {
    十:{value:10, secUnit:false},
    百:{value:100, secUnit:false},
    千:{value:1000, secUnit:false},
    万:{value:10000, secUnit:true},
    亿:{value:100000000, secUnit:true}
}
var CommonTool = {
    getDatePeriod: function(hour) {
        if(hour >= 6 && hour < 9){
            return "Early Morning(6:00 AM - 9:00 AM)";
        } else if(hour >=9 && hour < 12){
            return "Mid Morning(9:00 AM - 12:00 AM)";
        } else if(hour >=12 && hour < 15){
            return "Early Afternoon(12:00 AM - 3:00 PM)";
        } else if(hour >= 15 && hour < 17){
            return "Late Afternoon(3:00 PM - 5:00 PM)";
        } else if(hour >= 17 && hour < 19){
            return "Evening(5:00 PM - 7:00 PM)";
        }
        return "";
    },
    //时间格式转换函数
    formatTime:function(time, formatStr, addDays){
        if(!time){
            return "";
        }
        if(formatStr == "custom"){
            var nowTime = CommonTool.formatTime("now", "integer");
            var customTime = parseInt(time);
            var gapTime = nowTime - customTime;
            if(gapTime < 86400) {
                var hour = parseInt(gapTime / 3600);
                if (hour > 0) {
                    str = hour > 1 ? hour + " hours ago" : "1 hour ago";
                } else {
                    var minutes =  parseInt(gapTime / 60);
                    if(minutes == 0){
                        str = "0 minute ago";
                    }else{
                        str = minutes > 1 ? minutes + " minutes ago" : "1 minute ago";
                    }
                }
            }else{
                str = CommonTool.formatTime(customTime, "M j, Y g:i A");
            }
            return str;
        }
        if(time == "now"){
            var nowTime = new Date();
            time = Date.parse(nowTime);
        }else if(time == "nowDate"){
            var nowDateStr = this.formatTime("now", "Y/m/d");
            var nowTime = new Date(nowDateStr);
            time = Date.parse(nowTime);
        }else{
            if (/[^\d]/.test(time)){
                for(var key in datePeriodList){
                    time = time.replace(new RegExp(key,'gm'), datePeriodList[key]);
                }
                time = time.replace(new RegExp("-",'gm'),'/');
                time = Date.parse(time);
            }else{
                time = parseInt(time) * 1000;
            }
        }
        var formatTime = new Date(time);
        if(addDays){
            formatTime.setDate(formatTime.getDate() + addDays);
        }
        if(formatStr == "integer"){
            return formatTime / 1000;
        }
        var year = formatTime.getFullYear();
        var month = formatTime.getMonth() + 1;
        var day = formatTime.getDate();
        var hour = formatTime.getHours();
        var minutes = formatTime.getMinutes();
        var second = formatTime.getSeconds();
        var timeRegArr = {
            "{Y}" : year, //month
            "{m}" : month < 10 ? "0" + month : month,
            "{t}" : month,
            "{j}" : day,
            "{d}" : day < 10 ? "0" + day : day,
            "{H}" : hour < 10 ? "0" + hour : hour,
            "{h}" : hour > 12 ? hour - 12 : hour,
            "{g}" : hour > 12 ? hour - 12 : hour,
            "{i}" : minutes < 10 ? "0" + minutes : minutes,
            "{s}" : second < 10 ? "0" + second : second,
            "{A}" : hour > 12 ? "PM" : "AM",
            "{a}" : hour > 12 ? "pm" : "am",
            "{M}" : timeMonthShortArr[month],
            "{P}" : CommonTool.getDatePeriod(hour)
        }
        for(var idx = 0, len = timeFormatRegList.length; idx < len; idx++){
            var regChar = timeFormatRegList[idx];
            formatStr = formatStr.replace(regChar, "{" + regChar + "}");
        }
        for(var reg in timeRegArr){
            var regExp = new RegExp(reg,'gm');
            formatStr = formatStr.replace(regExp, timeRegArr[reg]);
        }
        return formatStr;
    },
    getPhoneNumber:function(str){
        if(!str){
            return "";
        }
        var reg = /\d/g;
        var val_list = str.match(reg);
        return val_list.join("");
    },
    //电话号码格式((111) 111-1111)
    displayPhoneNumber:function(str){
        if (!str) {
            return "";
        }
        return str.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },
    //获得当前月份的第一天
    getCurrentMonthFirst:function(){
        var d = new Date();
        d.setDate(1);
        return d.getFullYear()+"-"+(d.getMonth() + 1)+"-"+ d.getDate();
    },
    //获得当前月末（最后一天）
    getCurrentMonthLast:function(){
        var date=new Date();
        var currentMonth=date.getMonth();
        var nextMonth=++currentMonth;
        var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
        var oneDay=1000*60*60*24;
        var d = new Date(nextMonthFirstDay-oneDay);
        return d.getFullYear()+"-"+(d.getMonth() + 1)+"-"+ d.getDate();
    },
    //获得今年一月一日
    getCurrentYearFirst:function(){
        var Y = new Date();
        return Y.getFullYear()+"-"+1+"-"+1;

    },
    //获得今年一十二月三十一日
    getCurrentYearLast:function(){
        var Y=new Date();
        return Y.getFullYear()+"-"+12+"-"+ 31;
    },

    registerPhoneInput:function(obj){
        obj.css("ime-mode", "disabled").keydown(function(e){
            if(window.event)
                intkey = event.keyCode;
            else
                intkey=e.which;
            if ((intkey < 48 && intkey != 8) || (intkey > 57 && intkey < 96) || intkey > 105) {
                if(intkey != 9){
                    e.preventDefault();
                }
            }
        }).keyup(function(e){
            var value = $.trim($(this).val());
            if(!value){
                $(this).val("");
                return;
            }
            var reg = /\d/g;
            var valList = value.match(reg);
            var disText = [];
            var len = valList.length;
            var valStr = valList.join("");
            if(len <= 3){
                disText = valStr;
            }else if(len > 3 && len < 7){
                disText = "(" + valStr.substr(0, 3) + ") " + valStr.substr(3);
            }else{
                valStr = valStr.substr(0, 10);
                disText = "(" + valStr.substr(0, 3) + ") " + valStr.substr(3, 3) + "-" + valStr.substr(6);
            }
            $(this).val(disText);
        });
    },
    registerNumberInput:function(obj, len, min, max){
        max = max ? max : Infinity;
        obj.css("ime-mode","disabled").keydown(function(e){
            if(window.event)
                intkey = event.keyCode;
            else
                intkey = e.which;
            if ((intkey < 48 && intkey != 8) || (intkey > 57 && intkey < 96) || intkey > 105) {
                if(intkey != 9){
                    e.preventDefault();
                }
            }
        }).keyup(function(e){
            var value = $.trim($(this).val());
            if(!value){
                if(min){
                    $(this).val(min);
                }else{
                    $(this).val("0");
                }
                return;
            }
            if(min && (parseInt(value) < min)){
                $(this).val(min);
                return;
            }
            if(max && (parseInt(value) > max)){
                $(this).val(max);
                return;
            }
            var reg = /\d/g;
            var valList = value.match(reg);
            var valLen = valList.length;
            var valStr = valList.join("");
            if(valLen > len){
                valStr = valStr.substr(0, len);
            }
            var displayValue = parseInt(valStr);
            if(displayValue == 0){
                $(this).val(0);
            } else {
                $(this).val(displayValue);
            }
        });
    },
    registerDecimalNumberInput:function(obj, digit){
        var inputPoint = false;
        obj.css("ime-mode","disabled").keydown(function(e){
            if(window.event)
                intkey=event.keyCode;
            else
                intkey=e.which;
            if ((intkey < 48 && intkey != 8) || (intkey > 57 && intkey < 96) || intkey > 105) {
                if(intkey != 9 && intkey != 190 && intkey != 110){
                    e.preventDefault();
                }
            }
            if(inputPoint && (intkey == 190 || intkey == 110)){
                e.preventDefault();
            }
        }).keyup(function(e){
            var value = $.trim($(this).val());
            if(!value){
                $(this).val("0");
                inputPoint = false;
                return;
            }
            var valueList = value.split(".");
            var len = valueList.length;
            if(len > 1){
                inputPoint = true;
                var integerNum = valueList[0];
                integerNum = integerNum ? parseInt(integerNum) : 0;
                var decimalNum = valueList[len - 1];
                decimalNum = decimalNum.length > digit ? decimalNum.slice(0, digit) : decimalNum;
                if(parseFloat(decimalNum) == 0){
                    decimalNum = decimalNum.slice(0, digit - 1);
                }
                $(this).val(integerNum + "." + decimalNum);
            }else{
                $(this).val(parseInt(value));
                inputPoint = false;
            }
        });
        obj.blur(function(){
            var value = $.trim($(this).val());
            if(parseFloat(value) == 0){
                $(this).val("0");
            }else{
                var valueList = value.split(".");
                var len = valueList.length;
                var decimalNum = valueList[len - 1];
                if(parseFloat(decimalNum) == 0){
                    $(this).val(valueList[0]);
                }
            }
        });
    },
    registerStreetInput:function(objId, changeFn){
        changeFn = changeFn ? changeFn : function(){};
        var input = document.getElementById(objId);
        var options = {
            componentRestrictions: {country: "us"}
        }
        var searchBox = new google.maps.places.Autocomplete(input, options);
        var geoDom = document.createElement("DIV");
        var streetAddress = null;
        var geoTag = false;
        google.maps.event.addListener(searchBox, 'place_changed', function() {
            var place = searchBox.getPlace();
            var postion = place.geometry.location;
            var adr_address = place.adr_address;
            $(geoDom).empty().html(adr_address);
            var city = $(geoDom).find(".locality").length == 1 ? $(geoDom).find(".locality").html() : null;
            var state = $(geoDom).find(".region").length == 1 ? $(geoDom).find(".region").html() : null;
            var zipcode = $(geoDom).find(".postal-code").length == 1 ? $(geoDom).find(".postal-code").html() : null;
            streetAddress = $(geoDom).find(".street-address").length == 1 ? $(geoDom).find(".street-address").html() : "";
            changeFn({"city":city,"state":state,"zipcode":zipcode,"postion":postion});
            $(input).val(streetAddress);
            geoTag = true;
        });
        $("#" + objId).blur(function(){
            if(geoTag){
                setTimeout(function(){
                    $("#" + objId).val(streetAddress);
                    geoTag = false;
                }, 1);
            }
            setTimeout(function(){
                $("#" + objId).attr("for-check", 0);
            }, 1);
        });
        $("#" + objId).keyup(function(e){
            var intkey=-1;
            if(window.event)
            {
                intkey=event.keyCode;
            }
            else
            {
                intkey=e.which;
            }
            if(intkey == 13){
                streetAddress = $(input).val();
                geoTag = true;
            }else{
                geoTag = false;
            }
        });
    },
    requireJs:function(url){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement("script");
        script.type= "text/javascript";
        script.src= url;
        head.appendChild(script);
    },
    //将数据库内保存的数组转换为真正的数组
    pgArrayStrToArr:function(str){
        if(!str){
            return [];
        }
        str = str.replace("{", "");
        str = str.replace("}", "");
        return str.split(",");
    },
    //渲染动作按钮，一般用于列表最后一格
    renderActionButtons:function(buttons, title){
        if(!buttons || buttons.length == 0){
            return "";
        }
        title = title ? title : "Actions";
        var html = [];
        html.push("<div class=\"btn-group\">");
        html.push("<a class=\"btn green\" data-toggle=\"dropdown\" aria-expanded=\"false\">");
        html.push(title);
        html.push("&nbsp;<i class=\"icon-angle-down\"></i></a>");
        html.push("<ul class=\"dropdown-menu\">");
        for(var idx = 0, len = buttons.length; idx < len; idx++){
            html.push("<li>" + buttons[idx] + "</li>");
        }
        html.push("</ul></div>");
        return html.join("");
    },
    //将数组转换为枚举数组
    getJsonArray:function(json, type){
        var value = [];
        for(var key in json){
            if(type == "key"){
                value.push(key);
            } else {
                value.push(json[key]);
            }
        }
        return value;
    },
    //传递秒数，将秒转换为时分
    formatSeconds: function (time) {
        var theTime = parseInt(time);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if(theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if(theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        var result = "" + parseInt(theTime2) + " Hours ";

        if(theTime1 > 0) {
            result += parseInt(theTime1) + " Minutes ";
        }

        return result;
    },
    SectionToChinese: function (section){
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while(section > 0){
            var v = section % 10;
            if(v === 0){
                if(!zero){
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            }else{
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    },
    //阿拉伯数字转换为中文数字
    NumberToChinese: function (num){
        var unitPos = 0;
        var strIns = '', chnStr = '';
        var needZero = false;

        if(num === 0){
            return chnNumChar[0];
        }

        while(num > 0){
            var section = num % 10000;
            if(needZero){
                chnStr = chnNumChar[0] + chnStr;
            }
            strIns = CommonTool.SectionToChinese(section);
            strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }

        return chnStr;
    },
    //中文数字转换为阿拉伯数字
    ChineseToNumber:function (chnStr){
        var rtn = 0;
        var section = 0;
        var number = 0;
        var secUnit = false;
        var str = chnStr.split('');

        for(var i = 0; i < str.length; i++){
            var num = charNumChn[str[i]];
            if(typeof num !== 'undefined'){
                number = num;
                if(i === str.length - 1){
                    section += number;
                }
            }else{
                var unit = chnNameValue[str[i]].value;
                secUnit = chnNameValue[str[i]].secUnit;
                if(secUnit){
                    section = (section + number) * unit;
                    rtn += section;
                    section = 0;
                }else{
                    section += (number * unit);
                }
                number = 0;
            }
        }
        return rtn + section;
    },
    //判断当前打开的浏览器
    browser:function (){
        var explorer =navigator.userAgent ;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
            return "ie";
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
            return "Firefox";
        }
        //Chrome
        else if(explorer.indexOf("Chrome") >= 0){
            return "Chrome";
        }
        //Opera
        else if(explorer.indexOf("Opera") >= 0){
            return "Opera";
        }
        //Safari
        else if(explorer.indexOf("Safari") >= 0){
            return "Safari";
        }
        //Netscape
        else if(explorer.indexOf("Netscape")>= 0) {
            return 'Netscape';
        }
    }
};

//var SMS_JS_VERSION =  jsVersion;
var SmsJs = {};
(function(){
    /*定义已经加载的文件*/
    var hasLoadFiles = {};
    var isRun = false;
    var smsModel = {}, smsConfigValue = {};
    var includeFile;
    /*注册类*/
    SmsJs.register = function(key, value){
        SmsJs[key] = value;
    }
    /*初始化Model*/
    SmsJs.model = function(){
        if(arguments.length == 0){
            return;
        }
        var newModel;
        if(arguments.length == 1){
            var param = arguments[0];
            if(typeof(param) == "string"){
                return smsModel[param];
            }else if(typeof(param) == "object"){
                newModel = param;
            }
        }
        if(arguments.length == 2){
            var key = arguments[0];
            newModel = arguments[1];
            smsModel[key] = newModel;
        }
        if(includeFile){
            SmsJs.include(includeFile, function(){
                if(newModel["initialize"]){
                    newModel.initialize();
                }
            });
        }else{
            if(newModel["initialize"]){
                newModel.initialize();
            }
        }
        includeFile = null;
        return SmsJs;
    }

    /*定义全局变量*/
    SmsJs.config = {
        set:function(){
            if(arguments.length == 0){
                return;
            }
            if(arguments.length == 1){
                var params = arguments[0];
                if(typeof(params) == "object"){
                    for(var key in params){
                        smsConfigValue[key] = params[key];
                    }
                }
            }
            if(arguments.length == 2){
                var key = arguments[0];
                var setValue = arguments[1];
                smsConfigValue[key] = setValue;
            }
        },
        get:function(key){
            return smsConfigValue[key];
        }
    }
    /*定义一些常用工具，如果想扩展，调用extend函数*/
    var timeFormatRegList = ["Y","m","j","d","H","h","g","i","s","A","a","M", "P","t"];
    var timeMonthShortArr = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'};
    var timeZoneArr = {"-5": "EST","-6": "CST","-7": "MST","-8": "PST","-9": "AKST","-10": "HST"};
    SmsJs.tool = {
        getDatePeriod: function(hour) {
            if(hour >= 6 && hour < 9){
                return "Early Morning (6:00 AM - 9:00 AM)";
            } else if(hour >=9 && hour < 12){
                return "Mid Morning (9:00 AM - 12:00 AM)";
            } else if(hour >=12 && hour < 15){
                return "Early Afternoon (12:00 AM - 3:00 PM)";
            } else if(hour >= 15 && hour < 17){
                return "Late Afternoon (3:00 PM - 5:00 PM)";
            } else if(hour >= 17 && hour < 19){
                return "Evening (5:00 PM - 7:00 PM)";
            }
            return "";
        },
        encrypt: function(password){
            var crypt = new JSEncrypt();
            var publicKey = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdYcgMUL69/hU4KafBVgnXV/HG1wnzjKKttughEm7OfBl7CbNcAOMfgpfH7h9EKz/DX+7wFdtxjlDR5XgXkdFHc2Bo3tHmsWcHLjR2B6x+khxHPCfMxNIRtNuHxk54pqfC3Kabejl6Cx5Fj4Z5iJ7KkXqCLb0luT0iojFFXUSCZwIDAQAB-----END PUBLIC KEY-----";
            crypt.setPublicKey(publicKey);
            return crypt.encrypt(password);
        },
        isUrl:function(url){
            var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            var objExp = new RegExp(Expression);
            if(objExp.test(url) == true){
                return true;
            }else{
                return false;
            }
        },
        getUrl:function(url){
            if(this.isUrl(url)){
                return url;
            }
            var baseUrl = SmsJs.config.get("baseUrl");
            baseUrl = baseUrl ? baseUrl : "";
            return baseUrl + url;
        },
        getFileUrl:function(filePath, fileType){
            if(this.isUrl(filePath)){
                return filePath;
            }
            if(fileType){
                filePath = "/" + fileType + "/" + filePath;
                var fileSuffix = "." + fileType;
                if(filePath.indexOf(fileSuffix) <= 0 )
                {
                    if(SMS_JS_VERSION){
                        filePath = filePath + fileSuffix + "?v=" + SMS_JS_VERSION;
                    }else{
                        filePath = filePath + fileSuffix;
                    }
                }
            }
            var baseUrl = SmsJs.config.get("baseUrl");
            if(baseUrl){
                return baseUrl + filePath;
            }else{
                return filePath;
            }
        },
        getJsonKeyLength:function(json){
            if(!json){
                return 0;
            }
            var len = 0;
            for(var item in json){
                len++;
            }
            return len;
        },
        getLocalTimeZone:function(){
            var tzo = (new Date().getTimezoneOffset() /60) * (-1);
            var utcStr = "";
            if(timeZoneArr[tzo]){
                utcStr = timeZoneArr[tzo];
            }
            return utcStr;
        },
        getNewGuid:function(){
            var guid = "";
            for (var i = 1; i <= 32; i++){
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if((i==8)||(i==12)||(i==16)||(i==20))
                    guid += "-";
            }
            return guid;
        },
        ufirst:function(str){
            return str[0].toUpperCase() + str.slice(1);
        },
        formatTime:function(time, formatStr, addDays){
            if(!time){
                return "";
            }
            if(time == "now"){
                var nowTime = new Date();
                time = Date.parse(nowTime);
            }else if(time == "nowDate"){
                var nowDateStr = this.formatTime("now", "Y/m/d");
                var nowTime = new Date(nowDateStr);
                time = Date.parse(nowTime);
            }else{
                if (isNaN(time)){
                    var datePeriodList = SmsJs.config.get("datePeriodList");
                    for(var key in datePeriodList){
                        time = time.replace(new RegExp(key,'gm'), datePeriodList[key]);
                    }
                    time = time.replace(new RegExp("-",'gm'),'/');
                    time = Date.parse(time);
                }else{
                    time = parseInt(time) * 1000;
                }
            }
            var formatTime = new Date(time);
            if(addDays){
                formatTime.setDate(formatTime.getDate() + addDays);
            }
            if(formatStr == "integer"){
                return formatTime / 1000;
            }
            var year = formatTime.getFullYear();
            var month = formatTime.getMonth() + 1;
            var day = formatTime.getDate();
            var hour = formatTime.getHours();
            var minutes = formatTime.getMinutes();
            var second = formatTime.getSeconds();
            var timeRegArr = {
                "{Y}" : year, //month
                "{m}" : month < 10 ? "0" + month : month,
                "{t}" : month,
                "{j}" : day,
                "{d}" : day < 10 ? "0" + day : day,
                "{H}" : hour < 10 ? "0" + hour : hour,
                "{h}" : hour > 12 ? hour - 12 : hour,
                "{g}" : hour > 12 ? hour - 12 : hour,
                "{i}" : minutes < 10 ? "0" + minutes : minutes,
                "{s}" : second < 10 ? "0" + second : second,
                "{A}" : hour > 12 ? "PM" : "AM",
                "{a}" : hour > 12 ? "pm" : "am",
                "{M}" : timeMonthShortArr[month],
                "{P}" : this.getDatePeriod(hour)
            }

            for(var idx = 0, len = timeFormatRegList.length; idx < len; idx++){
                var regChar = timeFormatRegList[idx];
                formatStr = formatStr.replace(regChar, "{" + regChar + "}");
            }
            for(var reg in timeRegArr){
                var regExp = new RegExp(reg,'gm');
                formatStr = formatStr.replace(regExp, timeRegArr[reg]);
            }
            return formatStr;
        },
        extend:function(obj){
            for(var key in obj){
                this[key] = obj[key];
            }
        },
        HTMLDecode:function(str)
        {
            var converter = document.createElement("DIV");
            converter.innerHTML = str;
            var output = converter.innerText;
            converter = null;
            return output;
        }
    }
    /*定义插件*/
    var pluginArr = {};
    SmsJs.plugin = {
        extend:function(){
            if(arguments.length == 0){
                return;
            }
            if(arguments.length == 1){
                var params = arguments[0];
                if(typeof(params) == "object"){
                    for(var key in params){
                        pluginArr[key] = params[key];
                    }
                }
            }
            if(arguments.length == 2){
                var key = arguments[0];
                var obj = arguments[1];
                pluginArr[key] = obj;
            }
        },
        forceRender:false,
        render:function(){
            var copythis = this;
            function domRender(){
                setTimeout(function(){
                    var renderObj;
                    if(copythis.forceRender){
                        renderObj = $("body").find("*[data-plugin-type]");
                        copythis.forceRender = false;
                    }else{
                        renderObj = $("body").find("*[data-plugin-type][data-plugin-init!='1']")
                    }
                    renderObj.each(function(){
                        var pluginType = $(this).attr("data-plugin-type");
                        if(pluginArr[pluginType]){
                            new pluginArr[pluginType](this);
                        }
                        $(this).attr("data-plugin-init", "1");
                    });
                }, 10);
            }
            if(!document.addEventListener){
                $("body").get(0).addBehavior("event");
                $("body").get(0).attachEvent('onreadystatechange',function(e){
                    domRender();
                });
            }else{
                $(document).bind('DOMNodeInserted',function(){
                    domRender();
                });
            }
        }
    }
    /*加载相关文件*/
    SmsJs.require = function(paths, isExecute){
        includeFile = null;
        if(typeof(paths) != "object"){
            return SmsJs;
        }
        if(!paths["js"] || !paths["css"]){
            includeFile = {"js" : paths};
        }else{
            includeFile = paths;
        }
        if(isExecute){
            SmsJs.include(includeFile);
            includeFile = null;
        }else{
            return SmsJs;
        }
    }
    /*引用JS或CSS文件*/
    SmsJs.include = function(_paths, callBackFn, dealFn){
        var paths = _paths ? _paths : {};
        var successLoad = {};
        var jsFiles = paths["js"];
        var cssFiles = paths["css"];
        var jsFileCount = jsFiles ? jsFiles.length : 0;
        var cssFileCount = cssFiles ? cssFiles.length : 0;
        var loadFileCount = jsFileCount + cssFileCount;
        var head = document.getElementsByTagName('head')[0];
        if(jsFileCount > 0){
            for(var idx = 0; idx < jsFileCount; idx++){
                var jsFile = jsFiles[idx];
                if(hasLoadFiles[jsFile]){
                    loadFileCount--;
                    continue;
                }
                var jsIncludeFile = SmsJs.tool.getFileUrl(jsFile, "js");
                var script = document.createElement('script');
                script.type= 'text/javascript';
                script.setAttribute("data-path", jsFile);
                if(!script.readyState){
                    script.onload= function(){
                        hasLoadFiles[this.getAttribute("data-path")] = true;
                        loadFileCount--;
                    }
                }else{
                    script.onreadystatechange = function () {
                        if (this.readyState=='loaded' || this.readyState=='complete'){
                            hasLoadFiles[this.getAttribute("data-path")] = true;
                            loadFileCount--;
                        }
                    }
                }
                script.src= jsIncludeFile;
                head.appendChild(script);
            }
        }
        if(cssFileCount > 0){
            for(var idx = 0; idx < cssFileCount; idx++){
                var cssFile = cssFiles[idx];
                if(hasLoadFiles[cssFile]){
                    loadFileCount--;
                    continue;
                }
                var cssIncludeFile = SmsJs.tool.getFileUrl(cssFile, "css");
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.setAttribute("data-path", cssFile);
                if(!link.readyState){
                    link.onload= function(){
                        hasLoadFiles[this.getAttribute("data-path")] = true;
                        loadFileCount--;;
                    }
                }else{
                    link.onreadystatechange= function () {
                        if (this.readyState=='loaded' || this.readyState=='complete'){
                            hasLoadFiles[this.getAttribute("data-path")] = true;
                            loadFileCount--;
                        }
                    }
                }
                link.href = cssIncludeFile;
                head.appendChild(link);
            }
        }
        function await(){
            if(loadFileCount === 0){
                if(callBackFn){
                    callBackFn();
                }
            }else{
                setTimeout(await, 20);
            }
        }
        setTimeout(await, 20);
        if(dealFn){
            dealfn();
        }
        return SmsJs;
    }
    /*SmsJs入口，供第一次调用*/
    SmsJs.run = function(model){
        if(isRun){
            return;
        }
        isRun = true;
        var readyFn;
        function execute(){
            if(window.$){
                $(document).ready(function(){
                    SmsJs.plugin.render();
                    if(readyFn){
                        readyFn();
                    }
                    if(model){
                        SmsJs.include({"js":[model]});
                    }
                });
            }else{
                setTimeout(execute, 20);
            }
        }
        SmsJs.include({"js":["common/config", "common/boot", "common/jquery"]}, function(){
            SMS_JS_VERSION = SmsJs.config.get("SMS_JS_VERSION");
            readyFn = SmsJs.config.get("readyFn");
            execute();
        });
    }
    /*封装ajax request对象*/
    SmsJs.http = {
        renderLoadDiv:function(){
            var loadingDiv = document.createElement("DIV");
            var lodingHtml = "<div class=\"display-table\" name=\"loading_child_div\" style=\"position: fixed;_position:absolute;_top: expression(eval(document.documentElement.scrollTop - 100)); "
                + "z-index: 99999; left: 0px; top: 0px;_left:auto; zoom: 1; width: 100%; height: 100%; overflow: hidden;\"><div name=\"loading_child_div\" "
                + "style=\"position:absolute;width:100%;height:100%;background:#000;filter:alpha(opacity = 70);-moz-opacity:0.7;opacity:0.7;left: 0px; top: 0px;\">"
                + "</div><div class=\"ajaxloading\"></div></div>";
            $(loadingDiv).html(lodingHtml);
            $(loadingDiv).find("div[name='loading_child_div\']").css({"height": $(window).height() + 50});
            $("body").append($(loadingDiv));
            return loadingDiv;
        },
        request:function(options){
            if(!options || typeof(options) != "object"){
                return;
            }
            if(!options["dataUrl"]){
                return;
            }
            param = options["param"];
            var requestParams =  {};
            if(param && typeof(param) == "object"){
                requestParams = param;
            }
            var requestType = options["type"] ? options["type"] : "post";
            if(requestType == "post"){
                requestParams["_csrf"] = $("meta[name=csrf-token]").attr("content");
                if(!requestParams["_csrf"]){
                    return;
                }
            }
            var datatype = "json";
            var successCode = "200";
            var url = SmsJs.tool.getUrl(options["dataUrl"]);
            var async = true;
            var timeout = options["timeout"] ? parseInt(options["timeout"]) * 1000 : 10 * 1000;
            var dealStyle = options["dealStyle"] ? options["dealStyle"] : "normal";
            if(options["dataType"]){
                datatype = options["dataType"];
            }
            if(options["successCode"]){
                successCode = options["successCode"];
            }
            if(typeof(options["async"]) == "boolean"){
                async = options["async"];
            }
            var before = options["before"];
            var loadingDiv;
            var notLoading = options["notLoading"] ? options["notLoading"] : false;
            var copythis = this;
            if(!notLoading){
                loadingDiv = copythis.renderLoadDiv();
            }
            if(before){
                var data = before();
                if(data){
                    for(var key in data){
                        requestParams[key] = data[key];
                    }
                }
            }
            var content;
            $.ajax({
                url:url,
                data:requestParams,
                dataType:datatype,
                async:async,
                type:requestType,
                timeout:timeout,
                success:function(result){
                    content = result;
                    if(dealStyle == "normal"){
                        if(datatype == "json"){
                            if(result && result["code"] == successCode){
                                tag = true;
                                if(options["success"]){
                                    options["success"](result["data"]);
                                }
                            }else{
                                if(options["failed"]){
                                    options["failed"](result["message"], result["errors"], result["code"]);
                                }
                            }
                        }
                    }else if(dealStyle == "custom"){
                        if(options["success"]){
                            options["success"](result);
                        }
                    }
                    if(!notLoading){
                        $(loadingDiv).remove();
                    }
                },
                error:function(){
                    if(options["failed"]){
                        options["failed"]();
                    }
                    if(!notLoading){
                        $(loadingDiv).remove();
                    }
                }
            });
            return content;
        },
        extend:function(key, obj){
            this[key] = obj;
        }
    }
    /*定义对话框*/
    SmsJs.dialog = function(options){
        var copythis = this;
        options = options ? options : {};
        var dialogDiv = document.createElement("DIV");
        var dialogConfig = SmsJs.config.get("dialog");
        var type = options["type"] ? options["type"] : "show";
        var title = options["title"] ? options["title"] : "";
        var titleImg = options["titleImg"] ? options["titleImg"] : "";
        var content = options["content"] ? options["content"] : "";
        var ariaHidden = options["ariaHidden"] ? options["ariaHidden"] : false;
        var button = {};
        var execute;
        var dialogHtml = SmsJs.config.get("sms-dialog-html");
        var customEvent = options["event"] ? options["event"] : {};
        if(!dialogHtml){
            var dialogFormPath = dialogConfig["formPath"] ? dialogConfig["formPath"] : "";
            if(!dialogFormPath){
                return;
            }
            dialogHtml = SmsJs.http.request({
                dataUrl:dialogFormPath,
                type:"get",
                dataType:"text",
                async:false,
                notLoading:true
            });
            SmsJs.config.set("sms-dialog-html", dialogHtml);
        }
        $(dialogDiv).html(dialogHtml);
        /*定义相关事件*/
        if(typeof(options["closeDisplay"]) == "boolean" && !options["closeDisplay"]){
            $(dialogDiv).find("*[data-name='sms-dialog-btn-close']").hide();
        }
        var dialogCloseBtn = $(dialogDiv).find("*[data-name='sms-dialog-btn-close']");
        dialogCloseBtn.click(function(){
            if(customEvent["destroy"]){
                customEvent["destroy"]();
            }
            copythis.destroy();
        });
        var fn = {
            show: function(notShowHead){
                if (titleImg) {
                    $(dialogDiv).find("*[data-header-background]").css({
                        background: "url(" + titleImg["url"] + ") no-repeat center center",
                        "background-size":"cover"
                    });
                    $(dialogDiv).find("*[data-name='sms-dialog-form']").addClass("evaluate-modal");
                    if (!notShowHead) {
                        $(dialogDiv).find("*[data-name='dialog-show-img-header']").show();
                    }
                } else {
                    if (!notShowHead) {
                        $(dialogDiv).find("*[data-name='dialog-show-header']").show();
                    }
                }
                if(content){
                    $(dialogDiv).find("*[data-name='sms-dialog-show-content']").empty().html(content);
                }
                $(dialogDiv).find("*[data-name='sms-dialog-show-content']").show();
                if (title) {
                    $(dialogDiv).find("*[data-name='sms-dialog-title']").html(title);
                }
                var btnList = options["button"];
                if(btnList && btnList.length > 0) {
                    for(var idx = 0, len = btnList.length; idx < len; idx++){
                        var btnObject = btnList[idx];
                        if(btnObject["type"] == "list") {
                            var childBtnObj = $(dialogDiv).find("*[data-name='sms-dialog-btn-custom']").children("div");
                            var childButtonList = btnObject["buttonList"];
                            for(var childIdx = 0, childLen = childButtonList.length; childIdx < childLen; childIdx++)
                            {
                                var newBtn = childBtnObj.clone();
                                var name = childButtonList[childIdx]["name"];
                                var className = childButtonList[childIdx]["class"];
                                var buttonTag = childButtonList[childIdx]["type"] == "button" ? "button" : "a";
                                $(newBtn).find(buttonTag).html(name);
                                if(className){
                                    $(newBtn).addClass(className);
                                }
                                var buttonClassName = childButtonList[childIdx]["buttonClass"];
                                if(buttonClassName){
                                    $(newBtn).find(buttonTag).addClass(buttonClassName);
                                }
                                $(newBtn).attr("data-btnid", "child-" + childIdx);
                                if(childButtonList[childIdx]["click"]){
                                    $(newBtn).click(function(){
                                        var btnId = $(this).attr("data-btnid");
                                        btnId = parseInt(btnId.replace("child-", ""));
                                        if(childButtonList[btnId]["click"]()){
                                            dialogCloseBtn.click();
                                        }
                                    });
                                }else{
                                    $(newBtn).click(function(){
                                        dialogCloseBtn.click();
                                    });
                                }
                                button[name] = newBtn;
                                $(dialogDiv).find("*[data-name='sms-dialog-btn-list']").append(newBtn);
                            }
                        } else {
                            var btnObj = $(dialogDiv).find("*[data-name='sms-dialog-btn-standard']").children("div");
                            var newBtn = btnObj.clone();
                            var name = btnList[idx]["name"];
                            var className = btnList[idx]["class"];
                            var notDisplay = btnList[idx]["notDisplay"];
                            $(newBtn).find("button").html(name);
                            if(className){
                                $(newBtn).addClass(className);
                            }
                            var buttonClassName = btnList[idx]["buttonClass"];
                            if(buttonClassName){
                                $(newBtn).find("button").addClass(buttonClassName);
                            }
                            $(newBtn).attr("data-btnid", idx);
                            if(btnList[idx]["click"]){
                                $(newBtn).click(function(){
                                    var btnId = parseInt($(this).attr("data-btnid"));
                                    if(btnList[btnId]["click"]()){
                                        dialogCloseBtn.click();
                                    }
                                });
                            }else{
                                $(newBtn).click(function(){
                                    dialogCloseBtn.click();
                                });
                            }
                            button[name] = newBtn;
                            if(notDisplay)
                            {
                                $(newBtn).css({"display": "none"});
                            }
                            $(dialogDiv).find("*[data-name='sms-dialog-btn-list']").append(newBtn);
                        }
                    }
                    $(dialogDiv).find("*[data-name='dialog-footer-show']").show();
                }
            },
            alert:function(){
                var alertOption = typeof(options["alert"]) == "object" ? options["alert"] : {};
                var alertType = alertOption["type"];
                var second = options["time"];
                $(dialogDiv).find("*[data-name='sms-dialog-btn-cancel']").find("span").html("(" + second + ")");
                $(dialogDiv).find("*[data-name='dialog-alert-header']").show();
                if(options['title']=='Success!'){$(dialogDiv).find(".border-bottom").hide();}
                $(dialogDiv).find("*[data-name='dialog-alert-" + alertType + "']").show();
                if(content){
                    var contentObj = $(dialogDiv).find("*[data-name='sms-dialog-alert-content']");
                    contentObj.find("*[data-content]").html(content);
                    contentObj.show();
                }
                if(title){
                    $(dialogDiv).find("*[data-name='sms-dialog-title']").text(title);
                }
                $(dialogDiv).find("*[data-name='sms-dialog-btn-cancel']").addClass("btn-" + alertType);
                $(dialogDiv).find("*[data-name='sms-dialog-btn-cancel']").click(function(){
                    if(customEvent["destroy"]){
                        customEvent["destroy"]();
                    }
                    copythis.destroy();
                });
                $(dialogDiv).find("*[data-name='dialog-footer-alert']").show();
                function dialogClose(){
                    second = second - 1;
                    if(second == 0){
                        $(dialogDiv).find("*[data-name='sms-dialog-btn-cancel']").click();
                        return;
                    }
                    $(dialogDiv).find("*[data-name='sms-dialog-btn-cancel']").find("span").empty().html("(" + second + ")");
                    execute = setTimeout(dialogClose, 2000);
                }
                execute = setTimeout(dialogClose, 2000);
            },
            confirm:function(){
                var isWaring = options["isWaring"];
                var notShowHead = false;
                if (isWaring) {
                    var contentDiv = $(dialogDiv).find("*[data-name='sms-dialog-confirm-waring-html']");
                    contentDiv.find("*[data-content]").text(content);
                    content = contentDiv.html();
                    notShowHead = true;
                }
                this.show(notShowHead);
            },
            warning:function(){
                var warningObj = $(dialogDiv).find("*[data-name='sms-dialog-warning-cont']");
                $(warningObj).find("*[data-name='sms-dialog-warning-msg']").html(content);
                content = $(warningObj).html();
                this.show();
            },
            showImg: function(){
                var imgUrl = options["img"];
                var imgIframe = $(dialogDiv).find("*[data-name='dialog-show-img-iframe']");
                imgIframe.find("img").attr("src", imgUrl);
                imgIframe.show();
                $(dialogDiv).find("*[data-name='sms-dialog-form']").addClass("img-modal");
            }
        }
        this.Html = $(dialogDiv);
        this.getButtonByName = function(name){
            return button[name];
        }
        this.destroy = function(){
            $(dialogDiv).remove();
            $("body").removeClass("modal-open").css({"padding-right": "0px"});
            if(!ariaHidden){
                $(window).unbind("click");
            }
            dialogCloseBtn = null;
            dialogConfig = null;
            button = null;
            customEvent = null;
            if(execute){
                clearTimeout(execute);
            }
        }
        if(fn[type]){
            fn[type]();
            $("body").append(dialogDiv);
            $(dialogDiv).find("*[data-name='sms-dialog-form']").show();
            if(customEvent["initComplete"]){
                customEvent["initComplete"](this.Html);
            }
            var bodyScrollBarWidth = window.innerWidth - $(window).width();
            $("body").addClass("modal-open").css({"padding-right" : bodyScrollBarWidth + "px"});
            setTimeout(function(){$(dialogDiv).find("*[data-name='sms-dialog-form']").addClass("in");}, 50);
            if(!ariaHidden){
                setTimeout(function(){
                    $(window).click(function(e){
                        if($("#fancybox-overlay:visible").length > 0){
                            return;
                        }
                        var smsModalDialog = $(dialogDiv).find("*[data-name='sms-modal-dialog']");
                        var left = smsModalDialog.offset().left;
                        var top = smsModalDialog.offset().top;
                        var height = smsModalDialog.height();
                        var width = smsModalDialog.width();
                        var pageX = e.pageX;
                        var pageY = e.pageY;
                        if(pageX && pageY){
                            if(!(pageX >= left && pageX <= (left + width) && pageY >= top && pageY <= (top + height))){
                                copythis.destroy();
                            }
                        }
                    });
                }, 200);
            }
            fn = null;
        }
    }
})();

/*  公共文件的一些特效  */

//封装ajax
var OwenHttp = {
    request: function(options){
        if(!options || typeof(options) != "object"){
            return;
        }
        if(!options["dataUrl"]){
            return;
        }
        param = options["param"];
        var requestParams =  {};
        if(param && typeof(param) == "object"){
            requestParams = param;
        }
        var requestType = options["type"] ? options["type"] : "post";
        if(requestType == "post"){
            requestParams["_csrf"] = $("meta[name=csrf-token]").attr("content");
            if(!requestParams["_csrf"]){
                return;
            }
        }
        requestParams["random"] = Math.random();
        var async = true;
        if(typeof(options["async"]) == "boolean"){
            async = options["async"];
        }
        var datatype = "json";
        var successCode = "200";
        var url = options["dataUrl"];
        var timeout = options["timeout"] ? parseInt(options["timeout"]) * 1000 : 10 * 1000;
        if(options["successCode"]){
            successCode = options["successCode"];
        }
        $.ajax({
            url:url,
            data:requestParams,
            dataType:datatype,
            type:requestType,
            timeout:timeout,
            async:async,
            success:function(result){
                options["success"](result);
            },
            error:function(){
                options["failed"]();
            }
        });
    },
    dealPostData: function(paramRelation, datableTableData){
        var postData = {};
        for(var idx = 0, len = datableTableData.length; idx < len; idx++)
        {
            var name = datableTableData[idx]["name"];
            var value = datableTableData[idx]["value"];
            if(paramRelation[name]){
                postData[paramRelation[name]] = value;
            }
        }
        return postData;
    }
};
$(function() {
    console.log(CommonTool.browser());
    //头部秒表
    var _csrf = $('meta[name="csrf-token"]').attr('content');
    setInterval(function(){
        var date = new Date();
        var time = date.getFullYear()+'-'+supplement(date.getMonth()+1)+'-'+ supplement(date.getDate()) +' ' +supplement(date.getHours())+':'+supplement(date.getMinutes())+':'+supplement(date.getSeconds());
        //$('#dateTime').text(time);
        //innerText 不是W3C标准属性，因此我们无法在FireFox中使用它
        document.getElementById('dateTime').innerHTML = time;
        //document.getElementById('dateTime').textContent = time;
    },1000);
    function  supplement (x){
        //补0
        if(x<10) x = '0'+x;
        return x;
    }
    //退出登录
    logout = function(){
        OwenHttp.request({
            dataUrl: url.logout,
            success:function() {
                location.reload();
            }
        });
    };

    //生成左边导航栏
    OwenHttp.request({
        dataUrl: url.menuList,
        async: false,
        success:function(data){
            document.getElementById('left').innerHTML = data['html'];
            //$('.navbar-default.navbar-side').html(data['html']);
            //$('#left').load(data['html']);
        }
    });

    var hrefList = [] , html = location.href.split('#/')[1];
    var newHref = [
         'user_one.html'
    ];
    console.log(html);;
    if(html) {
        //$('#page-inner').load('views/'+html);
        $('#main-menu li a').removeClass('active-menu');
        $('#main-menu a.location-file').each(function(){
            //hrefList.push($(this).attr('href').split('#/')[1]);
            //代码优化
            hrefList.push(this.href.split('#/')[1]);
        });
        if($.inArray(html , hrefList) >= 0){
            $('#main-menu').find('a.location-file').each(function(){
                 if(this.href.split('#/')[1] == html){
                     //this.classList.add('active-menu');
                     $(this).addClass('active-menu');
                     //this.parentNode.parentNode.classList.remove('hidee');
                     $(this).parent('li').parent('ul').show();
                     var jsc = html.substring(0,html.indexOf('.')).split('_');
                     var script = document.createElement("script");
                     script.src = '/js/' + jsc[0] + '/' + jsc[1] + '.js?v='+Math.random();
                     $('#page-inner').load('views/'+html,function(){
                         $('#addScript').html(script);
                     });
                 }
             });
        } else if($.inArray(html , newHref) >= 0){
            var jsc = html.substring(0,html.indexOf('.')).split('_');
            var script = document.createElement("script");
            script.src = '/js/' + jsc[0] + '/' + jsc[1] + '.js?v='+Math.random();
            $('#page-inner').load('views/'+html,function(){
                $('#addScript').html(script);
            });
        } else {
            window.location.href = "error";
        }
    }
    /*实现局部刷新（头部与导航不刷新）*/
    $('#left').on('click' , 'a.location-file' , function(){
        var html = $(this).attr('href').split('#/')[1];
        if(html) {
            if($(this).parent().parent().hasClass('nav')){
                var jsc = html.substring(0,html.indexOf('.')).split('_');
                var script = document.createElement("script");
                script.src = '/js/' + jsc[0] + '/' + jsc[1] + '.js?v='+Math.random();
                $('#page-inner').load('views/'+html,function(){
                    $('#addScript').html(script);
                });
            }else {
                $('#main-menu li ul').slideUp();
                $('#main-menu li a').children('span').removeClass('icon-angle-down').addClass('icon-angle-right');
                $('#main-menu li a').removeClass('active-menu');
                $('#page-inner').load('views/'+html);
                var jsc = html.substring(0,html.indexOf('.')).split('_');
                var script = document.createElement("script");
                script.src = '/js/' + jsc[0] + '/' + jsc[1] + '.js?v='+Math.random();
                $('#page-inner').load('views/'+html,function(){
                    $('#addScript').html(script);
                });
            }
        }
    });

    /**
     * 左边菜单
     */
    //左边菜单鼠标事件
    $('#left').on({
        mouseover:function(){$(this).addClass('active-over')},
        mouseout:function(){$(this).removeClass('active-over')},
        click:function(){
            //二极菜单的显示影藏
            if($(this).children('span').hasClass('arrow')){
                if($(this).siblings('ul').is(':hidden')){
                    $(this).parent().siblings('li').each(function(){
                        if($(this).children('ul').children('li').children('a').hasClass('active-menu')){
                            $(this).children('a').addClass('active-menu');
                        }
                    });
                    if($(this).siblings('ul').children('li').children('a').hasClass('active-menu')){
                        $(this).removeClass('active-menu');
                    }
                    $(this).parent().siblings().children('ul').slideUp();
                    $(this).parent().siblings().children('a').children('span').removeClass('icon-angle-down').addClass('icon-angle-right');
                    $(this).siblings('ul').slideDown();
                    $(this).children('span').removeClass('icon-angle-right').addClass('icon-angle-down');
                }else {
                    if($(this).siblings('ul').children('li').children('a').hasClass('active-menu')){
                        $(this).addClass('active-menu');
                    }
                    $(this).siblings('ul').slideUp();
                    $(this).children('span').removeClass('icon-angle-down').addClass('icon-angle-right');
                }
            } else {
                $('#left #main-menu li a').removeClass('active-menu');
                $(this).addClass('active-menu');
            }
        }
    }, '#main-menu li a');

    //导航栏的显示影藏
    $('#left').on('click', '#sideNav', function(){
        if($(this).hasClass('closed')){
            $('.navbar-side').animate({left: '0px'});
            $(this).removeClass('closed');
            $('#page-wrapper').animate({'margin-left' : '260px'});
        }
        else{
            $(this).addClass('closed');
            $('.navbar-side').animate({left: '-260px'});
            $('#page-wrapper').animate({'margin-left' : '0px'});
        }
    });
});
