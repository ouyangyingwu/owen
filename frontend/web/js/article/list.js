/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    //if(!$.cookie['user']){window.location.href = "/site/login";}
    var token = $('meta[name=csrf-token]').attr('content');
    var article_id = $("#index").attr("data-id");
    var params = {"id": "","type":"","user_id":"",page:1};
    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params['page'] = 1;
        if ($('.select-id').val()) {
            params["id"] = $('.select-id').val();
        }
        if ($('.select-type').val()) {
            params["type"] = $('.select-type').val();
        }
        if ($('.select-user_id').val()) {
            params["user_id"] = $('.select-user_id').val();
        }
        articleList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-id').val('');
        $('.select-type').val('');
        $('.select-user_id').val('');
        articleList();
    });
    //用户筛选
    (function(){
        $.ajax({
            url:"/api/user/list",
            data:{_csrf:token , select:['id' , 'username']},
            dataType:'json',
            type:'POST',
            success:function(data){
                if(data){
                    var html = '';
                    if(data){
                        for (var i=0;i<data.length;i++){
                            html += '<option value="'+data[i]['id']+'">';
                            html += data[i]['username'];
                            html += '</option>';
                        }
                    } else {
                        html = '';
                    }
                    $('.select-user_id').append(html);
                }
            },
            error:function(XMLHttpRequest){
                alert(XMLHttpRequest.responseJSON.message+"");
            }
        });
    })();

    function typetostr(type){
        //console.log(type);
        switch (type){
            case 1: type = '成长日记';return type;break;
            case 2: type = '日常小结';return type;break;
            case 3: type = '读书笔记';return type;break;
            case 4: type = '人生感悟';return type;break;
        }
       // console.log(type);
        return type;
    }
    var createButtonList = function(row){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" model-type=\"activeEmployee\" class='test' ><i class=\"icon-edit\"></i> Edit</a>");
        buttonList.push("<a name=\"table-button-list\" model-type=\"deleteCoupon\" ><i class=\"icon-trash\"></i> Remove</a>");

        return buttonList;
    }


    //articleList
    function articleList(params){
        if(params){
            var id = params['id'];
            var type = params['type'];
            var user_id = params['user_id'];
            var page = params['page'];
        }
        $.ajax({
            url:"/api/article/list",
            data:{_csrf:token,
                id:id,
                type: type,
                user_id: user_id,
                page: page,
            },
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = Math.ceil(data.total/2);
                var data = data.data;
                var html = '';
                if(total>0){
                    //数据列表
                    for (var i=0;i<data.length;i++){
                        data[i]['describe'] = data[i]['describe'].length < 30 ? data[i]['describe'] : data[i]['describe'].substring(0,30)+'...';
                        data[i]['type'] = typetostr(data[i]['type']);
                        var button = createButtonList(data[i]['id'])
                        button = CommonTool.renderActionButtons(button);
                        //console.log(data[i]['type']);

                        html += '<tr class="article odd" role="row">';
                        html +='<td><a href="/article/detail/'+data[i]["id"]+'">'+data[i]["id"]+'</td>';
                        html +='<td>'+ data[i]['user']['username'] +'</td>';
                        html +='<td>'+ data[i]['title']+'</td>';
                        html +='<td>'+ data[i]['describe'] +'</td>';
                        html +='<td>'+ data[i]['type'] +'</td>';
                        html +='<td>'+ CommonTool.formatTime(data[i]['create_time'], "Y-m-d a") +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码
                    var per_page = 5;
                    if(total < 5){ per_page = total;}
                    //$('#visible-pages').empty().removeClass();
                    $('#visible-pages').twbsPagination({
                        totalPages: total,
                        visiblePages: per_page,
                        page: params['page'],
                        version: '1.1'
                    });
                } else {
                    html = '';
                    $('#visible-pages').empty();
                }
                $('#table-article-list tbody').empty();
                $('#table-article-list tbody').append(html);
                $('.test').click(function(){
                    alert(444);
                })
            },
            error:function(XMLHttpRequest){
                alert(XMLHttpRequest.responseJSON.message+"");
            }
        });
    }
    articleList(params);

    var page = 1;
    /*$('#visible-pages').on('click' ,'li', function(){
        var dataPage = $(this).attr('data-page');
        console.log(dataPage);
        if(dataPage != page){
            page = dataPage;
            params['page']=dataPage;
            articleList(params);
        }
    });*/
    $('#visible-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        //console.log(dataPage);
        if(dataPage != page){
            page = dataPage;
            params['page']=dataPage;
            articleList(params);
        }
    });
});