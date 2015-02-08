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
	 * @param	obj		vars	The controller vars made available by setJson()
	 * @param	Controller	parentController	(optional) Parent controller instance.
	 * @return	void 
	 */
	init: function(frontendData, parentController) {
		this.parentController = parentController;
		this._frontendData = frontendData;
		this.name = this._frontendData.request.controller;
		this.action = this._frontendData.request.action;

		this._dom = $('div.controller.' + this._frontendData.request.controller + '-' + stringUnderscore(this._frontendData.request.action));
		this.$ = this._dom.find.bind(this._dom);

		this.__initComponents();
		this._initialize();
	},
	/**
	 * Returns the contents of a view var, otherwise null
	 *
	 * @param string	key		The var name
	 * @return mixed
	 */
	getVar: function(key) {
		if(typeof this._frontendData.jsonData[ key ] != 'undefined') {
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
			if(typeof window['App']['Components'][ name ] == "function") {
				this[ this.components[i] ] = new window['App']['Components'][ name ](this);
				this[ this.components[i] ].startup();
			}
			else if(typeof this.components[i] == 'string') {
				console.error("Component %s not found", this.components[i]);
			}
		}
	},
	/**
	 * Makes an AJAX request to the server and returns the results.
	 *
	 * @param mixed		url		Either a string url or a Router-compatible url object
	 * @param Object	data	(optional)	POST data
	 * @param Function	responseCallback	The function which will receive the response 
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
	 * If the current request was made via ajax, bind the submit event, make an ajax
	 * POST request and update the dialog
	 * TODO: make URL and loadJsonAction options configurable
	 * @return {void}
	 */
	_ajaxDialogFormSetup: function($form, callback) {
		if (!this.isAjax()) {
			return false;
		}
		var url = {
			controller: this.name,
			action: this.action,
			pass: this._frontendData.request.pass,
			plugin: this._frontendData.request.plugin,
			named: this._frontendData.request.named
		};
		$form.submit(function(e) {
			e.preventDefault();
			App.Main.UIBlocker.blockElement(this._dom);
			App.Main.loadJsonAction(url, {
				target: this._dom.parent(),
				data: $form.serialize(),
				parentController: this.parentController,
				onComplete: function(controller, response) {
					App.Main.UIBlocker.unblockElement(this._dom);
					if (typeof callback === 'function') {
						callback(controller, response);
					}
				}
			});
			return false;
		}.bind(this));
	},
	/**
	 * If the current request was made via ajax, bind the submit event, make an ajax
	 * POST request and update the dialog
	 * TODO: make this more configurable
	 * @return {void}
	 */
	openDialog: function(url, onClose) {
		this._dialog = new App.Dialog({
			onClose: onClose
		});
		this._dialog.blockUi();
		App.Main.loadJsonAction(url, {
			parentController: this,
			target: this._dialog.getContent(),
			onComplete: function() {
				this._dialog.show();
				this._dialog.unblockUi();
			}.bind(this)
		});
	}
});