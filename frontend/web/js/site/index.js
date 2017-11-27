/**
 * Created by admin on 2017/9/22.
 */
$(function(){
    /**
     *index-head
     */
    var arr = [];
    var token = $('meta[name=csrf-token]').attr('content');     /*所有ajax的post请求都需要传递这个参数*/
    $(".index-head-left>div").each(function(){
        arr.push($(this).attr("data-id"));                      //获取首页展示的所有文章的id用于查询文章
    });

    /*var list = [];
    if(list.length == 0){
        $.ajax({
            url:"/api/article/list",                         //(默认: 当前页地址) 发送请求的地址。
            data:{_csrf:token , id:arr},                             //发送到服务器的参数,  所有的post请求都需要_csrf:token
            dataType:'json',                                //预期服务器返回的数据类型;
            type:'POST',                                    //请求方式 ("POST" 或 "GET")
            //async:async,                                  //(默认: true) 默认设置下，所有请求均为异步请求
            success:function(data , textStatus , jqXHR ){   //请求成功后回调函数
                list = data.data;
            },
            error:function(da,mess){                             //请求失败时将调用此方法
                console.log(da , mess);
                alert("数据连接失败！");
            }
        });
    }*/
    var ladder = $(".index-head-left div");
    var content = $(".content");
    ladder.mouseenter(function(){
        var id = $(this).attr('data-id');
        var rightText = content.text();
        var articleList = SmsJs.config.get("articleList");
        console.log(articleList);
        for(var i=0;i<articleList.length;i++){
            if(articleList[i].id == id){
                var time = articleList[i].describe.length;
                content.attr('href','/article/detail/'+articleList[i].id);
                if(articleList[i].describe != rightText){
                    content.lbyl({
                        content: articleList[i].describe,
                        speed: time, type: 'show'
                    });
                }
            }
        }
        if(ladder.is(":animated")){
            //停止当前的动画
            ladder.stop(true);
        }
        $(this).css({background:'#FFFD9F'}).animate({width:300+'px'},500);
    });

    ladder.mouseleave(function () {
        $(this).css({background:'#96FF93'}).animate({width:100+'px'},500);
    });
});