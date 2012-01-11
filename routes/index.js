exports.init = function(config) {
  this.collection = config.collection
  this.site_password = config.site_password;
}

exports.splash = function(req, res) {
  res.render('splash', { title: 'd&h'});
}

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'd&h Home' })
};


/*                                                                              
 * GET story page.                                                              
 */

exports.encounter = function(req, res){
  res.render('story/encounter', { title: 'd&h Encounter' })
};

exports.engagement = function(req, res){
  res.render('story/engagement', { title: 'd&h Engagement' })
};

exports.fun_facts = function(req, res){
  res.render('story/fun_facts', { title: 'd&h Fun Facts' })
};


/*                                                                              
 * GET party page.                                                              
 */

exports.guys = function(req, res){
  res.render('party/guys', { title: 'd&h Guys' })
};

exports.gals = function(req, res){
  res.render('party/gals', { title: 'd&h Gals' })
};


/*                                                                              
 * GET details page.                                                            
 */

exports.location = function(req, res){
  res.render('details/location', { title: 'd&h Location' })
};

exports.accommodations = function(req, res){
  res.render('details/accommodations', { title: 'd&h Accommodations' })
};


/*                                                                              
 * GET rsvp page.                                                               
 */

exports.rsvp = function(req, res){
  var auth = req.session.auth || false;
  /// display all the names of the people if authenicated
  // distinct
  res.render('rsvp', { title: 'd&h RSVP', auth: auth });
};

exports.rsvp_query = function(req, res){
  if (req.body.q === 'login') {
    if (req.body.password === site_password) {
      req.session.auth = true;
      res.render('rsvp', { title: 'd&h RSVP',  auth: true });
    } else {
      req.session.auth = false;
      res.render('rsvp', { title: 'd&h RSVP', auth: false });
    }
  } else {
    if (req.session.auth === true) {
      switch (req.body.q) {
      case 'search':
        // look for the name in the search, return all the groups that they are in
        var query = {};
        // search for name in list
        this.collection.find({'people.name': req.body.name}, {}, function (err, cursor) {
          cursor.toArray(function(err,groups) {
            res.rend('rsvp_query', { title: 'd&h RSVP', result: 'people', groups: groups });
          });
        });
        break;
      case 'register':
          // look at the req.body.names and req.body.hash, req.body.comments see which ones are registered
          // check if there is an update, update time 
        var query = {hash: req.body.hash, coming: {$exists:false}, 'people.name': { $all: req.body.names }};
        var fields = {$set: {coming: req.body.names, comments: req.body.comments, update_at: new Date()}};
        var options = {};
        this.collection.findAndModify(query, [], fields, options, function(err, doc) {
          if (err) {
            console.log(err);
            res.rend('rsvp_query', { title: 'd&h RSVP', result: 'error' });
          } else {
            if (doc) {
              res.rend('rsvp_query', { title: 'd&h RSVP', result: 'success' });
            } else {
              res.rend('rsvp_query', { title: 'd&h RSVP', result: 'hacker' });
            }
          }
        });
        break;
      default:
        req.session.auth = false;
        res.render('rsvp', { title: 'd&h RSVP', auth: false });
      }
    } else {
      res.render('rsvp', { title: 'd&h RSVP', auth: false });
    }
  }
};

exports.rsvp_query = function(req, res){
  res.render('rsvp', { title: 'd&h RSVP' })
};



/*                                                                              
 * GET registry page.                                                           
 */

exports.registry = function(req, res){
  res.render('registry', { title: 'd&h Registry' })
};


/*                                                                              
 * GET photo album page.                                                        
 */

exports.photos = function(req, res){
  res.render('photos', { title: 'd&h Photos' })
};
