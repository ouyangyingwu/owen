<?php
namespace common\models;

use Yii;
use common\exception\ModelException;

/**
 * User model
 *
 * @property integer $id
 * @property integer $user_id
 * @property string $majorNo
 * @property string $majorName
 * @property integer $majorCred
 * @property integer $number
 * @property integer $department_id
 * @property integer $create_time
 */
class Major extends  BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%major}}';
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

        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_LIST => ['id','user_id','majorNo','majorName','department_id','per_page','page'],
            self::SCENARIO_SEARCH_ONE => ['id', 'majorNo'],
            self::SCENARIO_ADD => ['user_id','majorNo','majorName','majorCred','department_id'],
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
        if($this->user_id)
        {
            $this->_query->andFilterWhere(['user_id' => $this->user_id]);
        }
        if($this->majorNo)
        {
            $this->_query->andFilterWhere(['like' , 'majorNo' , $this->majorNo]);
        }
        if($this->majorName)
        {
            $this->_query->andFilterWhere(['like' , 'majorName' , $this->majorName]);
        }
        if($this->department_id)
        {
            $this->_query->andFilterWhere(['department_id' => $this->department_id]);
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
    public function getTeam()
    {
        return $this->hasMany(Team::className(),['major_id'=>'id']);
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
            if(in_array('team.student.user' , $this->expand)){
                $this->_query->with('team.student.user');
            }
            if(in_array('team.student.user' , $this->expand)){
                $this->_query->with('team.student.register');
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
            $major = new Major();
            $major->scenario = self::SCENARIO_ADD;
            $major->setAttributes($this->safeAttributesData());
            $major->create_time = time();
            if($major->save())
            {
                return $major;
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
            $major = Major::find()->andFilterWhere(['id' => $this->id])->one();
            if($major)
            {
                $major->scenario = self::SCENARIO_EDIT;
                $major->setAttribute($this->edit_name, $this->edit_value);
                if($major->save())
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
