<?php
use Cake\Http\ServerRequest;

(function() {
    $isDialog = null;
    $isJson = null;

    ServerRequest::addDetector('dialog', function(ServerRequest $request) use ($isDialog) {
        if (is_null($isDialog)) {
            $isDialog = $request->query('dialog_action') === '1' || $request->param('dialogAction') === true;
        }

        return $isDialog;
    });

    ServerRequest::addDetector('json', function(ServerRequest $request) use ($isJson) {
        if (is_null($isJson)) {
            $isJson = $request->query('json_action') === '1' || $request->param('jsonAction') === true;
        }

        return $isJson;
    });
})();
