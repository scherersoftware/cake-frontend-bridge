<div id="frontend-bridge-modal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="btn btn-default btn-xs modal-back" style="display: none;"><i class="fa fa-arrow-left"></i></div>
                <h4 class="modal-title"></h4>
                <button type="button" class="close">
                    <span >&times;</span>
                </button>
            </div>
            <?php if (!empty($this->Flash)): ?>
                <?= $this->Flash->render() ?>
            <?php endif; ?>
            <div class="modal-body"></div>
        </div>
    </div>
</div>
