// Restrict non-authenticated users to GET requests.
servers.Auth.augment({
    initialize: function(super, app) {
        super.call(this, app);
        this.use(this.access.bind(this));
    }
});

servers.Auth.prototype.access = function(req, res, next) {
    if (req.method != 'GET') {
        if (!req.session || !req.session.user || !req.session.user.authenticated) {
            return next(new Error.HTTP(403));
        }
    }
    return next();
}
