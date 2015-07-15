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

  resource.invite = function(params, cb) {
    if (!config.client) {
      return cb(Merus.ClientCredentialError);
    }

    var req = request.post(config.baseUrl + 'auth/invites');

    var body = {
      client_id: config.client.id,
      client_secret: config.client.secret,
      email: params.email,
      redirect_uri: params.redirect_uri
    };

    req.send(body);

    req.end(function(err, res){
      cb(err, res.body);
    });
  }
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
  var opts;

  if (typeof args[args.length - 1] == 'object') {
    opts = args[args.length - 1];
    args = args.slice(0, args.length - 1);
  }

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

  if (opts) {
    base.client = opts.client;
  }

  if (opts && opts.baseUrl) {
    base.baseUrl = opts.baseUrl;
  }

  return base;
}

Merus.ClientCredentialError = new Error('Error with client credentials');

module.exports = Merus;
