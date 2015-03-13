"use strict";
var Dispatcher = require('./dispatcher');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Promise = require('es6-promise').Promise;

var Store = function () {
  this.__moduleName__ = "";
  this.changeEvent = "change";
  EventEmitter.defaultMaxListeners = 50;
}

Store.prototype.__create__ = function(storeActions){ 
    
  for(var storeMethod in storeActions){
    if(storeMethod === "init"){
      storeActions[storeMethod].call(this);
      continue;
    }
    if(storeMethod === "actions"){
      continue;
    }
    if(storeMethod === "mixins"){
      storeActions["mixins"].forEach(function(obj){
        if(typeof obj === "function"){
          assign(this, obj.prototype);
        }else{
          assign(this,obj);
        }
      }.bind(this))     
      continue
    }
    this[storeMethod] = storeActions[storeMethod];
  }//end for
  var methodPrefix = "";
  if(this.__moduleName__){
      methodPrefix = this.__moduleName__ + '.';
  }
  this["actions"] = {};
  for(var action in storeActions["actions"]){
    var newActionName = methodPrefix + action;
    this["actions"][newActionName] = storeActions["actions"][action];
  }

  assign(this,EventEmitter.prototype);

  Dispatcher.register(function(payload){
    var action = payload.action || payload.actionType;  
    delete payload.action;
    delete payload.actionType;
    var args = payload;
    this["actions"][action].call(this,args);
    this.emit(this.changeEvent);
  }.bind(this))
  this.__overrideEvent__(EventEmitter,methodPrefix);
  return this;
}
//重写on,emit,removeListener，事件自动动态增加modulename前缀，避免事件监听冲突。
Store.prototype.__overrideEvent__ = function(eventEmit,methodPrefix){
  var eventName = function(e){
    return methodPrefix + e;
  };
  this.on = function(event,cb){    
    eventEmit.prototype.on(eventName(event),cb);
  };
  this.emit = function(event){
    eventEmit.prototype.emit(eventName(event));
  };
  this.off = this.removeListener = function(event,cb){
    eventEmit.prototype.removeListener(eventName(event),cb);
  };
}

module.exports = new Store();