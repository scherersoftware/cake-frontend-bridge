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
                'html' => $response->body(),
                'closeDialog' => $this->viewVars['closeDialog']
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
        $layout = $this->getLayout($layout);
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
     * Returns a layout to render.
     *
     * @param string $layout the layout path
     * @return string
     */
    protected function getLayout($layout)
    {
        if ($layout === null) {
            $fbcExists = isset($this->FrontendBridge);
            $layout = 'FrontendBridge.json_action';

            if ($fbcExists) {
                $layout = $this->FrontendBridge->config('templatePaths.jsonAction');
            }

            if ($this->request->is('dialog')) {
                $layout = 'FrontendBridge.dialog_action';

                if ($fbcExists) {
                    $layout = $this->FrontendBridge->config('templatePaths.dialogAction');
                }
            }
        }

        return $layout;
    }

    /**
     * Json action redirect
     *
     * @param  string  $url  URL
     * @return \FrontendBridge\Lib\ServiceResponse
     */
    protected function redirectJsonAction($url)
    {
        $response = [
            'code' => 'success',
            'data' => [
                'redirect' => $url
            ]
        ];

        return new \FrontendBridge\Lib\ServiceResponse($response);
    }
}
