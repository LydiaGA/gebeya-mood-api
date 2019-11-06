const request = require("supertest");
const expect = require("chai").expect;

var app = require("../app");

describe("User Endpoint", function() {
  let user;
  var sampleSignup = {
    name: "Test User 5",
    email: "user5@test.com",
    password: "1234",
    team: "Student",
    sex : "Female"
  };

  var sampleLogin = {
    email : "user5@test.com",
    password : "1234"
  }

  describe("#Users POST /users", function() {
    it("should create a new user", function(done) {
      request(app)
        .post("/users")
        .set("Content-Type", "application/json; charset=utf-8")
        .send(sampleSignup)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(201)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          console.log(res.body);
          expect(res.body.role).to.equal("basic");
          
          return done();
        });
    });
  });


  describe("#Users POST /users/login", function(){
    it("should login a user", function(done){
      request(app)
      .post("/users/login")
      .set("Content-Type", "application/json; charset=utf-8")
      .send(sampleLogin)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .end(function(err, res){
        if (err) {
          return done(err);
        }
        expect(res.body.message).to.equal("Auth Successful");
        done();
      });
    });
  });
});