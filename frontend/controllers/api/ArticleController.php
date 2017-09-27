<?php
namespace frontend\controllers\api;

use Yii;
use yii\web\Controller;
use common\models\Article;

/**
 * Site controller
 */
class ArticleController extends Controller
{
    public function actionOne()
    {
        $article = new Article();
        $article->id = Yii::$app->request->post('id');
        return $article->getOne();
    }
}