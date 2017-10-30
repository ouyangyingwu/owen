$(function(){
    /**
     * 换肤(切换模型或范围的颜色)
     *
     * 所有关于cookie的内容都需要放置在服务器内才会产生效果
     * 2017.9.19
     * */
    var range = $("#range");
    var model = $("#model");
    if($.cookie('range_class')){        //判断背景的cookie手否存在
        var option = document.getElementsByClassName($.cookie('range_class'));
        //var option = $('.'+ $.cookie(range_class))    //效果同上一句代码
        var color = $(option[0]).css('border-color');
        $(option[0]).css('background' , color);         //选项背景颜色用保存的颜色
        range.css('background' , color);                //背景的颜色用保存的颜色
    }else {
        var option = document.getElementsByClassName('color_2');
        var color = $(option[0]).css('border-color');
        $(option[0]).css('background' , color);         //设置默认肤色
    }
    if($.cookie('model_class')){        //判断模型的cookie手否存在
        var option = document.getElementsByClassName($.cookie('model_class'));
        var color = $(option[1]).css('border-color');
        $(option[1]).css('background' , color);
        model.css('background' , color);
    }else {
        var option = document.getElementsByClassName('color_3');
        var color = $(option[1]).css('border-color');
        $(option[1]).css('background' , color);
    }
    //为背景和模型切换颜色
    $("#b_color li,#m_color li").click(function () {
        //设置cookie的过期时间
        var expiresDate= new Date();
        expiresDate.setTime(expiresDate.getTime() + (7 * 24 * 60 * 60 * 1000));    //有效期为七天
        var color = $(this).css('border-color');
        var cl = $(this).attr('class');
        var f_id = $(this).parent().parent().attr('id')
        if(f_id == 'b_color'){
            if($.cookie('model_class') == cl){
                alert('背景颜色与模型颜色不能相同！！！');
                return;
            }else {
                range.css('background' , color);
                //$.cookie('range_class',cl , {expires: 7});            //存入一个名为range_class，值为cl,有效期为expiresDate天的cookie（这项功能只有通过服务器上才起作用）
                $.cookie('range_class',cl , {expires: expiresDate});    //存入一个名为range_class，值为cl,有效期为expiresDate天的cookie（这项功能只有通过服务器上才起作用）
            }
        }else {
            if($.cookie('range_class') == cl){
                alert('模型颜色与背景颜色不能相同！！！');
                return;
            }else {
                model.css('background' , color);
                $.cookie('model_class',cl , {expires: expiresDate});
            }
        }
        $(this).css('background' , color).siblings().css('background' , '');
        //$.cookie(f_id , color , {expires:7 , path:'/'});
        // $.cookie["f_id"] = color;
    });

    /**
     * 鼠标点击移动和键盘方向控制移动
     *
     * 点击模型时移动是因为事件冒泡，需要在模型时就阻止事件冒泡
     * 传入的参数需要进行数据类型转换处理（speed = parseInt(speed)）
     * 2017.9.18
     * */
    //使点击模型时不会移动
    model.click(function(){
        return false;                   //阻止事件冒泡
        //event.stopPropagation();      //阻止事件冒泡
    });
    //模型跟随鼠标点击的位置
    range.click(function(e){
        //判断当前是否处于动画状态
        if(model.is(":animated")){
            //停止当前的动画
            model.stop(true);
        }
        //获取鼠标相对范围的位置
        var x = e.offsetX+"px",y = e.offsetY+"px";
        //界定模型的边界，使之不能超出范围之外
        var width = parseInt(range.css("width"))-parseInt(model.css("width")),height = parseInt(range.css("height"))-parseInt(model.css("height"));
        if(e.offsetX > width) x = width;
        if(e.offsetY > height) y = height;
        //获取当前模型的位置
        var x_model = model.css("left"), y_model = model.css("top");
        //计算需要的时间
        var x_time = Math.abs(e.offsetX-parseInt(x_model))*10, y_time = Math.abs(e.offsetY-parseInt(y_model))*10;
        var speed = $("#parameter>div:first>input").val();
        if (isNaN(speed) || speed<0){
            alert("输入的参数有误");
            return false;
        }else if(speed){
            x_time = Math.abs(e.offsetX-parseInt(x_model))/speed*1000, y_time = Math.abs(e.offsetY-parseInt(y_model))/speed*1000;
        }
        //模型动画
        model.animate({left:x},x_time).animate({top:y},y_time);
        //event.stopImmediatePropagation();                           //阻止事件捕获
        //event.stopPropagation();                                    //阻止事件冒泡
        //return false;
    });
    //键盘控制模型移动的方向
    range.keydown(function(e){
        //判断当前是否处于动画状态
        if(model.is(":animated")){
            //停止当前的动画
            model.stop(true);
        }
        var x_model = model.css("left"), y_model = model.css("top");
        var speed = $("#parameter>div").eq(1).find("input").val();
        if (isNaN(speed) || speed<0){
            alert("输入的参数有误");
            return false;
        }else if(speed){
            speed = parseInt(speed);
        }else {
            speed = 1;
        };
        x_model = parseInt(x_model);
        y_model = parseInt(y_model);
        if(e.keyCode == 37){
            x_model-=speed;
        }else if(e.keyCode == 38){
            y_model-=speed;
        }else if(e.keyCode == 39){
            x_model+=speed;
        }else if(e.keyCode == 40){
            y_model+=speed;
        };
        //界定模型的边界，使之不能超出范围之外
        var width = parseInt(range.css("width"))-parseInt(model.css("width")),height = parseInt(range.css("height"))-parseInt(model.css("height"));
        if(x_model < 0) x_model = 0;
        if(x_model > width) x_model = width;
        if(y_model < 0) y_model = 0;
        if(y_model > height) y_model = height;
        //重新定位
        model.css({top:y_model+"px" , left:x_model+"px"});
    });

    /**
     * 点击上下页进行图片的切换
     *
     * :eq()与.eq()效果类似，但是:eq()内只能放确定的值，而.eq()可以放表达式
     * 2017.9.19
     * */
    //图片展示
    var pag = 1,i = 4;
    //点击下一页
    $("#show_btn .last").click(function(){
        var amount = $("#img li").length;
        var width = $("#img").css('width');
        //判断当前是否处于动画状态
        if(model.is(":animated")){
            //停止当前的动画
            model.stop(true);
        }
        if(pag < Math.ceil(amount/i)){
            pag++;
            $("#img>ul").animate({left:'-='+width});
        }else{
            $("#img>ul").animate({left: 0+'px'});
            pag = 1;
        }
        //.eq()里面可以放表达式，:eq()内只能放数字
        $("#show_tip").children().eq(pag-1).addClass('style').siblings().removeClass('style');
    });
    //点击上一页
    $("#show_btn .first").click(function(){
        var amount = $("#img li").length;
        var width = $("#img").css('width');
        //判断当前是否处于动画状态
        if(model.is(":animated")){
            //停止当前的动画
            model.stop(true);
        }
        if(pag > 1){
            pag--;
            $("#img>ul").animate({left:'+='+width});
        }
        //.eq()里面可以放表达式，:eq()内只能放数字
        $("#show_tip").children().eq(pag-1).addClass('style').siblings().removeClass('style');
    });

    $(".js-silder").silder({
        auto: true,//自动播放，传入任何可以转化为true的值都会自动轮播
        speed: 20,//轮播图运动速度
        sideCtrl: true,//是否需要侧边控制按钮
        bottomCtrl: true,//是否需要底部控制按钮
        defaultView: 0,//默认显示的索引
        interval: 300,//自动轮播的时间，以毫秒为单位，默认3000毫秒
        activeClass: "active",//小的控制按钮激活的样式，不包括作用两边，默认active
    });
});

