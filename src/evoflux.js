"use strict";
var Action = require('./action');
var Store = require('./store');
var Router = require('./router');
var Evoflux = function(){};  

Evoflux.prototype.createAction = function(moduleName,spec){
  var spec = spec || moduleName;
  var a = new Action();
  if(typeof moduleName === "string"){
    a.__moduleName__ = moduleName;
  }
  return a.__create__(spec);
}

Evoflux.prototype.createStore = function(moduleName,spec){
  var spec = spec || moduleName;
  var s = new Store();
  if(typeof moduleName === "string"){
    s.__moduleName__ = moduleName;
  }
  return s.__create__(spec);
}

Evoflux.prototype.createRouter = function(routerObj){
  
  return Router.__create__(routerObj);
}

module.exports = new Evoflux();