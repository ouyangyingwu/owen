<?php

/* @var $this yii\web\View */

use yii\helpers\Html;
use \yii\helpers\Url;

$this->title = 'Create article';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="site-about">
    <div class="create-top">
        <span class="caption-subject font-dark sbold"> Add News </span>
    </div>

    <div class="create-during">
        <div class="portlet-body form" id="form-add-news">
            <div class="form-horizontal">
                <div class="form-body">
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Title:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <input type="text" class="form-control ng-pristine ng-valid ng-touched has-error" data-field="title" id="title" category="for-check" register-validate-focus="1" register-validate-blur="1" for-check="0"><span class="help-block">This field is required.</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Type:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <select class="form-control" id="type" data-field="type">
                                <option value="0">日常小结</option>
                                <option value="1">成长日记</option>
                                <option value="2">读书笔记</option>
                                <option value="3">人生感悟</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Summary
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-8">
                            <textarea data-field="summary" class="form-control ng-pristine ng-untouched ng-valid" rows="5" placeholder="Enter Summary ..." category="for-check" register-validate-focus="1" register-validate-blur="1"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Content
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-8">
                            <textarea data-field="summary" class="form-control ng-pristine ng-untouched ng-valid" rows="10" ng-model="news.summary" placeholder="Content ..." category="for-check" register-validate-focus="1" register-validate-blur="1"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            is_released:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <select class="form-control" id="news_type" data-field="type">
                                <option value="0">NO</option>
                                <option value="1">YES</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-actions right">
                    <div class="col-md-7">
                        <button type="submit" class="btn blue" ng-click="addArticle()">Save</button>
                        <button type="button" class="btn default" ng-click="resetNews()">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
