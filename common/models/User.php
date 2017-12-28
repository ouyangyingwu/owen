<?php
namespace common\models;

use Yii;
use yii\base\NotSupportedException;
use yii\behaviors\TimestampBehavior;
use yii\web\IdentityInterface;
use common\exception\ModelException;

/**
 * User model
 *
 * @property integer $id
 * @property integer $type
 * @property string $username
 * @property integer $sex
 * @property integer $birth
 * @property string $password_hash
 * @property string $password_reset_token
 * @property string $email
 * @property integer $status
 * @property string $auth_key
 * @property integer $phone
 * @property string $img_url
 *  @property integer $is_delete
 * @property integer $created_at
 * @property integer $updated_at
 * @property string $password write-only password
 */
class User extends BaseModel implements IdentityInterface
{
    const STATUS_DELETED = 0;
    const STATUS_ACTIVE = 10;


    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%user}}';
    }

    public $page = 1;
    public $per_page = 10;
    public $select;
    public $order_by;
    public $expand = [];
    public $edit_name;
    public $edit_value;
    public $old_password;
    public $new_password;

    private $_query;

    const SCENARIO_SEARCH = 'list';
    const SCENARIO_ONE = 'one';
    const SCENARIO_ADD = 'add';
    const SCENARIO_EDIT = 'edit';
    const SCENARIO_UPDATE = 'update';
    const SCENARIO_RESET_PASSWORD = 'password';
    const SCENARIO_DELETE = 'delete';

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id' , 'page'] , 'integer',],
            [['email' , 'username'], 'string'],
            [['old_password' , 'new_password'], 'required'],
            ['new_password', 'string', 'max' => 30 , 'min'=>8]
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_SEARCH => ['id', 'email' , 'username' , 'phone' , 'type' , 'per_page' , 'page'],
            self::SCENARIO_ADD => ['type', 'username' , 'phone' , 'email' , 'img_url' , 'sex' , 'birth' ],
            self::SCENARIO_UPDATE => ['email' , 'username' , 'phone'],
            self::SCENARIO_RESET_PASSWORD => ['old_password' , 'new_password'],
            self::SCENARIO_EDIT => ['id'  , 'edit_name' , 'edit_value'],
            self::SCENARIO_ONE => ['id'  , 'type'],
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
        $this->_query = static::find()->where(['is_delete'=>0]);
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
        if ($this->email)
        {
            $this->_query->andFilterWhere(['like', 'email', $this->email]);
        }
        if ($this->phone)
        {
            $this->_query->andFilterWhere(['like', 'phone', $this->phone]);
        }
        if ($this->username)
        {
            $this->_query->andFilterWhere(['like', 'username', $this->username]);
        }
        if (is_array($this->type))
        {
            $this->_query->andFilterWhere(['in' , 'type', $this->type]);
        }
        if ($this->type)
        {
            $this->_query->andFilterWhere(['type'=> $this->type]);
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
        return $this->hasOne(UserStudent::className(),['user_id'=>'id']);
    }
    public function getTeacher()
    {
        return $this->hasOne(UserTeacher::className(),['user_id'=>'id']);
    }
    public function getAdmin()
    {
        return $this->hasOne(UserAdmin::className(),['user_id'=>'id']);
    }
    /**
     * add expand query
     * 关联表查询
     */
    private function addQueryExpand()
    {
        if (count($this->expand)>0){
            if(in_array('student' , $this->expand)){
                $this->_query->with('student');              //查询UserStudent的所有字段
                /*$this->_query->with([                   //查询UserStudent的指定字段
                    'user' => function($query) {
                        $query->select(['id', 'user_id']);
                    }
                ]);*/
            }
            if(in_array('teacher' , $this->expand)){
                $this->_query->with('teacher');
            }
            if(in_array('admin' , $this->expand)){
                $this->_query->with('admin');
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
            foreach($result as &$list){
                unset($list['password_hash']);
                unset($list['password_reset_token']);
            }
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
            $this->addOrderBy();
            $result = $this->_query->one();
            unset($result['password_hash']);
            unset($result['password_reset_token']);
            return $result;
        }
    }
    /**
    * 编辑数据
    */
    public function getEdit()
    {
        if($this->validate())
        {
            $user = User::find()->andFilterWhere(['id' => $this->id])->one();
            if($user)
            {
                $user->scenario = self::SCENARIO_EDIT;
                $user->setAttribute($this->edit_name, $this->edit_value);
                if($user->save())
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
     * 修改数据
     */
    public function getUpdate()
    {
        if ($this->validate()) {
            $user = User::find()->andFilterWhere(['id' => $this->id])->one();
            if ($user) {
                $user->scenario = self::SCENARIO_UPDATE;
                $user->setAttributes($this->safeAttributesData());
                $user->updated_at = time();
                if ($user->save()) {
                    return true;
                }
            }
            return null;
        } else {
            $errorStr = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
        }
    }
    /**
     * 重置密码
     */
    public function getResetPassword()
    {
        if ($this->validate()) {
            $user = User::find()->andFilterWhere(['id' => $this->id])->one();
            if ($user) {
                $user->scenario = self::SCENARIO_RESET_PASSWORD;
                //判断密码是否匹配
                if(Yii::$app->security->validatePassword($this->old_password, $user->password_hash)){
                    $user->password_hash = Yii::$app->security->generatePasswordHash($this->new_password);
                    $user->updated_at = time();
                    //var_dump($user->save());die;
                    if ($user->save()) {
                        //var_dump($user->password_hash.'yse');die;
                        return true;
                    }
                } else {
                    $errorStr = "原始密码错误！！！";
                    throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
                }
            }
            return null;
        } else {
            $errorStr = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorStr);
        }
    }

    /**
     * 添加数据
     */
    public function getAdd()
    {
        if ($this->validate()) {
            $user = new User();
            $user->scenario = self::SCENARIO_ADD;
            $user->setAttributes($this->safeAttributesData());
            $user->create_time = time();
            $user->status = 1;
            $user->is_delete = 0;
            $user->password_hash = Yii::$app->security->generatePasswordHash(123456);
            if($user->save())
            {
                return $user;
            }
            return null;
        } else {
            $errorMsg = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorMsg);
        }
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            TimestampBehavior::className(),
        ];
    }


    /**
     * @inheritdoc
     */
    public static function findIdentity($id)
    {
        return static::findOne(['id' => $id, 'status' => self::STATUS_ACTIVE]);
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        throw new NotSupportedException('"findIdentityByAccessToken" is not implemented.');
    }

    /**
     * Finds user by username
     *
     * @param string $username
     * @return static|null
     */
    public static function findByUsername($username)
    {
        return static::findOne(['username' => $username, 'status' => self::STATUS_ACTIVE]);
    }

    /**
     * Finds user by password reset token
     *
     * @param string $token password reset token
     * @return static|null
     */
    public static function findByPasswordResetToken($token)
    {
        if (!static::isPasswordResetTokenValid($token)) {
            return null;
        }

        return static::findOne([
            'password_reset_token' => $token,
            'status' => self::STATUS_ACTIVE,
        ]);
    }

    /**
     * Finds out if password reset token is valid
     *
     * @param string $token password reset token
     * @return bool
     */
    public static function isPasswordResetTokenValid($token)
    {
        if (empty($token)) {
            return false;
        }

        $timestamp = (int) substr($token, strrpos($token, '_') + 1);
        $expire = Yii::$app->params['user.passwordResetTokenExpire'];
        return $timestamp + $expire >= time();
    }

    /**
     * @inheritdoc
     */
    public function getId()
    {
        return $this->getPrimaryKey();
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey()
    {
        return $this->auth_key;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey)
    {
        return $this->getAuthKey() === $authKey;
    }

    /**
     * Validates password
     *
     * @param string $password password to validate
     * @return bool if password provided is valid for current user
     */
    public function validatePassword($password)
    {
        return Yii::$app->security->validatePassword($password, $this->password_hash);
    }

    /**
     * Generates password hash from password and sets it to the model
     *
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password_hash = Yii::$app->security->generatePasswordHash($password);
    }

    /**
     * Generates "remember me" authentication key
     */
    public function generateAuthKey()
    {
        $this->auth_key = Yii::$app->security->generateRandomString();
    }

    /**
     * Generates new password reset token
     */
    public function generatePasswordResetToken()
    {
        $this->password_reset_token = Yii::$app->security->generateRandomString() . '_' . time();
    }

    /**
     * Removes password reset token
     */
    public function removePasswordResetToken()
    {
        $this->password_reset_token = null;
    }
}
