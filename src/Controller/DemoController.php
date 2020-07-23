<?php
declare(strict_types = 1);
namespace FrontendBridge\Controller;

use Cake\Controller\Controller;

/**
 * @property \FrontendBridge\Controller\Component\FrontendBridgeComponent $FrontendBridge
 */
class DemoController extends Controller
{

    /**
     * An array containing the names of components this controller uses
     *
     * @var array
     */
    public $components = [
        'FrontendBridge.FrontendBridge',
    ];

    /**
     * An array containing the names of helpers this controller uses
     *
     * @var array
     */
    public $helpers = [
        'FrontendBridge.FrontendBridge',
    ];

    /**
     * Demo page
     *
     * @return void
     */
    public function index(): void
    {
        $this->FrontendBridge->setJson('foobar', 'foo');
    }
}
