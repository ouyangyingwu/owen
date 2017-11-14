/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    //var postData = [];
    var token = $('meta[name=csrf-token]').attr('content');
    var article_id = $("#index").attr("data-id");

    $("#addArticle").on('click' , function(){
        /*var postData = [];
        postData['_csrf'] = token;
        postData['title'] = $('#title').val();
        postData['type'] = $('#type').val();
        postData['summary'] = $('#summary').val();
        postData['content'] = $('#content').val();
        postData['is_released'] = $('#is_released').val();
        console.log(postData);*/
        $.ajax({
            url:"/api/article/add",
            data:{_csrf:token,
                title:$('#title').val(),
                type: $('#type').val(),
                describe: $('#summary').val(),
                content: $('#summary').val(),
                is_released: $('#is_released').val()
            },
            dataType:'json',
            type:'POST',
            success:function(data){
                window.location.href = "/article/index";
            },
            error:function(XMLHttpRequest){
                alert(XMLHttpRequest.responseJSON.message+"");
            }
        });
    });

});