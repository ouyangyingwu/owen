<?php

namespace app\models;

use common\models\BaseModel;
use yii\web\IdentityInterface;
use Yii;

/**
 * This is the model class for table "employee".
 *
 * @property integer $id
 * @property string $name
 * @property string $card_number
 * @property integer $sex
 * @property string $password_hash
 * @property string $email
 * @property string $phone
 * @property string $create_time
 * @property string $img_url
 * @property integer $is_delete
 * @property string $active
 * @property integer $status
 * @property integer $created_at
 * @property integer $updated_at
 */
class Employee extends BaseModel //implements IdentityInterface
{
    const STATUS_DELETED = 0;
    const STATUS_ACTIVE = 10;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'employee';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['sex', 'phone', 'create_time', 'is_delete', 'status', 'created_at', 'updated_at'], 'integer'],
            [['password_hash', 'email'], 'required'],
            [['name', 'password_hash', 'email', 'img_url', 'active'], 'string', 'max' => 255],
            [['card_number'], 'string', 'max' => 25],
            [['email'], 'unique'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'card_number' => 'Card Number',
            'sex' => 'Sex',
            'password_hash' => 'Password Hash',
            'email' => 'Email',
            'phone' => 'Phone',
            'create_time' => 'Create Time',
            'img_url' => 'Img Url',
            'is_delete' => 'Is Delete',
            'active' => 'Active',
            'status' => 'Status',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }
    /**
     * Finds user by username
     *
     * @param string $username
     * @return static|null
     */
    public static function findByUsername($username)
    {
        return static::findOne(['name' => $username, 'status' => self::STATUS_ACTIVE]);
    }
}
