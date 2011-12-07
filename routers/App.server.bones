var time = Date.now();

// Remove catch all route on server.
delete routers.App.prototype.routes['/.*'];

// Override showError - if we're not dealing with a JSON request,
// render out an App view to present the user with a nice looking
// 404 page.
var middleware = require('bones/server/middleware');
var showError = middleware.showError();
middleware.showError = function() {
    return function(err, req, res, next) {
        if ((req.headers.accept + '' || '').indexOf('json') >= 0) {
            return showError(err, req, res, next);
        }
        if (!err.status) err.status = 500;
        routers.App.send(views.Error, err, res);
    };
};

routers.App.prototype.send = function(view, options) {
    routers.App.send(view, options, this.res);
};

routers.App.send = function(view, options, res) {
    var options = arguments.length > 1 ? arguments[1] : {};

    // Execute the main view.
    var main = new view(options);
    main.render();
    var o = '{el: $("#main"),';
    _.each(options, function(v, k) {
        // Any options that is a model or collection will have it's title
        // declared. Use this to re-hydrate it.
        if (v.constructor.title != undefined) {
            o += JSON.stringify(k) + ': new models.'+ v.constructor.title +'('+ JSON.stringify(options[k]) + '),';
        } else {
            o += JSON.stringify(k) + ':' + JSON.stringify(options[k]) +',';
        }
    });
    o = o.replace(/,$/, '}');

    res.send(Bones.plugin.templates.App({
        version: time,
        title: 'My Blog',
        main: $(main.el).html(),
        startup: 'Bones.initialize(function(models, views, routers, templates) {'+
                 'new views.' + main.constructor.title +'('+ o +').attach().activeLinks().scrollTop()'+
                 '});'
    }));
};
