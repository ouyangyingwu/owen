<?php

use \yii\helpers\Url;
use frontend\assets\AppAsset;
/* @var $this yii\web\View */

$this->title = 'Owen Home';

/**
 * 定义全局变量（在这里是需要定义的值，设置过程写在布局文件中）
 * 在全局变量中中能存字符串
 * 如果要存数组则需要把数组中的元素分别赋值
*/
$this->params['js_path'] = 'index';
$describeList = [];
$this->params['js_config_param'] = Traverse($ArticleList);

function Traverse($ArticleList){
    $describeList = [];
    foreach ($ArticleList as $item) {
        $describeList[$item['id']] = $item['describe'];
    }
    return $describeList;
};
//$this->params['js_config_param'] = ['articleList' => $ArticleList/*array_column( $ArticleList , 'describe')*/];

/**
 * 导入指定文件
 */
AppAsset::addScript($this , '@web/js/public/l-by-l.min.js');
AppAsset::addScript($this , '@web/js/site/index.js');
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
        <div class="font index-head-right"><a class="content" href="<?= Url::toRoute(['/article/detail' , 'id' => 1]) ?>"></a></div>
    </div>
</div>
