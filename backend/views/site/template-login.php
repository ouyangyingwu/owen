<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model \common\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use frontend\assets\AppAsset;

$this->title = 'Login';
$this->params['breadcrumbs'][] = $this->title;
?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
    <link href="/assets/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/signin.css" rel="stylesheet">
    <script src="/js/public/jquery.min.js"></script>
    <script src="/js/site/login.js"></script>
</head>
<body>
<div class="signin">
    <div class="signin-head"><img src="/image/head-default.png" alt="" class="img-circle"></div>
    <form class="form-signin" role="form" action="" method="post" onsubmit="postDate()">
        <input type="text" class="form-control" placeholder="用户名" required autofocus />
        <input type="password" class="form-control" placeholder="密码" required />
        <button class="btn btn-lg btn-warning btn-block" id="postSubmit" type="submit">登录</button>
        <label class="checkbox">
            <input type="checkbox" value="remember-me"> 记住我
        </label>
    </form>
</div>
</body>