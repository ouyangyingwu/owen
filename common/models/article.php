<?php
namespace common\models;

use Yii;

/**
 * Article model
 *
 * @property integer $id
 * @property string $username
 * @property string $password_hash
 * @property string $password_reset_token
 * @property string $email
 * @property string $auth_key
 * @property integer $status
 * @property integer $created_at
 * @property integer $updated_at
 * @property string $password write-only password
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

    public $id;
    public $user_id;
    public $title;
    public $describe;
    public $content;
    public $status;
    public $type;
    public $create_time;
    public $edit_time;
    public $is_delete;

    public $page = 1;
    public $per_page = 10;
    public $select;
    public $order_by;
    public $expand = [];

    private $_query;

    const SCENARIO_SEARCH = 'list';
    const SCENARIO_ADD = 'add';
    const SCENARIO_STATUS = 'status';
    const SCENARIO_EDIT = 'edit';
    const SCENARIO_DELETE = 'delete';

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id','user_d' ,'title' ,'content'],'required','on'=>self::SCENARIO_EDIT],     //分情景模式验证，修改的时候需要这条规则
            [['id'],'required','on'=>[self::SCENARIO_DELETE,self::SCENARIO_STATUS]],
            [['user_id' ,'title' ,'content'],'required','on'=>self::SCENARIO_ADD],
            [['id', 'create_time' , 'type' , 'endit_time'], 'integer'],                     //这条及以下的规则是当数据存在时验证
            [['describe'], 'string', 'max' => 50],
            [['content'], 'string', 'max' => 50000],
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_SEARCH => ['id', 'describe' , 'user_id' , 'title' , 'content'],
            self::SCENARIO_ADD => ['user_id' , 'describe' , 'title' , 'content'],
            self::SCENARIO_EDIT => ['id'  , 'describe' , 'title' , 'content'],
            self::SCENARIO_STATUS => ['id' , 'status'],
            self::SCENARIO_DELETE => ['id'],
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
        if ($this->type)
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
                        $query->andFilterWhere(['status'=>1]);
                        //$query->select([ 'create_time','content']);
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
            return [$total, $result];
        }
    }
    /**
     * 单条数据查询
     */
    public function getOne(){
        $this->scenario = self::SCENARIO_DELETE;
        if($this->validate()){
            $this->createQuery();
            $this->addQueryExpand();
            return $this->_query->one();
        }
    }
}
