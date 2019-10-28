<?php
declare(strict_types = 1);
namespace FrontendBridge;

use Cake\Core\BasePlugin;
use Cake\Core\PluginApplicationInterface;
use Cake\Http\ServerRequest;
use Cake\Routing\Router;

class Plugin extends BasePlugin
{
    /**
     * {@inheritdoc}
     */
    public function bootstrap(PluginApplicationInterface $app)
    {
        ServerRequest::addDetector('dialog', function (ServerRequest $request) {
            return $request->getQuery('dialog_action') === '1' || $request->getParam('dialogAction') === true;
        });

        ServerRequest::addDetector('jsonAction', function (ServerRequest $request) {
            return $request->getQuery('json_action') === '1' || $request->getParam('jsonAction') === true;
        });
    }

    /**
     * {@inheritdoc}
     */
    public function routes($routes)
    {
        $routes->scope(
            '/json_action',
            ['plugin' => 'FrontendBridge'],
            function ($routes) {
                $routes->connect(
                    '/json_action/:controller/:action/*',
                    ['jsonAction' => true]
                );
            }
        );
    }
}