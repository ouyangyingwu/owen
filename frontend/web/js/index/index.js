/**
 * Created by admin on 2017/9/22.
 */
$(function(){
    /**
     *index-head
     */
    var ladder = $(".index-head-left div");
    var content = $(".index-head-right");
    ladder.mouseenter(function(){
        var text = $(this).children().text();
        var rightText = content.text();
        var time = text.length;
        if(ladder.is(":animated")){
            //停止当前的动画
            ladder.stop(true);
        }
        $(this).css({background:'#FFFD9F'}).animate({width:300+'px'},500);
        if(text != rightText){
            content.lbyl({
                content: text,
                speed: time, type: 'show'});
        }
    });
    ladder.mouseleave(function () {
        $(this).css({background:'#96FF93'}).animate({width:100+'px'},500);
    });
});