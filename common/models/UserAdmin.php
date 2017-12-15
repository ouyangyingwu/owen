<?php
namespace common\models;

use Yii;
use common\exception\ModelException;

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
class UserAdmin extends  BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%user_admin}}';
    }

    public $page = 1;
    public $per_page = 10;
    public $select;
    public $order_by;
    public $expand = [];
    public $edit_name;
    public $edit_value;

    private $_query;

    const SCENARIO_LIST = 'list';
    const SCENARIO_SEARCH_ONE = 'one';
    const SCENARIO_ADD = 'add';
    const SCENARIO_EDIT = 'edit';

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'],'required','on'=>[self::SCENARIO_EDIT]],     //分情景模式验证，修改的时候需要这条规则
            [['user_id','stuNo','college_id','department_id','marjor_id'],'required','on'=>[self::SCENARIO_ADD]],     //分情景模式验证，修改的时候需要这条规则
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_LIST => ['id','user_id','stuNo','credit','college_id','department_id','marjor_id'],
            self::SCENARIO_SEARCH_ONE => ['id', 'user_id','stuNo'],
            self::SCENARIO_ADD => ['user_id','stuNo','college_id','department_id','marjor_id'],
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
        $this->_query = static::find();
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
                        $query->select(['id', 'username','email','phone']);
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
