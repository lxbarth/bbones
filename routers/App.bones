router = Backbone.Router.extend({
    routes: {
        '/' : 'front',
        '/about': 'about',
        '/page/:id': 'page',
        '/.*': 'error'
    },
    front: function() {
        this.send(views.Front);
    },
    about: function() {
        this.send(views.About);
    },
    page: function(id) {
        // TODO: we shouldn't need to clean out fragments from requests.
        var router = this,
            model = new models.Page({id: id});

        model.fetch({
            success: function() {
                router.send(views.Page, {model: model});
            },
            error: function(err) {
                router.error(err);
            }
        });
    },
    error: function(error) {
        this.send(views.Error, _.isArray(error) ? error.shift() : error);
    },
    send: function(view) {
        var options = arguments.length > 1 ? arguments[1] : {};
        var v = new view(options);
        $('#page').empty().append(v.el);
        v.render().attach().activeLinks().scrollTop();
    },
});
