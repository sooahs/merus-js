var assert = require('assert'),
     Merus = require('../lib');

var username = process.env.MERUS_USER;
var password = process.env.MERUS_PASS;

var merus = Merus(username, password);

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
  });

  describe("#me()", function(){
    it("gets me", function(done){
      merus.users.me(function(err, me){
        assert.equal(me.username, username);
        done();
      })
    });
  });
});
