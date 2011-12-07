// AdminPopupProject
// --------------
// Project creation/update popup.
view = views.AdminPopup.extend({
    events: _.extend({
        'click input[type=submit]': 'submit',
        'keyup input[name=name]': 'populatePath'
    }, views.AdminPopup.prototype.events),
    initialize: function (options) {
        _.bindAll(this, 'submit', 'populatePath');
        this.content = templates.AdminPopupDocument({
            pathPrefix: '/page/',
            documentType: 'page'
        });
        views.AdminPopup.prototype.initialize.call(this, options);
    },
    submit: function(e) {
        // stop the form from submitting
        e.preventDefault();

        var that = this;
        var params = {
            id: this.$('input[name=id]').val(),
            name: this.$('input[name=name]').val(),
            author: Bones.user.id || '',
            created: parseInt((new Date()).getTime() / 1000) + ''
        };
        this.model.save(params, {
            success: function() {
                var message = 'Your page has been created.';
                new views.AdminGrowl({message: message, autoclose: 15000});
                that.close();
                Backbone.View.route('/page/' + that.model.id);
            },
            error: Bones.admin.error
        });
        return false;
    },
    populatePath : function(ev) {
        var val = $('input[name=name]', this.el)
            .val()
            .toLowerCase().replace(/[^a-z0-9]+/gi, '-');
        val = val.replace(/^[-]+/, '').replace(/[-]+$/, '');
        $('input[name=id]', this.el).val(val);
    }
});
