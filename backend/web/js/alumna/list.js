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
        if ($('.select-name').val()) {
            params["name"] = $('.select-name').val();
        }
        if ($('.select-session').val()) {
            params["session"] = $('.select-session').val();
        }
        if ($('.select-depName').val()) {
            params["depName"] = $('.select-depName').val();
        }
        if ($('.select-majorName').val()) {
            params["majorName"] = $('.select-majorName').val();
        }
        if ($('.select-teamName').val()) {
            params["teamName"] = $('.select-teamName').val();
        }
        alumnaList(params);
    });
    //清除所有筛选条件
    $('#resetValue').on('click' , function  () {
        $('.select-name').val('');
        $('.select-session').val('');
        $('.select-depName').val('');
        $('.select-majorName').val('');
        $('.select-teamName').val('');
        params = {page:1 , per_page:10 , _csrf:token};
        alumnaList(params);
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
    //二级列表
    function towForm(data , type){
        var html = '';
        if(type == 'reason_list'){
            for (var i= 0,leng=data.length ; i<leng ; i++){
                html += '<tr class="odd" role="row">';
                html +='<td>'+ (data[i]["reason_time"]?data[i]["reason_time"]:'') +'</td>';
                html +='<td>'+ (data[i]['reason_name']?data[i]['reason_name']:'') +'</td>';
                html +='<td>'+ (data[i]['reason_content']?data[i]['reason_content']:'') +'</td>';
                html +='<td class="delete-reason" data-id="'+data[i]['dataTime']+'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
            }
            $("#reason_list-table tbody").append(html);return;
        }
        if(type == 'reward'){
            console.log(data);
            for (var i= 0,leng=data.length ; i<leng ; i++){
                html += '<tr class="odd" role="row">';
                html +='<td>'+ (data[i]["reward_time"]?data[i]["reward_time"]:'') +'</td>';
                html +='<td>'+ (data[i]['reward_name']?data[i]['reward_name']:'') +'</td>';
                html +='<td>'+ (data[i]['reward_type']?intTostr(data[i]['reward_type'] , 'reward_type'):'') +'</td>';
                html +='<td>'+ (data[i]['reward_ranking']?intTostr(data[i]['reward_ranking'] , 'reward_ranking'):'') +'</td>';
                html +='<td>'+ (data[i]['reward_level']?intTostr(data[i]['reward_level'] , 'reward_level'):'') +'</td>';
                html +='<td class="delete-reward" data-id="'+data[i]['dataTime']+'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
            }
            $("#reward-table tbody").append(html);return;
        }
        if(type == 'punish'){
            for (var i= 0,leng=data.length ; i<leng ; i++){
                html += '<tr class="odd" role="row">';
                html +='<td>'+ (data[i]["punish_time"]?data[i]["punish_time"]:'') +'</td>';
                html +='<td>'+ (data[i]['punish_reason']?data[i]['punish_reason']:'') +'</td>';
                html +='<td>'+ (data[i]['punish_content']?intTostr(data[i]['punish_content'] , 'punish_content'):'') +'</td>';
                html +='<td class="delete-punish" data-id="'+data[i]['dataTime']+'"><i class="icon-trash"></i>删除</td>';
                html +='</tr>';
            }
            $("#punish-table tbody").append(html)
        }
    }
    //init edit form
    var getEditSource = function(name){
        switch(name){
            case 'eminent':
                return [
                    {value:0 , text:'校友'},
                    {value:1 , text:'杰出校友'}
                ];
            default:
                return null;
        }
    };
    //修改、详情
    function initEditForm(data){
        $('#reason_time-table').find('.odd').remove();
        $('#reward-table tbody').empty();
        $('#punish-table tbody').empty();
        if(data.reason_list){towForm(data.reason_list,'reason_list')}
        if(data.reward){towForm(data.reward,'reward')}
        if(data.punish){towForm(data.punish,'punish')}
        $.fn.editable.defaults.mode = 'inline';
        $('#alumna-detail').find("[name='form-edit']").each(function(){
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
                        url:"/api/alumna/edit",
                        data:postData,
                        dataType:'json',
                        type:'POST',
                        success:function(data){
                            $(copythis).text(intTostr(data[name] , name));
                            htmlData[name] = data[name];
                            if(name == 'active') htmlData['reason'] = null;
                            alumnaList(params);
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
            displayValue = intTostr(displayValue , name);
            $(this).text(displayValue).editable('destroy');
            $(this).editable(options);
        });
    }
    function intTostr(value , type){
        if(type == 'sex') {
            if (value == 1) return '男';
            if (value == 2) return '女';
            if (value == 0) return '数据丢失';
        }
        if(type == 'birth' || type == 'admission_time' || type == 'graduate_time') {
            return CommonTool.formatTime(value , 'Y年m月d日');
        }
        if(type == 'eminent') {
            if (value == 0) return '校友';
            if (value == 1) return '杰出校友';
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
        if(type == 'punish_content'){
            if(value == 0) return '请选择';
            if(value == 1) return '警告处分';
            if(value == 2) return '记小过一次';
            if(value == 3) return '记大过一次';
            if(value == 4) return '留校查看';
            if(value == 5) return '劝退';
            if(value == 6) return '开除';
            if(value == 7) return '其他';
        }
        return value;
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
    $("#reason_list").click(function(){
        $('#add-reason_list').removeClass('hide');
    });
    //取消添加
    $('#cancel-reason_list').click(function(){
        $('#add-reason_list').addClass('hide');
    });
    //添加记录
    $('#insert-reason_list').click(function(){
        $('#add-reason_list').addClass('hide');
    });
    $('#insert-major').click(function(){
        var postData = {};
        postData['_csrf'] = token;
        $("#add-major .form-control").each(function(){
            postData[$(this).attr('data-name')] = $(this).val();
        });
        postData['alumna_id'] = htmlData.id;
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

    //选择时间
    var preset = 'date';
    var options = {
        preset : preset,
        minDate: new Date(new Date().setYear(new Date().getFullYear() - 100)),
        maxDate: new Date(new Date().setYear(new Date().getFullYear())),
        theme: "android-ics light",
        mode: "scroller",       //日期选择模式'clickpick',
        dateFormat: 'yyyy',     // 日期格式
        display: "modal",
        dateOrder: 'yy',        //面板中日期排列格式
        setText: '确定',        //确认按钮名称
        cancelText: '取消',     //取消按钮名籍我
    };
    $('.scheduleTime').val("").scroller("destroy");
    $('.scheduleTime').scroller(options);

    resetModel = function (model) {
        switch (model){
            case 'edit':
                $("#alumna-detail").modal("show");
                initEditForm(htmlData);
                break;
        }
    };
    var createButtonList = function(row){
        var buttonList = [];
        buttonList.push("<a name=\"table-button-list\" class='alumna-edit' type='edit' data-id='"+row+"' ><i class=\"icon-edit\"></i> Edit</a>");
        return buttonList;
    };
    //alumnaList
    var  oldCondition = params;
    function alumnaList(params){
        $('.content').removeClass('hide');  //圈圈显示
        $.ajax({
            url:"/api/alumna/list",
            data:params,
            dataType:'json',
            type:'POST',
            success:function(data){
                var total = data.total,alumna = data.data,html = '';
                var lastPage = total?1+(page-1)*5:0 , fastPage = page*5>parseInt(total)?parseInt(total):page*5 , overPage = total;
                if(alumna){
                    total = total > 10 ? Math.ceil(total/10) : 1;
                    //数据列表
                    for (var i= 0,leng=alumna.length;i<leng;i++){
                        var button = createButtonList(alumna[i]['id']);
                        button = CommonTool.renderActionButtons(button);

                        html += '<tr class="odd" role="row">';
                        html +='<td>'+ alumna[i]["stuNo"] +'</td>';
                        html +='<td>'+ alumna[i]['name'] +'</td>';
                        html +='<td>'+ intTostr(alumna[i]['sex'] , 'sex') +'</td>';
                        html +='<td>'+ alumna[i]["age"] +'</td>';
                        html +='<td>'+ alumna[i]['email']+'</td>';
                        html +='<td>'+ alumna[i]['phone']+'</td>';
                        html +='<td>'+ CommonTool.formatTime(alumna[i]['graduate_time'] , 'Y年m月') +'</td>';
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
                    if(condition['session'] !== oldCondition['session'] || condition['name'] !== oldCondition['name'] || condition['depName'] !== oldCondition['depName']
                        || condition['majorName'] !== oldCondition['majorName'] || condition['teamName'] !== oldCondition['teamName']){
                        number_pages = true;
                        oldCondition = condition;
                    }
                    console.log(number_pages);
                    $('#alumna-pages').twbsPagination({
                        //总页数
                        totalPages: total,
                        //显示页码数
                        visiblePages: per_page,
                        //是否刷新页码
                        page: number_pages,
                        version: '1.1'
                    });
                } else {
                    html = '<tr rowspan="4"><td style="text-align: center" colspan="8">No matching records found</td></tr>';
                    $('#visible-pages').empty();
                }
                if(title = 0) $('#visible-pages').empty();
                $('#alumna-over').children('.last-page').text(lastPage);
                $('#alumna-over').children('.fast-page').text(fastPage);
                $('#alumna-over').children('.over-page').text(overPage);
                $('#table-alumna-list tbody').empty().append(html);
                $('.content').addClass('hide');             //圈圈影藏
                $('.alumna-edit').click(function(){
                    var alumna_id = $(this).attr('data-id');
                    for (var i=0 ; i<alumna.length ; i++){
                        if(alumna_id == alumna[i]['id']){
                            htmlData = alumna[i];             //获取到当前id的所有数据
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
    alumnaList(params);

    var page = 1;
    $('#visible-pages').on('click' , function(){
        var dataPage = $(this).find('li.active').attr('data-page');
        if(dataPage != page){
            params['page'] = page = dataPage;
            alumnaList(params);
        }
    });
});