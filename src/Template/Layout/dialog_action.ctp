<?php
$dialogHeader =  $this->fetch('dialog_header');
$content =  $this->fetch('content');
$dialogFooter =  $this->fetch('dialog_footer');
?>

<div role="document" <?= $this->FrontendBridge->getControllerAttributes(['modal-dialog']) ?>>
    <div class="modal-content">
        <?php if (!empty($dialogHeader)): ?>
            <div class="modal-header">
                <button class="modal-back btn btn-primary">
                    <i class="fa fa-fw fa-arrow-left"></i>
                    <?= __('dialog.back'); ?>
                </button>
                <?= $dialogHeader ?>
            </div>
        <?php endif; ?>
        <?php if (!empty($content)): ?>
            <div class="modal-body">
                <?= $content ?>
            </div>
        <?php endif; ?>
        <?php if (!empty($dialogFooter)): ?>
            <div class="modal-footer">
                <?= $dialogFooter ?>
            </div>
        <?php endif; ?>
    </div>
</div>
