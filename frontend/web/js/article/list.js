/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    //if(!$.cookie['user']){window.location.href = "/site/login";}
    var htmlData;
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token , per_page:2};

    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params = {_csrf:token , per_page:2};
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
        params = {page:1,per_page:2,_csrf:token};
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
                    user = data.data;
                    var html = '';
                    if(data){
                        for (var i=0;i<user.length;i++){
                            html += '<option value="'+user[i]['id']+'">';
                            html += user[i]['username'];
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
    //删除
    $("#doConfirm").click(function(){
        var postData = {};
        postData["_csrf"] = token;
        postData["edit_name"] = 'is_delete';
        postData["edit_value"] = 1;
        postData["id"] = htmlData.id;
        $.ajax({
            url:"/api/article/edit",
            data:postData,
            dataType:'json',
            type:'POST',
            success:function(data){
                $("#dialog-confirm").modal("hide");
                articleList(params);
            },
            error:function(XMLHttpRequest){
                alert(XMLHttpRequest.responseJSON.message+"");
                $(copythis).text(oldValue);
            }
        });
    });
    //init edit form
    var getEditSource = function(name){
        switch(name){
            case  'user_id':
                var userList = [];
                for(var i = 0 ; i < user.length; i++){
                    userList.push({"value": user[i].id, "text": user[i].username});
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
    //修改、详情
    function initEditForm(data){
        $.fn.editable.defaults.mode = 'inline';
        $('#article-detail').find("[name='form-edit']").each(function(){
            var name = $(this).attr("data-name");
            var dataType = $(this).attr("data-type");
            var copythis = this;
            var editSource = getEditSource(name);
            var displayValue = data[name];
            var notEdit = false;                                //默认为可编辑
            if($(this).hasClass('notEdit')){notEdit = true;}    //class为notEdit的数据不可编辑
            if(name == 'create_time'){displayValue = CommonTool.formatTime(data.create_time, "Y-m-d a")}
            var options = {
                type: dataType,
                name: name,
                value: displayValue,
                disabled:notEdit,           //是否可编辑，默认为false(可编辑)
                inputclass: "form-control",
                url: function(param){
                    var oldValue = $(copythis).text();
                    var postData = {};
                    postData["_csrf"] = token;
                    postData["edit_name"] = name;
                    postData["edit_value"] = param["value"];
                    postData["id"] = data.id;
                    $.ajax({
                        url:"/api/article/edit",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            if(name == 'type'){
                                $(copythis).text(intTostr(data.type , 'type'));
                            }else if(name == 'is_released'){
                                $(copythis).text(intTostr(data.is_released , 'is_released'));
                            }else if(name == 'user_id'){
                                $(copythis).text(intTostr(data.user_id , 'user_id'));
                            }else {
                                $(copythis).text(data[name]);
                            }
                            articleList(params);
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
            //启用下拉框中的下拉选项
            if(editSource){options["source"] = editSource;}
            //为data-name为describe的项做数据验证
            switch (name){
                case 'describe':
                    options["validate"] = function(value){
                        var regexp;
                        /*regexp = /^[\u4e00-\u9fa5A-Za-z0-9]+$/;
                        if(!value.match(regexp)){
                            return "只能有汉字、字母和数字！";
                        }*/
                        regexp = /^.{0,150}$/;
                        if(!value.match(regexp)){
                            return "最大长度50个汉字或150个字符！";
                        }
                    };
            }
            if(name == 'type'){displayValue = intTostr(data.type , 'type');}
            if(name == 'user_id'){displayValue = intTostr(data.user_id , 'user_id')}
            if(name == 'is_released'){displayValue = intTostr(data.is_released , 'is_released');}

            $(this).text(displayValue).editable('destroy');
            $(this).editable(options);
        });
    }
    function intTostr(value , type){
        if(type == 'type'){
            if(value == 1){
                return '成长日记';
            }else if(value == 2){
                return '日常小结';
            }else if(value == 3){
                return '读书笔记';
            }else if(value == 4){
                return '人生感悟';
            }
        }else if(type == 'is_released') {
            if (value == 1) {
                return 'True';
            } else if (value == 0) {
                return 'False';
            }
        }else if (type == 'user_id') {
            for(var i=0 ; i<user.length ; i++){
                if(value == user[i]['id']){
                    return value = user[i]['username'];
                }
            }
        }
    }
    var createButtonList = function(row , url){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='article-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        buttonList.push("<a href=\"/file/"+url+"\" download=\""+url+"\" name=\"table-button-list\" class='article-edit' type='download' data-id='"+row+"' ><i class=\"icon-download-alt\"></i> DownLoad</a>");
        buttonList.push("<a name=\"table-button-list\" class='article-edit' type='delete' data-id='"+row+"' ><i class=\"icon-trash\"></i> Remove</a>");
        return buttonList;
    };
    //articleList
    var  oldCondition = params;
    function articleList(params){
        $('.content').removeClass('hide');  //圈圈显示
        $.ajax({
            url:"/api/article/list",
            data:params,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total;
                var data = data.data;
                var html = '';
                if(data){
                    if(data.length < total){
                        total = Math.ceil(total/2);
                    }else {
                        total = 1;
                    }

                    //数据列表
                    for (var i=0;i<data.length;i++){
                        var describe = data[i]['describe'].length < 30 ? data[i]['describe'] : data[i]['describe'].substring(0,30)+'...';
                        var button = createButtonList(data[i]['id'] , data[i]['article_url']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td><a href="/article/detail/'+data[i]["id"]+'">'+data[i]["id"]+'</a></td>';
                        html +='<td>'+ data[i]['user']['username'] +'</td>';
                        html +='<td>'+ data[i]['title']+'</td>';
                        html +='<td>'+ describe +'</td>';
                        html +='<td>'+ intTostr(data[i]['type'] , 'type') +'</td>';
                        html +='<td>'+ CommonTool.formatTime(data[i]['create_time'], "Y-m-d a") +'</td>';
                        html +='<td>'+ button +'</td>';
                        html +='</tr>';
                    }
                    //分页代码
                    var condition = params;
                    var per_page = 5;
                    var number_pages = false;
                    //当页码总数少于要显示的页码数时，显示页码总数
                    if(total < 5){ per_page = total;}
                    //判断筛选条件是否发生了变化
                    if(condition['id'] !== oldCondition['id'] || condition['user_id'] !== oldCondition['user_id'] || condition['type'] !== oldCondition['type'] ){
                        number_pages = true;
                        oldCondition = condition;
                    }
                    $('#visible-pages').twbsPagination({
                        //总页数
                        totalPages: total,
                        //显示页码数
                        visiblePages: per_page,
                        //是否刷新页码
                        page: number_pages,
                        version: '1.1'
                    });
                } else {
                    html = '<tr rowspan="4"><td style="text-align: center" colspan="7">No matching records found</td></tr>';
                    $('#visible-pages').empty();
                }
                if(title = 0) $('#visible-pages').empty();
                $('#table-article-list tbody').empty();
                $('#table-article-list tbody').append(html);
                $('.content').addClass('hide');             //圈圈影藏
                $('.article-edit').click(function(){
                    var dataid = $(this).attr('data-id');
                    for (var i=0 ; i<data.length ; i++){
                        if(dataid == data[i]['id']){
                            htmlData = data[i];             //获取到当前id的所有数据
                        }
                    }
                    if($(this).attr('type') == 'edit'){
                        $("#article-detail").modal("show");
                        initEditForm(htmlData);
                    } else if($(this).attr('type') == 'delete'){
                        $("#dialog-confirm").modal("show").find('p').text("你是否要删除这篇文章？");
                    }
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