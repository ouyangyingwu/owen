<?php

namespace common\models;

use Yii;
/**
 * Class Model
 *
 * @package frontend\libraries\base
 */
class BaseModel extends \yii\db\ActiveRecord
{
    /**
     * validate number field
     * @param unknown $attribute
     */
    public function validateNumberField($attribute)
    {
        $arr = $this->getAttributes([$attribute]);
        $value = $arr[$attribute];
        if (is_array($value))
        {
            foreach ($value as $id)
            {
                if (!is_numeric($id))
                {
                    $this->addError($attribute, 'Invalid Field: '.$attribute);
                    return;
                }
            }

        } else {
            if (!is_numeric($value))
            {
                $this->addError($attribute, 'Invalid Field: '.$attribute);
            }
        }
    }
    /**
     * validate boolean field
     * @param unknown $attribute
     */
    public function validateBooleanField($attribute)
    {
        $arr = $this->getAttributes([$attribute]);
        $value = $arr[$attribute];
        if (!is_numeric($value))
        {
            $this->addError($attribute, 'Invalid Field: '.$attribute);
            return;
        }
        if (!in_array($value, [0, 1]))
        {
            $this->addError($attribute, 'Invalid Field: '.$attribute);
        }
    }
    /**
     * Get safe attributes' data
     *
     * @return array
     */
    public function safeAttributesData()
    {
        return $this->toArray($this->safeAttributes());
    }

    /**
     * Change the array to pgsql array
     * @param array $array
     * @return string
     */
    public static function ArrayToPgsqlString($array)
    {
        if(is_array($array))
        {
            return '{'.implode(',',$array).'}';
        }
        return '{}';
    }
    /**
     * pgsqlstr to array
     * @param unknown $str
     * @return multitype:
     */
    public function pgsqlStrToArray($str)
    {
        if(!$str)
            return null;
        $str = ltrim($str, '{');
        $str = rtrim($str, '}');
        if(!$str)
            return null;
        return explode(',', $str);
    }

    public function displayPhoneNumber($str){
        if (!$str) {
            return "";
        }
        return preg_replace('/(\d{3})(\d{3})(\d{4})/','($1)$2-$3',$str);
    }
}