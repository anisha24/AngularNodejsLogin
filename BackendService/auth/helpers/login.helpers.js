"use strict";
var logger = require("../../logger");
// var ldapauth = require("./../config/ldap");
var jwt = require("jsonwebtoken");
const storage = require("node-persist");
//var loginModel = require("./../models/login.models");


const secret = "operationalDasSecret";
var expire = "3h";
var expireSecTime = 3600 * 1000;
var timestamp = Date.parse(new Date().toUTCString());

storage.init({
  dir: "loginDB",
  stringify: JSON.stringify,
  parse: JSON.parse,
  encoding: "utf8",
  logging: false,
  ttl: expireSecTime,
  expiredInterval: 10 * 60 * 1000, //cleanup db after 10 min
});


module.exports.login = async function (req) {

  try {
    // let user = await ldapauth.authenticateUser(req)
    let user = 1;
    if (user) {
      var token = jwt.sign({ cecid: user.cn, group: "admin", time: timestamp }, secret, { expiresIn: expire });
      return token;
    }
    else {
      let errorMsg = { code: 401, info: "Unauthorized" }
      logger.error("Authentication Failed", errorMsg);
      return;
    }
  }
  catch (err) {
    logger.error("Authentication Failed", err);
    return;
  }
};


/**module.exports.login = async function (req) {
  return new Promise((resolve, reject) => {
    var timestamp = Date.parse(new Date().toUTCString());
    var token = jwt.sign({cecid: "admin", group: 'group', time: timestamp}, secret, {expiresIn: expire});
    resolve(token);

    // try {
    //   passport.authenticate('ldapauth', {session: false}, function (err, user, info) {
    //     if (err) {
    //       logger.info("Authentication Failed", err);
    //       let errorMsg = {code: 401, info: "Unauthorized"}
    //       reject(errorMsg);
    //     }
    //     if (!user) {
    //       const errorMessage = {code: 401, info: "Invalid Credentials"};
    //       logger.info("Authentication Failed", errorMessage);
    //       reject(errorMessage);
    //     }
    //     let input = decodeRequest(req);
    //     var timestamp = Date.parse(new Date().toUTCString());
    //     loginModel.lookupUsers({cecid: "admin"}).then((model) => {
    //       var token = jwt.sign({cecid: input.username, group: model['group'], time: timestamp}, secret, {expiresIn: expire});
    //       resolve(token);
    //     }).catch((err) => {
    //       let errorMsg = {code: 401, info: "Unauthorized to access"}
    //       logger.info("Authentication Failed", errorMsg);
    //       reject(errorMsg);
    //     });
    //   })(req);
    // }
    // catch (err) {
    //   logger.info("Authentication Failed", err);
    //   let errorMsg = {code: 401, info: "Unauthorized"}
    //   reject(errorMsg);
    // }
  });
};*/

exports.logout = async function (input) {
  return new Promise(async (resolve, reject) => {
    let token = input.headers.authorization.split(" ")[1];
    let decodedToken = jwt.decode(token);
    try {
      let remTime =
        decodedToken.exp * 1000 - Date.parse(new Date().toUTCString());
      let inserted = await storage.setItem(token, "invalidToken", {
        ttl: remTime,
      });
      return resolve("Logout Success");
    } catch (error) {
      return reject({ code: 403, err: error });
    }
  });
};

exports.validateToken = async function (input) {
  return new Promise((resolve, reject) => {
    if (!input.headers.authorization || !input.headers.authorization.includes("Bearer ")) return reject();
    let token = input.headers.authorization.split(" ")[1];
    jwt.verify(token, secret, async function (err, tokendata) {
      if (err) {
        return reject({ code: 401, err: err.message });
      }
      if (tokendata) {
        let storedToken = await storage.getItem(token);
        if (storedToken) {
          return reject({ code: 401, err: "Logged Out" });
        } else {
          return resolve({ cecid: tokendata.cecid, group: tokendata.group });
        }
      }
    });
  });
};

exports.invalidateToken = function (input) {
  return new Promise(async (resolve, reject) => { });
};

exports.refreshToken = (input) => {
  let token = input.headers.authorization.split(" ")[1];
  console.log("token inside helper", token);
  let decodedToken = jwt.decode(token);
  console.log("cecid", decodedToken.cecid);
  let userCecid = decodedToken.cecid;
  let newtoken = jwt.sign({ cecid: userCecid, group: "admin", time: timestamp }, secret, { expiresIn: expire });
  console.log("newtoken", newtoken);
  return newtoken;
}

function decodeRequest(input) {
  var str = input.headers.authorization;
  var op = atob(str.substring(5, str.length)).split(":");
  input["username"] = op[0];
  input["password"] = op[1];
  return input;
}
