// Page view
// -------------
view = views.Main.extend({
    initialize: function(options) {
        views.Main.prototype.initialize.apply(this, arguments);
        _.bindAll(this, 'setupPanel');
        Bones.user && Bones.user.bind('auth:status', this.setupPanel);
    },
    render: function(options) {
        $(this.el).empty().append(templates.Page(this.model.renderer()));
        return this;
    },
    attach: function() {
        views.Main.prototype.attach.call(this);
        !Bones.server && this.setupPanel();
        return this;
    },
    setupPanel: function() {
        if (Bones.user && Bones.user.authenticated) {
            Bones.admin.setPanel(new views.AdminDocument({
                model: this.model,
                display: this
            }));
        }
        else {
            Bones.admin.setPanel();
        }
    }
});
