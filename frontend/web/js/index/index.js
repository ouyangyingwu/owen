/**
 * Created by admin on 2017/9/22.
 */
$(function(){
    /**
     *index-head
     */
    var ladder = $(".index-head-left div");
    var content = $(".content");
    ladder.mouseenter(function(){
        var text = $(this).children().text();
        var id = $(this).attr('data-id');
        var rightText = content.text();
        var time = text.length;
        $.ajax({
            url:"/api/Article/One",  //(默认: 当前页地址) 发送请求的地址。
            data:{id:id},                                        //发送到服务器的数据
            //dataType:datatype,                              //预期服务器返回的数据类型
            type:'POST',                                    //请求方式 ("POST" 或 "GET")
            timeout:3000,                                   //设置请求超时时间（毫秒）。此设置将覆盖全局设置。
            //async:async,                                    //(默认: true) 默认设置下，所有请求均为异步请求
            success:function(data){                       //请求成功后回调函数

            },
            error:function(){                               //请求失败时将调用此方法
                alert('请求失败');
            }
        });
        if(ladder.is(":animated")){
            //停止当前的动画
            ladder.stop(true);
        }
        $(this).css({background:'#FFFD9F'}).animate({width:300+'px'},500);
        if(text != rightText){
            content.lbyl({
                content: text,
                speed: time, type: 'show'});
        }
    });
    ladder.mouseleave(function () {
        $(this).css({background:'#96FF93'}).animate({width:100+'px'},500);
    });
});