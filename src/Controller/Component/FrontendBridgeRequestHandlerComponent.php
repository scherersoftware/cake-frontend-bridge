<?php
declare(strict_types = 1);
namespace FrontendBridge\Controller\Component;

use Cake\Controller\Component\RequestHandlerComponent;

class FrontendBridgeRequestHandlerComponent extends RequestHandlerComponent
{
    /**
     * Setter for procted $ext property of the RequestHandlerComponent
     *
     * @param string $ext extension
     * @return void
     */
    public function setExt(string $ext): void
    {
        $this->ext = $ext;
    }
}