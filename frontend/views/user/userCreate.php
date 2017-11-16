<?php

/* @var $this yii\web\View */

use frontend\assets\AppAsset;

$this->title = 'Create user';
$this->params['breadcrumbs'][] = $this->title;
AppAsset::addScript($this , '@web/js/public/jquery.validate.js');   //数据验证插件
AppAsset::addScript($this , '@web/js/user/add.js');
?>
<div class="site-about">
    <div class="create-top">
        <span class="caption-subject font-dark sbold"> Add User </span>
    </div>

    <div class="create-during">
        <div class="portlet-body form" id="form-add-user">
            <div class="form-horizontal">
                <div class="form-body">
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            User Name:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <input type="text" class="form-control" data-field="username" id="title">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Eamil:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <input type="text" class="form-control" data-field="email" id="title">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Phone:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <input type="text" class="form-control" data-field="phone" id="title">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Sex:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <select class="form-control" id="sex" data-field="sex">
                                <option value="1">Male</option>
                                <option value="2">Female</option>
                                <option value="0">Unknown</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Sticky:
                            <span class="required"> * </span>
                        </label>
                        <div class="input-icon right col-md-9 margin-l5">
                            <div class="fileinput fileinput-new">
                                <div id="iframe-image-show" class="fileinput-preview thumbnail" style="width: 200px; height: 130px;position: relative;">
                                </div>
                                <div>
                                <span class="btn red btn-outline btn-file">
                                    <span class="fileinput-new" id="upload" "> Select image </span>
                                    <input type="file" id="file" style="display:none;">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                <div class="form-actions right">
                    <div class="col-md-7">
                        <button type="submit" class="btn blue" id="addUser"">Save</button>
                        <button type="button" class="btn default" id="resetUser">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
