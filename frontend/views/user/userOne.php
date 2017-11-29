<?php

/* @var $this yii\web\View */

use frontend\assets\AppAsset;

$this->title = 'Create One';
$this->params['breadcrumbs'][] = $this->title;

AppAsset::addScript($this , '@web/js/public/jquery.validate.js');   //数据验证插件
AppAsset::addScript($this , '@web/js/public/message_zh.js');        //数据验证插件中文包
AppAsset::addScript($this , '@web/js/user/one.js');
?>
<div class="row">
    <div class="col-md-12">
        <!-- BEGIN PROFILE SIDEBAR -->
        <div class="profile-sidebar">
            <!-- PORTLET MAIN -->
            <div class="portlet light">
                <div class="profile-userpic margin-lr-25 padding-tb-10" id="iframe-image-show">
                    <img src="<?= "/image/".Yii::$app->user->identity->img_url?>" class="img-style img-round" alt="">
                    <div class="profile-usertitle padding-tb-10">
                        <div class="profile-usertitle-name"> <?= Yii::$app->user->identity->username?> </div>
                        <div class="profile-usertitle-name now-time"> <?=date("Y-m-d H:i:s")?> </div>
                    </div>
                </div>
                <div class="margin-lr-25 clearfix">
                    <input id="input-upload-file" type="file" style="display: none;">
                    <button type="button" class="btn red btn-sm float-left">Upload Avatar</button>
                    <button type="button" class="btn red btn-sm float-right">Delete Avatar</button>
                </div>
            </div>
            <!-- END PORTLET MAIN -->
        </div>
        <!-- END BEGIN PROFILE SIDEBAR -->
        <!-- BEGIN PROFILE CONTENT -->
        <div class="profile-content">
            <div class="row">
                <div class="col-md-12">
                    <div class="portlet light ">
                        <div class="portlet-title tabbable-line">
                            <div class="caption caption-md">
                                <i class="icon-globe theme-font hide"></i>
                                <span class="caption-subject font-blue-madison bold uppercase">Profile Account</span>
                            </div>
                            <ul class="nav nav-tabs">
                                <li class="active">
                                    <a data-toggle="tab">Personal Info</a>
                                </li>
                                <li>
                                    <a data-toggle="tab">Change Password</a>
                                </li>
                            </ul>
                        </div>
                        <div class="portlet-body">
                            <div class="tab-content">
                                <!-- PERSONAL INFO TAB -->
                                <div class="tab-pane active" id="information">
                                    <form id="edit-user" method="post" action="" >
                                    <div class="form-body">
                                        <div class="form-group">
                                            <label class="control-label">User Name</label>
                                            <div class="row">
                                                <div class="col-md-12" >
                                                    <input type="text" name="username" class="form-control" value="<?=Yii::$app->user->identity->username?>">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label">E-mail</label>
                                            <div class="row">
                                                <div class="col-md-12" >
                                                    <input type="text" name="email" class="form-control" value="<?=Yii::$app->user->identity->email?>">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label">Phone Number</label>
                                            <div class="row">
                                                <div class="col-md-12" >
                                                    <input type="text" name="phone" class="form-control" value="<?=Yii::$app->user->identity->phone?>">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn green">Save Changes</button>
                                    </form>
                                </div>
                                <!-- END PERSONAL INFO TAB -->
                                <!-- CHANGE PASSWORD TAB -->
                                <div class="hide" id="ResetPassword">
                                    <form id="reset-password" method="post" action="" >
                                    <div class="form-group">
                                        <label class="control-label">Old Password</label>
                                        <div class="row">
                                            <div class="col-md-12" >
                                                <input type="password" name="old_password" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="control-label">New Password</label>
                                        <div class="row">
                                            <div class="col-md-12" >
                                                <input type="password" name="new_password" class="form-control" id="password">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="control-label">Confirm Password</label>
                                        <div class="row">
                                            <div class="col-md-12" >
                                                <input type="password" name="confirm_password" class="form-control">
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn green">Change Password</button>
                                    </form>
                                </div>
                                <!-- END CHANGE PASSWORD TAB -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END PROFILE CONTENT -->
    </div>
</div>
