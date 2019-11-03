const request = require("supertest");
const expect = require("chai").expect;

var app = require("../app");

describe("User Endpoint", function() {
  let user;
  var sampleDocument = {
    name: "Test User",
    email: "user@test.com",
    password: "1234",
    team: "Student",
    sex : "Female"
  };

  describe("#Users POST /users", function() {
    it("should create a new user", function(done) {
      request(app)
        .post("/users")
        .set("Content-Type", "application/json; charset=utf-8")
        .send(sampleDocument)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(201)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          user = res.body;

          //expect(res.body._id).to.not.equal("string");

          done();
        });
    });
  });

});