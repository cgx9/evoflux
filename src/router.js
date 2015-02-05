"use strict";
var Router = require('director').Router();
module.exports = function (routers) {
  if(routers["init"] === undefined || routers["notfound"] === undefined){
    throw new Error("init and nofound router must definded");
  };
  var notfoundRoute = routers["notfound"];
  var initRoute = routers["init"];
  
  delete routers["notfound"];
  delete routers["init"];
  for(var router in routers){
    Router.on(router,routers[router]);
  }
  
  Router.configure({notfound: notfoundRoute}).init(initRoute);
};