<?php
declare(strict_types = 1);

use Cake\Routing\Router;

Router::plugin('FrontendBridge', function ($routes): void {
    /*Router::connect('/json_action/:plugin/:controller/:action/*', [
        'jsonAction' => true
    ], [
        'routeClass' => 'DashedRoute'
    ]);*/
    Router::connect('/json_action/:controller/:action/*', [
        'jsonAction' => true,
    ], [
        'routeClass' => 'DashedRoute',
    ]);
    $routes->fallbacks('DashedRoute');
});
