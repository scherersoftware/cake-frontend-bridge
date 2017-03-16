<?php use Cake\Utility\Text; ?>
<?php if(!isset($excludeActionWrapper)): ?>
	<div <?= $this->FrontendBridge->getControllerAttributes() ?> >
<?php endif; ?>
<?= $this->fetch('content') ?>

<?php if(!isset($excludeActionWrapper)): ?>
	</div>
<?php endif; ?>
