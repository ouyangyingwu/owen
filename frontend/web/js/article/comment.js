/**
 * Created by admin on 2017/9/27.
 */
$(function(){
    /**
     *index-head
     */
    var prompt = $(".detail-head .prompt");
    var content = $(".detail-head .content:eq(1)");
    prompt.click(function(){
        if(content.is(":visible")){
            content.addClass('hide');
            prompt.text("︾");
        }else {
            content.removeClass('hide');
            prompt.text("︽");
        }
    });
});