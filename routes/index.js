
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
  res.render('rsvp', { title: 'Express' })
};

exports.rsvp_post = function(req, res){
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
