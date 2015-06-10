var request = require('superagent');

function Users(config) {
  var resource = {};

  resource.me = function(cb){
    var req = request.get(config.baseUrl + config.version + '/users/me');
    if (config.basicAuth) {
      req = req.auth(config.username, config.password);
    } else {
      req = req.set('Authorization', 'Bearer ' + config.apiKey);
    }
    req.end(function(err, res){
      cb(err, res.body);
    });
  };
  return resource;
}

function Merus() {
  var base = {
    basicAuth: false,
    baseUrl: 'https://api.meruscase.com/',
    version: 'v1'
  };

  base.users = Users(base);

  var args = Array.prototype.slice.call(arguments, 0);

  switch(args.length) {
    case 1:
      base.apiKey = args[0];
      break;
    case 2:
      base.basicAuth = true;
      base.username = args[0];
      base.password = args[1];
      break;
  }

  return base;
}

module.exports = Merus;
