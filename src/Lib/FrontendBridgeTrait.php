<?php
namespace FrontendBridge\Lib;

trait FrontendBridgeTrait
{

    /**
     * jsonActionResponse
     *
     * @param \Cake\Network\Response $response the response
     * @return \FrontendBridge\Lib\ServiceResponse
     */
    protected function jsonActionResponse(\Cake\Network\Response $response)
    {
        // get the frontendData set by the Frontend plugin and remove unnecessary data
        $frontendData = $this->viewVars['frontendData'];
        unset($frontendData['Types']);
        $response = [
            'code' => 'success',
            'data' => [
                'frontendData' => $frontendData,
                'html' => $response->body()
            ]
        ];
        return new \FrontendBridge\Lib\ServiceResponse($response);
    }

    /**
     * renderJsonAction
     *
     * @param string $view   the view to render
     * @param string $layout the layout to render
     * @return \FrontendBridge\Lib\ServiceResponse
     */
    public function renderJsonAction($view, $layout)
    {
        if ($layout === null) {
            $layout = 'FrontendBridge.json_action';
        }
        if ($this->RequestHandler) {
            // Make sure the view is rendered as HTML, even if it is an AJAX request
            // jsonActionResponse() will make sure the JSON response is rendered correctly
            $this->RequestHandler->renderAs($this, 'ajax');
            $this->RequestHandler->ext = 'html';
        }
        $response = parent::render($view, $layout);
        return $this->jsonActionResponse($response);
    }

    /**
     * Detect if the current request should be rendered as a JSON Action
     *
     * @return bool
     */
    protected function _isJsonActionRequest()
    {
        return
            (isset($this->request->params['jsonAction']) && $this->request->params['jsonAction'] === true)
            || $this->request->query('json_action') == 1;
    }
}
