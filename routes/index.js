exports.init = function(config) {
  this.collection = config.collection
  this.site_password = config.site_password;
}

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};


/*                                                                              
 * GET story page.                                                              
 */

exports.encounter = function(req, res){
  res.render('story/encounter', { title: 'Express' })
};

exports.engagement = function(req, res){
  res.render('story/engagement', { title: 'Express' })
};

exports.fun_facts = function(req, res){
  res.render('story/fun_facts', { title: 'Express' })
};


/*                                                                              
 * GET party page.                                                              
 */

exports.guys = function(req, res){
  res.render('party/guys', { title: 'Express' })
};

exports.gals = function(req, res){
  res.render('party/gals', { title: 'Express' })
};


/*                                                                              
 * GET details page.                                                            
 */

exports.location = function(req, res){
  res.render('details/location', { title: 'Express' })
};

exports.accommodations = function(req, res){
  res.render('details/accommodations', { title: 'Express' })
};


/*                                                                              
 * GET rsvp page.                                                               
 */

exports.rsvp = function(req, res){
  var auth = req.session.auth || false;
  /// display all the names of the people if authenicated
  // distinct
  res.render('rsvp', { title: 'Express', auth: auth });
};

exports.rsvp_query = function(req, res){
  if (req.body.q === 'login') {
    if (req.body.password === site_password) {
      req.session.auth = true;
      res.render('rsvp', { title: 'Express',  auth: true });
    } else {
      req.session.auth = false;
      res.render('rsvp', { title: 'Express', auth: false });
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
            res.rend('rsvp_query', { title: 'Express', result: 'people', groups: groups });
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
            res.rend('rsvp_query', { title: 'Express', result: 'error' });
          } else {
            if (doc) {
              res.rend('rsvp_query', { title: 'Express', result: 'success' });
            } else {
              res.rend('rsvp_query', { title: 'Express', result: 'hacker' });
            }
          }
        });
        break;
      default:
        req.session.auth = false;
        res.render('rsvp', { title: 'Express', auth: false });
      }
    } else {
      res.render('rsvp', { title: 'Express', auth: false });
    }
  }
};

exports.rsvp_query = function(req, res){
  res.render('rsvp', { title: 'Express' })
};



/*                                                                              
 * GET registry page.                                                           
 */

exports.registry = function(req, res){
  res.render('registry', { title: 'Express' })
};


/*                                                                              
 * GET photo album page.                                                        
 */

exports.photos = function(req, res){
  res.render('photos', { title: 'Express' })
};
