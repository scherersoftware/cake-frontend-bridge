<?php
declare(strict_types = 1);
namespace FrontendBridge\Shell\Task;

use Bake\View\BakeView;
use Cake\Console\Shell;
use Cake\Core\ConventionsTrait;
use Cake\Event\Event;
use Cake\Event\EventManager;
use Cake\Http\Response;
use Cake\Http\ServerRequest as Request;
use Cake\View\Exception\MissingTemplateException;
use Cake\View\View;
use Cake\View\ViewVarsTrait;

/**
 * Used by other tasks to generate templated output, Acts as an interface to BakeView
 *
 * @property \Cake\Console\Shell $viewVars*/
class BakeTemplateTask extends Shell
{

    use ConventionsTrait;
    use ViewVarsTrait;

    /**
     * BakeView instance
     *
     * @var \Bake\View\BakeView
     */
    public $View;

    /**
     * Get view instance
     *
     * @return \Cake\View\View
     * @triggers Bake.initialize $view
     */
    public function getView(): View
    {
        if ($this->View) {
            return $this->View;
        }

        $theme = $this->params['theme'] ?? '';

        $viewOptions = [
            'helpers' => [
                'Bake.Bake',
                'Bake.DocBlock',
            ],
            'theme' => $theme,
        ];

        $view = new BakeView(new Request(), new Response(), null, $viewOptions);
        $event = new Event('Bake.initialize', $view);
        EventManager::instance()->dispatch($event);
        /** @var \Bake\View\BakeView $view */
        $view = $event->getSubject();
        $this->View = $view;

        return $this->View;
    }

    /**
     * Runs the template
     *
     * @param string     $template bake template to render
     * @param array|null $vars     Additional vars to set to template scope.
     * @return string contents of generated code template
     */
    public function generate(string $template, ?array $vars = null): string
    {
        if ($vars !== null) {
            $this->set($vars);
        }

        $this->getView()->set($this->viewVars);

        try {
            return $this->View->render($template);
        } catch (MissingTemplateException $e) {
            $this->_io->verbose(sprintf('No bake template found for "%s"', $template));

            return '';
        }
    }
}
