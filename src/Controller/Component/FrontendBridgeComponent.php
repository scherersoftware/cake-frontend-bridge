<?php
namespace FrontendBridge\Controller\Component;

use Cake\Controller\Component;
use Cake\Controller\ComponentRegistry;
use Cake\Core\Configure;
use Cake\Event\Event;
use Cake\Utility\Hash;
use Cake\Utility\Inflector;

class FrontendBridgeComponent extends Component {

    /**
     * Holds a reference to the controller which uses this component
     *
     * @var Controller
     */
    protected $_controller;

    /**
     * Holds the data which will be made available to the frontend controller
     *
     * @var array
     */
    protected $_jsonData = array();

    /**
     * Holds additional data to be set into frontend data by the controller.
     *
     * @var array
     */
    protected $_additionalAppData = array();

    /**
     * the current request object
     *
     * @var CakeRequest
     */
    protected $_request;

    /**
     * Close dialog indicator
     *
     * @var bool
     */
    protected $_closeDialog = false;

    protected $_defaultConfig = [
        'templatePaths' => [
            'jsonAction' => 'FrontendBridge.json_action',
            'dialogAction'=> 'FrontendBridge.dialog_action'
        ]
    ];

    /**
     * Constructor
     *
     * @param ComponentRegistry $registry A ComponentRegistry object.
     * @param array $config Array of configuration settings.
     */
    public function __construct(ComponentRegistry $registry, array $config = []) {
        parent::__construct($registry, $config);

        $this->_controller = $registry->getController();
        $this->_request = $this->_controller->request;
    }

    /**
     * Events supported by this component.
     *
     * @return array
     */
    public function implementedEvents() {
        return [
            'Controller.beforeRender' => 'beforeRender'
        ];
    }

    /**
     * Pass data to the frontend controller
     *
     * @param string $key string key or array of key=>values
     * @param mixed $value value
     * @return void
     */
    public function setJson($key, $value = null) {
        if (is_array($key)) {
            foreach ($key as $k => $v) {
                $this->setJson($k, $v);
            }
            return;
        }

        $this->_jsonData[$key] = $value;
    }

    /**
     * Pass data to the frontend controller
     *
     * @param string $key string key or array of key=>values
     * @param mixed $value value
     * @return void
     */
    public function set($key, $value = null) {
        $this->setJson($key, $value);
    }

    /**
     * Adds additional data to the appData
     *
     * @param string $key string key
     * @param mixed $value value
     * @return void
     */
    public function addAppData($key, $value = null) {
        $this->_additionalAppData[$key] = $value;
    }

    /**
     * Set a variable to both the frontend controller and the backend view
     *
     * @param string $key string key or array of key=>value
     * @param mixed $value var value
     * @return void
     */
    public function setBoth($key, $value = null) {
        $this->_controller->set($key, $value);
        $this->setJson($key, $value);
    }

    /**
     * Close dialog setter
     *
     * @return void
     */
    public function closeDialog()
    {
        $this->_closeDialog = true;
    }

    /**
     * Should be called explicitely in Controller::beforeRender()
     *
     * @param Event $event beforeRender event
     * @return void
     */
    public function beforeRender(Event $event) {
        $this->setJson('isAjax', $this->_controller->request->is('ajax'));
        $this->setJson('isMobile', $this->_controller->request->is('mobile'));
        $this->setBoth('isDialog', $this->_controller->request->is('dialog'));
        $this->setBoth('isJson', $this->_controller->request->is('json'));
        $this->setJson('debug', Configure::read('debug'));

        $ssl = false;
        if (env('HTTPS') || $this->_controller->request->is('ssl') || $this->_controller->request->env('HTTP_X_FORWARDED_PROTO') == 'https') {
            $ssl = true;
        }

        $appData = array(
            'jsonData' => $this->_jsonData,
            'webroot' => 'http' . ($ssl ? 's' : '') . '://' . env('HTTP_HOST') . $this->_controller->request->webroot,
            'url' => $this->_controller->request->url,
            // 'controller' => $this->_controller->name,
            // 'action' => $this->_controller->request->action,
            // 'plugin' => $this->_controller->request->plugin,
            'request' => array(
                'query' => $this->_controller->request->query,
                'pass' => $this->_controller->request->params['pass'],
                'plugin' => $this->_controller->request->plugin,
                'controller' => Inflector::underscore($this->_controller->name),
                'action' => $this->_controller->request->action
            )
        );

        // merge in the additional frontend data
        $appData = Hash::merge($appData, $this->_additionalAppData);
        $this->_controller->set('frontendData', $appData);
        $this->_controller->set('closeDialog', $this->_closeDialog);
    }
}
