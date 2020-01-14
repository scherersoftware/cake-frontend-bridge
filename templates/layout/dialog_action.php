<?php
use Cake\Utility\Hash;

$dialogHeader =  $this->fetch('dialog_header');
$content =  $this->fetch('content');
$dialogFooter =  $this->fetch('dialog_footer');
$modalClasses = Hash::merge(
    ['modal-dialog'],
    $this->fetch('modal_classes')
);
?>

<div role="document" <?= $this->FrontendBridge->getControllerAttributes($modalClasses) ?>>
    <div class="modal-content">
        <?php if (!empty($dialogHeader)): ?>
            <div class="modal-header">
                <?= $this->FrontendBridge->dialogBackButton() ?>
                <?= $dialogHeader ?>
            </div>
        <?php endif; ?>
        <?php if (!empty($content)): ?>
            <div class="modal-body">
                <?= $content ?>
                <div class="clearfix"></div>
            </div>
        <?php endif; ?>
        <?php if (!empty($dialogFooter)): ?>
            <div class="modal-footer">
                <?= $dialogFooter ?>
            </div>
        <?php endif; ?>
    </div>
</div>
