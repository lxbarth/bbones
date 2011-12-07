model = models.Document.extend({
    schema: {
        id: 'Page',
        type : 'object',
        properties: {
            'id': {
                'type': 'string',
                'title': 'Path',
                'required': true,
                'minlength': 1,
                'pattern': '^[a-z0-9\-_]+$'
            },
            'name': {
                'type': 'string',
                'format': 'simpletext',
                'title': 'Title'
            },
            'body': {
                'type': 'string',
                'title': 'Body',
                'format': 'markdown'
            }
        }
    },
    url: function() {
        return '/api/Page/' + encodeURIComponent(this.id);
    }
});
