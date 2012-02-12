var routes = {};

exports.init = function(config) {
  routes.collection = config.collection;
  routes.site_password = config.site_password;
  routes.special_password = config.special_password;
};

exports.splash = function(req, res) {
  res.render('splash', { title: 'd&h'});
};

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'd&h Home' });
};


/*                                                                              
 * GET story page.                                                              
 */

exports.encounter = function(req, res){
  res.render('story/encounter', { title: 'd&h Encounter' });
};

exports.engagement = function(req, res){
  res.render('story/engagement', { title: 'd&h Engagement' });
};

exports.fun_facts = function(req, res){
  res.render('story/fun_facts', { title: 'd&h Fun Facts' });
};


/*                                                                              
 * GET party page.                                                              
 */

exports.guys = function(req, res){
  res.render('party/guys', { title: 'd&h Guys' });
};

exports.gals = function(req, res){
  res.render('party/gals', { title: 'd&h Gals' });
};


/*                                                                              
 * GET details page.                                                            
 */

exports.location = function(req, res){
  res.render('details/location', { title: 'd&h Location' });
};

exports.accommodations = function(req, res){
  res.render('details/accommodations', { title: 'd&h Accommodations' });
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
    if (req.body.pass === routes.site_password) {
      req.session.auth = true;
      res.render('rsvp', { title: 'd&h RSVP',  auth: true });
    } else {
      req.session.auth = false;
      res.render('rsvp', { title: 'd&h RSVP', auth: false });
    }
  } else {
    if (req.session.auth === true) {
      switch (req.body.q) {
      case 'register':
          // look at the req.body.names and req.body.hash, req.body.comments see which ones are registered
          // check if there is an update, update time 
        if (req.body.notes.length > 140) {
          res.render('rsvp_query', { title: 'd&h RSVP', result: 'hacker'});
        }
        var count = parseInt(req.body.count);
        var query = {hash: req.body.hash, coming: {$exists:false}, count: {$gte: count}};
        var fields = {$set: {coming: count, notes: req.body.notes, update_at: new Date()}};
        var options = {};
        routes.collection.findAndModify(query, [], fields, options, function(err, doc) {
          if (err) {
            console.log(err);
            res.render('rsvp_query', { title: 'd&h RSVP', result: 'error' });
          } else {
            if (doc) {
              res.render('rsvp_query', { title: 'd&h RSVP', result: 'success' });
            } else {
              res.render('rsvp_query', { title: 'd&h RSVP', result: 'hacker' });
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



/*                                                                              
 * GET registry page.                                                           
 */

exports.registry = function(req, res){
  res.render('registry', { title: 'd&h Registry' });
};


/*                                                                              
 * GET photo album page.                                                        
 */

exports.photos = function(req, res){
  res.render('photos', { title: 'd&h Photos' });
};


/*
 * API calls
 */

exports.get_names = function(req, res){
  if (req.session.auth === true) {
    routes.collection.find({}, {}, function(err, cursor) {
      cursor.toArray(function(err, groups) {
        var names = [],
          parties = [],
          i;
        for (i = 0; i < groups.length; i++) {
          var party = {};
          names.push.apply(names, groups[i].people);
          party.people = groups[i].people;
          party.desc = groups[i].desc;
          party.tag = groups[i].tag;
          party.count = groups[i].count;
          party.done = !!(groups[i].coming !== undefined);
          party.hash = groups[i].hash;
          parties.push(party);
        }
        names.sort();
        var prev = '',
          uniq_names = [];
        for (i = 0; i < names.length; i++) {
          if (prev !== names[i]) {
            uniq_names.push(names[i]);
            prev = names[i];
          }
        }
        res.send({data: uniq_names, parties:parties});
      });
    });
  } else {
    res.render('rsvp', {title: 'd&h RSVP', auth: false});
  }
};



/*                                                                              
 * GET not here                                                               
 */


var getRsvps = function(cb) {
  routes.collection.find({}, {}, function(err, cursor) {
    cursor.toArray(function(err, groups) {
      var lines = [],
        i;
      for (i = 0;i < groups.length; i++) {
        console.log(groups[i]);
        var line = [];
        line.push(groups[i].people[0]);
        line.push(groups[i].tag);
        line.push(groups[i].coming);
        line.push(groups[i].notes);
        console.log(line);
        var s = line.join(', ');
        lines.push(s);
      }
      cb(lines);
    });
  });
};



exports.nothere = function(req, res){
  var auth = req.session.special;
  /// display all the names of the people if authenicated
  // distinct
//  if (auth) {
//    getRsvps(function (rsvps) {
//      res.render('nothere', { title: 'd&h o.O', auth: auth, rsvps: rsvps });
//    });
//  } else {
    res.render('nothere', { title: 'd&h o.O', auth: false });
//  }
};

exports.nothere_query = function(req, res){
  if (req.body.q === 'login') {
    if (req.body.pass === routes.special_password) {
      req.session.special = true;
      getRsvps(function (rsvps) {
        res.render('nothere_list', { title: 'd&h o.O', auth: true, rsvps: rsvps });
      });
    } else {
      req.session.special = false;
      res.render('nothere', { title: 'd&h o.O', auth: false });
    }
  } else {
      req.session.special = false;
      res.render('nothere', { title: 'd&h o.O', auth: false });
  }
};
