/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    //if(!$.cookie['user']){window.location.href = "/site/login";}
    var token = $('meta[name=csrf-token]').attr('content');
    var article_id = $("#index").attr("data-id");
    var params = {_csrf:token};

    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params = {_csrf:token};
        params["page"] = 1;
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
        params = {page:1 , _csrf:token};
        articleList(params);
    });
    //用户列表下拉框
    var user = false;
    (function(){
        $.ajax({
            url:"/api/user/list",
            data:{_csrf:token , select:['id' , 'username']},
            dataType:'json',
            type:'POST',
            success:function(data){
                if(data){
                    user = data;
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

    //init edit form
    var getEditSource = function(name){
        switch(name){
            case  'user_id':
                var userList = [];
                for(var i = 0 ; i < user.length; i++){
                    userList.push({"value": user[0].id, "text": user[0].username});
                }
                return userList;
            case 'type':
                return [
                    {value: 1, text: '成长日记'},
                    {value: 2, text: '日常小结'},
                    {value: 3, text: '读书笔记'},
                    {value: 4, text: '人生感悟'}
                ];
            case 'is_released':
                return [
                    {value: 1, text: 'True'},
                    {value: 0, text: 'False'}
                ];
            default:
                return null;
        }
    };
    //详情
    function initEditForm(data){
        //console.log(data);
        //data.type = typetostr(data.type);
        $.fn.editable.defaults.mode = 'inline';
        $('#article-detail').find("[name='form-edit']").each(function(){
            var name = $(this).attr("data-name");
            var dataType = $(this).attr("data-type");
            var copythis = this;
            var editSource = getEditSource(name);
            var displayValue = data[name];
            //$(this).html(displayValue);
            var options = {
                type: dataType,
                name: name,
                value: displayValue,
                inputclass: "form-control",
                url: function(params){
                    var oldValue = $(copythis).text();
                    var postData = {};
                    postData["_csrf"] = token;
                    postData["edit_name"] = name;
                    postData["edit_value"] = params["value"];
                    postData["id"] = data.id;
                    $.ajax({
                        url:"/api/article/edit",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            if(name == 'type'){
                                $(copythis).text(typetostr(data.type));
                            }else {
                                $(copythis).text(data[name]);
                            }
                        },
                        error:function(XMLHttpRequest){
                            alert(XMLHttpRequest.responseJSON.message+"");
                            $(copythis).text(oldValue);
                        }
                    });
                },
                validate: function(value){
                    var needValidate = $(copythis).attr("data-need-validate");
                    if(needValidate){
                        var msg = $.validator_tool.checkValue(value, validateRules[name], validateMessages[name]);
                        if(msg){
                            return msg;
                        }
                    }
                }
            };
            if(editSource){
                options["source"] = editSource;
            }
            if(name == 'type'){displayValue = typetostr(data.type);}
            if(name == 'user_id'){}
            if(name == 'create_time'){displayValue = CommonTool.formatTime(data.create_time, "Y-m-d a")}
            $(this).text(displayValue).editable('destroy');
            //$(this).text(displayValue);
            $(this).editable(options);
        });
    }

    function typetostr(type){
        if(type == 1){
            return '成长日记';
        }else if(type == 2){
            return '日常小结';
        }else if(type == 3){
            return '读书笔记';
        }else if(type == 4){
            return '人生感悟';
        }
    }
    var createButtonList = function(row){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='article-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        buttonList.push("<a name=\"table-button-list\" class='article-edit' type='delete' data-id='"+row+"' ><i class=\"icon-trash\"></i> Remove</a>");
        return buttonList;
    };
    //articleList
    var first_page = 0;
    function articleList(params){
        $('.content').removeClass('hide');
        $.ajax({
            url:"/api/article/list",
            data:params,
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

                        html += '<tr class="odd" role="row">';
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
                    var number_pages = null;
                    if(total < 5){ per_page = total;}                           //当页码总数少于要显示的页码数时，显示页码总数
                    if(total != first_page){number_pages=first_page = total;}   //用于确认页数是否发生了变化

                    $('#visible-pages').twbsPagination({
                        totalPages: total,
                        visiblePages: per_page,
                        page: number_pages,                                     //当页数发生变化时重新生成页码，并且初始页为第一页
                        version: '1.1'
                    });
                } else {
                    html = '';
                    $('#visible-pages').empty();
                }
                $('#table-article-list tbody').empty();
                $('#table-article-list tbody').append(html);
                $('.content').addClass('hide');
                $('.article-edit').click(function(){
                    if($(this).attr('type') == 'edit'){
                        $.ajax({
                            url:"/api/article/one",
                            data:{_csrf:token , id:$(this).attr('data-id')},
                            dataType:'json',
                            type:'POST',
                            success:function(data){
                                $("#article-detail").modal("show");
                                initEditForm(data);
                            },
                            error:function(XMLHttpRequest){
                                alert(XMLHttpRequest.responseJSON.message+"");
                            }
                        });
                    }else{$("#dialog-confirm").modal("show");}
                });
            },
            error:function(XMLHttpRequest){
                alert(XMLHttpRequest.responseJSON.message+"");
            }
        });
    }
    articleList(params);

    var page = 1;
    $('#visible-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            params['page'] = page = dataPage;
            articleList(params);
        }
    });
});