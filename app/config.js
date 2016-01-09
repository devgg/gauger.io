var path = require('path');


var config = {
    paths: {}
};


var workingDirectory = path.join(__dirname, '..');

config.paths.views = path.join(workingDirectory, 'views');
config.paths.public = path.join(workingDirectory, 'public');

config.paths.images = path.join(config.paths.public, 'images');
config.paths.favicon = path.join(config.paths.images, 'favicon.ico');
config.paths.app = path.join(workingDirectory, 'app');

module.exports = config;