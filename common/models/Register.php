<?php
namespace common\models;

use Yii;
use common\exception\ModelException;

/**
 * This is the model class for table "course".
 *
 * @property integer $id
 * @property integer $student_id
 * @property integer $course_id
 * @property integer $exam_time
 * @property integer $score
 * @property integer $lack_class
 * @property integer $be_late
 */
class Register extends  BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%register}}';
    }

    public $page = 1;
    public $per_page = 10;
    public $select;
    public $order_by;
    public $expand = [];
    public $edit_name;
    public $edit_value;
    public $max_score;
    public $min_score;

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
            self::SCENARIO_LIST => ['id','student_id','major_id','type','couNo','courseName','per_page','page'],
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
        if ($this->course_id)
        {
            $this->_query->andFilterWhere(['course_id' => $this->course_id]);
        }
        if ($this->student_id)
        {
            $this->_query->andFilterWhere(['student_id' => $this->student_id]);
        }
        if ($this->max_score)
        {
            $this->_query->andFilterWhere(['<' , 'score' , $this->max_score]);
        }
        if ($this->min_score)
        {
            $this->_query->andFilterWhere(['>=' , 'score' => $this->min_score]);
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
    public function getStudent()
    {
        return $this->hasOne(UserStudent::className(),['id'=>'student_id']);
    }
    public function getCourse()
    {
        return $this->hasOne(Course::className(),['id'=>'course_id']);
    }
    /**
     * add expand query
     * 关联表查询
     */
    private function addQueryExpand()
    {
        if (count($this->expand)>0)
        {
            if(in_array('student' , $this->expand)){
                $this->_query->with('student');
            }

            if(in_array('student.user' , $this->expand)){
                /*$this->_query->with(['student.user'=>function($q){
                    //只能对最后一个关联表的字段进行筛选
                  $q->select(['id','username','phone','email','sex']);
                }]);*/
                $this->_query->with([
                    'student' => function($query){
                        $query->select(['id','user_id','stuNo'])->with([
                            'user'=>function($query){
                                $query->select(['id','username','phone','email','sex']);
                            }
                        ]);
                    }
                ]);
            }

            if(in_array('course' , $this->expand)){
                $this->_query->with('course');
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
            $register = new Register();
            $register->scenario = self::SCENARIO_ADD;
            $register->setAttributes($this->safeAttributesData());
            if($register->save())
            {
                return $register;
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
            $register = Register::find()->andFilterWhere(['id' => $this->id])->one();
            if($register)
            {
                $register->scenario = self::SCENARIO_EDIT;
                $register->setAttribute($this->edit_name, $this->edit_value);
                if($register->save())
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
