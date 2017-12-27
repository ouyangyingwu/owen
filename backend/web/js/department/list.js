/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    var htmlData,userList,majorList,majorNo;
    var token = $('meta[name=csrf-token]').attr('content');
    var params = {_csrf:token , per_page:10};

    //按条件筛选数据
    $('#searchResult').on('click' , function  () {
        params = {_csrf:token , per_page:10};
        params["page"] = 1;
        if ($('.select-id').val()) {
            params["id"] = $('.select-id').val();
        }
        if ($('.select-user_id').val()) {
            params["user_id"] = $('.select-user_id').val();
        }
        if ($('.select-depNo').val()) {
            params["depNo"] = $('.select-depNo').val();
        }
        if ($('.select-depName').val()) {
            params["depName"] = $('.select-depName').val();
        }
        if ($('.select-phone').val()) {
            params["phone"] = $('.select-phone').val();
        }
        if ($('.select-depAddress').val()) {
            params["depAddress"] = $('.select-depAddress').val();
        }
        departmentList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-id').val('');
        $('.select-user_id').val('');
        $('.select-depNo').val('');
        $('.select-depName').val('');
        $('.select-phone').val('');
        $('.select-depAddress').val('');
        params = {page:1 , per_page:10 , _csrf:token};
        departmentList(params);
    });
    (function(){
        $.ajax({
            url: 'api/department/list-data',
            data: {_csrf:token},
            type: 'post',
            dataTye: 'json',
            success:function(data){
                userList = data.user;
                majorList = data.major;
                majorNo = data.numbe.majorNo;
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
        $('#teacher-table').find('.odd').remove();
        $('#major-table').find('.odd').remove();
        if(userList){
            var html = '';
            for(var i=0,len = userList.length; i<len; i++){
                if(userList[i]['teacher']['department_id'] == data['id']){
                    html += '<tr class="odd" role="row">';
                    html +='<td>'+ userList[i]['teacher']['teachNo'] +'</td>';
                    html +='<td>'+ userList[i]['username'] +'</td>';
                    html +='<td>'+ userList[i]['teacher']['position'] +'</td>';;
                    html +='<td>'+ userList[i]['phone'] +'</td>';
                    html +='<td>'+ userList[i]['email'] +'</td>';
                    html +='<td></td>';
                    html +='</tr>';
                }
            }
            $("#teacher-table tbody").append(html);
        }
        if(majorList){
            var html = '';
            for(var i=0,len = majorList.length; i<len; i++){
                if(majorList[i]['department_id'] == data['id']){
                    html += '<tr class="odd" role="row">';
                    html +='<td>'+ majorList[i]['majorNo'] +'</td>';
                    html +='<td>'+ majorList[i]['majorName'] +'</td>';
                    html +='<td>'+ intTostr(majorList[i]['user_id'] , 'user_id') +'</td>';
                    html +='<td>'+ majorList[i]['majorCred'] +'</td>';
                    html +='<td></td>';
                    html +='</tr>';
                }
            }
            $("#major-table tbody").append(html);
        }
        $.fn.editable.defaults.mode = 'inline';
        $('#department-detail').find("[name='form-edit']").each(function(){
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
                            departmentList(params);
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
            if(name == 'create_time'){displayValue = CommonTool.formatTime(displayValue , 'Y年m月d日')}
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
    $('#add-teacher .form-control[data-name="username"]').change(function(){
        var teacher_id = $(this).val();
        for (var i=0,len=userList.length ; i<len ; i++ ){
            if(userList[i]['id'] == teacher_id){
                $('.form-control[data-name="teachNo"]').val(userList[i]['teacher']['teachNo']);
                $('.form-control[data-name="position"]').val(userList[i]['teacher']['position']);
                $('.form-control[data-name="phone"]').val(userList[i]['phone']);
                $('.form-control[data-name="email"]').val(userList[i]['email']);
            }
        }
    });
    //显示添加
    $("#teacher").click(function(){
        $('#add-teacher').removeClass('hide');
        var html = '';
        html += '<option value="">请选择教师</option>';
        for (var i=0,len=userList.length ; i<len ; i++ ){
            if(userList[i]['teacher']['department_id'] != htmlData['id']){
                html += '<option value="'+ userList[i]['id'] +'">'+ userList[i]['username'] +'</option>';
            }
        }
        $('#add-teacher .form-control[data-name="username"]').empty();
        $('#add-teacher .form-control[data-name="username"]').append(html);
    });
    $("#major").click(function(){
        $('#add-major').removeClass('hide');
        var html = '';
        html += '<option value="">请选择负责人</option>';
        for (var i=0,len=userList.length ; i<len ; i++ ){
            if(userList[i]['teacher']['department_id'] == htmlData['id']){
                html += '<option value="'+ userList[i]['id'] +'">'+ userList[i]['username'] +'</option>';
            }
        }
        $('#add-major .form-control[data-name="user_id"]').empty();
        $('#add-major .form-control[data-name="user_id"]').append(html);
        var numbe;
        if(majorNo){
            numbe = Number(majorNo.substr(1 , 4))+1;
            if(String(numbe).length == 1) numbe = '000'+numbe;
            if(String(numbe).length == 2) numbe = '00'+numbe;
            if(String(numbe).length == 3) numbe = '0'+numbe;
        }else {
            numbe = '0001';
        }
        $('#add-major .form-control[data-name="majorNo"]').val('M'+numbe);
    });
    //取消添加
    $('#cancel-teacher').click(function(){
        $('#add-teacher').addClass('hide');
    });
    $('#cancel-major').click(function(){
        $('#add-major').addClass('hide');
    });
    //添加记录
    $('#insert-teacher').click(function(){
        $('#add-teacher').addClass('hide');
    });
    $('#insert-major').click(function(){
        var postData = {};
        postData['_csrf'] = token;
        $("#add-major .form-control").each(function(){
            postData[$(this).attr('data-name')] = $(this).val();
        });
        postData['department_id'] = htmlData.id;
        $.ajax({
            url: 'api/major/add',
            data: postData,
            type: 'post',
            dataType: 'json',
            success:function(data){
                majorNo = postData['majorNo'];
                $('#add-major').addClass('hide');
                $("#dialog-prompt").modal("show").find('p').text("添加成功");
                var html = '';
                html += '<tr class="odd" role="row">';
                html +='<td>'+ postData['majorNo'] +'</td>';
                html +='<td>'+ postData['majorName'] +'</td>';
                html +='<td>'+ intTostr(postData['user_id'] , 'user_id') +'</td>';
                html +='<td>'+ postData['majorCred'] +'</td>';
                html +='<td></td>';
                html +='</tr>';
                $("#major-table tbody").append(html);
            }
        })
    });
    var validateRules = {
        "reason": {required: true},
        "content": {required: true}
    };
    var validateMessages = {};
    $("#create-message").validate({
        rules:validateRules,
        messages: validateMessages,
        errorClass: "text-red",
        //错误提示的html标签
        errorElement:'span',
        focusCleanup:true,
        submitHandler: function() {
            var postData = {};
            postData['_csrf'] = token;
            postData['be_applicant'] = $('#add-teacher .form-control[data-name="username"]').val();
            postData['reason'] = $('#recipient-name').val();
            postData['content'] = $('#message-text').val();
            $.ajax({
                url: 'api/information/add',
                data: postData,
                type: 'post',
                dataType: 'json',
                success:function(data){
                    $("#exampleModal").modal("hide");
                    $("#dialog-prompt").modal("show").find('p').text("已通知该用户");
                }
            });
        }
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

    resetModel = function (model) {
        switch (model){
            case 'edit':
                $("#department-detail").modal("show");
                initEditForm(htmlData);
                break;
        }
    };
    var createButtonList = function(row){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='department-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        return buttonList;
    };
    //departmentList
    var  oldCondition = params;
    function departmentList(params){
        $('.content').removeClass('hide');  //圈圈显示
        $.ajax({
            url:"/api/department/list",
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
                        var button = createButtonList(data[i]['id']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+data[i]["id"]+'</td>';
                        html +='<td>'+data[i]["depNo"]+'</td>';
                        html +='<td>'+ data[i]['user']['username'] +'</td>';
                        html +='<td>'+ data[i]['depName']+'</td>';
                        html +='<td>'+ data[i]['depAddress'] +'</td>';
                        html +='<td>'+ data[i]['phone'] +'</td>';
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
                $('#table-department-list tbody').empty();
                $('#table-department-list tbody').append(html);
                $('.content').addClass('hide');             //圈圈影藏
                $('.department-edit').click(function(){
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
    departmentList(params);

    var page = 1;
    $('#visible-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            params['page'] = page = dataPage;
            departmentList(params);
        }
    });
});