/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    var postData = [];
    var token = $('meta[name=csrf-token]').attr('content');
    var article_id = $("#index").attr("data-id");

    function addArticle(){
        var postData = [];
        postData['title'] = $('#title').val();
    }

});