/**
 * Created by admin on 2018/2/3.
 */
$(function(){
    //选择时间插件
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

    $("*[name='btn-export']").click(function(){
        var form = $(this).attr("data-form");
        if (!$("#" + form).validate("check")) {
            return;
        }

        var action = $(this).attr("data-action");
        var params = [];
        $("#" + form).find("*[data-field]").each(function(){
            var field = $(this).attr("data-field");
            var value = $(this).val();
            if ($(this).attr("data-time-type")) {
                var addDay = $(this).attr("data-add-day");
                if (addDay) {
                    addDay = parseInt(addDay);
                } else {
                    addDay = 0;
                }
            } else {
                value = value ? value : '';
            }
            params.push(field + "=" + value);
        });
        var url = "report/" + action + "?" + params.join("&");
        //console.log(url);return;
        window.location.href = url;
    });
});
