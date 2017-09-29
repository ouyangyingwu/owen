/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    var postData = [];
    var token = $('meta[name=csrf-token]').attr('content');
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

    var inputT = $("#input-text");
    var inputB = $("#input-button");
   /* inputT.focus(function(){
        inputT.val('');
    });
    inputT.blur(function(){
        if(inputT.val() == ''){
            inputT.val('评论:');
        }
    });*/
    inputB.click(function(){
        if(inputT.val() != ''){
            postData['_csrf'] = token;
            postData['comment_id'] = 0;
            postData['user_id'] = 1;
            postData['article_id'] = $("#index").attr('data-id');
            postData['content'] = inputT.val();
            $.ajax({
                url:"/api/comment/add",                         //(默认: 当前页地址) 发送请求的地址。
                data:{
                    _csrf: token,
                    comment_id: 0,
                    user_id: 1,
                    article_id: $("#index").attr('data-id'),
                    content: inputT.val()
                },                             //发送到服务器的参数,  所有的post请求都需要_csrf:token
                dataType:'json',                                //预期服务器返回的数据类型;
                type:'POST',                                    //请求方式 ("POST" 或 "GET")
                //async:async,                                  //(默认: true) 默认设置下，所有请求均为异步请求
                success:function(data){   //请求成功后回调函数

                },
                error:function(da,mess){                             //请求失败时将调用此方法
                    console.log(da , mess);
                    alert("数据连接失败！");
                }
            });
        }else {
            inputT.focus();
        }

    });

});