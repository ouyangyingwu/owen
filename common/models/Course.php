<?php
namespace common\models;

use Yii;
use common\exception\ModelException;

/**
 * This is the model class for table "course".
 *
 * @property integer $id
 * @property string $couNo
 * @property string $courseName
 * @property integer $credit
 * @property string $class_time
 * @property integer $start_time
 * @property integer $end_time
 * @property integer $user_id
 * @property integer $department_id
 * @property integer $major_id
 * @property integer $classroom_id
 * @property integer $number
 * @property integer $type
 * @property integer $period
 */
class Course extends  BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%course}}';
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
            self::SCENARIO_LIST => ['id','user_id','major_id','type','couNo','courseName','period','per_page','page'],
            self::SCENARIO_SEARCH_ONE => ['id', 'user_id','stuNo'],
            self::SCENARIO_ADD => ['user_id','couNo','courseName','department_id','classroom_id','major_id','credit','number','start_time','end_time','class_time','type'],
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
        if ($this->couNo)
        {
            $this->_query->andFilterWhere(['couNo' => $this->couNo]);
        }
        if ($this->courseName)
        {
            $this->_query->andFilterWhere(['courseName' => $this->courseName]);
        }
        if ($this->type)
        {
            $this->_query->andFilterWhere(['type' => $this->type]);
        }
        if ($this->major_id)
        {
            $this->_query->andFilterWhere(['major_id' => $this->major_id]);
        }
        if ($this->period)
        {
            $this->_query->andFilterWhere(['period' => $this->period]);
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
    public function getClassRoom()
    {
        return $this->hasOne(ClassRoom::className(),['id'=>'classroom_id']);
    }
    public function getRegister()
    {
        return $this->hasMany(Register::className(),['course_id'=>'id']);
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
                        $query->select(['id', 'username','email','phone','birth','sex']);
                    }
                ]);
            }
            if(in_array('major' , $this->expand)){
                $this->_query->with([
                    'major' => function($query) {
                        $query->select(['id', 'majorNo','majorName']);
                    }
                ]);
            }
            if(in_array('department' , $this->expand)){
                $this->_query->with([
                    'department' => function($query) {
                        $query->select(['id', 'depNo','depName']);
                    }
                ]);
            }
            if(in_array('classRoom' , $this->expand)){
                $this->_query->with([
                    'classRoom' => function($query) {
                        $query->select(['id', 'crBuildingName','crRoomNo','crNo']);
                    }
                ]);
            }
            if(in_array('register' , $this->expand)){
                $this->_query->with('register');
            }
            if(in_array('register.student.user' , $this->expand)){
                $this->_query->with('register.student.user');
            }
            if(in_array('register.student.team' , $this->expand)){
                $this->_query->with('register.student.team');
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
            $this->addOrderBy();
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
            $course = new Course();
            $course->scenario = self::SCENARIO_ADD;
            $course->setAttributes($this->safeAttributesData());
            if($course->save())
            {
                return $course;
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
            $course = Course::find()->andFilterWhere(['id' => $this->id])->one();
            if($course)
            {
                $course->scenario = self::SCENARIO_EDIT;
                if($this->edit_name == 'class_time')$this->edit_value = json_encode($this->edit_value);
                $course->setAttribute($this->edit_name, $this->edit_value);
                if($course->save())
                {
                    if($this->edit_name == 'class_time')$this->edit_value = json_decode($this->edit_value);
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
