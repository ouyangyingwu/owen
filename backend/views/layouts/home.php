<?php

/* @var $this \yii\web\View */
/* @var $content string */

use backend\assets\AppAsset;
use yii\helpers\Html;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>
<div id="wrapper">
    <nav class="navbar navbar-default top-navbar" role="navigation">
        <?php include ("template-head.php") ?>
    </nav>
    <!--/. NAV TOP  -->
    <nav class="navbar-default navbar-side" id="left" role="navigation">
        <?php /*include ("template-left.php") */?>
    </nav>
    <!-- /. NAV SIDE  -->
    <div id="page-wrapper">
        <div id="page-inner">
            <?= $content ?>
        </div>
    </div>
    <!-- /. PAGE WRAPPER  -->
</div>
<div id="addScript">

</div>
<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
