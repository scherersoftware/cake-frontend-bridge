<?php
declare(strict_types = 1);
namespace FrontendBridge\Shell\Task;

use Bake\Shell\Task\BakeTask;
use Cake\Console\Shell;
use Cake\Utility\Inflector;

/**
 * @property \Bake\Shell\Task\BakeTemplateTask $BakeTemplate
 */
class JsControllerTask extends BakeTask
{

    /**
     * JS controllers path
     *
     * @var string
     */
    public $pathFragment = '../webroot/js/app/controllers/';

    /**
     * Bake tasks
     *
     * @var array
     */
    public $tasks = [
        'Bake.BakeTemplate',
    ];

    /**
     * Main Action
     *
     * @return mixed
     */
    public function main()
    {
        if (count($this->args) < 2) {
            return $this->abort('Please pass the controller and action name.');
        }
        $controllerName = Inflector::camelize($this->args[0]);
        $actionName = Inflector::camelize($this->args[1]);
        $this->plugin = isset($this->params['plugin']) ? $this->params['plugin'] : null;

        $this->BakeTemplate->set('controllerName', $controllerName);
        $this->BakeTemplate->set('actionName', $actionName);
        $content = $this->BakeTemplate->generate('FrontendBridge.webroot/js_controller');

        $this->bake($controllerName, $actionName, $content);
    }

    /**
     * Bakes the JS file
     *
     * @param string $controllerName Controller Name
     * @param string $actionName Action Name
     * @param string $content File Content
     * @return string
     */
    public function bake(string $controllerName, string $actionName, string $content = ''): string
    {
        if ($content === true) {
            $content = $this->getContent($action);
        }

        if (empty($content)) {
            return false;
        }

        $this->out("\n" . sprintf('Baking `%s%s/%s` JS controller file...', ($this->plugin ? $this->plugin . '.' : ''), $controllerName, $actionName), 1, Shell::QUIET);
        $path = $this->getPath();
        $filename = $path . Inflector::underscore($controllerName) . '/' . Inflector::underscore($actionName) . '_controller.js';
        $this->createFile($filename, $content);

        return $content;
    }

    /**
     * Gets the option parser instance and configures it.
     *
     * @return \Cake\Console\ConsoleOptionParser
     */
    public function getOptionParser(): \Cake\Console\ConsoleOptionParser
    {
        $parser = parent::getOptionParser();

        $parser->setDescription(
            'Bake a JS Controller for use in FrontendBridge '
        )->addArgument('controller', [
            'help' => 'Controller Name, e.g. Posts',
            'required' => true,
        ])->addArgument('action', [
            'help' => 'Action Name, e.g. addPost',
            'required' => true,
        ]);

        return $parser;
    }
}
