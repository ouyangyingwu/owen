<?php

/* @var $this yii\web\View */

use yii\helpers\Html;
use \yii\helpers\Url;

$this->title = 'List Article';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="site-about">
<!--    <code>--><?//= __FILE__ ?><!--</code>-->
    <div class="header">
        <div><span>Search Form</span></div>
        <div>
            <div class="search-group col-md-3">
                <input type="text" class="form-control" placeholder="ID #" ng-model="search.id">
            </div>
            <div class="search-group col-md-3">
                <input type="text" class="form-control" placeholder="User Name" ng-model="search.id">
            </div>
            <div class="search-group col-md-3">
                <input type="text" class="form-control" placeholder="Type" ng-model="search.id">
            </div>
            <div style="margin-top:0px;">
                <button type="submit" class="btn green marginr-10" ng-click="searchResult()">Submit</button>
                <button type="button" class="btn default" ng-click="resetValue()">Reset</button>
            </div>
        </div>
    </div>

    <div>
        <div>
            <div class="caption">
                <i class="fa fa-shopping-cart"></i> News List
            </div>
            <div class="actions">
                <a href="<?= Url::toRoute(['article/create'])?>" class="btn sbold green">
                    Add New <i class="fa fa-plus"></i>
                </a>
            </div>
        </div>
        <div class="table-container">
            <table class="table" id="table-article-list">
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
                <?php foreach($ArticleList as $article):?>
                    <tr>
                        <td><a href="<?= Url::toRoute(['article/detail' , 'id' => $article['id']])?>"><?=$article['id']?></a></td>
                        <td><?=$article['user']['username']?></td>
                        <td><?=$article['title']?></td>
                        <td><?=strlen($article['describe'])<99?$article['describe']:substr($article['describe'] , 0 ,99).'...'?></td>
                        <td><?php
                            switch($article['type']){
                                case 0: echo '日常小结';break;
                                case 1: echo '成长日记';break;
                                case 2: echo '读书笔记';break;
                                case 3: echo '人生感悟';break;
                            }; ?>
                        </td>
                        <td><?=date('Y-m-d H:i:s' , $article['create_time'])?></td>
                        <td><?=$article['id']?></td>

                    </tr>
                <?php endforeach;?>
                </tbody>
            </table>
        </div>
    </div>
</div>
