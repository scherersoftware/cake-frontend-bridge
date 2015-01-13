<?php if(!isset($excludeActionWrapper)): ?>
	<div class="controller <?php echo $this->FrontendBridge->getMainContentClasses() ?>">
<?php endif; ?>
<?= $this->fetch('content') ?>

<?php if(!isset($excludeActionWrapper)): ?>
	</div>
<?php endif; ?>