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
        $article = new Article();
        $article->order_by = ['id' => 1];
        $article->status = 1;
        $article->expand = ['user'];
        list($total , $list) = $article->getList();
        return $this->render('articleList' , [
            'ArticleList' => $list
        ]);
    }

    public function actionCreate()
    {
        return $this->render('articlecreate');
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

        return $this->render('article-detail' , [
            'Article' => $article,
            'Comment' => $list,
            'total' => $total
        ]);
    }
}
