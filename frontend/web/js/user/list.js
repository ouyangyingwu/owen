/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    //if(!$.cookie['user']){window.location.href = "/site/login";}
    var htmlData;
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token};

    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params = {_csrf:token};
        params["page"] = 1;
        if ($('.select-id').val()) {
            params["id"] = $('.select-id').val();
        }
        if ($('.select-username').val()) {
            params["username"] = $('.select-username').val();
        }
        if ($('.select-email').val()) {
            params["email"] = $('.select-email').val();
        }
        userList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-id').val('');
        $('.select-type').val('');
        $('.select-user_id').val('');
        params = {page:1 , _csrf:token};
        userList(params);
    });
    //删除
    $("#doConfirm").click(function(){
        var postData = {};
        postData["_csrf"] = token;
        postData["edit_name"] = 'is_delete';
        postData["edit_value"] = 1;
        postData["id"] = htmlData.id;
        $.ajax({
            url:"/api/user/edit",
            data:postData,
            dataType:'json',
            type:'POST',
            success:function(data){
                $("#dialog-confirm").modal("hide");
                userList(params);
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
            case 'activ':
                return [
                    {value: 1, text: 'Activ'},
                    {value: 0, text: 'Freeze'}
                ];
            default:
                return null;
        }
    };
    //修改、详情
    function initEditForm(data){
        $.fn.editable.defaults.mode = 'inline';
        $('#user-detail').find("[name='form-edit']").each(function(){
            var name = $(this).attr("data-name");
            var dataType = $(this).attr("data-type");
            var copythis = this;
            var editSource = getEditSource(name);
            var displayValue = data[name];
            var notEdit = false;                                //默认为可编辑
            if($(this).hasClass('notEdit')){notEdit = true;}    //class为notEdit的数据不可编辑
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
                        url:"/api/user/edit",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            $(copythis).text(data[name]);
                            userList(params);
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
            }
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
    var createButtonList = function(row){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='user-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        buttonList.push("<a name=\"table-button-list\" class='user-edit' type='delete' data-id='"+row+"' ><i class=\"icon-trash\"></i> Remove</a>");
        return buttonList;
    };
    //userList
    var  oldCondition = params;
    function userList(params){
        $('.content').removeClass('hide');  //圈圈显示
        $.ajax({
            url:"/api/user/list",
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
                        var button = createButtonList(data[i]['id'])
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td><a href="/user/detail/'+data[i]["id"]+'">'+data[i]["id"]+'</td>';
                        html +='<td>'+ data[i]['username'] +'</td>';
                        html +='<td>'+ data[i]['email']+'</td>';
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
                $('#table-user-list tbody').empty();
                $('#table-user-list tbody').append(html);
                $('.content').addClass('hide');             //圈圈影藏
                $('.user-edit').click(function(){
                    var dataid = $(this).attr('data-id');
                    for (var i=0 ; i<data.length ; i++){
                        if(dataid == data[i]['id']){
                            htmlData = data[i];             //获取到当前id的所有数据
                        }
                    }
                    if($(this).attr('type') == 'edit'){
                        $("#user-detail").modal("show");
                        initEditForm(htmlData);
                    }else{
                        $("#dialog-confirm").modal("show").find('p').text("你是否要删除这个用户？");
                    }
                });
            },
            error:function(XMLHttpRequest){
                alert(XMLHttpRequest.responseJSON.message+"");
            }
        });
    }
    userList(params);

    var page = 1;
    $('#visible-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            params['page'] = page = dataPage;
            userList(params);
        }
    });
});