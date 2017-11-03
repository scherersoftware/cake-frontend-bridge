<?php
Cake\Network\Request::addDetector('dialog', function($request) {
    return $request->query('dialog_action') === '1' || $request->param('dialogAction') === true;
});

Cake\Network\Request::addDetector('jsonAction', function($request) {
    return $request->query('json_action') === '1' || $request->param('jsonAction') === true;
});
