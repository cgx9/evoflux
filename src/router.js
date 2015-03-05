"use strict";
var DirectorRouter = require('director');//.Router();
var isServer = !process.browser;
var R = isServer ? DirectorRouter.http.Router : DirectorRouter.Router;

var Router = function () {
  // this.init = "/";
  this.notfound = "404";
  //this.html5history = true
};
Router.prototype.__create__ = function(routers){ 

  var notfoundRoute = routers["notfound"] || this.notfound;
  var initRoute = routers["init"] || this.init;
  
  delete routers["notfound"];
  delete routers["init"];
  
  return R(routers).configure({notfound: notfoundRoute})//;.init(initRoute);
};

module.exports = new Router();