<?php
namespace common\models;

use Yii;
use common\exception\ModelException;

/**
 * This is the model class for table "user_student".
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $stuNo
 * @property integer $credit
 * @property string $reward
 * @property string $punish
 * @property integer $status
 * @property integer $create_time
 * @property integer $leaveschool_time
 * @property integer $leaveschool_length
 * @property integer $dropout_time
 * @property integer $class
 * @property integer $team_id
 * @property integer $major_id
 * @property integer $department_id
 */
class UserStudent extends  BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%user_student}}';
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
    const SCENARIO_DELETE = 'delete';

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id'],'required','on'=>[self::SCENARIO_EDIT]],     //分情景模式验证，修改的时候需要这条规则
            [['user_id','stuNo','department_id','major_id'],'required','on'=>[self::SCENARIO_ADD]],     //分情景模式验证，修改的时候需要这条规则
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_LIST => ['id','user_id','team_id','status','per_page','page'],
            self::SCENARIO_SEARCH_ONE => ['id', 'user_id','stuNo'],
            self::SCENARIO_ADD => ['user_id','stuNo','department_id','major_id'],
            self::SCENARIO_EDIT => ['id' , 'edit_name' , 'edit_value' , 'leaveschool_length'],
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
        if ($this->team_id)
        {
            if(is_array($this->team_id)){
                $this->_query->andFilterWhere(['in', 'team_id', $this->team_id]);
            }else{
                $this->_query->andFilterWhere(['team_id' => $this->team_id]);
            }
        }
        if ($this->stuNo)
        {
            if(is_array($this->stuNo)){
                $this->_query->andFilterWhere(['in', 'stuNo', $this->stuNo]);
            }else{
                $this->_query->andFilterWhere(['stuNo' => $this->stuNo]);
            }
        }
        if ($this->status)
        {
            if(is_array($this->status)){
                $this->_query->andFilterWhere(['in', 'status', $this->status]);
            }else{
                $this->_query->andFilterWhere(['status' => $this->status]);
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
    public function getMajor()
    {
        return $this->hasOne(Major::className(),['id'=>'major_id']);
    }
    public function getTeam()
    {
        return $this->hasOne(Team::className(),['id'=>'team_id']);
    }
    public function getRegister()
    {
        return $this->hasMany(Register::className(),['student_id'=>'id']);
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
                        $query->select(['id', 'username','email','phone','birth','sex','active']);
                    }
                ]);
            }
            if(in_array('department' , $this->expand)){
                $this->_query->with('department');
            }
            if(in_array('major' , $this->expand)){
                $this->_query->with('major');
            }
            if(in_array('team' , $this->expand)){
                $this->_query->with('team');
            }
            if(in_array('register' , $this->expand)){
                $this->_query->with('register');
            }
            if(in_array('register.course' , $this->expand)){
                $this->_query->with([
                    'register' => function($query){
                        $query->where(['NOT',['exam_time' => null]])->andwhere(['NOT',['exam_time' => '']])->with('course');
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
            $userStudent = new UserStudent();
            $userStudent->scenario = self::SCENARIO_ADD;
            $userStudent->setAttributes($this->safeAttributesData());
            $userStudent->credit = 0;
            $userStudent->status = 1;
            $userStudent->create_time = time();
            if($userStudent->save())
            {
                return $userStudent;
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
            $userStudent = UserStudent::find()->andFilterWhere(['id' => $this->id])->one();
            if($userStudent)
            {
                $userStudent->scenario = self::SCENARIO_EDIT;
                if($this->edit_name == 'reward' || $this->edit_name == 'punish')$this->edit_value = json_encode($this->edit_value);
                if($this->edit_name == 'department_id'){
                    $userStudent->major_id = 0;
                    $userStudent->team_id = 0;
                }elseif($this->edit_name == 'major_id'){
                    $userStudent->team_id = 0;
                }elseif($this->edit_name == 'team_id'){
                    $user_number = self::findAll(['team_id' => $this->edit_value]);
                    $number_limit = Team::findOne(['id'=>$this->edit_value]);
                    if(count($user_number) >= $number_limit['number_limit']){
                        $errorStr = "该班级人数已满！！！";
                        throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
                    }
                }
                if($this->edit_name == 'status' && $this->edit_value == 5){
                    $userStudent->leaveschool_time = time();
                    $userStudent->leaveschool_length = $this->leaveschool_length;
                }
                if($this->edit_name == 'status' && $this->edit_value == 1){
                    $userStudent->leaveschool_time = null;
                    $userStudent->leaveschool_length = null;
                }
                $userStudent->setAttribute($this->edit_name, $this->edit_value);
                if($userStudent->save())
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

    /**
     * 删除数据
     */
    public function getDelete(){
        if ($this->validate()) {
            $student = UserStudent::find()->andFilterWhere(['user_id' => $this->id])->one();
            if ($student) {
                if ($student->delete()) {
                    return true;
                }
            }
            return null;
        } else {
            $errorStr = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
        }
    }
}
