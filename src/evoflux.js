"use strict";
var Action = require('./action');
var Store = require('./store');
var Router = require('./router');
var Evoflux = function(){};  

Evoflux.prototype.createAction = function(moduleName,spec){
  var spec = spec || moduleName;
  if(typeof moduleName === "string"){
    Action.__moduleName__ = moduleName;
  }
  return Action.__create__(spec);
}

Evoflux.prototype.createStore = function(moduleName,spec){
  var spec = spec || moduleName;
  if(typeof moduleName === "string"){
    Store.__moduleName__ = moduleName;
  }
  return Store.__create__(spec);
}

Evoflux.prototype.createRouter = function(routerObj){
  
  return Router.__create__(routerObj);
}

module.exports = new Evoflux();