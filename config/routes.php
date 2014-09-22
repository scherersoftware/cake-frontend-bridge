<?php
use Cake\Routing\Router;

Router::plugin('FrontendBridge', function ($routes) {
	$routes->fallbacks();
});
