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
            <div class="font content">&nbsp;&nbsp;&nbsp;<?=$Article['content']?></div>
            <div class="comment">

            </div>
        <?php endif;?>
    </div>
</div>