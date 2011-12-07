var couch = require('backbone-couch');

var register = models.User.register;
models.User.register = function(server) {
    var config = server.plugin.config;
    var options = {
        host: config.couchHost,
        port: config.couchPort,
        name: config.couchPrefix + '_users'
    };
    var couchSync = couch(options).sync;

    models['User'].augment({
        sync: function(parent, method, model, options) {
            var options = options || {};
            var success = options.success,
                error = options.error;

            // Don't write the passwordConfirm attribute.
            model.unset('passwordConfirm', { silent: true });
            // Filter out `resp.password`.
            options.success = function(resp) {
                var filtered = _(resp).clone();
                if (method === 'read' && _(filtered.password).isString()) {
                    model.password = filtered.password;
                    delete filtered.password;
                } else if (method === 'create' || method === 'update') {
                    filtered.password = undefined;
                }
                success(filtered);
            };

            couchSync.call(this, method, model, options);
        }
    });
};
