Frontend.Controller = Class.extend({
    /**
     * Controller vars set server-side with Frontend->setJson()
     *
     * @var obj
     */
    _frontendData: {},
    /**
     * String list of the used components
     *
     * @var Array
     */
    components: [],
    baseComponents: [],
    /**
     * Holds a reference to the parentController, if set.
     *
     * @return Controller
     */
    parentController: null,
    name: null,
    action: null,
    instanceId: null,
    /**
     * Holds the DOM element of this controller.
     *
     * @var DOMElement
     */
    _dom: null,
    $: null,
    /**
     * Class constructor
     *
     * @param    obj        vars    The controller vars made available by setJson()
     * @param    Controller    parentController    (optional) Parent controller instance.
     * @return    void
     */
    init: function(frontendData, parentController, instanceId) {
        this.parentController = parentController;
        this._frontendData = frontendData;
        this.name = this._frontendData.request.controller;
        this.action = this._frontendData.request.action;
        this.instanceId = instanceId;

        if (this.instanceId == undefined) {
            console.error('No JS Controller instance passed');
        }

        var selector = 'div.controller.' + this._frontendData.request.controller + '-' + stringUnderscore(this._frontendData.request.action) + '[data-instance-id=' + instanceId + ']';

        this._dom = $(selector);
        this.$ = this._dom.find.bind(this._dom);

        App.Main.initSubControllers(this, this._frontendData);

        this.__initComponents();
        this._initialize();
    },
    /**
     * self ajax reloads a (sub)controller
     *
     * @param array    data        post-data
     * @param array    pass        further url params
     * @return void
     */
    ajaxSubmit: function(data, pass) {
        $renderTarget = this._dom;
        var url = {
            controller: this.name.replace(/_/g,'-'),
            action: this.action.replace(/_/g,'-'),
        }
        var options = {
            target: $renderTarget,
            replaceTarget: true
        }
        if (pass !== undefined) {
            url.pass = pass
        }
        if (data !== undefined) {
            options.data = data
        }
        App.Main.UIBlocker.blockElement(this._dom);
        App.Main.loadJsonAction(url, options);
    },
    /**
     * Returns the contents of a view var, otherwise null
     *
     * @param string    key        The var name
     * @return mixed
     */
    getVar: function(key) {
        if (typeof this._frontendData.jsonData[ key ] != 'undefined') {
            return this._frontendData.jsonData[ key ];
        }
        return null;
    },
    /**
     * Startup callback - can be implemented by sub controllers
     *
     * @return void
     */
    _initialize: function() {
        this.startup();
    },
    /**
     * Startup callback - can be implemented by sub controllers
     *
     * @return void
     */
    startup: function() {},
    /**
     * Initializes the configured components
     *
     * @return void
     */
    __initComponents: function() {
        for(var i in this.baseComponents) {
            this.components.push(this.baseComponents[ i ]);
        }
        for(var i in this.components) {
            var name = this.components[i] + 'Component';
            if (typeof window['App']['Components'][ name ] == "function") {
                this[ this.components[i] ] = new window['App']['Components'][ name ](this);
                this[ this.components[i] ].startup();
            }
            else if (typeof this.components[i] == 'string') {
                console.error("Component %s not found", this.components[i]);
            }
        }
    },
    /**
     * Makes an AJAX request to the server and returns the results.
     *
     * @param mixed        url        Either a string url or a Router-compatible url object
     * @param Object    data    (optional)    POST data
     * @param Function    responseCallback    The function which will receive the response
     * @return void
     */
    request: function(url, data, responseCallback) {
        App.Main.request(url, data, responseCallback);
    },
    isAjax: function() {
        return this.getVar('isAjax') === true;
    },
    /**
     * Returns Server-side state value for mobile-check
     *
     * @return {boolean}
     */
    isMobile: function() {
        return this.getVar('isMobile');
    },
    /**
     * Called after controller markup and before instance are deleted
     * @return {void}
     */
    beforeDelete: function() {}
});
