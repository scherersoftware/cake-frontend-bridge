<?php
use Cake\Routing\Router;

Router::plugin('FrontendBridge', function ($routes) {
	Router::connect('/json_action/:plugin/:controller/:action/*', array('jsonAction' => true));
	Router::connect('/json_action/:controller/:action/*', array('jsonAction' => true));
	$routes->fallbacks();
});
