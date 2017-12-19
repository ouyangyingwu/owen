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
        params = {_csrf:token , per_page:10};
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
        if ($('.select-type').val()) {
            params["type"] = $('.select-type').val();
        }
        userList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-id').val('');
        $('.select-type').val('');
        $('.select-user_id').val('');
        params = {page:1 , per_page:10 , _csrf:token};
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
                    {value: 0, text: '第三性别'},
                    {value: 1, text: '男'},
                    {value: 2, text: '女'},
                ];
            default:
                return null;
        }
    };
    //修改、详情
    function initEditForm(data){
        //$("#iframe-image-show").empty();
        if(data.type == 1) {
            $('#student').removeClass('hide').siblings().addClass('hide');
            $('#reward-table').find('.odd').remove();
            if(data['student']['reward']){
                var html = '', value = data['student']['reward'];
                for (var i=0 ; i<data['student']['reward'].length ; i++){
                    html += '<tr class="odd" role="row">';
                    html +='<td>'+ (value[i]["reward_time"]?value[i]["reward_time"]:'') +'</td>';
                    html +='<td>'+ (value[i]['reward_name']?value[i]['reward_name']:'') +'</td>';
                    html +='<td>'+ (value[i]['reward_type']?intTostr(value[i]['reward_type'] , 'reward_type'):'') +'</td>';
                    html +='<td>'+ (value[i]['reward_ranking']?intTostr(value[i]['reward_ranking'] , 'reward_ranking'):'') +'</td>';
                    html +='<td>'+ (value[i]['reward_level']?intTostr(value[i]['reward_level'] , 'reward_level'):'') +'</td>';
                    html +='<td class="delete-reward" data-id="'+i+'"><i class="icon-trash"></i>删除</td>';
                    html +='</tr>';
                }
                $("#reward-table tbody").append(html)
            }
        };
        if(data.type == 2) $('#teacher').removeClass('hide').siblings().addClass('hide');
        if(data.type == 3) $('#admin').removeClass('hide').siblings().addClass('hide');

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
            if(name == 'dirthday'){displayValue = CommonTool.formatTime(displayValue , 'm月d日');}
            if(!displayValue){displayValue="Empty";}
            $(this).text(displayValue).editable('destroy');
            $(this).editable(options);
        });
    }
    function intTostr(value , type){
        if(type == 'active') {
            if (value == 1) {
                return 'Active';
            } else if (value == 0) {
                return 'Freeze';
            }
        }
        if(type == 'sex') {
            if (value == 1)return '男';
            if (value == 2)return '女';
            if (value == 0)return '第三类性别';
        }
        if(type == 'type') {
            if (value == 1) {
                return '学生';
            } else if (value == 2) {
                return '教职工';
            }else if(value == 3) {
                return '管理员';
            }
        }
        if(type == 'reward_type'){
            if(value == 0) return '奖助学金';
            if(value == 1) return '奥数比赛';
            if(value == 2) return '演讲比赛';
            if(value == 3) return '文章发表';
            if(value == 4) return '运动会';
            if(value == 5) return '书法文艺';
            if(value == 6) return '音乐舞蹈';
            if(value == 7) return '其他';
        }
        if(type == 'reward_ranking'){
            if(value == 0) return '此类比赛无名次';
            if(value == 1) return '第一名';
            if(value == 2) return '第二名';
            if(value == 3) return '第三名';
            if(value == 4) return '特等奖';
            if(value == 5) return '参与奖';
        }
        if(type == 'reward_level'){
            if(value == 1) return '奖助学金';
            if(value == 2) return '班级';
            if(value == 3) return '院校级';
            if(value == 4) return '市级';
            if(value == 5) return '省级';
            if(value == 6) return '国家级';
            if(value == 7) return '世界级';
        }
        if(type == 'reward_level'){
            if(value == 1) return '奖助学金';
            if(value == 2) return '班级';
            if(value == 3) return '院校级';
            if(value == 4) return '市级';
            if(value == 5) return '省级';
            if(value == 6) return '国家级';
            if(value == 7) return '世界级';
        }
    }
    //显示添加
    $("#add-reward").click(function(){
        $('#form-add-reward').removeClass('hide');
    });
    $("#add-punish").click(function(){
        $('#form-add-punish').removeClass('hide');
    });
    //取消添加
    $('#cancel-reward').click(function(){
        $('#form-add-reward').addClass('hide');
    });
    $('#cancel-punish').click(function(){
        $('#form-add-punish').addClass('hide');
    });
    //添加记录
    $('#insert-reward').click(function(){
        var postData = {},value = {};
        var $type = htmlData.student ? 'student' : (htmlData.teacher?'teacher':'admin');
        var edit_value = htmlData[$type] && htmlData[$type]['reward'] ? htmlData[$type]['reward'] : [];
        postData['_csrf'] = token;
        postData['id'] = htmlData[$type]['id'];
        postData['type'] = $type;
        $("#form-add-reward .form-control").each(function(){
            value[$(this).attr('data-name')] = $(this).val();
        });
        edit_value.push(value);
        postData['edit_name'] = 'reward';
        postData['edit_value'] = edit_value;
        console.log(postData);
        $.ajax({
            url: 'api/user/edit',
            data: postData,
            type: 'post',
            dataType: 'json',
            success:function(data){
                if(data){
                    var html = '';
                    html += '<tr class="odd" role="row">';
                    html +='<td>'+ value["reward_time"] +'</td>';
                    html +='<td>'+ value['reward_name'] +'</td>';
                    html +='<td>'+ intTostr(value['reward_type'] , 'reward_type')+'</td>';
                    html +='<td>'+ intTostr(value['reward_ranking'] , 'reward_ranking')+'</td>';
                    html +='<td>'+ intTostr(value['reward_level'] , 'reward_level')+'</td>';
                    html +='<td class="delete-reward"><i class="icon-trash"></i>删除</td>';
                    html +='</tr>';
                    $("#reward-table tbody").append(html)
                }
            }
        });
    });
    //删除奖惩记录（detail列表内的记录）
    $('#reward-table').on('click', '.delete-reward' , function(){
        var id = $(this).attr('data-id');
        var reward = htmlData['student']['reward'];
        var $type = htmlData.student ? 'student' : (htmlData.teacher?'teacher':'admin');
        var postData = {};
        reward.splice(id , 1);
        //htmlData = reward;  //刷新原始数据的
        console.log(reward , htmlData['student']['reward']);
        postData['_csrf'] = token;
        postData['id'] = htmlData[$type]['id'];
        postData['type'] = $type;
        postData['edit_name'] = 'reward';
        postData['edit_value'] = reward;
        $(this).parents('.odd').remove();
        $.ajax({
            url: 'api/user/edit',
            data: postData,
            type: 'post',
            dataType: 'json',
            //success:function(){}
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
                        total = Math.ceil(total/10);
                    }else {
                        total = 1;
                    }

                    //数据列表
                    for (var i=0;i<data.length;i++){
                        var button = createButtonList(data[i]['id'])
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+data[i]["id"]+'</td>';
                        html +='<td>'+ data[i]['username'] +'</td>';
                        html +='<td>'+ data[i]['email']+'</td>';
                        html +='<td>'+ data[i]['phone']+'</td>';
                        html +='<td>'+ intTostr(data[i]['sex'] , 'sex') +'</td>';
                        html +='<td>'+ intTostr(data[i]['type'] , 'type') +'</td>';
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