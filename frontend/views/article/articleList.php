<?php

/* @var $this yii\web\View */

use frontend\assets\AppAsset;
use \yii\helpers\Url;
use yii\widgets\LinkPager;

$this->title = 'Article List';
$this->params['breadcrumbs'][] = $this->title;

AppAsset::addScript($this , '@web/js/public/jquery.twbsPagination.js'); //分页插件
AppAsset::addScript($this , '@web/js/article/list.js');
?>
<!--主内容-->
<div class="site-about">
    <!--<code><?/*= __FILE__ */?></code>-->
    <div class="header">
        <div class="portlet light paddingb-10">
            <div class="portlet-title">
                <div class="caption">
                    <i class="icon-search font-dark"></i>
                    <span class="caption-subject font-dark sbold">Search Form</span>
                </div>
            </div>
            <div class="portlet-body form">
                <div class="form-horizontal" role="form">
                    <div class="form-body paddingb-0">
                        <div class="form-group">
                            <div class="col-sm-6 col-md-4 col-lg-3">
                                <input type="text" class="form-control select-id" placeholder="ID #">
                            </div>
                            <div class="col-sm-6 col-md-4 col-lg-3">
                                <select class="form-control select-user_id">
                                    <option selected value="">All</option>
                                </select>
                            </div>
                            <div class="col-sm-6 col-md-4 col-lg-3">
                                <select class="form-control select-type">
                                    <option selected value="">All</option>
                                    <option value="1">成长日记</option>
                                    <option value="2">日常小结</option>
                                    <option value="3">读书笔记</option>
                                    <option value="4">人生感悟</option>
                                </select>
                            </div>
                            <div class="col-sm-6 col-md-4 col-lg-3">
                                <div class="search-group">
                                    <div style="margin-top:0px;">
                                        <button type="submit" class="btn green marginr-10" id="searchResult">Submit</button>
                                        <button type="button" class="btn default" id="resetValue" ">Reset</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="portlet light portlet-fit portlet-datatable bordered">
        <div class="portlet-title">
            <div class="caption">
                <i class="icon-shopping-cart"></i> Article List
            </div>
            <div class="actions">
                <div class="btn-group btn-group-devided">
                    <a href="/article/create" class="btn sbold green">
                        Add New <i class="icon-plus"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="portlet-body">
            <div class="table-container " style="position: relative;">
                <div class="content hide">
                    <div style="opacity: .5;position: absolute;top:0;left:0;right:0;bottom:0;background: #d4d7d8"></div>
                    <div style="position: absolute;top:50%;left:50%;opacity: 1;z-index: 12;">
                        <i class=" icon-spinner icon-spin icon-2x"></i>
                    </div>
                </div>
                <table class="table table-striped table-bordered table-hover" id="table-article-list">
                    <thead>
                    <tr class="heading">
                        <th>ID #</th>
                        <th>Author Name</th>
                        <th>Title</th>
                        <th>describe</th>
                        <th>Type</th>
                        <th>Create Time</th>
                        <th style="width: 150px;">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php /*foreach($ArticleList as $article):*/?><!--
                    <tr>
                        <td><a href="<?/*= Url::toRoute(['article/detail' , 'id' => $article['id']])*/?>"><?/*=$article['id']*/?></a></td>
                        <td><?/*=$article['user']['username']*/?></td>
                        <td><?/*=$article['title']*/?></td>
                        <td><?/*=strlen($article['describe'])<99?$article['describe']:substr($article['describe'] , 0 ,99).'...'*/?></td>
                        <td><?php
                    /*                            switch($article['type']){
                                                    case 0: echo '日常小结';break;
                                                    case 1: echo '成长日记';break;
                                                    case 2: echo '读书笔记';break;
                                                    case 3: echo '人生感悟';break;
                                                }; */?>
                        </td>
                        <td><?/*=date('Y-m-d H:i:s' , $article['create_time'])*/?></td>
                        <td><?/*=$article['id']*/?></td>

                    </tr>
                --><?php /*endforeach;*/?>
                    </tbody>
                    <?php
                    /*echo LinkPager::widget([
                        'pagination' => $pages,
                        'maxButtonCount' =>10,
                        'firstPageLabel' =>'first',
                        'lastPageLabel' =>'last',
                        'nextPageLabel'=>'next',
                        'prevPageLabel'=>'prev'
                    ])*/
                    ?>
                </table>
            </div>
        </div>
        <div class="text-center">
            <ul id="visible-pages"></ul>
        </div>
    </div>
</div>

<!--detail-->
<div class="modal container fade" id="article-detail" aria-hidden="false">
    <div class="modal-content">
        <div class="portlet light portlet-fit ">
            <div class="portlet-title">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <div class="caption">
                    <span class="caption-subject font-dark sbold uppercase">Article Detail</span>
                </div>
            </div>
            <div class="portlet-body paddingb-0">
                <div class="row">
                    <div class="col-md-12">
                        <fieldset class="fieldset">
                            <div class="col-md-12">
                                <div class="col-md-2 text-right">
                                    <span>ID #:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a class="notEdit" name="form-edit" data-name="id"></a>
                                </div>
                                <div class="col-md-2 text-right">
                                    <span>Create Time:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a class="notEdit" name="form-edit" data-name="create_time" data-type="date"></a>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="col-md-2 text-right">
                                    <span>Title:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a href="#" name="form-edit" data-name="title" data-type="text"></a>
                                </div>
                                <div class="col-md-2 text-right">
                                    <span>Author Namee:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a class="notEdit" href="#" name="form-edit" data-name="user_id" data-type="select"></a>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="col-md-2 text-right">
                                    <span>Type:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a href="#" name="form-edit" data-name="type" data-type="select"></a>
                                </div>
                                <div class="col-md-2 text-right">
                                    <span> is_released:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a href="#" name="form-edit" data-name="is_released" data-type="select"></a>
                                </div>
                            </div>
                            <div class="col-md-12 margint-10">
                                <div class="col-md-2 text-right">
                                    <span>Describe:</span>
                                </div>
                                <div class="input-daterange input-group">
                                    <a href="#" name="form-edit" data-name="describe" data-type="textarea"></a>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" data-dismiss="modal"
                    class="btn btn-outline red">Close
            </button>
        </div>
    </div>
</div>

<!-- confirm dialog -->
<div id="dialog-confirm" class="modal fade" data-backdrop="static" data-keyboard="false" data-attention-animation="false">
    <div class="modal-body">
        <p><!--弹框显示的内容--></p>
    </div>
    <div class="modal-footer">
        <button type="button" data-dismiss="modal" class="btn btn-outline red">Cancel</button>
        <button type="submit" id="doConfirm" class="btn green">Confirm</button>
    </div>
</div>

