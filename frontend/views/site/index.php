<?php

use \yii\helpers\Url;
use frontend\assets\AppAsset;
/* @var $this yii\web\View */

$this->title = 'Owen Home';
AppAsset::addScript($this , '@web/js/index/index.js');
?>
<div class="site-index" id="index">
    <div class="index-bg"></div>
    <div class="index-head">
        <h3>人生阶梯</h3>
        <div class="index-head-left">
            <?php if($ArticleList):?>
            <?php foreach($ArticleList as $key=>$Article):?>
                <?php if($key<10):?>
                    <div data-id="<?=$Article['id']?>" class="font"><?=$Article['title']?></div>
                <?php endif;?>
            <?php endforeach; ?>
            <?php endif;?>
        </div>
        <div class="font index-head-right"><a class="content" href="<?= Url::toRoute(['site/detail' , 'id' => 1]) ?>"></a></div>
    </div>
</div>
