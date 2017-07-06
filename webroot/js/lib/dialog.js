Frontend.Dialog = Class.extend({
    /**
     * History keeper
     *
     * @type object
     */
    _history: {
        upcoming: null,
        entries: []
    },

    /**
     * Modal instance
     *
     * @type object
     */
    _modal: null,

    /**
     * Indicator if modal is currently open
     *
     * @type bool
     */
    _modalOpen: false,

    /**
     * Configuration
     *
     * @type object
     */
    _config: {
        selectTab: false,
        additionalClasses: false,
        initController: true,
        replaceTarget: false,
        preventHistory: false,
        onLoadComplete: false,
        onDialogClose: false
    },

    /**
     * Open dialog from action
     *
     * @param  object  url             Request URL in CakePHP style
     * @param  object  requestOptions  Request options for loadJsonAction
     * @return void
     */
    loadDialog: function(url, requestOptions) {
        if (!this._checkForModalTemplate()) {
            return false;
        }

        this._config = jQuery.extend(this._config, requestOptions, {
            onComplete: function(controller, response) {
                if (response.data.redirect) {
                    var redirectUrl = response.data.redirect;
                    if (typeof redirectUrl === 'object') {
                        redirectUrl = App.Main.Router.url(redirectUrl);
                    }

                    window.location = redirectUrl;
                    return
                }
                // Error handling
                if (!response.data.html) {
                    return console.error('No response HTML available.');
                }

                // Initialize new dialog
                this._modal = $('.modal');
                // Content setter
                this._setContent(response.data.html);

                selectedTab = null;
                // Tab selector
                if (this._config.selectTab) {
                    $(this._config.selectTab).tab('show');
                    selectedTab = this._config.selectTab;
                }

                // Large modal option
                if (this._config.additionalClasses) {
                    $('.modal-dialog', this._modal).addClass(this._config.additionalClasses);
                }

                // Modal Initialize
                this._modal.modal({
                    backdrop: true,
                    keyboard: true,
                    focus: true,
                    show: true
                });

                // History and events
                this._addHistory(url, this._config.preventHistory, selectedTab);
                this._registerHandler();

                if (typeof this._config.onLoadComplete === 'function') {
                    this._config.onLoadComplete(controller, response);
                }

                App.Main.UIBlocker.unblockElement($(this._getBlockElement()));

                if (response.data.closeDialog) {
                    this._cleanupModal();
                }
            }.bind(this)
        });

        App.Main.UIBlocker.blockElement($(this._getBlockElement()));
        App.Main.loadJsonAction(this._ensureDialogAction(url), this._config);
    },

    /**
     * Determine which element to block the ui for
     *
     * @return string
     */
    _getBlockElement: function() {
        var blockElement = 'body';
        if (this._modalOpen) {
            blockElement = '.modal-dialog';
        }

        return blockElement;
    },

    /**
     * Set content of the modal
     *
     * @param  string  content  HTML Content
     * @return void
     */
    _setContent: function(content) {
        this._modal.html(content);
    },

    /**
     * Modal existence checker
     *
     * @return bool
     */
    _checkForModalTemplate: function()
    {
        if (!$('.modal').length) {
            console.error('You need to load the modal template through FrontendBrigeHelper::includeModal function into DOM.');
            return false;
        }

        return true;
    },

    /**
     * Add item to history
     *
     * @param  object  url              Request URL in CakePHP style
     * @param  bool    preventUpcoming  Prevent writing of a new upcoming entry
     * @param  string  selectedTab      Selected tab
     * @return void
     */
    _addHistory: function(url, preventUpcoming, selectedTab) {
        if (this._history.upcoming && !preventUpcoming) {
            this._history.entries.push(this._history.upcoming);
        }
        if (preventUpcoming && this._history.entries.length > 0) {
            url = null;
        }

        if (url) {
            url = {
                url: url,
                title: $('.modal-title', this._modal).html(),
                selectedTab: selectedTab
            };
        }
        this._history.upcoming = url;
    },

    /**
     * Bind handlers and do conditional stuff.
     *
     * @return void
     */
    _registerHandler: function() {
        this._modal.off('hidden.bs.modal').on('hidden.bs.modal', function(e) {
            this._cleanupModal();
            this._history = {
                upcoming: null,
                entries: []
            };
            $('.modal-dialog', this._modal).removeClass('modal-lg');
            this._modalOpen = false;

            if (typeof this._config.onDialogClose === 'function') {
                this._config.onDialogClose(this);
            }
        }.bind(this));

        this._modal.on('shown.bs.modal', function () {
            this._modalOpen = true;
        }.bind(this));


        $(document).on('keyup', function(e) {
            if (!this._modal) {
                return;
            }

            // Escape key
            if (e.keyCode === 27) {
                this._modal.modal('hide');
            }
        }.bind(this));

        $('.modal-header .close, .modal-header .close-btn, .modal-footer .cancel-button', this._modal).off('click').on('click', function(e) {
            e.preventDefault();
            this._modal.modal('hide');
        }.bind(this));

        $('form', this._modal).off('submit').on('submit', function(e) {
            var $target = $(e.currentTarget);
            if($target.data('ajax-submit') === 0) {
                return;
            }
            
            e.preventDefault();

            this._cleanupModal();
            App.Main.UIBlocker.blockElement($(this._getBlockElement()));
            var url = $target.attr('action');

            var formData = null;
            if (!!window.FormData) {
                formData = new FormData(e.currentTarget);
            } else {
                formData = $target.serialize();
            }

            this.loadDialog(url, {
                data: formData,
                preventHistory: true
            });
        }.bind(this));

        if (this._history.entries.length > 0) {
            $('.modal-back', this._modal).show();
        } else {
            $('.modal-back', this._modal).hide();
        }

        $('.modal-back', this._modal).off('click').on('click', function(e) {
            if (this._history.entries.length <= 0) {
                return;
            }

            this._cleanupModal();

            App.Main.UIBlocker.blockElement($(this._getBlockElement()));
            var url = this._history.entries.pop();
            this.loadDialog(url.url, {
                preventHistory: true,
                modalTitle: url.title,
                selectTab: url.selectedTab
            });
            App.Main.UIBlocker.unblockElement($(this._getBlockElement()));
        }.bind(this));

        $('.nav-tabs.historized a[data-toggle="tab"]', this._modal).on('shown.bs.tab', function (e) {
            // Update tab in history
            if (typeof $(e.target).attr('class') === 'string' && this._history.upcoming) {
                this._history.upcoming.selectedTab = '.' + $(e.target).attr('class');
            }
        }.bind(this))
    },

    /**
     * Ensure addition of json_action=1 and dialog_action=1 at a url which is no cakephp conform array.
     *
     * @param   mixed  url  URL to check for
     * @return  mixed
     */
    _ensureDialogAction: function(url) {
        if (typeof url === 'object') {
            if (url.hasOwnProperty('query')) {
                url.query.dialog_action = 1;
            } else {
                url.query = {
                    dialog_action: 1
                }
            }

            return url;
        }

        if (typeof url !== 'string') {
            return url;
        }

        if (url.indexOf('json_action=1') !== -1 && url.indexOf('dialog_action=1') !== -1) {
            return url;
        }

        if (url.indexOf('?') !== -1) {
            url += '&';
        } else {
            url += '?';
        }
        url += 'json_action=1&dialog_action=1';

        return url;
    },

    /**
     * Removes controller instance from instance keeper.
     *
     * @return void
     */
    _cleanupModal: function() {
        if (!this._modal) {
            return;
        }

        App.Main.cleanControllerInstances(this._modal);
    }
});
