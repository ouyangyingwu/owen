<?php
namespace common\models;

use Yii;
use common\exception\ModelException;

/**
 * This is the model class for table "article_comment".
 *
 * @property integer $id
 * @property integer $comment_id
 * @property integer $user_id
 * @property integer $article_id
 * @property string $content
 * @property string $create_time
 * @property integer $status
 */
class Comment extends  BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%article_comment}}';
    }

    //定义这些属性会使的赋值时付错地方
    /*public $id;
    public $comment_id;
    public $user_id;
    public $article_id;
    public $content;
    public $create_time;
    public $status;*/

    public $page = 1;
    public $per_page = 10;
    public $select;
    public $order_by;
    public $expand = [];

    private $_query;

    const SCENARIO_LIST = 'list';
    const SCENARIO_ADD = 'add';
    const SCENARIO_STATUS = 'status';
    const SCENARIO_DELETE = 'delete';

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id' , 'user_id'],'required','on'=>[self::SCENARIO_DELETE,self::SCENARIO_STATUS]],
            [['user_id' ,'comment_id' ,'article_id' , 'content'],'required','on'=>self::SCENARIO_ADD],
            [['id' , 'user_id' ,'comment_id' ,'article_id' ], 'integer'],                     //这条及以下的规则是当数据存在时验证
            [['content'], 'string', 'max' => 255],
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_ADD => ['user_id' ,'comment_id' ,'article_id' , 'content'],
            self::SCENARIO_STATUS => ['id' , 'status'],
            self::SCENARIO_DELETE => ['id'],
            self::SCENARIO_LIST => ['article_id']
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
        if ($this->id)
        {
            $this->_query->andFilterWhere(['id' => $this->id]);
        }
        if ($this->user_id)
        {
            $this->_query->andFilterWhere(['user_id' => $this->user_id]);
        }
        if ($this->article_id)
        {
            $this->_query->andFilterWhere(['article_id' => $this->article_id]);
        }
        if ($this->status)
        {
            $this->_query->andFilterWhere(['status'=>$this->status]);
        }
        if(count($this->select)>0)
        {
            $this->_query->select($this->select);
        }
    }
    /**
     * 关联关系
     */
    public function getUser()
    {
        return $this->hasOne(User::className(),['id'=>'user_id']);
    }
    public function getComment()
    {
        return $this->hasMany(static::className(),['comment_id'=>'id']);
    }
    /**
     * add expand query
     * 关联表查询
     */
    private function addQueryExpand()
    {
        if (count($this->expand)>0){
            if(in_array('user' , $this->expand)){
                $this->_query->with([
                    'user' => function($query) {
                        $query->select(['id', 'username']);
                    }
                ]);
            }
            if(in_array('comment' , $this->expand)){
               // $this->_query->with('comment');
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
            $this->addQueryExpand();
            $this->addOrderBy();
            //$this->addLimit();
            $result = $this->_query->all();

            $comment = [];
            foreach($result as $value){
                if($value['comment_id'] = 0){
                    $comment[] = $value;
                }
            }
            $result = $this->reply($result);
            //var_dump($result);die;
            return [count($result), $result];
        }
    }

    /**
     * 递归函数
    */
    public function reply($a, $pid = 0,$level = 0) {
        $tree = array();                                    //每次都声明一个新数组用来放子元素
        foreach($a as $v){
            if($v['comment_id'] == $pid){                   //匹配子记录
              //  var_dump($pid);
                $v['level'] = $level;
                $v['comment'] = self::reply($a,$v['id'],$level+1);   //递归获取子记录
                if($v['comment'] == null){
                    unset($v['comment']);                   //如果子元素为空则unset()进行删除，说明已经到该分支的最后一个元素了（可选）
                }
                $tree[] = $v;                               //将记录存入新数组
            }
        }
        return $tree;                                       //返回新数组
    }

    /**
     *
    */
    public function getAdd()
    {
        if ($this->validate()) {
            $comment = new Comment();
            $comment->scenario = self::SCENARIO_ADD;
            $comment->setAttributes($this->safeAttributesData());
            $comment->create_time = time();
            $comment->status = 1;
            if($comment->save())
            {
                return $comment;
            }
            return null;
        } else {
            $errorMsg = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorMsg);
        }
    }
}
