<?php
namespace frontend\controllers;

use common\models\Article;
use common\models\Comment;
use common\models\User;
use Yii;
use yii\web\Controller;



/**
 * Site controller
 */
class ArticleController extends Controller
{
    public function actionIndex()
    {
        //注释部分用于前端数据处理
        /*$article = new Article();
        $article->order_by = ['id' => 1];
        $article->status = 1;
        $article->expand = ['user'];
        list($total , $list) = $article->getList();*/

        return $this->render('articleList' , [
            /*'ArticleList' => $list,
            'pages'=>$total*/
        ]);
    }

    public function actionCreate()
    {
        return $this->render('articleCreate');
    }

    public function actionDetail($id = 1)
    {
        $article = new Article();
        $article->expand = ['user'];
        $article->status = 1;
        $article->id = $_GET['id'];
        $article = $article->getOne();

        $comment = new Comment();
        $comment->expand = ['user'];
        $comment->article_id = $_GET['id'];
        list($total , $list) = $comment->getList();

        return $this->render('articleDetail' , [
            'Article' => $article,
            'Comment' => $list,
            'total' => $total
        ]);
    }
}
