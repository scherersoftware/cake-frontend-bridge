<?php
declare(strict_types = 1);
namespace FrontendBridge\Lib;

use Cake\Http\Response;
use Cake\Utility\Hash;

/**
 * Custom CakeResponse for Service calls
 *
 * @package default
 */
class ServiceResponse extends Response
{

    /**
     * Constructor
     *
     * @param string|array $code One of Types::CODE_*, or an array containing 'code' and 'data' keys
     * @param array $data data to return
     */
    public function __construct($code, array $data = [])
    {
        if (is_array($code)) {
            $body = Hash::merge([
                'code' => 'success',
                'data' => [],
            ], $code);
        } else {
            $body = [
                'code' => $code,
                'data' => $data,
            ];
        }
        $options = [
            'type' => 'json',
            'body' => json_encode($body),
        ];

        parent::__construct($options);
    }
}
