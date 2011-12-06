view = views.Main.extend({
    initialize: function(options) {
        _.bindAll(this, 'render');
        views.Main.prototype.initialize.call(this, options);
        Bones.user && Bones.user.bind('auth:status', this.setupPanel);
    },
    render: function() {
        return this;
    },
    attach: function() {
        views.Main.prototype.attach.call(this);
        return this;
    }
});
