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
    }
};

//计时器
(function($){
    $.fn.numberRock=function(options){
        var defaults={
            speed:24,
            count:100
        };
        var opts=$.extend({}, defaults, options);
        var div_by = 100,
            count=opts["count"],
            speed = Math.floor(count / div_by),
            sum=0,
            $display = this,
            run_count = 1,
            int_speed = opts["speed"];
        var int = setInterval(function () {
            if (run_count <= div_by&&speed!=0) {
                $display.text(sum=speed * run_count);
                run_count++;
                $display.parent().removeClass('hide');
            } else if (sum < count) {
                $display.text(++sum);
            } else {
                clearInterval(int);
            }
        }, int_speed);
    }

})(jQuery);