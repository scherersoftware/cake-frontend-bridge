<?php
declare(strict_types = 1);
namespace FrontendBridge;

use Cake\Core\BasePlugin;
use Cake\Core\PluginApplicationInterface;
use Cake\Http\ServerRequest;
use Cake\Routing\RouteBuilder;

class Plugin extends BasePlugin
{
    /**
     * {@inheritdoc}
     */
    public function bootstrap(PluginApplicationInterface $app): void
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
    public function routes(RouteBuilder $routes): void
    {
        $routes->scope(
            '/json_action',
            ['plugin' => 'FrontendBridge'],
            function ($routes): void {
                $routes->connect(
                    '/json_action/:controller/:action/*',
                    ['jsonAction' => true]
                );
            }
        );
    }
}
