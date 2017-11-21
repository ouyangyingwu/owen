<?php

/* @var $this yii\web\View */

use frontend\assets\AppAsset;

$this->title = 'User List';
$this->params['breadcrumbs'][] = $this->title;

AppAsset::addScript($this , '@web/js/public/jquery.twbsPagination.js'); //分页插件
AppAsset::addScript($this , '@web/js/user/list.js');
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
                            <div class="col-sm-6 col-md-4 col-lg-3 margin-bottom-10">
                                <input type="text" class="form-control select-id" placeholder="ID #">
                            </div>
                            <div class="col-sm-6 col-md-4 col-lg-3 margin-bottom-10">
                                <input type="text" class="form-control select-username" placeholder="User Name #">
                            </div>
                            <div class="col-sm-6 col-md-4 col-lg-3 margin-bottom-10">
                                <input type="text" class="form-control select-phone" placeholder="Phone #">
                            </div>
                            <div class="col-sm-6 col-md-4 col-lg-3 margin-bottom-10">
                                <input type="text" class="form-control select-email" placeholder="Email #">
                            </div>
                            <div class="col-sm-6 col-md-4 col-lg-3 margin-bottom-10">
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
                <i class="icon-shopping-cart"></i> User List
            </div>
            <div class="actions">
                <div class="btn-group btn-group-devided">
                    <a href="/user/create" class="btn sbold green">
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
                <table class="table table-striped table-bordered table-hover" id="table-user-list">
                    <thead>
                    <tr class="heading">
                        <th>ID #</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Sex</th>
                        <th style="width: 150px;">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="text-center">
            <ul id="visible-pages"></ul>
        </div>
    </div>
</div>

<!--detail-->
<div class="modal container fade" id="user-detail" aria-hidden="false">
    <div class="modal-content">
        <div class="portlet light portlet-fit ">
            <div class="portlet-title">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <div class="caption">
                    <span class="caption-subject font-dark sbold uppercase">User Detail</span>
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
                                    <span>User Namee:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a name="form-edit" data-name="username" data-type="text"></a>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="col-md-2 text-right">
                                    <span>Phone:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a name="form-edit" data-name="phone" data-type="text"></a>
                                </div>
                                <div class="col-md-2 text-right">
                                    <span>Email:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a name="form-edit" data-name="email" data-type="text"></a>
                                </div>
                            </div>
                            <div class="col-md-12 margint-10">
                                <div class="col-md-2 text-right">
                                    <span>Sex:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a name="form-edit" data-name="sex" data-type="select"></a>
                                </div>
                                <div class="col-md-2 text-right">
                                    <span>Activ:</span>
                                </div>
                                <div class="col-md-4 text-left">
                                    <a href="#" name="form-edit" data-name="active" data-type="select"></a>
                                </div>
                            </div>
                            <div class="col-md-12 margint-10">
                                <div class="col-md-2 text-right">
                                    <span>Sticky:</span>
                                </div>
                                <div class="input-icon right col-md-9 margin-l5">
                                    <div class="fileinput fileinput-new">
                                        <div id="iframe-image-show" class="fileinput-preview thumbnail" style="width: 200px; height: 130px;position: relative;"></div>
                                        <div>
                                            <span class="btn red btn-outline btn-file">
                                                <span class="fileinput-new" id="upload" "> Select image </span>
                                                <input type="file" id="file" accept="image/jpeg,image/gif,image/png" style="display:none;">
                                            </span>
                                            <span class="btn red btn-outline btn-file">
                                                <span class="delete-ing" id="deleteImg"> Delete image </span>
                                            </span>
                                        </div>
                                    </div>
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

