Frontend.UIBlocker = Class.extend({
    init: function() {

    },
    _blockUiOptions: {
        fadeIn: 50,
        fadeOut: 50,
        message: '&nbsp;', // blockElement won't display with an empty message.
        overlayCSS:  {
            backgroundColor: '#fff',
            opacity:           0.6,
            cursor:               'wait',
            backgroundImage: 'url(/frontend_bridge/img/ajax_loader.gif)',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            zIndex: 9999
        }
    },
    blockElement: function(element) {
        $(element).addClass('uiblocker-loading');
        // backup the stupid css defaults for restoring them later
        var backupDefaults = $.blockUI.defaults.css;
        $.blockUI.defaults.css = {};
        $(element).block(this._blockUiOptions);
        // restore the defaults.
        $.blockUI.defaults.css = backupDefaults;
    },
    unblockElement: function(element) {
        $(element).removeClass('uiblocker-loading');
        $(element).unblock(this._blockUiOptionDefaults);
    }
});
