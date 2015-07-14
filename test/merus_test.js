var assert = require('assert'),
     Merus = require('../lib');

var username = process.env.MERUS_USER;
var password = process.env.MERUS_PASS;
var baseUrl  = process.env.MERUS_BASE_URL;

var client = {
  id: process.env.MERUS_CLIENT_ID,
  secret: process.env.MERUS_CLIENT_SECRET
};

var opts = {client: client};

if (baseUrl) {
  opts.baseUrl = baseUrl;
}

var merus = Merus(username, password, opts);

describe("Merus", function(){
  describe("#()", function(){
    it("does does not set anything with no arguments", function(){
      var merus = Merus();
      assert.equal(merus.basicAuth, false);
    });

    it("sets the apiKey with one argument", function(){
      var merus = Merus('abc123');
      assert.equal(merus.basicAuth, false);
      assert.equal(merus.apiKey, 'abc123');
    });

    it("sets the username and password with two arguments", function(){
      var merus = Merus('user@example.com', 'opensesame');
      assert.equal(merus.basicAuth, true);
      assert.equal(merus.username, 'user@example.com');
      assert.equal(merus.password, 'opensesame');
    });

    it("sets the client when in options", function(){
      var client = {id: 124, secret: 'sesameseeds'};
      var merus = Merus('abc123', {client: client});
      assert.equal(merus.client.id, client.id);
      assert.equal(merus.client.secret, client.secret);
    });

    it("sets the baseUrl when in options", function(){
      var merus = Merus('abc123', {baseUrl: 'http://example.org'});
      assert.equal(merus.baseUrl, 'http://example.org');
    });
  });

  describe("#me()", function(){
    it("gets me", function(done){
      merus.users.me(function(err, me){
        assert.equal(me.username, username);
        done();
      })
    });
  });

  describe("#invite()", function(){
    it("returns error when client credentials are not set", function(done){
      var email = username;
      var merus = Merus('abc123');
      merus.users.invite(email, function(err, verification){
        assert.equal(err, Merus.ClientCredentialError);
        done();
      });
    });

    it("returns a verification", function(done){
      var params = {
        email: username,
        redirect_uri: 'http://example.com/auth/signin',
      };

      merus.users.invite(params, function(err, verification){
        assert.equal(err, null);

        assert.ok(verification.token);
        assert.equal(verification.email, params.email);
        assert.equal(verification.redirect_uri, params.redirect_uri);
        done();
      });
    });
  });
});
