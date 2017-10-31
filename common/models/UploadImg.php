<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "upload_img".
 *
 * @property integer $Id
 * @property string $img_url
 * @property integer $size
 * @property string $upload_time
 * @property integer $is_download
 * @property integer $active
 */
class UploadImg extends BaseModel
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'upload_img';
    }

    /*public $name;
    public $type;
    public $tmp_name;
    public $error;
    public $size;*/

    public $file;
    public $page = 1;
    public $per_page = 10;
    public $select;
    public $order_by;
    public $expand = [];

    private $_query;

    const SCENARIO_SEARCH = 'list';
    const SCENARIO_ADD = 'add';
    const SCENARIO_STATUS = 'status';
    const SCENARIO_EDIT = 'edit';
    const SCENARIO_DELETE = 'delete';

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['upload_time', 'is_download', 'active' , 'size' , 'id'], 'integer'],
            [['img_url'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'img_url' => 'Img Url',
            'size' => 'Size',
            'upload_time' => 'Upload Time',
            'is_download' => 'Is Download',
            'active' => 'Active',
        ];
    }

    public function scenarios()
    {
        return [
            self::SCENARIO_ADD => ['img_url' , 'size' , 'is_download'],
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
        if ($this->active)
        {
            $this->_query->andFilterWhere(['active'=>$this->active]);
        }
        if ($this->type)
        {
            $this->_query->andFilterWhere(['type'=>$this->type]);
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
    public function getComment()
    {
        return $this->hasMany(Comment::className(),['article_id'=>'id']);
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
                        $query->select(['id', 'username']);
                    }
                ]);
            }
            if(in_array('comment' , $this->expand)){
                $this->_query->with([
                    'comment'=>function($query){
                        $query->select(['article_id', 'create_time','content'])->andFilterWhere(['status'=>1]);
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
     * 上传图片
     */
    public function getCreate(){
        if ($this->validate()) {
            $upload = new UploadImg();
            $upload->scenario = self::SCENARIO_ADD;
            $upload->setAttributes($this->safeAttributesData());
            $upload->create_time = time();
            $upload->status = 1;
            if($upload->save())
            {
                return $upload;
            }
            return null;
        } else {
            $errorMsg = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorMsg);
        }
    }
    /**
     * 下载图片
     */
    public function getDownlode(){
        $this->scenario = self::SCENARIO_DELETE;
        if ($this->validate()) {
            $filePath = "./upload/".$this->img_url.".jpg";
            $filename = $this->img_url.".jpg";
            header("Content-type:image/jpeg");
            header("Content-Length:".filesize($filePath));
            header("Content-Disposition:attachment;filename=".$filename);
            readfile($filePath);
        } else {
            $errorMsg = current($this->getFirstErrors());
            throw new ModelException(ModelException::CODE_INVALID_INPUT, $errorMsg);
        }
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
            return $this->_query->one();
        }
    }

    /**
     * 图片位置与名称处理
    */
    public function FileUrl()
    {
        //var_dump('mmp');die;
        if (@$this->file['error'] > 0) {
            //上传失败
            switch ($this->file['error']) {
                case 1 :
                    return "上传失败，超过了PHP配置文件中的upload_max_filesize设置的大小";
                    break;
                case 2 :
                    return "上传失败，超过了HTML表单中的MAX_FILE_SIZE选项指定的值";
                    break;
                case 3 :
                    return "上传失败，只有部分文件被上传";
                    break;
                case 4 :
                    return "上传失败，上传文件大小为0，即没有上传任何文件";
                    break;
            }
        } else {
            //上传成功
            //自动获取后缀名
            $file_arr = explode(".", $this->file['name']);    //上传的文件名分割为数组
            $fileExt = $file_arr[count($file_arr) - 1];                //获取后缀名

            //判断文件上传的后缀名是否为允许的类型
            $alowExt = "txt,doc,jpg,png,gif,";
            if (strstr($alowExt, $fileExt)) {
                //设置名字
                $fileNewName = "CS" . date("YmdHis") . mt_rand(10000, 99999) . "." . $fileExt;
                if (is_uploaded_file($this->file['tmp_name'])) {  //判断文件是否通过HTTP POST方式上传的
                    if (@move_uploaded_file($this->file['tmp_name'], "./image/upload/" . $fileNewName)) {
                        return "upload/" . $fileNewName;
                    } else {
                        return "上传失败";
                        //echo "文移动传成功！";
                    }
                }
            } else {
                echo $fileExt . "类型文件不允许上传！";
            }
        }
    }
}
