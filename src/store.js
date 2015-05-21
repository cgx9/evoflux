"use strict";
var Dispatcher = require('./dispatcher');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Promise = require('es6-promise').Promise;

var Store = function () {
  this.__moduleName__ = "";
  this.changeEvent = "change";
  EventEmitter.defaultMaxListeners = 50;
  this.events = [];
  this.triggerTo = {};//store接收action的方法时需要触发的事件。
  
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
    var action = payload.action;//在action已经把actionType处理了。
    // delete payload.action;
    // delete payload.actionType;
    var args = payload;
    /*
    * 需要payload的action与this的action一致，不在dispatcher中的循环做判断名称是否一样，是允许多个store监听同一个action。
    * 只要某个store的action里的action名为：namepace.action:function(){}, 即可监听该action。
    */
    for(var storeAction in storeActions["actions"]){
      //带namespace的，监听另一个store对应的action的。
      if(storeAction.split('.').length>1){
        if(action === storeAction){
          this["actions"][action].call(this,args);
          this.emit(this.triggerTo[storeAction] || this.changeEvent);//使用自定触发事件，否则默认change
        }
      }else{
        if(methodPrefix + storeAction === action){
          this["actions"][action].call(this,args);
          this.emit(this.triggerTo[storeAction] || this.changeEvent);
        }
      }
    }
    
  }.bind(this))
  this.__overrideEvent__(EventEmitter,methodPrefix);
  return this;
}
//重写on,emit,removeListener，事件自动动态增加modulename前缀，避免事件监听冲突。
Store.prototype.__overrideEvent__ = function(eventEmit,methodPrefix){
  var eventName = function(e){
    return methodPrefix + e;
  };
  //防止重复绑定
  this.on = function(event,cb){    
    for ( var i= this.events.length - 1;i>-1;i--) {  
      if(event===this.events[i].event){
        eventEmit.prototype.removeListener(eventName(event), this.events[i].cb); 
        this.events.splice(i,1); 
      }
    }
    this.events.push({
      event: event,
      cb: cb
    });
    eventEmit.prototype.on(eventName(event),cb);
  };
  this.emit = this.trigger = function(event){
    //todo：判断当前model的前后值是否一致
    eventEmit.prototype.emit(eventName(event));
  };
  this.off = this.removeListener = function(event,cb){
    eventEmit.prototype.removeListener(eventName(event),cb);
  };
  this.offAll = this.removeAllListeners = function(){
    this.events.forEach(function(e){
      eventEmit.prototype.removeAllListeners(eventName(e['event']));
    }) 
  }.bind(this);
}

module.exports = Store;