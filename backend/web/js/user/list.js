/**
 * Created by admin on 2017/11/30.
 */
$(function(){
    $.ajax({
        url:"/api/user/list",
        data:{_csrf: $('meta[name=csrf-token]').attr('content')},
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
                    html +='<td>'+data[i]["id"]+'</td>';
                    html +='<td>'+ data[i]['username'] +'</td>';
                    html +='<td>'+ data[i]['email']+'</td>';
                    html +='<td>'+ data[i]['phone']+'</td>';
                    html +='<td>'+ intTostr(data[i]['sex'] , 'sex') +'</td>';
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
});
