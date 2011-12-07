model = Backbone.Collection.extend({
    model: models.Page,
    url: '/api/Page',
    comparator: function(model) {
        return model.id.toLowerCase();
    }
});
