<?php
use Cake\Http\ServerRequest;

(function() {
    $isDialog = null;
    $isJson = null;

    ServerRequest::addDetector('dialog', function(ServerRequest $request) use ($isDialog) {
        if (is_null($isDialog)) {
            $isDialog = $request->getQuery('dialog_action') === '1' || (isset($request->params['dialogAction']) && $request->params['dialogAction'] === true);
        }

        return $isDialog;
    });

    ServerRequest::addDetector('json', function(ServerRequest $request) use ($isJson) {
        if (is_null($isJson)) {
            $isJson = $request->getQuery('json_action') === '1' || (isset($request->params['jsonAction']) && $request->params['jsonAction'] === true);
        }

        return $isJson;
    });
})();
