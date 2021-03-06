<?php
namespace common\models;

use Yii;
use common\exception\ModelException;

/**
 * This is the model class for table "user_teacher".
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $teachNo
 * @property string $position
 * @property integer $course
 * @property integer $department_id
 * @property string $reward
 * @property string $punish
 * @property integer $create_time
 * @property integer $division_id
 */
class UserTeacher extends  BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%user_teacher}}';
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
            [['user_id','teachNo','position','department_id'],'required','on'=>[self::SCENARIO_ADD]],     //分情景模式验证，修改的时候需要这条规则
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_LIST => ['id','user_id','teachNo','position','department_id','division_id','page','per_page'],
            self::SCENARIO_SEARCH_ONE => ['id', 'user_id','stuNo'],
            self::SCENARIO_ADD => ['user_id','teachNo','position','department_id'],
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
        if ($this->department_id)
        {
            $this->_query->andFilterWhere(['department_id'=> $this->department_id]);
        }
        if ($this->user_id){
            if (is_array($this->user_id))
            {
                $this->_query->andFilterWhere(['user_id'=> $this->user_id]);
            }else{
                $this->_query->andFilterWhere(['user_id'=> $this->user_id]);
            }
        }
        if ($this->division_id)
        {
            if (is_array($this->division_id)){
                $this->_query->andFilterWhere(['in' , 'division_id' , $this->division_id]);
            }else{
                $this->_query->andFilterWhere(['division_id'=> $this->division_id]);
            }
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
    public function getDepartment()
    {
        return $this->hasOne(Department::className(),['id'=>'department_id']);
    }
    public function getDivision()
    {
        return $this->hasOne(Division::className(),['id'=>'division_id']);
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
                        $query->select(['id', 'username','email','phone','sex','active','birth']);
                    }
                ]);
            }
            if(in_array('department' , $this->expand)){
                $this->_query->with('department');
            }
            if(in_array('division' , $this->expand)){
                $this->_query->with('division');
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
            $userTeacher = new UserTeacher();
            $userTeacher->scenario = self::SCENARIO_ADD;
            $userTeacher->setAttributes($this->safeAttributesData());
            $userTeacher->create_time = time();
            if($userTeacher->save())
            {
                return $userTeacher;
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
            $userTeacher = UserTeacher::find()->andFilterWhere(['id' => $this->id])->one();
            if($userTeacher)
            {
                $userTeacher->scenario = self::SCENARIO_EDIT;
                if($this->edit_name == 'reward' || $this->edit_name == 'punish')$this->edit_value = json_encode($this->edit_value);
                $userTeacher->setAttribute($this->edit_name, $this->edit_value);
                if($userTeacher->save())
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
