<?php
namespace FrontendBridge\Controller;

class DemoController extends AppController {
	public $components = [
		'FrontendBridge.FrontendBridge'
	];
	
	public $helpers = [
		'FrontendBridge.FrontendBridge'
	];
	
	public function index() {
		$this->FrontendBridge->setJson('foobar', 'foo');
	}
}