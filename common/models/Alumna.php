<?php
namespace common\models;

use Yii;
use common\exception\ModelException;

/**
 * This is the model class for table "alumna".    校友
 *
 * @property integer $id
 * @property string $stuNo
 * @property string $name
 * @property integer $sex
 * @property integer $birth
 * @property string $email
 * @property integer $phone
 * @property integer $session
 * @property string $depName
 * @property string $majorName
 * @property string $teamName
 * @property integer $credit
 * @property string $reward
 * @property string $punish
 * @property integer $admission_time
 * @property integer $graduate_time
 * @property integer $eminent
 * @property string $reason_list
 * @property integer $type
 * @property string $expel_reason
 */
class Alumna extends  BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%alumna}}';
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
            self::SCENARIO_LIST => ['id','per_page','page','name','session','depName','majorName','teamName'],
            self::SCENARIO_EDIT => ['id' , 'edit_name' , 'edit_value'],
            self::SCENARIO_ADD => [
                'stuNo','name','sex','birth','email','phone','session','depName','majorName', 'teamName','credit',
                'reward','punish','admission_time','type','expel_reason'
            ]
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
        if ($this->depName)
        {
            $this->_query->andFilterWhere(['like', 'depName', $this->depName]);
        }
        if ($this->majorName)
        {
            $this->_query->andFilterWhere(['like', 'majorName', $this->majorName]);
        }
        if ($this->teamName)
        {
            $this->_query->andFilterWhere(['like', 'teamName', $this->teamName]);
        }
        if ($this->session)
        {
            $this->_query->andFilterWhere(['session' => $this->session]);
        }
        if ($this->name)
        {
            $this->_query->andFilterWhere(['like', 'name', $this->name]);
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
        if (count($this->expand)>0){}
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
            $alumna = new Alumna();
            $alumna->scenario = self::SCENARIO_ADD;
            $alumna->setAttributes($this->safeAttributesData());
            $alumna->graduate_time = strtotime(date('Y-m'));
            $alumna->eminent = false;
            if($alumna->save())
            {
                return true;
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
            $alumna = Alumna::find()->andFilterWhere(['id' => $this->id])->one();
            if($alumna)
            {
                $alumna->scenario = self::SCENARIO_EDIT;
                if($this->edit_name == 'reason_list'){$this->edit_value = json_encode($this->edit_value);}
                $alumna->setAttribute($this->edit_name , $this->edit_value);
                if($alumna->save())
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
