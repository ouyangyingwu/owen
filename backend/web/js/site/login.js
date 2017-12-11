/**
 * Created by admin on 2017/11/30.
 */
$(function() {
    var _csrf = $('meta[name="csrf-token"]').attr('content');
    $('#postSubmit').click(function(){
        var postDate = {};
        postDate['_csrf-backend'] = _csrf;
        postDate['_csrf-backend'] = [
            username = $('form input[type = "text"]').val(),
            password = $('form input[type = "password"]').val()
        ]
        console.log(postDate);
        alert(postDate);
        $.ajax({
            url: 'site/login',
            data: postDate,
            type: 'POST',
            dateType:'json',
            success:function(){},
            error:function(XMLHttpRequest){
                alert(XMLHttpRequest.responseJSON.message+"");
            }
        });
    })
});
