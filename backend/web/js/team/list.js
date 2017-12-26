/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    var htmlData,userList;
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token , per_page:10};

    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params = {_csrf:token , per_page:10};
        params["page"] = 1;
        if ($('.select-id').val()) {
            params["id"] = $('.select-id').val();
        }
        if ($('.select-crNo').val()) {
            params["crNo"] = $('.select-crNo').val();
        }
        if ($('.select-crBuildingName').val()) {
            params["crBuildingName"] = $('.select-crBuildingName').val();
        }
        if ($('.select-crRoomNo').val()) {
            params["crRoomNo"] = $('.select-crRoomNo').val();
        }
        if ($('.select-crNumberOfSeat').val()) {
            params["crNumberOfSeat"] = $('.select-crNumberOfSeat').val();
        }
        classRoomList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-id').val('');
        $('.select-crNo').val('');
        $('.select-crBuildingName').val('');
        $('.select-crRoomNo').val('');
        $('.select-crNumberOfSeat').val('');
        params = {page:1 , per_page:10 , _csrf:token};
        classRoomList(params);
    });
    (function(){
        $.ajax({
            url: 'api/user/list',
            data: {_csrf:token,type:2},
            type: 'post',
            dataTye: 'json',
            success:function(data){
                userList = data.data;
                var html = '';
                html += '<option value="">请选择负责人</option>';
                for(var i= 0,len =userList.length; i<len; i++){
                    html += '<option value="'+userList[i]['id']+'">'+userList[i]['username']+'</option>';
                }
                $('.select-user_id').append(html);
                $('#add-maintain-records [data-name="username"]').append(html);
            }
        })
    })();

    //init edit form
    var getEditSource = function(name){
        switch(name){
            case 'active':
                return [
                    {value: 1, text: '是'},
                    {value: 0, text: '否'}
                ];
            case 'user_id':
                var user = [];
                for (var i=0,len=userList.length ; i<len ; i++){
                    user.push({value:userList[i]['id'] , text:userList[i]['username']});
                }
                return user;
            default:
                return null;
        }
    };
    //修改、详情
    function initEditForm(data){
        $('#maintain-records-table').find('.odd').remove();
        if(data.maintain){
            var html = '';
            for(var i=0,len = data.maintain.length; i<len; i++){
                html += '<tr class="odd" role="row">';
                html +='<td>'+ data['maintain'][i]["start_time"] +'</td>';
                html +='<td>'+ data['maintain'][i]['end_time'] +'</td>';
                html +='<td>'+ data['maintain'][i]['reason'] +'</td>';
                html +='<td>'+ data['maintain'][i]['money'] +'</td>';
                html +='<td>'+ intTostr(data['maintain'][i]['username'] , 'user_id') +'</td>';
                html +='<td class="delete-maintain-records" data-id="'+ data['maintain'][i]["dataTime"] +'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
            }
            $("#maintain-records-table tbody").append(html);
        }
        $.fn.editable.defaults.mode = 'inline';
        $('#classRoom-detail').find("[name='form-edit']").each(function(){
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
                        url:"/api/class-room/edit",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            $(copythis).text(intTostr(data[name] , name));
                            htmlData[name] = data[name];
                            if(name == 'active') htmlData['reason'] = null;
                            classRoomList(params);
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
            if (name == 'crNumberOfSeat' || name == 'reason'){
                options["validate"] = function(value){
                    if(name == 'crNumberOfSeat' && value > data['max_crNumberOfSeat']){
                        return '座位数不能超出上限值'+data['max_crNumberOfSeat'];
                    }
                    if(name == 'reason' && htmlData['active'] == 1 && value != ''){
                        return '只有关闭该教室后才能填写!';
                    }
                }
            }
            if(dataType == 'select'){
                displayValue = intTostr(displayValue , name);
            }
            $(this).text(displayValue).editable('destroy');
            $(this).editable(options);
        });
    }
    function intTostr(value , type){
        if(type == 'active') {
            if (value == 1) {
                return '是';
            } else if (value == 0) {
                return '否';
            }
        }
        if(type == 'user_id'){
            for (var i=0,len=userList.length ; i<len ; i++){
                if(value == userList[i]['id']){
                    return userList[i]['username'];
                }
            }
        }
    }
    //显示添加
    $("#maintain-records").click(function(){
        $('#add-maintain-records').removeClass('hide');
    });
    //取消添加
    $('#cancel-maintain-records').click(function(){
        $('#add-maintain-records').addClass('hide');
    });
    //添加记录
    $('#insert-maintain-records').click(function(){
        $('#add-maintain-records').addClass('hide');
        var postData = {},value = {},edit_value = htmlData.maintain? htmlData.maintain:[];
        postData['_csrf'] = token;
        postData['id'] = htmlData['id'];
        value['dataTime'] = Math.round((new Date().getTime())/1000);
        $('#add-maintain-records .form-control').each(function(){
            value[$(this).attr('data-name')] = $(this).val();
        });
        value['dataTime'] = Math.round((new Date().getTime())/1000);
        edit_value.push(value);
        postData['edit_name'] = 'maintain';
        postData['edit_value'] = edit_value;
        $.ajax({
            url: 'api/class-room/edit',
            data: postData,
            type: 'post',
            dataType: 'json',
            success:function(data){
                var html = '';
                html += '<tr class="odd" role="row">';
                html +='<td>'+ value["start_time"] +'</td>';
                html +='<td>'+ value['end_time'] +'</td>';
                html +='<td>'+ value['reason'] +'</td>';
                html +='<td>'+ value['money'] +'</td>';
                html +='<td>'+ intTostr(value['username'] , 'user_id') +'</td>';
                html +='<td class="delete-maintain-records" data-id="'+ value["dataTime"] +'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
                $("#maintain-records-table tbody").append(html);
                htmlData.maintain = edit_value;
            }
        });
    });
    //删除记录（detail列表内的记录）
    $('#maintain-records-table').on('click', '.delete-maintain-records' , function(){
        var id = $(this).attr('data-id');
        var postData = {};
        for(var i = 0,len = htmlData.maintain.length ; i<len ; i++){
            if($(this).attr('data-id') == htmlData['maintain'][i]['dataTime']){
                htmlData.maintain.splice(i , 1);
            }
        }
        postData['_csrf'] = token;
        postData['id'] = htmlData['id'];
        postData['edit_name'] = 'maintain';
        postData['edit_value'] = htmlData.maintain;
        $(this).parents('.odd').remove();
        $.ajax({
            url: 'api/class-room/edit',
            data: postData,
            type: 'post'
        });
        return;
    });

    //选择时间
    var preset = 'date';
    var options = {
        preset : preset,
        minDate: new Date(new Date().setYear(new Date().getFullYear() - 5)),
        maxDate: new Date(new Date().setYear(new Date().getFullYear() + 5)),
        theme: "android-ics light",
        mode: "scroller",
        dateFormat: 'yyyy-mm-dd',
        display: "modal"
    };
    $('.scheduleTime').val("").scroller("destroy");
    $('.scheduleTime').scroller(options);

    var validateRules = {
        "reason": {required: true}
    };
    var validateMessages = {};
    $('#edit-close').validate({
        rules:validateRules,
        messages: validateMessages,
        errorClass: "help-block",
        //错误提示的html标签
        errorElement:'span',
        submitHandler: function() {
            var postData = {};
            postData['_csrf'] = token;
            postData['id'] = htmlData['id'];
            postData['active'] = 0;
            postData['reason'] = $(".form-control[name='reason']").val();
            $.ajax({
                url: "/api/class-room/update",
                data: postData,
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    $("#exampleModal").modal("hide");
                    classRoomList(params);
                },
                error: function (XMLHttpRequest) {
                    alert(XMLHttpRequest.responseJSON.message + "");
                }
            })
        }
    });

    $('#doConfirm').click(function () {
        var postData = {};
        postData['_csrf'] = token;
        console.log(htmlData);
        postData['id'] = htmlData['id'];
        postData['active'] = 1;
        postData['reason'] = null;
        $.ajax({
            url: "/api/class-room/update",
            data: postData,
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                $("#dialog-confirm").modal("hide");
                classRoomList(params);
            },
            error: function (XMLHttpRequest) {
                alert(XMLHttpRequest.responseJSON.message + "");
            }
        })
    });

    resetModel = function (model) {
        switch (model){
            case 'edit':
                $("#classRoom-detail").modal("show");
                initEditForm(htmlData);
                break;
            case  'close':
                $("#exampleModal").modal("show");
                break;
            case 'open':
                $("#dialog-confirm").modal("show").find('p').text("是否开放该教室？");
                $("#dialog-confirm").attr('data-type' , 'open');
                break;
        }
    };
    var createButtonList = function(row , active){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='classroom-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        if(active == 1){
            buttonList.push("<a name=\"table-button-list\" class='classroom-edit' type='close' data-id='"+row+"' ><i class=\"icon-eye-close\"></i> Close</a>");
        }else {
            buttonList.push("<a name=\"table-button-list\" class='classroom-edit' type='open' data-id='"+row+"' ><i class=\" icon-eye-open\"></i> Open</a>");
        }
        return buttonList;
    };
    //classRoomList
    var  oldCondition = params;
    function classRoomList(params){
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
                        var button = createButtonList(data[i]['id'] ,data[i]['active']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+data[i]["id"]+'</td>';
                        html +='<td>'+data[i]["crNo"]+'</td>';
                        html +='<td>'+ data[i]['crBuildingName'] +'</td>';
                        html +='<td>'+ data[i]['crRoomNo']+'</td>';
                        html +='<td>'+ data[i]['crNumberOfSeat'] +'/'+ data[i]['max_crNumberOfSeat'] +'</td>';
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
                    if(condition['id'] !== oldCondition['id'] || condition['crNo '] !== oldCondition['crNo '] || condition['crNumberOfSeat'] !== oldCondition['crNumberOfSeat']
                        || condition['crBuildingName '] !== oldCondition['crBuildingName '] || condition['crRoomNo'] !== oldCondition['crRoomNo']){
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
                $('#table-classroom-list tbody').empty();
                $('#table-classroom-list tbody').append(html);
                $('.content').addClass('hide');             //圈圈影藏
                $('.classroom-edit').click(function(){
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
    classRoomList(params);

    var page = 1;
    $('#visible-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            params['page'] = page = dataPage;
            classRoomList(params);
        }
    });
});