
/**
 * Module dependencies.
 */

var express = require('express')
, mongo = require('mongodb')
, config = require('./config')
;



db = new mongo.Db('soju', new mongo.Server(config.mongo_host, config.mongo_port, {}), {});

db.addListener("error", function(error) {
  console.log("Error connecting to mongo -- perhaps it isn't running?");
});

var port = process.env.PORT || 3000;

// Configuration

db.open(function(p_db) {
  db.createCollection('guests', function(err, collection) {
    db.collection('guests', function(err, collection) {

      config.collection = collection;

      var routes = require('./routes');
      routes.init(config);
      
      console.log('soju is up and ready to go');
      var app = module.exports = express.createServer();

      app.configure(function(){
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.set('view options', { layout: false });
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.session({ secret: 'tsdf32r389uio4398ui4jrkffj' }));
        app.use(app.router);
        app.use(express.static(__dirname + '/public'));
      });

      app.configure('development', function(){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
      });

      app.configure('production', function(){
        app.use(express.errorHandler()); 
      });

      // Routes

      app.get('/', routes.index);
      app.get('/encounter', routes.encounter);
      app.get('/engagement', routes.engagement);
      app.get('/fun_facts', routes.fun_facts);
      app.get('/guys', routes.guys);
      app.get('/gals', routes.gals);
      app.get('/location', routes.location);
      app.get('/accommodations', routes.accommodations);
      app.get('/rsvp', routes.rsvp);
      app.post('/rsvp', routes.rsvp_post);
      app.get('/registry', routes.registry);
      app.get('/photos', routes.photos);

      app.listen(port);

      console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });
  });
});
