<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2017/11/30
 * Time: 16:32
 */
?>
<header class="head-style clearfix">
    <div class="col-md-1 full-h" id="head-left">
        <div class="row full-h head-logo">Owen Home</div>
        <div class="iconlist"><i class="icon-list"></i></div>
    </div>
    <div class="col-md-2 full-h"></div>
    <div class="col-md-3 full-h pull-right">
        <ul class="navbar-nav col-md-12 full-h">
            <li class="pager col-xs-6" id="dateTime">2017-11-30 17:45:00</li>
            <li class="pager col-xs-6 full-h" id="user-actions">
                <ul class="navbar-nav col-md-12 full-h">
                    <li class="col-xs-6 text-right"><img src="/image/<?=Yii::$app->user->identity->img_url?>" class="head-img"></li>
                    <li class="col-xs-6 text-left"><?= Yii::$app->user->identity->username?></li>
                </ul>
                <div id="logout" class="text-left hide">
                    <ul style="margin: 0;padding: 0px">
                        <li>
                            <a href="/user/one" style="border: none"><i class="icon-user"></i> Account Info </a>
                        </li>
                        <li>
                            <a href="/user/one" style="border: none"><i class="icon-key"></i> Log Out </a>
                        </li>
                        <!--<li><a style="border: none">
                            <form method="post" action="/site/logout">
                                <i class="icon-key"></i>
                                <input type="hidden" name="_csrf" value="<?/*=Yii::$app->getRequest()->getCsrfToken()*/?>">
                                <input type="submit" value="Log Out">
                            </form></a>
                        </li>-->
                    </ul>
                    <div class="adornment"><i class="icon-caret-up" style=""></i></div>
                </div>

            </li>
        </ul>
    </div>
</header>