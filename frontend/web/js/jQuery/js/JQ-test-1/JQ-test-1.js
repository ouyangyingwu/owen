$(function(){
    //第一块
    var mover = $(".mover");
    var li = $(".mover li");
    mover.on({
        //鼠标移动到class为move的元素上时，显示它的子类中class为1的元素;
        mouseenter:function(){
            $(this).children("li:hidden").show();
            //:hidden选取所有不可见元素，:visible选取所有可见元素
        },
        //鼠标移出class为move的元素时，影藏它的子类中class为li的元素;
        mouseleave:function(){
            $(this).children("li").hide();
        },
        //鼠标点击class为move的元素时，为被点击元素添加stlye样式，并且把它的兄弟元素的stlye样式删除;
        //根据被点击元素的值显示对应的内容
        click:function(){
            $(this).addClass("stlye").siblings().removeClass("stlye");
            switch ($(this).children("span").text()){
                case "哈哈":
                    $("#body div:first").show().siblings().hide();	//#body下的第一个div
                    break;
                case "呵呵":
                    $("#body div:eq(1)").show().siblings().hide();	//#body下的索引为一div，索引从0开始
                    break;
                case "嘻嘻":
                    $(".san").show().siblings().hide();				//class为san的元素
                    break;
                case "嘿嘿":
                    $("#body div:last").show().siblings().hide();	//#body下的最后一个div
                    break;
            }
        }
    });
    li.on({
        //鼠标移动到当前元素上时，为他加上stlye样式且显示它的子类中class为2的元素;
        mouseenter:function(){
            $(this).addClass("stlye").children("ul").children("li").show();
        },
        //与上相反
        mouseleave:function(){
            $(this).removeClass("stlye").find("li").hide();
        }
    });

    //第二块
    $("#submit").on({
        click: function () {if($("#cr").is(':checked')){
            $(this).attr('type' , 'submit');
        }else{alert("请先阅读协议！");}}
    });
    //跟随鼠标显示title和大图
    $("#from>a").mouseover(function(e){             //移入创建
        this.titles = this.title;
        this.title = "";
        var title = "<div id='image'  style=''><img id='img' src='image/imag_1.jpg' width='800px;'/><p>"+this.titles+"</p></div>";
        $("body").append(title);
    }).mouseout(function(){                         //移除删除
        this.title =  this.titles;
        $("#image").remove();
    }).mousemove(function(e){                        //移动跟随
        var x = 20,y = -20;
        $("#image").css({"top": (e.pageY+y)+"px", "left": (e.pageX+x)+"px"}).show();    //使图片跟随鼠标
    });

    //第三块
    var hide = $("#pingpai ul li:gt(3):lt(-2)");	/*获取第五至倒数第三个li; gt(3):not(:last)获取第5至倒数第2个li*/
    var btn = $(".btn>a");
    var last = $("#pingpai ul li:last");
    hide.hide();
    //实现部分显示与全部显示的切换
    btn.click(function(){
        if(hide.is(":visible")){
            hide.hide();
            $(".btn>a>span").text("显示全部品牌");
            $("#pingpai ul li").filter(":contains('伊利') , :contains('旺仔')").removeClass("stlye");
        }else {
            hide.show();
            $(".btn>a>span").text("精简显示");
            $("#pingpai ul li").filter(":contains('伊利') , :contains('旺仔')").addClass("stlye");	//filter筛选符合要求的元素，推荐品牌添加特殊样式
        }
        return false;	//超链接不跳转,如果用户禁用了js 那么跳转到完整的页面
    });
    //添加品牌的弹框
    $("#pingpai ul li:eq(-2)").on("click", function(){
        var fatherId = $("#cover");
        var child = $("#brand_alert");
        cover(fatherId , child);
    });
    //确认添加品牌
    $("#brand_alert .footer button").on("click" , function(){
        var html = $("#brand>input").val();
        if(!html){
            var fatherId = $("#cover");
            var child = $("#dialog_alert");
            var content = "请填入内容！请填入内容请填入内容请填入内容请填入内容请填入内容请填入内容";
            cover(fatherId , child ,content);
            return;
        }
        $("#pingpai ul li:eq(-2)").before("<li value='"+$("#brand>input").val()+"'>"+$("#brand>input").val()+"</li>");
        $("#brand_alert").hide();
        $("#cover").hide();
    });
    //为品牌加上多选框用于选择，并且弹出框
    last.click(function(){
        if(last.attr("class") == 'first_step'){
            $("#pingpai ul li input").remove();
            $("#pingpai ul li:visible:not(:gt(-3))").prepend("<input type='checkbox' style='width: 14px;height: 14px;' />");
            last.text("确认删除").attr("class" , "last_step");
        }else if(last.attr("class") == 'last_step') {
            if($("#pingpai ul li input").is(":checked")) {
                var fatherId = $("#cover");
                var child = $("#whether_alert");
                var content = "是否确认删除？";
                cover(fatherId, child, content);
            }else{
                var fatherId = $("#cover");
                var child = $("#dialog_alert");
                var content = "请选择需要删除的品牌";
                cover(fatherId, child, content);
            }
        }
    });
    //确认删除
    $(".yse").click(function(){
        $("#pingpai ul li input:checked").parent().remove();
        $("#pingpai ul li input").remove();
        last.text("确认删除").attr("class" , "first_step");
        $("#cover").slideUp();
        $(this).parents(".alert_list").slideUp();

    });

    //第四块
    //事件冒泡测试
    var text = $("#bubble>.text");
    $("#bubble").on('click' , function(e){
        console.log(e , $(this));
        text.append("这是父元素的点击事件<br/>");
        //e.stopPropagation();                        //停止事件冒泡
        return false;                               //同时调用stopPropagation  和 preventDefault(阻止默认行为)
    });
    $("#bubble>.click").on('click' , function(e){
        text.append("这是兄弟元素的点击事件<br/>");
        //e.stopPropagation();                        //停止事件冒泡
        return false;
    });
    $("#bubble>.click>p").on('click' , function(e){
        $(e.target).append("这是子元素的点击事件<br/>");
        //text.append("这是子元素的点击事件<br/>");
        //e.stopPropagation();                         //停止事件冒泡
        return false;
    });

    //弹框遮罩层
    function cover(coverId , windowId , content){
        coverId.show();windowId.show();                             //显示遮罩和窗口
        pageHeight = $(window).height();                            //当前浏览器可视区域的高度
        pagerWidth = document.body.scrollWidth;
        Width = windowId.width();
        Width = (pagerWidth/2)-(Width/2)-10;
        coverheight = $(document.body).height();                    //整个html页面的高度
        if(coverheight < pageHeight) coverheight = pageHeight;       //页面高度和可视高度谁的值大就用谁
        if(Width < 0) Width = 0;
        coverId.css({height:coverheight+'px'});
        windowId.css({top:25+'%' , left:Width+'px'});  //设置定位的高度
        if(content){
            windowId.children(".content").text("");
            windowId.children(".content").append(content);
        }
    }
    $("#cover").click(function () {                                 //点击遮罩
        if($("#dialog_alert").css("display") == "none"){
            $("#alert .alert_list").slideUp();
            $("#cover").fadeOut(800);
        }
    });
    $(".close,.X").click(function () {
        $(this).parents(".alert_list").slideUp();            //向上滑动影藏,slideDown向下显示
        if(!$(this).parents(".alert_list").siblings().is(":visible")){
            $("#cover").fadeOut(800);                       //渐影，与fadeIn相反
        }
    });
});
