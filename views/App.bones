// Starts routing on client
// ------------------------
var start = _.once(function() {
    var bypass = true,
        _loadUrl = Backbone.History.prototype.loadUrl;

    Backbone.History.prototype.loadUrl = function(e) {
        if (bypass) {
            bypass = false;
            return;
        }
        _loadUrl.call(this, e);
    }

    Bones.start({pushState: true, root: ""});
});

// Sets up user and administrative elements on client
// --------------------------------------------------
var adminSetup = _.once(function() {
    Bones.user = new models.User;

    // Add bones-admin view.
    Bones.admin = new views['Admin']({
        model: Bones.user,
        auth: views['AdminLogin'],
        dropdowns: [
            views['AdminDropdownUser']
        ]
    });
    Bones.admin.render();
    Bones.user.status();
});

// Sets up country search form in footer
// -------------------------------------
var searchSetup = _.once(function() {
    var view = new views.CountrySearch({
        model: new models.CountrySearch()
    });
    view.render();
});

var feedbackSetup = _.once(function() {
    $('#feedbacktab .button').click(function() {
        $('#feedbacktab').toggleClass('open');
    })
});

// Sets up key tracking on client
// ------------------------------
// TODO: should we use Bones.currentKeys?
var keyTracking = _.once(function() {
    $(function() {
        // Global tracking of pressed keys.
        $(document).keydown(function(ev) {
            window.currentKeys = window.currentKeys || {};
            window.currentKeys[ev.keyCode] = ev;
        });
        $(document).keyup(function(ev) {
            window.currentKeys = window.currentKeys || {};
            if (window.currentKeys[ev.keyCode]) {
                delete window.currentKeys[ev.keyCode];
            }
        });

    });
});

// Topmost view
// ------------
view = Backbone.View.extend({
    _ensureElement: function() {
        this.el = $('body');
    },
    initialize: function() {
        if (!Bones.server) {
            feedbackSetup();
            searchSetup();
            adminSetup();
            keyTracking();
        }
    }
});

// Registers event handler for all click events
// --------------------------------------------
view.prototype.events = {
    'click a': 'routeClick'
};

// Routes a click event
// --------------------
view.prototype.routeClick = function(ev) {
    if (_.size(window.currentKeys)) {
        return true;
    }
    // We only route client side if the browser supports push state.
    // The check here is borrowed from Backbone.
    if (window.history && window.history.pushState) {
        var href = $(ev.currentTarget).get(0).getAttribute('href', 2);
        if (href) return view.route($(ev.currentTarget).get(0).getAttribute('href', 2));
    }
    return true;
};

// Routes a path
// -------------
view.route = function(path) {
    start();
    if (path.charAt(0) === '/') {
        var matched = _.any(Backbone.history.handlers, function(handler) {
            if (handler.route.test(path)) {
                // TODO: find a better place to reset panel.
                Bones.admin.setPanel();
                Backbone.history.navigate(path, true);
                return true;
            }
        });
        return !matched;
    }
    return true;
};
