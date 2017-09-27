<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2017/9/26
 * Time: 15:01
 */

$this->title = '文章详情';
?>
<div class="site-index" id="index">
    <div class="index-bg"></div>
    <div class="index-head detail-head">
        <?php if($Article):?>
            <h2 class="font"><?=$Article['title']?></h2>
            <div class="font writer">
                <div class="writer-left">作者：<?=$Article['user']['username']?></div>
                <div class="writer-right">发布时间：<?=$Article['create_time']?></div>
            </div>
            <?php if(mb_strlen($Article['content'])<1000):?>
                <div class="font content">&nbsp;&nbsp;&nbsp;&nbsp;<?=$Article['content']?></div>
            <?php else:?>
            <div class="font content">&nbsp;&nbsp;&nbsp;&nbsp;<?=substr($Article['content'] , 0 ,999)?></div>
            <div class="font content hide"><?=substr($Article['content'] , 999)?></div>
            <div class="prompt">︾</div>
            <?php endif;?>
            <div class="comment clearfix">
                <div class="comment-list">
                    <h2>共 <?=$total?> 条评论</h2>
                    <?php foreach($Comment as $list):?>
                        <div class="comment-detail">
                            <div class="comment-user"><a><?=$list['user']['username']?></a> 评论于 <?=date('Y-m-d H:i',$list['create_time'])?></div>
                            <div class="comment-content font"><?=$list['content']?></div>
                        </div>
                        <?php if($list['comment']):?>
<!--                            --><?php //foreach($list['comment'] as $reply):?>
                            <div class="comment-detail-reply">
                                <div class="comment-user"><a><?=$list['comment']['user']['username']?></a> 评论于 <?=date('Y-m-d H:i',$list['comment']['create_time'])?></div>
                                <div class="comment-content font"><?=$list['comment']['content']?></div>
                            </div>
<!--                            --><?php //endforeach;?>
                        <?php endif;?>
                    <?php endforeach;?>
                </div>
                <div class="comment-value">
                    <input id="input-text" class="font float-left" type="text" value="评论:" />
                    <input id="input-button" class="font float-left" type="button" value="发表" />
                </div>
            </div>
        <?php endif;?>
    </div>
</div>