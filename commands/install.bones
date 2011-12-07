var fs = require('fs'),
    crypto = require('crypto'),
    _ = require('underscore')._;

command = Bones.Command.extend();

command.description = 'set up application and install databases';

command.prototype.initialize = function(plugin) {
    var config = plugin.config;

    try {
        fs.statSync(config.files);
    } catch (err) {
        console.log('Creating files dir %s', config.files);
        fs.mkdirSync(config.files, 0777);
    }
    try {
        fs.statSync(config.secret);
    } catch (err) {
        console.log('Creating secret key %s', config.secret);
        fs.writeFileSync(config.secret, JSON.stringify({
            salt: crypto.createHash('md5')
                .update(String(Math.random()))
                .digest('hex')
        }));
        fs.chmodSync(config.secret, 0600);
    }

    // Install CouchDB databases.
    var command = this;
    config.databases.split(':').forEach(function(dbName) {
        command.installDB(plugin, dbName);
    });
};

command.prototype.installDB = function(plugin, dbName) {
    var config = plugin.config;
    var options = {
        host: config.couchHost,
        port: config.couchPort,
        name: config.couchPrefix + '_' + dbName,
        basename: dbName
    };
    var designDocs = getDesignDocs(dbName);

    var couch = require('backbone-couch')(options);

    couch.install(function(err) {
        if (err) {
            console.error('%s', err);
        }
        else {
            designDocs && couch.db.putDesignDocs(designDocs);
            console.log('Installed database %s', dbName);
        }
    });
};

var getDesignDocs = function(dbName) {
    var dir = [process.cwd(), 'design-docs', dbName].join('/');

    try {
        if (fs.statSync(dir).isDirectory) {
            return _(fs.readdirSync(dir)).map(function(val) {
               return dir + '/' + val;
            });
        }
    } catch (err) {   }
};
