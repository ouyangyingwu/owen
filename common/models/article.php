<?php
namespace common\models;

use Yii;
use common\exception\ModelException;
use common\models\File;

/**
 * This is the model class for table "Article".
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $title
 * @property string $describe
 * @property string $content
 * @property integer $status
 * @property integer $type
 * @property string $create_time
 * @property string $edit_time
 * @property integer $is_delete
 */
class Article extends  BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%article}}';
    }

    /*public $id;
    public $user_id;
    public $title;
    public $describe;
    public $content;
    public $status;
    public $type;
    public $create_time;
    public $edit_time;
    public $is_delete;*/

    public $page = 1;
    public $per_page = 10;
    public $select;
    public $order_by;
    public $expand = [];
    public $edit_name;
    public $edit_value;
    public $strORurl;

    private $_query;

    const SCENARIO_SEARCH = 'list';
    const SCENARIO_SEARCH_ONE = 'one';
    const SCENARIO_ADD = 'add';
    const SCENARIO_EDIT = 'edit';

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id',],'required','on'=>[self::SCENARIO_EDIT]],     //分情景模式验证，修改的时候需要这条规则
            [['user_id' ,'title'],'required','on'=>self::SCENARIO_ADD],
            [['create_time' , 'type' , 'endit_time', 'page' , 'user_id' ,'id'], 'integer'],                     //这条及以下的规则是当数据存在时验证
            [['describe'], 'string', 'max' => 50],
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_SEARCH => ['id', 'describe' , 'user_id' , 'title' ,'page' , 'per_page' , 'type'],
            self::SCENARIO_SEARCH_ONE => ['id', 'describe' , 'user_id' , 'title' ,'page', 'type'],
            self::SCENARIO_ADD => ['user_id' , 'describe' , 'title'  , 'article_url' , 'type' , 'strORurl'],
            self::SCENARIO_EDIT => ['id' , 'edit_name' , 'edit_value'],
        ];
    }

    /**
     * create query
     * @return \yii\db\$this
     * 创建查询
     */
    private function createQuery($asArray = true)
    {
        $this->_query = static::find()->where(['is_delete'=>false]);
        if ($asArray)
        {
            $this->_query->asArray();
        }
        if (is_array($this->id))
        {
            $this->_query->andFilterWhere(['in', 'id', $this->id]);
        }elseif(is_numeric($this->id)){
            $this->_query->andFilterWhere(['id' => $this->id]);
        }
        if (is_numeric($this->user_id))
        {
            $this->_query->andFilterWhere(['user_id' => $this->user_id]);
        }
        if ($this->describe)
        {
            $this->_query->andFilterWhere(['ILIKE', 'describe', $this->describe]);
        }
        if ($this->title)
        {
            $this->_query->andFilterWhere(['ILIKE' ,'title' , $this->title]);
        }
        if ($this->status)
        {
            $this->_query->andFilterWhere(['status'=>$this->status]);
        }
        if (is_numeric($this->type))
        {
            $this->_query->andFilterWhere(['type'=>$this->type]);
        }
        if(count($this->select)>0)
        {
            $this->_query->select($this->select);
        }
    }
    /**
     * 关联关系
     *
     * 一对一用hasOne来执行连接
     * 一对多用hasMany
     */
    public function getUser()
    {
        return $this->hasOne(User::className(),['id'=>'user_id']);
    }
    public function getComment()
    {
        return $this->hasMany(Comment::className(),['article_id'=>'id']);
    }
    /**
     * add expand query
     * 关联表查询
     */
    private function addQueryExpand()
    {
        if (count($this->expand)>0){
            if(in_array('user' , $this->expand)){
                //$this->_query->with('user');              //查询User的所有字段
                $this->_query->with([
                    'user' => function($query) {
                        $query->select(['id', 'username']);
                    }
                ]);
            }
            if(in_array('comment' , $this->expand)){
                $this->_query->with([
                    'comment'=>function($query){
                        $query->select(['article_id', 'create_time','content'])->andFilterWhere(['status'=>1]);
                    }
                ]);
            }
        }
    }
    /**
     * deal order by
     * 排序
     */
    private function addOrderBy()
    {
        if (count($this->order_by))
        {
            foreach ($this->order_by as $field => $orderType)
            {
                $orderBy = $orderType == 1 ? SORT_ASC : SORT_DESC;
                $this->_query->addOrderBy([$field => $orderBy]);
            }
        }
    }
    /**
     * deal limit condition
     * 分页
     */
    private function addLimit()
    {
        $offset = ($this->page - 1) * $this->per_page;
        $this->_query->offset($offset);
        $this->_query->limit($this->per_page);
    }
    /**
     * 列表查询
     */
    public function getList(){
        $this->scenario = self::SCENARIO_SEARCH;
        if($this->validate()){
            $this->createQuery();
            $total = $this->_query->count();
            if ($total == 0)
            {
                return [0, null];
            }
            $this->addQueryExpand();
            $this->addOrderBy();
            /*$pages = new Pagination(['totalCount' => $total]);    //用于php分页代码
            $pages->pageSize = 1;
            $result = $this->_query->offset($pages->offset)
                ->limit($pages->limit)
                ->all();*/
            $this->addLimit();
            $result = $this->_query->all();
            return [$total , $result];
        }
    }
    /**
     * 单条数据查询
     */
    public function getOne(){
        $this->scenario = self::SCENARIO_SEARCH_ONE;
        if($this->validate()){
            $this->createQuery();
            $this->addQueryExpand();
            $result = $this->_query->one();
            if($result['article_url']){
                $result['content'] = file_get_contents("../web/file/".$result['article_url']);
            }
            return $result;
        }
    }
    /**
     * 添加数据
    */
    public function getAdd()
    {
        if ($this->validate()) {
            $article = new Article();
            $article->scenario = self::SCENARIO_ADD;
            $article->setAttributes($this->safeAttributesData());
            if($this->strORurl == 'str'){
                $file = new File();
                $file->content = $article->article_url;
                $article->article_url = $file->FileCreate();
            }
            $article->create_time = time();
            $article->status = 1;
            $article->is_delete = 0;
            if($article->save())
            {
                return $article;
            }
            return null;
        } else {
            $errorMsg = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorMsg);
        }
    }
    /**
     * 修改数据
     */
    public function getEdit()
    {
        if($this->validate())
        {
            $article = Article::find()->andFilterWhere(['id' => $this->id])->one();
            if($article)
            {
                $article->scenario = self::SCENARIO_EDIT;
                $article->setAttribute($this->edit_name, $this->edit_value);
                $article->edit_time = time();
                if($article->save())
                {
                    return [$this->edit_name => $this->edit_value];
                }
            }
            return null;
        } else {
            $errorStr = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
        }
    }
}
