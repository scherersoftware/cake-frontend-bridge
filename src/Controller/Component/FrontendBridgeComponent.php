<?php
namespace FrontendBridge\Controller\Component;

use Cake\Controller\Component;
use Cake\Controller\ComponentRegistry;
use Cake\Core\Configure;
use Cake\Event\Event;
use Cake\Utility\Hash;
use Cake\Utility\Inflector;

class FrontendBridgeComponent extends Component
{

    /**
     * Holds a reference to the controller which uses this component
     *
     * @var \Cake\Controller\Controller
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
     * @var \Cake\Http\ServerRequest
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
            'dialogAction' => 'FrontendBridge.dialog_action',
        ],
        'csrfCookieFieldName' => '_csrfToken',
    ];

    /**
     * Constructor
     *
     * @param ComponentRegistry $registry A ComponentRegistry object.
     * @param array             $config   Array of configuration settings.
     */
    public function __construct(ComponentRegistry $registry, array $config = [])
    {
        parent::__construct($registry, $config);

        $this->_controller = $registry->getController();
        $this->_request = $this->_controller->getRequest();
    }

    /**
     * Events supported by this component.
     *
     * @return array
     */
    public function implementedEvents(): array
    {
        return [
            'Controller.beforeRender' => 'beforeRender',
        ];
    }

    /**
     * Pass data to the frontend controller
     *
     * @param string|array $key   string key or array of key=>values
     * @param mixed        $value value
     * @return void
     */
    public function setJson($key, $value = null): void
    {
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
     * @param string|array $key   string key or array of key=>values
     * @param mixed        $value value
     * @return void
     */
    public function set($key, $value = null): void
    {
        $this->setJson($key, $value);
    }

    /**
     * Adds additional data to the appData
     *
     * @param string $key   string key
     * @param mixed  $value value
     * @return void
     */
    public function addAppData(string $key, $value = null): void
    {
        $this->_additionalAppData[$key] = $value;
    }

    /**
     * Set a variable to both the frontend controller and the backend view
     *
     * @param string|array $key   string key or array of key=>value
     * @param mixed        $value var value
     * @return void
     */
    public function setBoth($key, $value = null): void
    {
        if (\is_array($key)) {
            $this->_controller->viewBuilder()->setVars($key);
        } else {
            $this->_controller->viewBuilder()->setVar($key, $value);
        }

        $this->setJson($key, $value);
    }

    /**
     * Close dialog setter
     *
     * @return void
     */
    public function closeDialog(): void
    {
        $this->_closeDialog = true;
    }

    /**
     * Should be called explicitely in Controller::beforeRender()
     *
     * @param Event $event beforeRender event
     * @return void
     */
    public function beforeRender(Event $event): void
    {
        $this->setJson('isAjax', $this->_request->is('ajax'));
        $this->setJson('isMobile', $this->_request->is('mobile'));
        $this->setBoth('isDialog', $this->_request->is('dialog'));
        $this->setBoth('isJson', $this->_request->is('json'));
        $this->setJson('debug', Configure::read('debug'));

        $ssl = false;
        if (env('HTTPS') || $this->_request->is('ssl') || $this->_request->getEnv('HTTP_X_FORWARDED_PROTO') === 'https') {
            $ssl = true;
        }

        $appData = [
            'jsonData' => $this->_jsonData,
            'webroot' => 'http' . ($ssl ? 's' : '') . '://' . env('HTTP_HOST') . $this->_request->getAttribute('webroot'),
            'url' => $this->_request->getPath(),
            // 'controller' => $this->_controller->name,
            // 'action' => $this->_request->action,
            // 'plugin' => $this->_request->plugin,
            'request' => [
                'query' => $this->_request->getQueryParams(),
                'pass' => $this->_request->getParam('pass'),
                'plugin' => $this->_request->getParam('plugin'),
                'controller' => Inflector::underscore($this->_controller->getName()),
                'action' => $this->_request->getParam('action'),
                'csrf' => $this->_request->getParam($this->getConfig('csrfCookieFieldName'), ''),
                'csrfCookieFieldName' => $this->getConfig('csrfCookieFieldName'),
            ],
        ];

        // merge in the additional frontend data
        $appData = Hash::merge($appData, $this->_additionalAppData);
        $this->_controller->viewBuilder()->setVar('frontendData', $appData);
        $this->_controller->viewBuilder()->setVar('closeDialog', $this->_closeDialog);
    }
}
