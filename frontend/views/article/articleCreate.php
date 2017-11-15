<?php

/* @var $this yii\web\View */

use frontend\assets\AppAsset;

$this->title = 'Create article';
$this->params['breadcrumbs'][] = $this->title;
AppAsset::addScript($this , '@web/js/public/jquery.validate.js');   //数据验证插件
AppAsset::addScript($this , '@web/js/article/add.js');
?>
<div class="site-about">
    <div class="create-top">
        <span class="caption-subject font-dark sbold"> Add Article </span>
    </div>

    <div class="create-during">
        <div class="portlet-body form" id="form-add-article">
            <div class="form-horizontal">
                <div class="form-body">
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Title:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <input type="text" class="form-control" data-field="title" id="title" category="for-check">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Type:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <select class="form-control" id="type" data-field="type">
                                <option value="">请选择类型</option>
                                <option value="1">成长日记</option>
                                <option value="2">日常小结</option>
                                <option value="3">读书笔记</option>
                                <option value="4">人生感悟</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Summary
                            <span class="required">  </span>
                        </label>
                        <div class="col-md-8">
                            <textarea data-field="summary" id="summary" class="form-control" rows="5" placeholder="Enter Summary ..."></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Content
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-8">
                            <textarea id="content" class="form-control" rows="10" placeholder="Content ..." ></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            is Released:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <select class="form-control" id="is_released" data-field="is_released">
                                <option value="0">NO</option>
                                <option value="1">YES</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-actions right">
                    <div class="col-md-7">
                        <button type="submit" class="btn blue" id="addArticle"">Save</button>
                        <button type="button" class="btn default" ng-click="resetNews()">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
