/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    //if(!$.cookie['user']){window.location.href = "/site/login";}
    var htmlData;
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token , per_page:10};

    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params = {_csrf:token , per_page:2};
        params["page"] = 1;
        if ($('.select-id').val()) {
            params["id"] = $('.select-id').val();
        }
        if ($('.select-username').val()) {
            params["username"] = $('.select-username').val();
        }
        if ($('.select-phone').val()) {
            params["phone"] = $('.select-phone').val();
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
        params = {page:1 , per_page:2 , _csrf:token};
        userList(params);
    });

    //init edit form
    var getEditSource = function(name){
        switch(name){
            case 'active':
                return [
                    {value: 1, text: 'Active'},
                    {value: 0, text: 'Freeze'}
                ];
            case 'sex':
                return [
                    {value: 0, text: 'Unknown'},
                    {value: 1, text: 'Male'},
                    {value: 2, text: 'Female'},
                ];
            default:
                return null;
        }
    };
    //修改、详情
    function initEditForm(data){
        $("#iframe-image-show").empty();
        if(data.img_url){
            var html = "<img src='/image/"+data.img_url+"'>";
            $("#iframe-image-show").empty().append(html);
        }
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
                            $(copythis).text(intTostr(data[name] , name));
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
            switch (name){}
            if(dataType == 'select'){
                displayValue = intTostr(data[name] , name);
            }
            $(this).text(displayValue).editable('destroy');
            $(this).editable(options);
        });
    }
    function intTostr(value , type){
        if(type == 'active') {
            if (value == 1) {
                return 'Yes';
            } else if (value == 0) {
                return 'No';
            }
        }
        if(type == 'sex') {
            if (value == 1) {
                return 'Male';
            } else if (value == 2) {
                return 'Female';
            }else {
                return 'Unknown';
            }
        }
    }
    //图片处理
    $("#upload").click(function(){
        $('#file').trigger('click');
    });
    $('#file').change(function(){
        if($(this).val()){
            $('.progress').removeClass('hide');
            var formData = new FormData();
            formData.append('file', $('#file')[0].files[0]);
            //上传图片
            $.ajax({
                url:'/api/file/url',
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                xhr: function(){
                    var xhr = $.ajaxSettings.xhr();
                    if(onprogress && xhr.upload) {
                        xhr.upload.addEventListener("progress" , onprogress, false);
                        return xhr;
                    }
                }
            }).done(function(res) {
                if(res && res.split('/')[1].match(/^CS[0-9]{18}.[a-z]{3,4}$/)){
                    var postData = {};
                    postData["_csrf"] = token;
                    postData["edit_name"] = 'img_url';
                    postData["edit_value"] = res;
                    postData["id"] = htmlData.id;
                    //修改数据
                    $.ajax({
                        url:"/api/user/edit",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            onprogressFast();
                            if(htmlData.img_url){
                                var postData = {};
                                postData["_csrf"] = token;
                                postData["name"] = htmlData.img_url;
                                postData["url"] = 'image';
                                //删除旧的图片
                                $.ajax({
                                    url:"/api/file/delete",
                                    data:postData,
                                    type:'POST'
                                });
                            }
                            var html = "<img src='/image/"+res+"'>";
                            $('.progress').addClass('hide');
                            $("#iframe-image-show").show().empty().append(html);
                            userList(params);
                        }
                    });
                    return;
                }
                alert(res);
            }).fail(function(res) {
                alert(res);
            });
        }
    });
    function onprogress(evt){
        var loaded = evt.loaded;                //已经上传大小情况
        var tot = evt.total;                    //附件总大小
        var per = Math.floor(50*loaded/tot);    //已经上传的百分比
        $(".progress-bar").html( per +"%" );
        $(".progress-bar").css("width" , per +"%");
    }
    function onprogressFast(){                  //当后台数据返回确定成功
        $(".progress-bar").html( 100 +"%" );
        $(".progress-bar").css("width" , 100 +"%");
    }

    $("#deleteImg").click(function(){
        //判断图片是否存在
        if($("#iframe-image-show").children().length){
            var postData = {};
            postData["_csrf"] = token;
            postData["edit_name"] = 'img_url';
            postData["edit_value"] = null;
            postData["id"] = htmlData.id;
            $.ajax({
                url:"/api/user/edit",
                data:postData,
                dataType:'json',
                type:'POST',
                success:function(data){
                    $("#iframe-image-show").show().empty();
                    $("#dialog-confirm").modal("show").find('p').text("是否同时删除源文件？");
                    $("#dialog-confirm").attr({'data-type': 'img_url' , 'data-value': htmlData.img_url });
                    htmlData.img_url = null;
                    //userList(params);
                }
            });
        }
    });
    //删除
    $("#doConfirm").click(function(){
        var dataType = $(this).parent().parent().attr('data-type');
        var postData = {};
        postData["_csrf"] = token;
        switch (dataType){
            case 'img_url':
                postData["name"] = $(this).parent().parent().attr('data-value');
                postData["url"] = 'image';
                $.ajax({
                    url:"/api/file/delete",
                    data:postData,
                    dataType:'json',
                    type:'POST',
                    success:function(data){
                        $("#dialog-confirm").modal("hide");
                    },
                    error:function(XMLHttpRequest){
                        alert(XMLHttpRequest.responseJSON.message+"");
                        $(copythis).text(oldValue);
                    }
                });break;
            case 'is_delete':
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
                });break;
        }
    });
    resetModel = function (model) {
        switch (model){
            case 'edit':
                $("#user-detail").modal("show");
                initEditForm(htmlData);
                break;
            case 'delete':
                $("#dialog-confirm").modal("show").find('p').text("你是否要删除这个用户？");
                $("#dialog-confirm").attr('data-type' , 'is_delete');
                break;
        }
    };
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
            url:"/api/class-room/list",
            data:params,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total;
                var data = data.data;
                var html = '';
                if(data){
                    if(data.length < total){
                        total = Math.ceil(total/10);
                    }else {
                        total = 1;
                    }

                    //数据列表
                    for (var i=0;i<data.length;i++){
                        var button = createButtonList(data[i]['id'])
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+data[i]["crNo"]+'</td>';
                        html +='<td>'+ data[i]['crBuildingName'] +'</td>';
                        html +='<td>'+ data[i]['crRoomNo']+'</td>';
                        html +='<td>'+ data[i]['crNumberOfSeat']+'</td>';
                        html +='<td>'+ intTostr(data[i]['active'] , 'active') +'</td>';
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
                    if(condition['id'] !== oldCondition['id'] || condition['username'] !== oldCondition['username']
                        || condition['email'] !== oldCondition['email'] || condition['phone'] !== oldCondition['phone']){
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
                    var Model = $(this).attr('type');
                    resetModel(Model);
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