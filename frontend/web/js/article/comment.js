/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    var postData = [];
    var token = $('meta[name=csrf-token]').attr('content');
    var article_id = $("#index").attr("data-id");
    /**
     *index-head
     */
    var prompt = $(".detail-head .prompt");
    var content = $(".detail-head .content:eq(1)");
    prompt.click(function(){
        if(content.is(":visible")){
            content.addClass('hide');
            prompt.text("︾");
        }else {
            content.removeClass('hide');
            prompt.text("︽");
        }
    });

    $(".comment-detail-reply").each(function(){
        var marginleft = $(this).attr('data-level');
        $(this).css("margin-left",20*marginleft+'px');
    });

    var inputT = $(".input-text");
    var inputB = $(".input-button");
    var comment_id = 0;
    $(".icon-reply").click(function(){
        $(this).siblings('.comment-value').removeClass("hide");
        comment_id = $(this).siblings('.comment-user').attr('data-id');
    });
    $(".shut-down").click(function () {
        $(this).parent('.comment-value').addClass("hide");
    });
    inputB.click(function(){
        var content = $(this).siblings('.input-text').val();
        if(content != ''){
            $.ajax({
                url:"/api/comment/add",                         //(默认: 当前页地址) 发送请求的地址。
                data:{
                    _csrf: token,
                    comment_id: comment_id,
                    article_id: article_id,
                    content: content
                },                             //发送到服务器的参数,  所有的post请求都需要_csrf:token
                dataType:'json',                                //预期服务器返回的数据类型;
                type:'POST',                                    //请求方式 ("POST" 或 "GET")
                //async:async,                                  //(默认: true) 默认设置下，所有请求均为异步请求
                success:function(data){   //请求成功后回调函数
                    window.location.href = "/article/detail/"+article_id;
                },
                error:function(XMLHttpRequest){                             //请求失败时将调用此方法
                    //console.log(da , mess);
                    alert(XMLHttpRequest.responseJSON.message+"");
                }
            });
        }else {
            $(this).siblings('.input-text').focus();
        }

    });
    $(".comment-content").click(function(){
        var commentreply = $(this).siblings('.comment-detail-reply');
        if(commentreply){
            var arr = commentreply.attr("class").split(' ');
            if($.inArray('hide' , arr) > 0){
                $(this).siblings('.comment-detail-reply').removeClass("hide");
            }else {
                $(this).siblings('.comment-detail-reply').addClass("hide");
            }
        }
        return false;
    });
});