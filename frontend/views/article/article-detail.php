<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2017/9/26
 * Time: 15:01
 */
use frontend\assets\AppAsset;

$this->title = '文章详情';
AppAsset::addScript($this , '@web/js/article/comment.js');
?>
<div class="site-index" id="index" data-id="<?=$Article['id']?>">
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
                    <?php

                        function all($data , $res=''){
                            $res .= '<div class="comment-detail-reply hide" data-level="'.$data['level'].'">
                                    <div class="comment-user"><a>'.$data['user']['username'].'</a> 评论于</div>
                                    <div class="comment-content font">'.$data['content'].'</div>
                                </div>';

                            if(isset($data['comment']) && is_array($data['comment'])){
                                foreach($data['comment'] as $v){
                                    all($v);
                                }
                            }
                            echo $res;
                        };
                    ?>
                    <h2>共 <?=$total?> 条评论</h2>
                    <?php foreach($Comment as $list):?>
                        <div class="comment-detail clearfix">
                            <div class="comment-user" data-id="<?=$list['id']?>"><a><?=$list['user']['username']?></a> 评论于 <?=date('Y-m-d H:i',$list['create_time'])?></div>
                            <div class="comment-content font"><?=$list['content']?></div>
                            <?php if(isset($list['comment'])):?>
                            <?php foreach($list['comment'] as $reply):?>
                                  <?php  all($reply);?>
                               <!-- <div class="comment-detail-reply">
                                    <div class="comment-user"><a><?/*=$reply['user']['username']*/?></a> 评论于 <?/*=date('Y-m-d H:i',$reply['create_time'])*/?></div>
                                    <div class="comment-content font"><?/*=$reply['content']*/?></div>
                                </div>-->
                            <?php endforeach;?>
                            <?php endif;?>
                            <div class="icon-reply float-left"><a>回复</a></div>
                            <div class="comment-value hide clearfix">
                                <input id="input-text" class="font float-left input-text" type="text" placeholder="回复:" value="" />
                                <input id="input-button" class="font float-left input-button" type="button" value="发表" />
                                <input id="input-button" class="font float-left shut-down" type="button" value="取消" />
                            </div>
                        </div>
                    <?php endforeach;?>
                </div>
                <div class="comment-value clearfix">
                    <input id="input-text" class="font float-left input-text" type="text" placeholder="评论:" value="" />
                    <input id="input-button" class="font float-left input-button" type="button" value="发表" />
                </div>
            </div>
        <?php endif;?>
    </div>
</div>
<div id="uploadForm" class="clearfix">
    <div id="uploadimg">
        <input id="file" type="file"/>
        <button id="upload" type="button">upload</button>
    </div>
    <div id="reveal">

    </div>
</div>