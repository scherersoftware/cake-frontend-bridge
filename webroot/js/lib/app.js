Frontend.App = Class.extend({
	appData: {},
	_controllers: {},
	_pubSubBroker: null,
	PageController: null,
	_errorHandler: null,
	/**
	 * Holds an instance of the router class
	 *
	 * @var Frontend.Router 
	 */
	Router: null,
	/**
	 * Class constructor
	 * 
	 * @param {ob} appData Application JSON vars from the backend
	 * @return void 
	 */
	init: function(appData) {
		this.appData = appData;
		this._pubSubBroker = new Frontend.PublishSubscribeBroker();
		this.Router = new Frontend.Router(appData);
		this.UIBlocker = new Frontend.UIBlocker();
	},
	
	/**
	 * Called on document ready.
	 *
	 * @return void 
	 */
	startup: function() {
		// initialize the main controller, if available
		this.PageController = this._loadController(this.appData);
	},
	
	/**
	 * Initialize a controller based on the frontendData
	 * 
	 * @returns void
	 */
	_loadController: function(frontendData, parentController) {
		var actionControllerName = camelCase(frontendData.request.controller) + camelCase(frontendData.request.action) + 'Controller';
		var controller = null;

		if(frontendData.request.plugin && window['App']['Controllers'][ frontendData.request.plugin ] && window['App']['Controllers'][ frontendData.request.plugin ][ actionControllerName ]) {
			this._controllers[actionControllerName] = new window['App']['Controllers'][ frontendData.request.plugin ][ actionControllerName ](frontendData, parentController);
			controller = this._controllers[actionControllerName];
		}
		else if(window['App']['Controllers'][ actionControllerName ]) {
			this._controllers[actionControllerName] = new window['App']['Controllers'][ actionControllerName ](frontendData, parentController);
			controller = this._controllers[actionControllerName];
		}
		else {
			this._controllers[ 'AppController' ] = new Frontend.AppController(frontendData, parentController);
			controller = this._controllers[ 'AppController' ];
		}
		return controller;
	},
	/**
	 * Makes an AJAX request and triggers the _onWidgetLoaded() event
	 *
	 * @param mixed url			Either a string url or a Router compatible url object
	 * @param obj	options		options object, all keys are optional
	 *							- target:		A DOM element where the resulting
	 *											HTML will be inserted.
	 *							- onComplete	This function will be called if the json action
	 *											request was successful. Will receive
	 *											the json action controller as an argument, if available.
	 *							- data			POST data
	 *							- onError		This function will be called if an error 
	 *											occured, it will receive the ajax response
	 *											as an argument.
	 * @return void 
	 */
	loadJsonAction: function(url, options) {
		if(!options) {
			var options = {};
		}
		var options = jQuery.extend({}, {
			target: null,
			onComplete: null,
			data: null,
			onError: null,
			parentController: null,
			initController: true,
			replaceTarget: false,
			dialog: null
		}, options);
		if(typeof url == 'object') {
			url.prefix = 'json_action/';
		}
		this.request(url, options.data, function(response) {
			switch(response.code) {
				case 'success':
					this._onJsonActionLoaded(response, options);
					break;
				default:
					if(typeof options.onError == 'function') {
						options.onError(response);
					}
					else if(this._errorHandler != null) {
						this._errorHandler.handleError(response);
					}
					console.log('loadJsonAction error: ', response);
			}
		}.bind(this));
	},
	/**
	 * Triggered from loadJsonAction()
	 *
	 * @param obj response	The AJAX response
	 * @param obj options	The loadJsonAction() options
	 * @return void 
	 */
	_onJsonActionLoaded: function(response, options) {
		if(options.replaceTarget === true && options.target !== null) {
			options.target.replaceWith(response.data.html);
		}
		else if(options.target !== null) {
			options.target.html(response.data.html);
		}
		var controller = null;
		if(typeof response.data.frontendData == 'object' && options.initController) {
			setTimeout(function() {
				controller = this._loadController(response.data.frontendData, options.parentController);
			}.bind(this), 10);
		}
		if(typeof options.onComplete == 'function') {
			options.onComplete(controller, response);
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
		if(typeof url == 'object') {
			var url = this.Router.url(url);
		}
		var requestType = (data !== null) ? 'POST' : 'GET';

		var requestData = {
			type: requestType,
			url: url,
			postData: data
		};

		$.ajax({
			type: requestType,
			data: data,
			url: url,
			dataType: 'json',
			cache: false,
			context: this,
			success: function(response, textStatus, jqXHR) {
				if(response == null) {
					var response = {
						code: 'error'
					};
				}
				response.requestData = requestData;
				if(typeof responseCallback == 'function') {
					responseCallback(response);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var response = {
					code: 'error',
					requestData: requestData,
					responseText: jqXHR.responseText
				};
				if(typeof responseCallback == 'function') {
					responseCallback(response);
				}
				//console.error(jqXHR, textStatus, errorThrown);
			}
		});
	},
	/**
	 * Redirects the user to another page
	 * 
	 * @param string|object url		Either the URL as a string or a router-compatible url.
	 * @return void 
	 */
	redirect: function(url) {
		if(typeof url == 'object') {
			url = this.Router.url(url);
		}
		window.location.replace(url);
	},
	/**
	 * Proxy for PublishSubscribeBroker::subscribe()
	 *
	 * @return SubscriptionHandle	Containing topic and subscription id (used for unsubscribing)
	 */
	subscribeEvent: function(topic, handler, scope) {
		this._pubSubBroker.subscribe(topic, handler, scope);
	},

	/**
	 * Proxy for PublishSubscribeBroker::publish()
	 *
	 * @return void 
	 */
	publishEvent: function(topic, data) {
		this._pubSubBroker.publish(topic, data);
	},
	/**
	 * Inject an app-specific error handler, which will be used to delegate 
	 * the error handling to.
	 *
	 * @param Object	errorHandler	Must implement handleError(response)
	 * @return void 
	 */
	registerErrorHandler: function(errorHandler) {
		this._errorHandler = errorHandler;
	}
});