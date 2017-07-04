Frontend.Router = Class.extend({
    webroot: '',
    controller: '',
    action: '',
    named: {},
    currentUrl: '',
    urlDefaults: {
        controller: null,
        action: null,
        pass: [],
        query: {},
        prefix: '',
        plugin: null,
        '#': null,
    },
    /**
     * Class constructor
     *
     * @param    Object    the appData object
     * @return     void
     */
    init: function(appData) {
        this.webroot = appData.webroot;
        this.controller = appData.controller;
        this.action = appData.action;
        this.named = appData.named;
        this.currentUrl = appData.url;
    },
    /**
     * Constructs an url based on the given parameters.
     *
     * The method also accepts an object containing at least the controller
     * and action keys (see this.urlDefaults). Otherwise it takes
     * the function arguments.
     *
     * @param string    controller   The controller name in lower case
     * @param string    action       The controller action
     * @param Array     pass         An array containing the pass params (/arg1/arg2/)
     * @param Object    query        An object containing the named params, indexed by param name
     * @param string    string       The hash to append to the url
     * @return string                The generated URL
     */
    url: function(controller, action, pass, query, hash) {
        if (typeof controller == 'object') {
            var params = jQuery.extend({}, this.urlDefaults, controller);
            controller = params.controller;
            action = params.action;
            pass = params.pass;
            query = params.query;
            hash = params['#'];
            var prefix = params.prefix;
            var plugin = params.plugin;
        }

        if (plugin) {
            plugin = plugin.toLowerCase() + '/';
        } else {
            plugin = '';
        }

        var url = this.webroot + prefix + plugin + controller + '/' + action + '/';

        if (pass instanceof Array && pass.length > 0) {
            $.each(pass, function (i, val) {
                url += val + '/';
            });
            // remove "/" from end to not disturb functionality of possible #-anchor in url
            url = url.slice(0, -1);
        }

        if (typeof query == 'object' && !$.isEmptyObject(query)) {
            url += '?' + http_build_query(query);
        }

        if (hash) {
            url += '#' + hash;
        }

        return url;
    },
    /**
     * Returns the complete, current URL of the site.
     *
     * @return void
     */
    getCurrentUrl: function() {
        return this.webroot + '/' + this.url;
    }
});
