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
};
