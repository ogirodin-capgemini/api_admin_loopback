'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var oauth2 = require('loopback-component-oauth2');
var path = require('path');
var site = require('./site');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {

  const db = app.dataSources.maintainer;

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  var options = {
    dataSource: db, // Data source for oAuth2 metadata persistence
    loginPage: '/oauth2/token', // The login page URL
    loginPath: '/oauth2/token' // The login form processing URL
  };

  oauth2.oAuth2Provider(
    app, // The app instance
    options // The options
  );


  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
