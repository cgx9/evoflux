"use strict";
var DirectorRouter = require('director');//.Router();
var isServer = !process.browser;
var R = isServer ? DirectorRouter.http.Router : DirectorRouter.Router;
if(!isServer) var queryString = require('query-string');
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
  var routerInit = R(routers).configure({notfound: notfoundRoute})//;.init(initRoute);
  if(!isServer){
    routerInit.query = function(key){
      return queryString.parse(location.search)[key];
    }
  }
  
  return routerInit;
};

module.exports = new Router();