view = views.Main.extend({
    initialize: function(options) {
        views.Main.prototype.initialize.call(this, options);
    },
    render: function() {
        $(this.el).empty().append(templates.Front({message: 'Hello World'}));
        return this;
    }
});
