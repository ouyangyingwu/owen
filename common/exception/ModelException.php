<?php

namespace common\exception;

use yii\base\Exception;

/**
 * Class ApiException
 *
 * @package frontend\libraries\exception
 */
class ModelException extends Exception
{
    const CODE_INVALID_INPUT = 50001;
    const CODE_NOT_FOUND_MODE = 50002;
    
    private static $errorMsg = [
        self::CODE_INVALID_INPUT => 'Invalid Input',
        self::CODE_NOT_FOUND_MODE => 'No result'
    ];
    /**
     * Constructor
     *
     * @param int $code
     * @param string $message
     * @param \Exception $previous
     */
    public function __construct($code, $message = null, \Exception $previous = null)
    {
        if ($code && is_null($message)) {
            $message = self::$errorMsg[$code];
        }
        parent::__construct($message, $code, $previous);
    }

    /**
     * Get user-friendly name of this exception
     *
     * @return string
     */
    public function getName()
    {
        return 'ModelException';
    }
    
    /**
     * Get detailed errors
     *
     * @return array
     */
    public function getErrors()
    {
        $previous = $this->getPrevious();
        if ($previous instanceof ModelException) {
            return $previous->getErrors();
        }
        return array();
    }
}