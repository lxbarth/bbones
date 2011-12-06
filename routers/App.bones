router = Backbone.Router.extend({
    routes: {
        '/' : 'front'
    },
    front: function() {
        this.send(views.Front);
    },
    send: function(view) {
        var options = arguments.length > 1 ? arguments[1] : {};
        var v = new view(options);
        $('#page').empty().append(v.el);
        v.render().attach().activeLinks().scrollTop();
    },
});
