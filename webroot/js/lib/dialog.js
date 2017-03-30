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

        var config = jQuery.extend({}, requestOptions, {
            initController: true,
            replaceTarget: false,
            onComplete: function(controller, response) {
                if (response.data.redirect) {
                    window.location = response.data.redirect;
                    return
                }
                // Error handling
                if (!response.data.html) {
                    return console.error('No response HTML available.');
                }

                // Initialize new dialog
                this._modal = $('.modal');
                // Content and title setting
                this._setContent(response.data.html);
                if (config.modalTitle) {
                    this._setTitle(config.modalTitle);
                }
                // Large modal option
                if (config.largeModal) {
                    $('.modal-dialog', this._modal).addClass('modal-lg');
                } else {
                    $('.modal-dialog', this._modal).removeClass('modal-lg');
                }

                // Modal Initialize
                this._modal.modal({
                    backdrop: true,
                    keyboard: true,
                    focus: true,
                    show: true
                });

                // History and events
                this._addHistory(url, config.preventHistory);
                this._registerHandler();

                if (config.onLoadComplete && typeof config.onLoadComplete === 'function') {
                    config.onLoadComplete(controller, response);
                }

                App.Main.UIBlocker.unblockElement($('body'));

                if (response.data.closeDialog) {
                    this._modal.modal('hide');
                }
            }.bind(this)
        });
        App.Main.UIBlocker.blockElement($('body'));
        App.Main.loadJsonAction(this._ensureJsonAction(url), config);
    },

    /**
     * Set content of the modal
     *
     * @param  string  content  HTML Content
     * @return void
     */
    _setContent: function(content) {
        $('.modal-body', this._modal).html(content);
    },

    /**
     * Set title to given string
     *
     * @param  string  title  Title string
     * @return void
     */
    _setTitle: function(title) {
        $('.modal-title', this._modal).html(title);
    },

    /**
     * Modal existence checker
     *
     * @return bool
     */
    _checkForModalTemplate: function()
    {
        if (!$('.modal').length) {
            console.error('You need to load the modal template through FrontendBrigeHelper::loadModalTemplate function into DOM.');
            return false;
        }

        return true;
    },

    /**
     * Add item to history
     *
     * @param  object  url              Request URL in CakePHP style
     * @param  bool    preventUpcoming  Prevent writing of a new upcoming entry
     * @return void
     */
    _addHistory: function(url, preventUpcoming) {
        if (this._history.upcoming && !preventUpcoming) {
            this._history.entries.push(this._history.upcoming);
        }
        if (preventUpcoming && this._history.entries.length > 0) {
            url = null;
        }

        this._history.upcoming = url;
    },

    /**
     * Bind handlers and do conditional stuff.
     *
     * @return void
     */
    _registerHandler: function() {
        this._modal.on('hidden.bs.modal', function(e) {
            this._cleanupModal();
            this._history = {
                upcoming: null,
                entries: []
            };
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

        $('.close, .close-btn, .cancel-button', this._modal).off('click').on('click', function(e) {
            e.preventDefault();
            this._modal.modal('hide');
        }.bind(this));

        $('form', this._modal).off('submit').on('submit', function(e) {
            e.preventDefault();

            this._cleanupModal();
            App.Main.UIBlocker.blockElement('.modal-dialog', this._modal);

            var url = $(e.currentTarget).attr('action');
            var formData = $(e.currentTarget).serialize();

            this.loadDialog(url, {
                data: formData
            });
            App.Main.UIBlocker.unblockElement('.modal-dialog', this._modal);
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

            App.Main.UIBlocker.blockElement('.modal-dialog', this._modal);
            var url = this._history.entries.pop();
            this.loadDialog(url, {
                preventHistory: true
            });
            App.Main.UIBlocker.unblockElement('.modal-dialog', this._modal);
        }.bind(this));
    },

    /**
     * Ensure addition of json_action=1 at a url which is no cakephp conform array.
     *
     * @param   mixed  url  URL to check for
     * @return  mixed
     */
    _ensureJsonAction: function(url) {
        if (typeof url !== 'string') {
            return url;
        }

        if (url.indexOf('json_action=1') !== -1) {
            return url;
        }

        if (url.indexOf('?') !== -1) {
            url += '&';
        } else {
            url += '?';
        }
        url += 'json_action=1';

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
