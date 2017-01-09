<?php use Cake\Utility\Text; ?>
<?php if(!isset($excludeActionWrapper)): ?>
	<div class="controller <?php echo $this->FrontendBridge->getMainContentClasses() ?>" data-instance-id="<?= Text::uuid() ?>">
<?php endif; ?>
<?= $this->fetch('content') ?>

<?php if(!isset($excludeActionWrapper)): ?>
	</div>
<?php endif; ?>
