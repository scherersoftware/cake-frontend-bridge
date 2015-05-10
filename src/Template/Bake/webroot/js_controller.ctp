App.Controllers.<%= $controllerName %><%= $actionName %>Controller = Frontend.AppController.extend({
    startup: function() {
        console.log('Hello from ' + this.name + '/' + this.action + ', here is my container div', this.$(''));
    }
});