router = Backbone.Router.extend({
    routes: {
        '/' : 'front',
        '/about': 'about'
    },
    front: function() {
        this.send(views.Front);
    },
    about: function() {
        this.send(views.About);
    },
    send: function(view) {
        var options = arguments.length > 1 ? arguments[1] : {};
        var v = new view(options);
        $('#page').empty().append(v.el);
        v.render().attach().activeLinks().scrollTop();
    },
});
