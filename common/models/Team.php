<?php
namespace common\models;

use Yii;
use common\exception\ModelException;

/**
 * This is the model class for table "team".    班级表
 *
 * @property integer $id
 * @property string $teamName
 * @property integer $period
 * @property integer $number_limit
 * @property integer $major_id
 * @property integer $department_id
 * @property integer $user_id
 * @property string $honor
 */
class Team extends  BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%team}}';
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
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_LIST => ['id','user_id','className','period','major_id','per_page','page'],
            self::SCENARIO_EDIT => ['id' , 'edit_name' , 'edit_value'],
            self::SCENARIO_ADD => ['major_id','teamName','user_id','period','number_limit']
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
        if($this->major_id)
        {
            $this->_query->andFilterWhere(['major_id' => $this->major_id]);
        }
        if($this->user_id)
        {
            $this->_query->andFilterWhere(['user_id' => $this->user_id]);
        }
        if($this->period)
        {
            $this->_query->andFilterWhere(['period' => $this->period]);
        }
        if($this->teamName)
        {
            $this->_query->andFilterWhere(['like' , 'teamName' , $this->teamName]);
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
    public function getMajor()
    {
        return $this->hasOne(Major::className(),['id'=>'major_id']);
    }
    public function getDepartment()
    {
        return $this->hasOne(Department::className(),['id'=>'department_id']);
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
            if(in_array('major' , $this->expand)){
                $this->_query->with([
                    'major' => function($query) {
                        $query->select(['id', 'majorName']);
                    }
                ]);
            }
            if(in_array('department' , $this->expand)){
                $this->_query->with([
                    'department' => function($query) {
                        $query->select(['id', 'depName']);
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
        $this->scenario = self::SCENARIO_LIST;
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
            return $result;
        }
    }
    /**
     * 添加数据
    */
    public function getAdd()
    {
        if ($this->validate()) {
            $team = new Team();
            $team->scenario = self::SCENARIO_ADD;
            $team->setAttributes($this->safeAttributesData());
            if($team->save())
            {
                return $team;
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
            $team = Team::find()->andFilterWhere(['id' => $this->id])->one();
            if($team)
            {
                $team->scenario = self::SCENARIO_EDIT;
                if($this->edit_name == 'honor'){$this->edit_value = json_encode($this->edit_value);}
                $team->setAttribute($this->edit_name , $this->edit_value);
                if($team->save())
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
