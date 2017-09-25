<?php
namespace common\models;

use Yii;

/**
 * User model
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
    public $create_time;
    public $edit_time;
    public $is_delete;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id','user_d' ,'title' ,'content'],'required','on'=>self::SCENARIO_EDIT],     //分情景模式验证，修改的时候需要这条规则
            [['id'],'required','on'=>[self::SCENARIO_DELETE,self::SCENARIO_STATUS]],
            [['user_d' ,'title' ,'content'],'required','on'=>self::SCENARIO_ADD],
            [['id', 'create_time' , 'endit_time'], 'integer'],
            [['describe'], 'string', 'max' => 50],
            [['content'], 'string', 'max' => 50000],
        ];
    }


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



    public function scenarios()
    {
        return [
            self::SCENARIO_SEARCH => ['id', 'describe' , 'user_id' , 'title' , 'content'],
            self::SCENARIO_ADD => ['user_id' , 'describe' , 'title' , 'content'],
            self::SCENARIO_STATUS => ['id' , 'status'],
            self::SCENARIO_EDIT => ['id'  , 'describe' , 'title' , 'content'],
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
        if ($this->id)
        {
            $this->_query->andFilterWhere(['id', $this->id]);
        }
        if ($this->user_id)
        {
            $this->_query->andFilterWhere(['id', $this->user_id]);
        }
        if ($this->describe)
        {
            $this->_query->andFilterWhere(['ILIKE', 'content', $this->describe]);
        }
        if ($this->content)
        {
            $this->_query->andFilterWhere(['ILIKE', 'content', $this->content]);
        }
        if ($this->title)
        {
            $this->_query->andFilterWhere(['status'=>$this->title]);
        }

        if(count($this->select)>0)
        {
            $this->_query->select($this->select);
        }
    }
    /**
     * add expand query
     * 关联表查询
     */
    private function addQueryExpand()
    {

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
