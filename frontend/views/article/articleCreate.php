<?php

/* @var $this yii\web\View */

use frontend\assets\AppAsset;

$this->title = 'Create article';
$this->params['breadcrumbs'][] = $this->title;
AppAsset::addScript($this , '@web/js/public/jquery.validate.js');   //数据验证插件
AppAsset::addScript($this , '@web/js/public/message_zh.js');   //数据验证插件
AppAsset::addScript($this , '@web/js/article/add.js');
?>
<div class="site-about">
    <div class="create-top">
        <span class="caption-subject font-dark sbold"> Add Article </span>
    </div>

    <div class="create-during">
        <div class="portlet-body form" id="form-add-article">
            <div class="form-horizontal">
                <form id="add-article" method="post" action="" >
                <div class="form-body">
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Title:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <input type="text" class="form-control" name="title">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Type:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <select class="form-control" name="type">
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
                            <textarea name="summary" class="form-control" rows="5" placeholder="Enter Summary ..."></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            Content Format:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <select class="form-control" id="content-format">
                                <option value="1">TEXT</option>
                                <option value="0">URL</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group content">
                        <label class="col-md-2 control-label bold">
                            Content
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-8">
                            <textarea name="content" class="form-control" rows="10" placeholder="Content ..." ></textarea>
                        </div>
                    </div>
                    <div class="form-group content-url hide">
                        <label class="col-md-2 control-label bold">
                            Content URL
                            <span class="required"> * </span>
                        </label>

                        <div class="col-md-5" style="height: 50px;">
                            <div class="float-left" style="width: 302px;height: 20px;border-radius: 10px;border: 1px solid #3598dc;margin-top: 1px;">
                                <div id="processerbar" style="width: 0px;height: 18px;border-radius: 10px;background-color: #3598dc;text-align: center;color: #ffffff;font-weight: bolder;"></div>
                            </div>
                            <a class="btn btn-xs green" id="upload" style="margin-left:15px;height: 20px">
                                <i class="icon-plus"></i>Upload
                            </a>
                            <input type="file" name="content_url" id="file" accept=".txt,.text,.doc,.docx" style="display:none;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 control-label bold">
                            is Released:
                            <span class="required"> * </span>
                        </label>
                        <div class="col-md-5">
                            <select class="form-control" id="is_released" name="is_released">
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
                </form>
            </div>
        </div>
    </div>
</div>
